'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThirdPartyProcessor, DataInventoryItem } from '@/../types/wizard';

interface Step5Props {
    data: ThirdPartyProcessor[];
    dataInventory: DataInventoryItem[];
    onChange: (data: ThirdPartyProcessor[]) => void;
}

export default function Step5ThirdParties({ data, dataInventory, onChange }: Step5Props) {
    const addProcessor = () => {
        const newProcessor: ThirdPartyProcessor = {
            id: `processor-${Date.now()}`,
            nome: '',
            tipo: 'processador',
            localizacao: 'brasil',
            dados_compartilhados: [],
            finalidade_compartilhamento: '',
            possui_dpa: false
        };
        onChange([...data, newProcessor]);
    };

    const removeProcessor = (id: string) => {
        onChange(data.filter(p => p.id !== id));
    };

    const updateProcessor = (id: string, field: keyof ThirdPartyProcessor, value: any) => {
        onChange(data.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const toggleDataShared = (processorId: string, dataItemId: string) => {
        const processor = data.find(p => p.id === processorId);
        if (!processor) return;

        const newShared = processor.dados_compartilhados.includes(dataItemId)
            ? processor.dados_compartilhados.filter(id => id !== dataItemId)
            : [...processor.dados_compartilhados, dataItemId];

        updateProcessor(processorId, 'dados_compartilhados', newShared);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold mb-2">Compartilhamento com Terceiros</h2>
                <p className="text-muted-foreground">
                    Liste todos os fornecedores, parceiros ou terceiros que processam ou têm acesso aos dados pessoais.
                </p>
            </div>

            <div className="space-y-4">
                {data.map((processor, index) => (
                    <div key={processor.id} className="p-6 border border-border rounded-lg bg-card space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold">Terceiro {index + 1}</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProcessor(processor.id)}
                                className="text-destructive hover:text-destructive/90"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nome */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome do Terceiro *</label>
                                <input
                                    type="text"
                                    value={processor.nome}
                                    onChange={(e) => updateProcessor(processor.id, 'nome', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Ex: AWS, Mailchimp, Google Analytics..."
                                    required
                                />
                            </div>

                            {/* CNPJ */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CNPJ (se aplicável)</label>
                                <input
                                    type="text"
                                    value={processor.cnpj || ''}
                                    onChange={(e) => updateProcessor(processor.id, 'cnpj', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>

                            {/* Tipo */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Relação *</label>
                                <select
                                    value={processor.tipo}
                                    onChange={(e) => updateProcessor(processor.id, 'tipo', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="processador">Operador (Processador)</option>
                                    <option value="controlador_conjunto">Controlador Conjunto</option>
                                    <option value="subcontratado">Subcontratado</option>
                                </select>
                            </div>

                            {/* Localização */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Localização *</label>
                                <select
                                    value={processor.localizacao}
                                    onChange={(e) => updateProcessor(processor.id, 'localizacao', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="brasil">Brasil</option>
                                    <option value="exterior">Exterior</option>
                                </select>
                            </div>

                            {/* Dados Compartilhados */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Dados Compartilhados *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-muted/30 rounded-lg border border-border">
                                    {dataInventory.map(item => (
                                        <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={processor.dados_compartilhados.includes(item.id)}
                                                onChange={() => toggleDataShared(processor.id, item.id)}
                                                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{item.tipo}</span>
                                        </label>
                                    ))}
                                    {dataInventory.length === 0 && (
                                        <span className="text-sm text-muted-foreground col-span-3">Nenhum dado cadastrado na Etapa 2</span>
                                    )}
                                </div>
                            </div>

                            {/* Finalidade */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Finalidade do Compartilhamento *</label>
                                <textarea
                                    value={processor.finalidade_compartilhamento}
                                    onChange={(e) => updateProcessor(processor.id, 'finalidade_compartilhamento', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
                                    placeholder="Ex: Hospedagem de dados, envio de emails marketing, analytics..."
                                    required
                                />
                            </div>

                            {/* DPA */}
                            <div className="space-y-2 md:col-span-2">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={processor.possui_dpa}
                                        onChange={(e) => updateProcessor(processor.id, 'possui_dpa', e.target.checked)}
                                        className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <label className="text-sm font-medium">Possui Contrato de DPA (Data Processing Agreement)</label>
                                </div>
                                {processor.possui_dpa && (
                                    <input
                                        type="date"
                                        value={processor.data_dpa || ''}
                                        onChange={(e) => updateProcessor(processor.id, 'data_dpa', e.target.value)}
                                        className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addProcessor}
                    className="w-full flex items-center gap-2 border-dashed border-2"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Terceiro
                </Button>

                {data.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        Clique no botão acima se sua empresa compartilha dados com terceiros.
                    </div>
                )}
            </div>
        </div>
    );
}
