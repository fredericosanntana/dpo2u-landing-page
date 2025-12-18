import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validar dados básicos
        if (!data.nome || !data.cnpj || !data.email) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        const timestamp = Date.now();
        const id = `${data.cnpj.replace(/\D/g, '')}-${timestamp}`;
        // Use /tmp for temp files - always writable in containers
        const inputPath = path.join('/tmp', `temp-${id}.json`);

        // O diretório de output deve ser acessível publicamente para download
        // Vamos usar public/downloads na raiz do landing page
        const publicDownloadDir = path.resolve(process.cwd(), 'public', 'downloads', id);

        // Garantir que o diretório de downloads existe
        fs.mkdirSync(publicDownloadDir, { recursive: true });

        // Salvar JSON de entrada
        const empresaData = {
            nome: data.nome,
            cnpj: data.cnpj,
            setor: data.setor,
            colaboradores: parseInt(data.colaboradores),
            coletaDados: data.coletaDados === 'true' || data.coletaDados === true,
            possuiOperadores: data.possuiOperadores === 'true' || data.possuiOperadores === true,
            contato: {
                responsavel: data.responsavel,
                email: data.email,
                telefone: data.telefone
            }
        };

        fs.writeFileSync(inputPath, JSON.stringify(empresaData, null, 2));

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
