'use client';

import React from 'react';
import { CompanyInfo } from '@/../types/wizard';
import clsx from 'clsx';

interface Step1Props {
    data: CompanyInfo;
    onChange: (data: CompanyInfo) => void;
}

export default function Step1CompanyInfo({ data, onChange }: Step1Props) {
    const update = (field: keyof CompanyInfo, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold mb-2 text-gray-900 dark:text-white">Informações da Empresa</h2>
                <p className="text-muted-foreground">
                    Dados básicos sobre a organização e o responsável pela proteção de dados.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Razão Social *</label>
                    <input
                        type="text"
                        value={data.nome}
                        onChange={(e) => update('nome', e.target.value)}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Empresa Exemplo Ltda"
                        required
                    />
                </div>

                {/* CNPJ */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">CNPJ *</label>
                    <input
                        type="text"
                        value={data.cnpj}
                        onChange={(e) => update('cnpj', e.target.value)}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="00.000.000/0001-00"
                        required
                    />
                </div>

                {/* Setor */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Setor de Atuação *</label>
                    <select
                        value={data.setor}
                        onChange={(e) => update('setor', e.target.value)}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="Tecnologia/Software">Tecnologia/Software</option>
                        <option value="E-commerce/Varejo">E-commerce/Varejo</option>
                        <option value="Serviços Financeiros">Serviços Financeiros</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                        <option value="Consultoria">Consultoria</option>
                        <option value="Indústria">Indústria</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>

                {/* Colaboradores */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Número de Colaboradores *</label>
                    <select
                        value={data.colaboradores}
                        onChange={(e) => update('colaboradores', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="5">1-10 (Micro)</option>
                        <option value="30">11-49 (Pequena)</option>
                        <option value="150">50-249 (Média)</option>
                        <option value="500">250+ (Grande)</option>
                    </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 md:col-span-2 pt-4">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <input
                            type="checkbox"
                            checked={data.coletaDados}
                            onChange={(e) => update('coletaDados', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-sm">A empresa coleta dados pessoais de clientes/usuários?</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <input
                            type="checkbox"
                            checked={data.possuiOperadores}
                            onChange={(e) => update('possuiOperadores', e.target.checked)}
                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-sm">A empresa utiliza fornecedores que processam dados (operadores)?</span>
                    </div>
                </div>

                {/* DPO/Responsável */}
                <div className="space-y-2 md:col-span-2 pt-4 border-t border-border">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Dados do DPO / Responsável</h3>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Nome do Responsável *</label>
                    <input
                        type="text"
                        value={data.responsavel}
                        onChange={(e) => update('responsavel', e.target.value)}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Nome Completo"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Email de Contato *</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="dpo@empresa.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Telefone (Opcional)</label>
                    <input
                        type="tel"
                        value={data.telefone || ''}
                        onChange={(e) => update('telefone', e.target.value)}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="(00) 00000-0000"
                    />
                </div>
            </div>
        </div>
    );
}
