'use client';

import React from 'react';
import { SecurityMeasures, RiskAssessment } from '@/../types/wizard';

interface Step6Props {
    security: SecurityMeasures;
    risks: RiskAssessment;
    onSecurityChange: (security: SecurityMeasures) => void;
    onRisksChange: (risks: RiskAssessment) => void;
}

export default function Step6SecurityAndRisks({ security, risks, onSecurityChange, onRisksChange }: Step6Props) {
    const updateTechnical = (field: keyof SecurityMeasures['tecnicas'], value: any) => {
        onSecurityChange({
            ...security,
            tecnicas: { ...security.tecnicas, [field]: value }
        });
    };

    const updateOrganizational = (field: keyof SecurityMeasures['organizacionais'], value: any) => {
        onSecurityChange({
            ...security,
            organizacionais: { ...security.organizacionais, [field]: value }
        });
    };

    const updateRisk = (field: keyof RiskAssessment, value: any) => {
        onRisksChange({ ...risks, [field]: value });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-serif font-bold mb-2">Segurança e Avaliação de Riscos</h2>
                <p className="text-muted-foreground">
                    Informe as medidas de segurança implementadas e responda ao questionário de avaliação de impacto (DPIA).
                </p>
            </div>

            {/* Medidas Técnicas */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Medidas Técnicas de Segurança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Criptografia */}
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={security.tecnicas.criptografia}
                                onChange={(e) => updateTechnical('criptografia', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">Criptografia de Dados</span>
                        </label>
                        {security.tecnicas.criptografia && (
                            <input
                                type="text"
                                value={security.tecnicas.criptografia_descricao || ''}
                                onChange={(e) => updateTechnical('criptografia_descricao', e.target.value)}
                                className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg text-sm"
                                placeholder="Ex: AES-256, TLS 1.3..."
                            />
                        )}
                    </div>

                    {/* Controle de Acesso */}
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={security.tecnicas.controle_acesso}
                                onChange={(e) => updateTechnical('controle_acesso', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">Controle de Acesso</span>
                        </label>
                        {security.tecnicas.controle_acesso && (
                            <input
                                type="text"
                                value={security.tecnicas.controle_acesso_descricao || ''}
                                onChange={(e) => updateTechnical('controle_acesso_descricao', e.target.value)}
                                className="w-full px-3 py-2 bg-muted/50 border border- input rounded-lg text-sm"
                                placeholder="Ex: MFA, RBAC..."
                            />
                        )}
                    </div>

                    {/* Backup */}
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={security.tecnicas.backup}
                                onChange={(e) => updateTechnical('backup', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">Backup Regular</span>
                        </label>
                        {security.tecnicas.backup && (
                            <input
                                type="text"
                                value={security.tecnicas.backup_frequencia || ''}
                                onChange={(e) => updateTechnical('backup_frequencia', e.target.value)}
                                className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg text-sm"
                                placeholder="Frequência (Ex: Diário, Semanal...)"
                            />
                        )}
                    </div>

                    {/* Outras medidas */}
                    <div className="p-4 border border-border rounded-lg flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={security.tecnicas.firewall}
                            onChange={(e) => updateTechnical('firewall', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Firewall</span>
                    </div>
                    <div className="p-4 border border-border rounded-lg flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={security.tecnicas.antivirus}
                            onChange={(e) => updateTechnical('antivirus', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Antivírus</span>
                    </div>
                    <div className="p-4 border border-border rounded-lg flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={security.tecnicas.monitoramento}
                            onChange={(e) => updateTechnical('monitoramento', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Monitoramento de Segurança</span>
                    </div>
                </div>
            </div>

            {/* Medidas Organizacionais */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Medidas Organizacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={security.organizacionais.politica_privacidade_interna}
                            onChange={(e) => updateOrganizational('politica_privacidade_interna', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Política de Privacidade Interna</span>
                    </div>

                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={security.organizacionais.treinamento_colaboradores}
                                onChange={(e) => updateOrganizational('treinamento_colaboradores', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">Treinamento de Colaboradores</span>
                        </label>
                        {security.organizacionais.treinamento_colaboradores && (
                            <input
                                type="text"
                                value={security.organizacionais.treinamento_frequencia || ''}
                                onChange={(e) => updateOrganizational('treinamento_frequencia', e.target.value)}
                                className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg text-sm"
                                placeholder="Frequência (Ex: Anual, Semestral...)"
                            />
                        )}
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={security.organizacionais.procedimentos_documentados}
                            onChange={(e) => updateOrganizational('procedimentos_documentados', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Procedimentos Documentados</span>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={security.organizacionais.auditoria_regular}
                            onChange={(e) => updateOrganizational('auditoria_regular', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Auditoria Regular</span>
                    </div>
                </div>
            </div>

            {/* Avaliação de Riscos (DPIA) */}
            <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xl font-semibold">Avaliação de Impacto (DPIA)</h3>

                <div className="space-y-4">
                    {/* Atividades de Alto Risco */}
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={risks.atividades_alto_risco}
                                onChange={(e) => updateRisk('atividades_alto_risco', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">A empresa realiza atividades de tratamento de alto risco?</span>
                        </label>
                        {risks.atividades_alto_risco && (
                            <textarea
                                value={risks.atividades_alto_risco_descricao || ''}
                                onChange={(e) => updateRisk('atividades_alto_risco_descricao', e.target.value)}
                                className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg min-h-[60px]"
                                placeholder="Descreva as atividades..."
                            />
                        )}
                    </div>

                    {/* Decisões Automatizadas */}
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={risks.decisoes_automatizadas}
                                onChange={(e) => updateRisk('decisoes_automatizadas', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">Decisões automatizadas (IA/Algoritmos)?</span>
                        </label>
                        {risks.decisoes_automatizadas && (
                            <textarea
                                value={risks.decisoes_automatizadas_descricao || ''}
                                onChange={(e) => updateRisk('decisoes_automatizadas_descricao', e.target.value)}
                                className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg min-h-[60px]"
                                placeholder="Descreva quais decisões..."
                            />
                        )}
                    </div>

                    {/* Transferência Internacional */}
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={risks.transferencia_internacional}
                                onChange={(e) => updateRisk('transferencia_internacional', e.target.checked)}
                                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="font-medium">Transferência internacional de dados?</span>
                        </label>
                        {risks.transferencia_internacional && (
                            <input
                                type="text"
                                value={risks.transferencia_internacional_paises?.join(', ') || ''}
                                onChange={(e) => updateRisk('transferencia_internacional_paises', e.target.value.split(', '))}
                                className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg"
                                placeholder="Países (separados por vírgula)"
                            />
                        )}
                    </div>

                    {/* Medidas de Mitigação */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Medidas de Mitigação de Riscos *</label>
                        <textarea
                            value={risks.medidas_mitigacao}
                            onChange={(e) => updateRisk('medidas_mitigacao', e.target.value)}
                            className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                            placeholder="Descreva as medidas implementadas para mitigar os riscos identificados..."
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
