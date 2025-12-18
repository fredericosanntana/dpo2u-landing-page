'use client';

import React from 'react';
import { StorageAndRetention, DataInventoryItem } from '@/../types/wizard';
import { AlertCircle } from 'lucide-react';

interface Step4Props {
    data: StorageAndRetention[];
    dataInventory: DataInventoryItem[];
    onChange: (data: StorageAndRetention[]) => void;
}

export default function Step4StorageAndRetention({ data, dataInventory, onChange }: Step4Props) {
    // Auto-create storage entries for each data item
    React.useEffect(() => {
        const existingIds = new Set(data.map(s => s.dataItemId));
        const newStorage: StorageAndRetention[] = dataInventory
            .filter(item => !existingIds.has(item.id))
            .map(item => ({
                dataItemId: item.id,
                localizacao: 'cloud_brasil' as const,
                periodo_retencao: '',
                procedimento_exclusao: ''
            }));

        if (newStorage.length > 0) {
            onChange([...data, ...newStorage]);
        }
    }, [dataInventory]);

    const updateStorage = (dataItemId: string, field: keyof Omit<StorageAndRetention, 'dataItemId'>, value: any) => {
        onChange(data.map(s =>
            s.dataItemId === dataItemId ? { ...s, [field]: value } : s
        ));
    };

    if (dataInventory.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum dado cadastrado</h3>
                <p className="text-muted-foreground">Volte para a Etapa 2 e cadastre pelo menos um tipo de dado pessoal.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold mb-2">Armazenamento e Retenção</h2>
                <p className="text-muted-foreground">
                    Informe onde cada tipo de dado é armazenado e por quanto tempo é mantido.
                </p>
            </div>

            <div className="space-y-6">
                {data.map((storage) => {
                    const dataItem = dataInventory.find(item => item.id === storage.dataItemId);
                    if (!dataItem) return null;

                    return (
                        <div key={storage.dataItemId} className="p-6 border border-border rounded-lg bg-card space-y-4">
                            <h3 className="font-semibold text-lg">{dataItem.tipo}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Localização */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Localização do Armazenamento *</label>
                                    <select
                                        value={storage.localizacao}
                                        onChange={(e) => updateStorage(storage.dataItemId, 'localizacao', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="cloud_brasil">Cloud (Brasil)</option>
                                        <option value="cloud_exterior">Cloud (Exterior)</option>
                                        <option value="on_premise">On-Premise (Servidor próprio)</option>
                                        <option value="misto">Misto</option>
                                    </select>
                                </div>

                                {/* Provedor */}
                                {(storage.localizacao.startsWith('cloud')) && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Provedor Cloud</label>
                                        <input
                                            type="text"
                                            value={storage.provedor || ''}
                                            onChange={(e) => updateStorage(storage.dataItemId, 'provedor', e.target.value)}
                                            className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Ex: AWS, Azure, Google Cloud..."
                                        />
                                    </div>
                                )}

                                {/* Período de Retenção */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Período de Retenção *</label>
                                    <input
                                        type="text"
                                        value={storage.periodo_retencao}
                                        onChange={(e) => updateStorage(storage.dataItemId, 'periodo_retencao', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="Ex: 2 anos, 5 anos, Até cancelamento..."
                                        required
                                    />
                                </div>

                                {/* Procedimento de Exclusão */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Procedimento de Exclusão *</label>
                                    <textarea
                                        value={storage.procedimento_exclusao}
                                        onChange={(e) => updateStorage(storage.dataItemId, 'procedimento_exclusao', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
                                        placeholder="Descreva como os dados são excluídos após o período de retenção..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
