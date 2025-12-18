import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validar estrutura completa do wizard
        if (!data.step1_company || !data.step1_company.nome || !data.step1_company.cnpj || !data.step1_company.email) {
            return NextResponse.json({ error: 'Dados da empresa incompletos' }, { status: 400 });
        }

        if (!data.step2_inventory || data.step2_inventory.length === 0) {
            return NextResponse.json({ error: 'Inventário de dados é obrigatório' }, { status: 400 });
        }

        const timestamp = Date.now();
        const id = `${data.step1_company.cnpj.replace(/\D/g, '')}-${timestamp}`;
        // Use /tmp for temp files - always writable in containers
        const inputPath = path.join('/tmp', `temp-${id}.json`);

        // O diretório de output deve ser acessível publicamente para download
        // Vamos usar public/downloads na raiz do landing page
        const publicDownloadDir = path.resolve(process.cwd(), 'public', 'downloads', id);

        // Garantir que o diretório de downloads existe
        fs.mkdirSync(publicDownloadDir, { recursive: true });

        // Salvar JSON de entrada completo (wizard data)
        const completeData = {
            // Dados backward-compatible com formato antigo
            nome: data.step1_company.nome,
            cnpj: data.step1_company.cnpj,
            setor: data.step1_company.setor,
            colaboradores: data.step1_company.colaboradores,
            coletaDados: data.step1_company.coletaDados,
            possuiOperadores: data.step1_company.possuiOperadores,
            contato: {
                responsavel: data.step1_company.responsavel,
                email: data.step1_company.email,
                telefone: data.step1_company.telefone || ''
            },
            //Dados estendidos do wizard
            wizard_data: {
                inventory: data.step2_inventory || [],
                purposes: data.step3_purposes || [],
                storage: data.step4_storage || [],
                third_parties: data.step5_third_parties || [],
                security: data.step6_security || {},
                risks: data.step6_risks || {}
            }
        };

        fs.writeFileSync(inputPath, JSON.stringify(completeData, null, 2));

        // Executar CLI - Caminho Absoluto para o Kit
        const cliPath = '/root/dpo2u-lgpd-kit/dist/cli.js';

        if (!fs.existsSync(cliPath)) {
            throw new Error(`CLI não encontrado em: ${cliPath}. Verifique se o dpo2u-lgpd-kit foi compilado.`);
        }

        // Configuração do ambiente
        const env = { ...process.env };

        // Importante: Passar a chave do Gemini
        // Tenta pegar do payload ou do env atual
        if (data.apiKey) env.GEMINI_API_KEY = data.apiKey;

        // Se não tiver chave no env atual, tenta carregar do arquivo .env do kit se necessário,
        // mas o ideal é que o container/VPS já tenha as variáveis.
        // Opcionalmente podemos ler o .env do kit se estiver vazio:
        if (!env.GEMINI_API_KEY) {
            try {
                const kitEnvPath = '/root/dpo2u-lgpd-kit/.env';
                if (fs.existsSync(kitEnvPath)) {
                    const kitEnv = fs.readFileSync(kitEnvPath, 'utf8');
                    const match = kitEnv.match(/GEMINI_API_KEY=(.*)/);
                    if (match) env.GEMINI_API_KEY = match[1];
                }
            } catch (e) { }
        }

        // Executa CLI apontando para o binário compilado
        const command = `node ${cliPath} adequacao --input ${inputPath} --output ${publicDownloadDir} --provider gemini --model gemini-2.0-flash`;

        console.log(`🚀 Executando comando: ${command}`);

        // Timeout alto pois o processo pode demorar
        const { stdout, stderr } = await execPromise(command, {
            env,
            timeout: 300000 // 5 minutos
        });

        console.log('✅ CLI Output:', stdout);
        if (stderr) console.log('⚠️ CLI Stderr (Warning):', stderr);

        // Limpar arquivo temporário
        try {
            fs.unlinkSync(inputPath);
        } catch (e) { }

        // Verificar se o zip foi criado
        const zipPath = path.join(publicDownloadDir, 'pacote-final.zip');
        if (!fs.existsSync(zipPath)) {
            throw new Error('Arquivo ZIP final não foi gerado. Verifique os logs.');
        }

        const downloadUrl = `/downloads/${id}/pacote-final.zip`;

        return NextResponse.json({
            success: true,
            downloadUrl,
            logs: stdout
        });

    } catch (error) {
        console.error('❌ Erro na API:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Erro interno no servidor'
        }, { status: 500 });
    }
}
