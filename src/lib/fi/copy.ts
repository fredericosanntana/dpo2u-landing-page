// Textos da porta financeira em EN, PT e ES. Regras de copy: nunca "compliant",
// "autorizado pelo regulador" ou "compliance completo"; o diagnóstico é indicativo.

export type Lang = 'en' | 'pt' | 'es';

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const l = navigator.language.toLowerCase();
  if (l.startsWith('pt')) return 'pt';
  if (l.startsWith('es')) return 'es';
  return 'en';
}

export const MARKETS: { code: string; label: Record<Lang, string> }[] = [
  { code: 'BR', label: { en: 'Brazil', pt: 'Brasil', es: 'Brasil' } },
  { code: 'EU', label: { en: 'European Union', pt: 'União Europeia', es: 'Unión Europea' } },
  { code: 'PT', label: { en: 'Portugal', pt: 'Portugal', es: 'Portugal' } },
  { code: 'DE', label: { en: 'Germany', pt: 'Alemanha', es: 'Alemania' } },
  { code: 'ES', label: { en: 'Spain', pt: 'Espanha', es: 'España' } },
  { code: 'FR', label: { en: 'France', pt: 'França', es: 'Francia' } },
  { code: 'AR', label: { en: 'Argentina', pt: 'Argentina', es: 'Argentina' } },
  { code: 'MX', label: { en: 'Mexico', pt: 'México', es: 'México' } },
  { code: 'CO', label: { en: 'Colombia', pt: 'Colômbia', es: 'Colombia' } },
  { code: 'CL', label: { en: 'Chile', pt: 'Chile', es: 'Chile' } },
  { code: 'US', label: { en: 'United States', pt: 'Estados Unidos', es: 'Estados Unidos' } },
  { code: 'GB', label: { en: 'United Kingdom', pt: 'Reino Unido', es: 'Reino Unido' } },
  { code: 'SG', label: { en: 'Singapore', pt: 'Singapura', es: 'Singapur' } },
  { code: 'AE', label: { en: 'United Arab Emirates', pt: 'Emirados Árabes', es: 'Emiratos Árabes' } },
  { code: 'NG', label: { en: 'Nigeria', pt: 'Nigéria', es: 'Nigeria' } },
  { code: 'ZA', label: { en: 'South Africa', pt: 'África do Sul', es: 'Sudáfrica' } },
];

export const INSTITUTION_TYPES = ['vasp', 'casp', 'psav', 'exchange', 'custodian', 'payment_institution', 'bank', 'fintech'] as const;
export const SERVICES = ['exchange', 'custody', 'transfer', 'brokerage', 'stablecoin_issuance', 'payments', 'onramp_offramp'] as const;

type Dict = Record<string, string>;

export const COPY: Record<Lang, Dict> = {
  en: {
    tag: 'For financial institutions',
    h1: 'Enforce the rules before the transfer. Prove it after, without exposing anyone.',
    lead: 'DPO2U is a compliance operator for VASPs, CASPs and payment institutions: Travel Rule checks that block before value moves, partner passports reviewed by a named person, and evidence packs a supervisor can open. Start with a diagnostic of what applies to you.',
    cta: 'Run the diagnostic',
    market: 'Market',
    type: 'Institution type',
    services: 'Services',
    partners: 'We use third-party service providers to serve clients',
    volume: 'Monthly volume (USD, optional)',
    email: 'Email to receive the report (optional)',
    company: 'Company (optional)',
    consent: 'I agree that DPO2U stores this email and company to send the report and contact me about it.',
    run: 'See what applies',
    running: 'Checking…',
    result: 'What applies to you',
    gaps: 'gaps',
    critical: 'critical',
    generic: 'generic',
    covered: 'declared covered',
    create: 'Create workspace',
    createH: 'Create your workspace',
    createP: 'We send a sign-in link to your email. No password, no wallet.',
    wsName: 'Institution name',
    send: 'Send link',
    sent: 'If the address can receive it, the link is on its way. It is valid for 15 minutes.',
    error: 'Something went wrong. Try again in a minute.',
    disclaimer: 'Indicative diagnostic based on what you declared. Not legal advice, and not a statement of compliance.',
  },
  pt: {
    tag: 'Para instituições financeiras',
    h1: 'Aplique as regras antes da transferência. Prove depois, sem expor ninguém.',
    lead: 'A DPO2U é uma operadora de compliance para VASPs, CASPs e instituições de pagamento: Travel Rule que bloqueia antes de o valor sair, passaporte de parceiros revisado por uma pessoa nomeada e pacote de evidências que o supervisor abre. Comece pelo diagnóstico do que se aplica a você.',
    cta: 'Fazer o diagnóstico',
    market: 'Mercado',
    type: 'Tipo de instituição',
    services: 'Serviços',
    partners: 'Usamos prestadores de serviço terceiros para atender clientes',
    volume: 'Volume mensal (USD, opcional)',
    email: 'E-mail para receber o relatório (opcional)',
    company: 'Empresa (opcional)',
    consent: 'Concordo que a DPO2U guarde este e-mail e a empresa para enviar o relatório e falar comigo sobre ele.',
    run: 'Ver o que se aplica',
    running: 'Verificando…',
    result: 'O que se aplica a você',
    gaps: 'lacunas',
    critical: 'críticas',
    generic: 'genérico',
    covered: 'declaradas cobertas',
    create: 'Criar workspace',
    createH: 'Crie o seu workspace',
    createP: 'Mandamos um link de acesso para o seu e-mail. Sem senha e sem carteira.',
    wsName: 'Nome da instituição',
    send: 'Enviar link',
    sent: 'Se o endereço puder receber, o link está a caminho. Ele vale 15 minutos.',
    error: 'Algo deu errado. Tente de novo em um minuto.',
    disclaimer: 'Diagnóstico indicativo a partir do que foi declarado. Não é parecer jurídico nem declara conformidade.',
  },
  es: {
    tag: 'Para instituciones financieras',
    h1: 'Aplique las reglas antes de la transferencia. Pruébelo después, sin exponer a nadie.',
    lead: 'DPO2U es un operador de compliance para VASPs, CASPs e instituciones de pago: Travel Rule que bloquea antes de que el valor salga, pasaporte de socios revisado por una persona nombrada y paquete de evidencias que el supervisor puede abrir. Empiece por el diagnóstico de lo que le aplica.',
    cta: 'Hacer el diagnóstico',
    market: 'Mercado',
    type: 'Tipo de institución',
    services: 'Servicios',
    partners: 'Usamos proveedores de servicios terceros para atender clientes',
    volume: 'Volumen mensual (USD, opcional)',
    email: 'Correo para recibir el informe (opcional)',
    company: 'Empresa (opcional)',
    consent: 'Acepto que DPO2U guarde este correo y la empresa para enviar el informe y contactarme sobre él.',
    run: 'Ver lo que aplica',
    running: 'Verificando…',
    result: 'Lo que le aplica',
    gaps: 'brechas',
    critical: 'críticas',
    generic: 'genérico',
    covered: 'declaradas cubiertas',
    create: 'Crear workspace',
    createH: 'Cree su workspace',
    createP: 'Enviamos un enlace de acceso a su correo. Sin contraseña y sin billetera.',
    wsName: 'Nombre de la institución',
    send: 'Enviar enlace',
    sent: 'Si la dirección puede recibirlo, el enlace está en camino. Vale 15 minutos.',
    error: 'Algo salió mal. Intente de nuevo en un minuto.',
    disclaimer: 'Diagnóstico indicativo basado en lo declarado. No es asesoría legal ni declara cumplimiento.',
  },
};

export const LABELS: Record<Lang, Record<string, string>> = {
  en: { vasp: 'VASP', casp: 'CASP (EU)', psav: 'PSAV (Brazil)', exchange: 'Exchange', custodian: 'Custodian', payment_institution: 'Payment institution', bank: 'Bank', fintech: 'Fintech', custody: 'Custody', transfer: 'Transfers', brokerage: 'Brokerage', stablecoin_issuance: 'Stablecoin issuance', payments: 'Payments', onramp_offramp: 'On/off-ramp' },
  pt: { vasp: 'VASP', casp: 'CASP (UE)', psav: 'PSAV (Brasil)', exchange: 'Exchange', custodian: 'Custodiante', payment_institution: 'Instituição de pagamento', bank: 'Banco', fintech: 'Fintech', custody: 'Custódia', transfer: 'Transferências', brokerage: 'Intermediação', stablecoin_issuance: 'Emissão de stablecoin', payments: 'Pagamentos', onramp_offramp: 'Entrada e saída (on/off-ramp)' },
  es: { vasp: 'VASP', casp: 'CASP (UE)', psav: 'PSAV (Brasil)', exchange: 'Exchange', custodian: 'Custodio', payment_institution: 'Institución de pago', bank: 'Banco', fintech: 'Fintech', custody: 'Custodia', transfer: 'Transferencias', brokerage: 'Intermediación', stablecoin_issuance: 'Emisión de stablecoin', payments: 'Pagos', onramp_offramp: 'On/off-ramp' },
};
