/**
 * /psav — landing do Padrão PSAV-parceiro (PT-BR).
 *
 * Dois públicos: a SPSAV autorizada que contrata prestadores de serviço relevante
 * (Res. BCB 520, arts. 32–42) e a empresa sem autorização que vira prestadora
 * contratada. Base: docs/superpowers/research/2026-10-02-estudo-mercado-psav.md.
 *
 * Regras de copy (do estudo): nunca "aluguel de licença", "continue operando",
 * "autorizado pelo BCB", "compliance completo" nem "blockchain prova conformidade".
 * Todo prazo e todo número aparece com a norma ou a fonte ao lado.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { Button, FONTS, PALETTE, Rule, SmallLabel } from '@/components/sealed/atoms';
import { DEADLINES, STATS, countdownText } from '@/lib/psav/landing';

type Audience = 'spsav' | 'prestador';

const CONTACT = 'mailto:contato@dpo2u.com.br';

// O terracota do site (#C85C3B) não atinge 4.5:1 em texto pequeno (3.81 sobre o card,
// 4.16 com branco por cima — medido com axe). Nesta página usamos a mesma matiz,
// mais escura: 5.23 sobre #F5F5F5 e 5.7 com branco. O token global não é alterado.
const TERRA = '#A84A2D';
const terraButton: React.CSSProperties = { background: TERRA, border: `1px solid ${TERRA}` };

const HERO: Record<Audience, { tag: string; h: string; p: string; cta: string; subject: string }> = {
  spsav: {
    tag: 'Para a SPSAV autorizada',
    h: 'Contrate parceiros cripto com a diligência que o art. 34 exige — provada e datada.',
    p: 'A Res. BCB 520 deixa a responsabilidade com você (arts. 35 e 36) e pede um diretor responsável pelas contratações (art. 42). Entregamos, por prestador contratado, a trilha de evidências que esse diretor apresenta: verificável, com data e com a origem de cada veredito.',
    cta: 'Agendar diagnóstico',
    subject: 'Diagnóstico — Padrão PSAV-parceiro (SPSAV)',
  },
  prestador: {
    tag: 'Para quem não vai pedir autorização',
    h: '6 de novembro: instituições autorizadas param de operar com quem não é autorizado. Existe um caminho regulado.',
    p: 'A Res. BCB 520 permite que uma SPSAV contrate prestadores de serviço relevante: tecnologia, custódia, liquidez, formador de mercado, conta (art. 33). Você presta o serviço por conta e sob as diretrizes dela. O cliente é da SPSAV. O padrão mostra que você está pronto para ser contratado.',
    cta: 'Checar elegibilidade como prestador',
    subject: 'Elegibilidade — Padrão PSAV-parceiro (prestador)',
  },
};

const STEPS = [
  { n: '01', h: 'Diligência', p: 'Avaliamos o prestador contra as regras do padrão, artigo por artigo, sobre evidência que ele mesmo envia. Só hashes saem do ambiente dele.' },
  { n: '02', h: 'Revisão e selo', p: 'Regras de máquina são lidas na rede. Regras documentais são decididas por um revisor nomeado, que assina com a própria chave. O resultado é selado em blockchain.' },
  { n: '03', h: 'Passaporte', p: 'A SPSAV recebe um passaporte com tier, validade e a origem de cada veredito. Ele expira sozinho e é suspenso se uma condição deixa de valer.' },
];

const ARTICLES = [
  { art: 'Art. 34', h: 'Verificação prévia do contratado', p: 'Capacidade técnica, operacional e de conformidade, com a evidência referenciada.' },
  { art: 'Art. 35', h: 'Atuação por conta da SPSAV', p: 'Cláusula conferida no contrato: o prestador atua sob suas diretrizes, e você permanece responsável.' },
  { art: 'Art. 37', h: 'Vedação de cobrança direta', p: 'Cláusula conferida: o prestador não cobra tarifas nem comissões dos seus clientes.' },
  { art: 'Art. 40', h: 'Acesso do BCB ao contratado', p: 'Cláusula conferida: informações, documentos e dependências do prestador ficam acessíveis ao BCB.' },
  { art: 'Art. 41', h: 'Informação ao cliente', p: 'Evidência de que o cliente foi informado da participação do prestador e dos riscos.' },
  { art: 'Art. 42', h: 'Diretor responsável', p: 'O aceite de cada parceiro é um evento registrado, com o diretor designado.' },
];

const ELIGIBLE = ['Tecnologia', 'Custódia de ativos virtuais', 'Provedor de liquidez', 'Formador de mercado', 'Emissão de moeda eletrônica e oferta de conta'];

const ORIGINS = [
  { h: 'Máquina', p: 'Qualquer pessoa reproduz o resultado lendo a mesma rede, no mesmo bloco. Ex.: cada cliente tem conta própria na blockchain (art. 29).', color: PALETTE.verdigris },
  { h: 'Revisor nomeado', p: 'Uma pessoa identificada decide e assina com a própria chave. A assinatura não vale para outro processo nem para outra versão das regras.', color: PALETTE.concrete },
  { h: 'Terceiro independente', p: 'Laudo de auditor ou parecer, referenciado e selado. Ex.: a auditoria bienal de segregação (art. 30, III).', color: TERRA },
];

const FAQ = [
  { q: 'O que é PSAV e quem precisa de autorização?', a: 'Prestadora de serviços de ativos virtuais. Quem presta esses serviços no Brasil precisa de autorização do Banco Central pela Lei 14.478/2022 e pelas Res. BCB 519, 520 e 521/2025, em vigor desde 02/02/2026. Quem já operava tinha 270 dias para pedir (Res. 520, art. 88, I).' },
  { q: 'O que acontece a partir de 06/11/2026?', a: 'Pela redação dada pela Res. BCB 589/2026 ao art. 91 da Res. 520, instituições autorizadas pelo BCB não podem realizar nem viabilizar operações com contraparte que preste serviços de ativos virtuais sem autorização para funcionar no país, salvo nas formas que a resolução autoriza.' },
  { q: 'Quem só protocolou o pedido escapa dessa vedação?', a: 'A redação nova do art. 91 deixou de mencionar quem está "em processo de autorização". O efeito exato precisa de parecer jurídico para o seu caso. Não tratamos isso como garantia.' },
  { q: 'Uma empresa sem autorização pode prestar serviço a uma SPSAV?', a: 'A Res. 520 permite que a SPSAV contrate prestadores de serviço relevante, no país e no exterior (arts. 32 e 33). O prestador atua por conta e sob as diretrizes da SPSAV, que permanece responsável (art. 35). Isso não equivale a operar a própria corretora.' },
  { q: 'Isso é "white label" ou aluguel de licença?', a: 'Não. Não existe aluguel de licença. O que a norma prevê é a contratação de serviço relevante, com a SPSAV como responsável e com cláusulas obrigatórias, como a vedação de cobrança direta (art. 37) e o acesso do BCB (art. 40). O padrão documenta e verifica essa relação.' },
  { q: 'O que o passaporte prova, e o que ele não prova?', a: 'Prova que uma avaliação, com regras de versão conhecida, foi feita e selada numa data, e mostra de onde veio cada veredito. Não prova, sozinho, que a empresa está em conformidade com tudo, e não substitui a diligência da SPSAV, o auditor independente nem a decisão do Banco Central.' },
  { q: 'O que o padrão ainda não cobre?', a: 'Nesta versão: programa de PLD/FT operacional, Travel Rule com troca de mensagens entre VASPs e envio de remessas ao STA do BCB. Para esses pontos, trabalhamos ao lado de fornecedores especializados.' },
  { q: 'Em que redes o passaporte é selado?', a: 'O padrão é independente de rede. Na Solana, segregação por cliente, controles do emissor e controle de upgrade do programa são lidos diretamente da rede. Hoje a operação está em testnet e devnet.' },
  { q: 'Quanto custa?', a: 'Depende do número de prestadores e do tier. A cobrança é por período ou por avaliação, nunca por aprovação, para que o preço não dependa do veredito.' },
];

const NORMS = [
  'Lei 14.478/2022',
  'Res. BCB 519, 520 e 521/2025 (vigência 02/02/2026)',
  'Res. BCB 589/2026 (art. 91, vigência 01/10/2026)',
  'IN BCB 713/2026 (documentos 5710/5711)',
];

const h2: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 };
const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 };

function mailto(subject: string) {
  return `${CONTACT}?subject=${encodeURIComponent(subject)}`;
}

export default function PsavLandingPage() {
  const [aud, setAud] = useState<Audience>('spsav');
  const now = useMemo(() => new Date(), []);
  const hero = HERO[aud];

  usePageHead({
    title: 'Padrão PSAV-parceiro — diligência verificável para SPSAV e prestadores | DPO2U',
    description: 'SPSAV autorizada e prestador de serviço relevante (Res. BCB 520, arts. 32–42): diligência artigo por artigo, revisor nomeado e passaporte de conformidade selado em blockchain.',
    path: '/psav',
  });

  return (
    <div style={{ color: PALETTE.ink, fontFamily: FONTS.body }}>
      {/* 1 · Hero */}
      <section className="px-6 lg:px-14 pt-16 pb-12 lg:pt-24 lg:pb-16" aria-labelledby="psav-hero">
        <SmallLabel style={{ marginBottom: 16 }}>Padrão PSAV-parceiro · Brasil</SmallLabel>
        <div role="group" aria-label="Escolha o seu perfil" className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(HERO) as Audience[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={aud === k}
              onClick={() => setAud(k)}
              style={{
                fontFamily: FONTS.body, fontSize: 14, fontWeight: 500, padding: '10px 16px', borderRadius: 4, cursor: 'pointer',
                background: aud === k ? PALETTE.ink : 'transparent', color: aud === k ? PALETTE.paper : PALETTE.ink,
                border: `1px solid ${aud === k ? PALETTE.ink : PALETTE.ruleStrong}`,
              }}
            >
              {HERO[k].tag}
            </button>
          ))}
        </div>
        <h1 id="psav-hero" style={h2} className="text-[32px] sm:text-[44px] lg:text-[56px] max-w-[22ch]">
          {hero.h}
        </h1>
        <p className="mt-6 text-[17px] leading-[1.6] max-w-[62ch]" style={{ color: PALETTE.inkSoft }}>{hero.p}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button kind="terracotta" href={mailto(hero.subject)} style={terraButton}>{hero.cta} →</Button>
          <Button kind="ghost" href="https://docs.dpo2u.com/docs/psav/padrao-psav-parceiro">Ler a metodologia</Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Prazos regulatórios">
          {DEADLINES.map((d) => (
            <div key={d.id} className="p-5" style={card}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: TERRA }}>
                {new Date(d.dateIso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} · {countdownText(d, now)}
              </div>
              <div className="mt-2 text-[16px] leading-[1.45]">{d.label}</div>
              <a href={d.ruleUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[13px]" style={{ color: PALETTE.concrete }}>
                {d.rule}
              </a>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* 2 · O que mudou (números com fonte) */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-mercado">
        <SmallLabel style={{ marginBottom: 16 }}>§ 01 · O que mudou</SmallLabel>
        <h2 id="psav-mercado" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          O mercado é grande. Poucos vão operar com autorização própria<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <figure key={s.value} className="p-5 m-0" style={card}>
              <div style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 500, letterSpacing: '-.02em' }}>{s.value}</div>
              <figcaption className="mt-2 text-[14.5px] leading-[1.45]">{s.label}</figcaption>
              <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[12px] leading-[1.4]" style={{ color: PALETTE.concrete }}>
                {s.kind === 'estimativa' ? 'Estimativa. ' : ''}Fonte: {s.source}
              </a>
            </figure>
          ))}
        </div>
      </section>

      <Rule />

      {/* 3 · Como funciona */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-como">
        <SmallLabel style={{ marginBottom: 16 }}>§ 02 · Como funciona</SmallLabel>
        <h2 id="psav-como" style={h2} className="text-[30px] sm:text-[40px]">Três passos<span style={{ color: TERRA }}>.</span></h2>
        <ol className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 p-0 list-none">
          {STEPS.map((s) => (
            <li key={s.n} className="p-6" style={card}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: TERRA }}>{s.n}</div>
              <h3 className="mt-2 text-[22px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>{s.h}</h3>
              <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: PALETTE.inkSoft }}>{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <Rule />

      {/* 4 · Para a SPSAV */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-spsav">
        <SmallLabel style={{ marginBottom: 16 }}>§ 03 · Para a SPSAV</SmallLabel>
        <h2 id="psav-spsav" style={h2} className="text-[30px] sm:text-[40px] max-w-[26ch]">
          O que entregamos, artigo por artigo da Res. BCB 520<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARTICLES.map((a) => (
            <div key={a.art} className="p-6" style={card}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: TERRA }}>{a.art}</div>
              <h3 className="mt-2 text-[19px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>{a.h}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.55]" style={{ color: PALETTE.inkSoft }}>{a.p}</p>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* 5 · Para o prestador */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-prestador">
        <SmallLabel style={{ marginBottom: 16 }}>§ 04 · Para o prestador</SmallLabel>
        <h2 id="psav-prestador" style={h2} className="text-[30px] sm:text-[40px] max-w-[26ch]">
          Você presta o serviço. A SPSAV responde e é dona da relação com o cliente<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6" style={card}>
            <h3 className="text-[19px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>Serviços que a norma cita como relevantes (art. 33, § 1º)</h3>
            <ul className="mt-4 pl-5 text-[15px] leading-[1.7]">
              {ELIGIBLE.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
          <div className="p-6" style={card}>
            <h3 className="text-[19px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>O que muda no seu modelo</h3>
            <ul className="mt-4 pl-5 text-[15px] leading-[1.7]">
              <li>Você atua por conta e sob as diretrizes da SPSAV (art. 35).</li>
              <li>O cliente é da SPSAV. Você não cobra dele tarifa nem comissão (art. 37).</li>
              <li>O BCB pode acessar seus documentos e dependências (art. 40).</li>
              <li>O cliente é informado da sua participação (art. 41).</li>
            </ul>
          </div>
        </div>
      </section>

      <Rule />

      {/* 6 · Verificável */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-origem">
        <SmallLabel style={{ marginBottom: 16 }}>§ 05 · Verificável</SmallLabel>
        <h2 id="psav-origem" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          Cada veredito mostra de onde veio<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ORIGINS.map((o) => (
            <div key={o.h} className="p-6" style={{ ...card, borderTop: `3px solid ${o.color}` }}>
              <h3 className="text-[19px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>{o.h}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.55]" style={{ color: PALETTE.inkSoft }}>{o.p}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[15px] leading-[1.6] max-w-[70ch]">
          O selo em blockchain prova a <strong>integridade e a data</strong> da avaliação. Não prova, sozinho, que a empresa está em conformidade.
          Qualquer pessoa confere o passaporte publicamente em <code>dpo2u.com/verify/passport/…</code>, vendo o veredito, nunca a evidência.
        </p>
      </section>

      <Rule />

      {/* 7 · Por que confiar */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-confianca">
        <SmallLabel style={{ marginBottom: 16 }}>§ 06 · Por que confiar</SmallLabel>
        <h2 id="psav-confianca" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          Metodologia aberta. Conflito de interesse tratado como regra<span style={{ color: TERRA }}>.</span>
        </h2>
        <ul className="mt-8 pl-5 text-[15.5px] leading-[1.75] max-w-[72ch]">
          <li>As regras são públicas e versionadas, e cada uma cita o artigo. O passaporte fixa o hash da versão avaliada.</li>
          <li>Um revisor com relação declarada com o avaliado fica bloqueado pelo sistema. A cobrança nunca depende do veredito.</li>
          <li>Regra que depende de evidência ausente falha. Nenhum veredito pendente aparece como aprovado.</li>
          <li>Feito por DPO com 15 anos de proteção de dados, coautor da especificação ERC-8004.</li>
        </ul>
        <p className="mt-6">
          <a href="https://docs.dpo2u.com/docs/psav/padrao-psav-parceiro" style={{ color: PALETTE.ink, borderBottom: `1px solid ${TERRA}`, textDecoration: 'none' }}>
            Ler a metodologia completa →
          </a>
        </p>
      </section>

      <Rule />

      {/* 8 · FAQ */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-faq">
        <SmallLabel style={{ marginBottom: 16 }}>§ 07 · Perguntas frequentes</SmallLabel>
        <h2 id="psav-faq" style={h2} className="text-[30px] sm:text-[40px]">Perguntas frequentes<span style={{ color: TERRA }}>.</span></h2>
        <div className="mt-8 max-w-[80ch]">
          {FAQ.map((f) => (
            <details key={f.q} className="py-4" style={{ borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
              <summary className="cursor-pointer text-[17px]" style={{ fontWeight: 500 }}>{f.q}</summary>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: PALETTE.inkSoft }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Rule />

      {/* 9 · CTA */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="psav-cta">
        <h2 id="psav-cta" style={h2} className="text-[30px] sm:text-[40px] max-w-[22ch]">
          Comece pelo diagnóstico<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button kind="terracotta" href={mailto(HERO.spsav.subject)} style={terraButton}>Sou SPSAV — agendar diagnóstico →</Button>
          <Button kind="ghost" href={mailto(HERO.prestador.subject)}>Sou prestador — checar elegibilidade</Button>
        </div>
      </section>

      {/* 10 · Rodapé normativo */}
      <section className="px-6 lg:px-14 pb-16" aria-label="Normas e aviso">
        <Rule style={{ marginBottom: 20 }} />
        <p className="text-[13px] leading-[1.6]" style={{ color: PALETTE.concrete }}>
          Normas citadas: {NORMS.join(' · ')}. Página atualizada em 02/10/2026. Operação em testnet e devnet.
          Este conteúdo é informativo e não é aconselhamento jurídico. O passaporte apoia a diligência da SPSAV, mas não a substitui, não substitui a auditoria
          independente e não equivale a autorização do Banco Central. <Link to="/privacy" style={{ color: PALETTE.concrete }}>Privacidade</Link>.
        </p>
      </section>
    </div>
  );
}
