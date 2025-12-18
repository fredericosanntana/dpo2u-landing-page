// Extended data model for complete LGPD compliance form

export interface CompanyInfo {
    nome: string;
    cnpj: string;
    setor: string;
    colaboradores: number;
    coletaDados: boolean;
    possuiOperadores: boolean;
    responsavel: string;
    email: string;
    telefone?: string;
}

export interface DataInventoryItem {
    id: string;
    tipo: string; // CPF, Email, Endereço, etc.
    categoria: 'cadastral' | 'sensivel' | 'crianca' | 'financeiro' | 'outro';
    volume: 'baixo' | 'medio' | 'alto'; // < 1000, 1000-10000, > 10000
    descricao: string;
}

export interface PurposeAndBasis {
    dataItemId: string; // Reference to DataInventoryItem
    finalidade: string; // "Marketing direto", "Execução de contrato", etc.
    baseLegal: 'consentimento' | 'contrato' | 'obrigacao_legal' | 'exercicio_regular' | 'protecao_vida' | 'tutela_saude' | 'interesse_legitimo' | 'protecao_credito' | 'outro';
    justificativa: string; // Detailed justification for the legal basis
}

export interface StorageAndRetention {
    dataItemId: string;
    localizacao: 'cloud_brasil' | 'cloud_exterior' | 'on_premise' | 'misto';
    provedor?: string; // AWS, Azure, Google Cloud, etc.
    periodo_retencao: string; // "2 anos", "5 anos", "Até cancelamento", etc.
    procedimento_exclusao: string;
}

export interface ThirdPartyProcessor {
    id: string;
    nome: string;
    cnpj?: string;
    tipo: 'processador' | 'controlador_conjunto' | 'subcontratado';
    localizacao: 'brasil' | 'exterior';
    dados_compartilhados: string[]; // IDs of DataInventoryItems
    finalidade_compartilhamento: string;
    possui_dpa: boolean;
    data_dpa?: string;
}

export interface SecurityMeasures {
    tecnicas: {
        criptografia: boolean;
        criptografia_descricao?: string;
        controle_acesso: boolean;
        controle_acesso_descricao?: string;
        backup: boolean;
        backup_frequencia?: string;
        firewall: boolean;
        antivirus: boolean;
        monitoramento: boolean;
        outras: string[];
    };
    organizacionais: {
        politica_privacidade_interna: boolean;
        treinamento_colaboradores: boolean;
        treinamento_frequencia?: string;
        procedimentos_documentados: boolean;
        auditoria_regular: boolean;
        outras: string[];
    };
}

export interface RiskAssessment {
    atividades_alto_risco: boolean;
    atividades_alto_risco_descricao?: string;
    decisoes_automatizadas: boolean;
    decisoes_automatizadas_descricao?: string;
    perfilamento: boolean;
    perfilamento_descricao?: string;
    transferencia_internacional: boolean;
    transferencia_internacional_paises?: string[];
    incidentes_anteriores: boolean;
    incidentes_anteriores_descricao?: string;
    medidas_mitigacao: string;
}

export interface CompleteFormData {
    step1_company: CompanyInfo;
    step2_inventory: DataInventoryItem[];
    step3_purposes: PurposeAndBasis[];
    step4_storage: StorageAndRetention[];
    step5_third_parties: ThirdPartyProcessor[];
    step6_security: SecurityMeasures;
    step6_risks: RiskAssessment;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
