'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataInventoryItem } from '@/../types/wizard';
import clsx from 'clsx';

interface Step2Props {
    data: DataInventoryItem[];
    onChange: (data: DataInventoryItem[]) => void;
}

export default function Step2DataInventory({ data, onChange }: Step2Props) {
    const addItem = () => {
        const newItem: DataInventoryItem = {
            id: `item-${Date.now()}`,
            tipo: '',
            categoria: 'cadastral',
            volume: 'baixo',
            descricao: ''
        };
        onChange([...data, newItem]);
    };

    const removeItem = (id: string) => {
        onChange(data.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof DataInventoryItem, value: any) => {
        onChange(data.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold mb-2">Inventário de Dados Pessoais</h2>
                <p className="text-muted-foreground">
                    Liste todos os tipos de dados pessoais que sua empresa coleta, armazena ou processa.
                </p>
            </div>

            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={item.id} className="p-6 border border-border rounded-lg bg-card space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold">Item {index + 1}</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive/90"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tipo de Dado */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Dado *</label>
                                <input
                                    type="text"
                                    value={item.tipo}
                                    onChange={(e) => updateItem(item.id, 'tipo', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Ex: CPF, Email, Endereço, Telefone..."
                                    required
                                />
                            </div>

                            {/* Categoria */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoria *</label>
                                <select
                                    value={item.categoria}
                                    onChange={(e) => updateItem(item.id, 'categoria', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="cadastral">Cadastral</option>
                                    <option value="sensivel">Sensível (Art. 11 LGPD)</option>
                                    <option value="crianca">Criança/Adolescente</option>
                                    <option value="financeiro">Financeiro</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            {/* Volume */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Volume Aproximado *</label>
                                <select
                                    value={item.volume}
                                    onChange={(e) => updateItem(item.id, 'volume', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="baixo">Baixo (&lt; 1.000 registros)</option>
                                    <option value="medio">Médio (1.000 - 10.000)</option>
                                    <option value="alto">Alto (&gt; 10.000)</option>
                                </select>
                            </div>

                            {/* Descrição */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Descrição / Contexto</label>
                                <textarea
                                    value={item.descricao}
                                    onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                                    className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
                                    placeholder="Descreva como esse dado é coletado e onde é usado..."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="w-full flex items-center gap-2 border-dashed border-2"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Tipo de Dado
                </Button>

                {data.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        Clique no botão acima para adicionar o primeiro tipo de dado pessoal.
                    </div>
                )}
            </div>
        </div>
    );
}
