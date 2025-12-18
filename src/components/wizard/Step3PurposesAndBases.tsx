'use client';

import React from 'react';
import { PurposeAndBasis, DataInventoryItem } from '@/../types/wizard';
import { AlertCircle } from 'lucide-react';

interface Step3Props {
    data: PurposeAndBasis[];
    dataInventory: DataInventoryItem[];
    onChange: (data: PurposeAndBasis[]) => void;
}

export default function Step3PurposesAndBases({ data, dataInventory, onChange }: Step3Props) {
    // Automatically create purpose entries for each data item
    React.useEffect(() => {
        const existingIds = new Set(data.map(p => p.dataItemId));
        const newPurposes: PurposeAndBasis[] = dataInventory
            .filter(item => !existingIds.has(item.id))
            .map(item => ({
                dataItemId: item.id,
                finalidade: '',
                baseLegal: 'consentimento' as const,
                justificativa: ''
            }));

        if (newPurposes.length > 0) {
            onChange([...data, ...newPurposes]);
        }
    }, [dataInventory]);

    const updatePurpose = (dataItemId: string, field: keyof Omit<PurposeAndBasis, 'dataItemId'>, value: any) => {
        onChange(data.map(p =>
            p.dataItemId === dataItemId ? { ...p, [field]: value } : p
        ));
    };

    const getDataItemName = (id: string) => {
        return dataInventory.find(item => item.id === id)?.tipo || 'Dado não encontrado';
    };

    if (dataInventory.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum dado cadastrado</h3>
                <p className="text-muted-foreground">
                    Volte para a Etapa 2 e cadastre pelo menos um tipo de dado pessoal.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold mb-2">Finalidades e Bases Legais</h2>
                <p className="text-muted-foreground">
                    Para cada dado pessoal, indique a finalidade do tratamento e a base legal conforme a LGPD (Art. 7 e 11).
                </p>
            </div>

            <div className="space-y-6">
                {data.map((purpose) => {
                    const dataItem = dataInventory.find(item => item.id === purpose.dataItemId);
                    if (!dataItem) return null;

                    return (
                        <div key={purpose.dataItemId} className="p-6 border border-border rounded-lg bg-card space-y-4">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{dataItem.tipo}</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                    {dataItem.categoria}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Finalidade */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Finalidade do Tratamento *</label>
                                    <input
                                        type="text"
                                        value={purpose.finalidade}
                                        onChange={(e) => updatePurpose(purpose.dataItemId, 'finalidade', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="Ex: Execução de contrato, Marketing direto, Cumprimento de obrigação legal..."
                                        required
                                    />
                                </div>

                                {/* Base Legal */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Base Legal (Art. 7 LGPD) *</label>
                                    <select
                                        value={purpose.baseLegal}
                                        onChange={(e) => updatePurpose(purpose.dataItemId, 'baseLegal', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="consentimento">I - Consentimento do titular</option>
                                        <option value="contrato">II - Execução de contrato</option>
                                        <option value="obrigacao_legal">III - Obrigação legal/regulatória</option>
                                        <option value="exercicio_regular">IV - Exercício regular de direitos</option>
                                        <option value="protecao_vida">V - Proteção da vida</option>
                                        <option value="tutela_saude">VI - Tutela da saúde</option>
                                        <option value="interesse_legitimo">VII - Legítimo interesse</option>
                                        <option value="protecao_credito">VIII - Proteção ao crédito</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>

                                {/* Justificativa */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Justificativa da Base Legal *</label>
                                    <textarea
                                        value={purpose.justificativa}
                                        onChange={(e) => updatePurpose(purpose.dataItemId, 'justificativa', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                                        placeholder="Explique por que essa base legal é aplicável para este tratamento específico..."
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {purpose.baseLegal === 'interesse_legitimo' &&
                                            '⚠️ Para legítimo interesse, documente o teste de balanceamento de direitos.'}
                                        {purpose.baseLegal === 'consentimento' &&
                                            '💡 Garanta que o consentimento seja livre, informado e inequívoco.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
