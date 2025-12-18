'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Download, CheckCircle, AlertCircle, Loader2, Brain, Activity } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

type FormData = {
    nome: string;
    cnpj: string;
    setor: string;
    colaboradores: string;
    coletaDados: boolean;
    possuiOperadores: boolean;
    responsavel: string;
    email: string;
    telefone: string;
    apiKey?: string;
};

export default function AnalisePage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ downloadUrl: string; logs: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/analise/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Erro ao gerar documentos');
            }

            setResult(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Gerador de Adequação LGPD
                        </h1>
                        <p className="text-xl text-muted-foreground font-light">
                            Gere seu kit de conformidade completo em minutos usando nossa IA.
                        </p>
                    </div>

                    <Card className="p-8 shadow-xl bg-card border-border/50 backdrop-blur-sm">
                        {!result && (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Nome */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Razão Social</label>
                                        <input
                                            {...register('nome', { required: 'Nome é obrigatório' })}
                                            className={clsx(
                                                "w-full px-4 py-3 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all",
                                                errors.nome ? "border-destructive" : "border-input"
                                            )}
                                            placeholder="Sua Empresa Ltda"
                                        />
                                        {errors.nome && <span className="text-destructive text-xs">{errors.nome.message}</span>}
                                    </div>

                                    {/* CNPJ */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">CNPJ</label>
                                        <input
                                            {...register('cnpj', { required: 'CNPJ é obrigatório' })}
                                            className={clsx(
                                                "w-full px-4 py-3 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all",
                                                errors.cnpj ? "border-destructive" : "border-input"
                                            )}
                                            placeholder="00.000.000/0001-00"
                                        />
                                        {errors.cnpj && <span className="text-destructive text-xs">{errors.cnpj.message}</span>}
                                    </div>

                                    {/* Setor */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Setor de Atuação</label>
                                        <select
                                            {...register('setor')}
                                            className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                        >
                                            <option value="Tecnologia/Software">Tecnologia/Software</option>
                                            <option value="E-commerce/Varejo">E-commerce/Varejo</option>
                                            <option value="Serviços Financeiros">Serviços Financeiros</option>
                                            <option value="Saúde">Saúde</option>
                                            <option value="Educação">Educação</option>
                                            <option value="Consultoria">Consultoria</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>

                                    {/* Colaboradores */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Colaboradores</label>
                                        <select
                                            {...register('colaboradores')}
                                            className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                        >
                                            <option value="5">1-10 (Micro)</option>
                                            <option value="30">11-49 (Pequena)</option>
                                            <option value="150">50-249 (Média)</option>
                                            <option value="500">250+ (Grande)</option>
                                        </select>
                                    </div>

                                    {/* DPO Nome */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nome do DPO/Responsável</label>
                                        <input
                                            {...register('responsavel', { required: 'Responsável é obrigatório' })}
                                            className={clsx(
                                                "w-full px-4 py-3 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all",
                                                errors.responsavel ? "border-destructive" : "border-input"
                                            )}
                                            placeholder="Nome Completo"
                                        />
                                        {errors.responsavel && <span className="text-destructive text-xs">{errors.responsavel.message}</span>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email de Contato</label>
                                        <input
                                            {...register('email', { required: 'Email é obrigatório' })}
                                            className={clsx(
                                                "w-full px-4 py-3 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all",
                                                errors.email ? "border-destructive" : "border-input"
                                            )}
                                            placeholder="dpo@empresa.com"
                                        />
                                        {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
                                    </div>

                                    {/* Telefone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Telefone (Opcional)</label>
                                        <input
                                            {...register('telefone')}
                                            className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <input
                                            type="checkbox"
                                            {...register('coletaDados')}
                                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">A empresa coleta dados pessoais de clientes/usuários?</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <input
                                            type="checkbox"
                                            {...register('possuiOperadores')}
                                            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">A empresa utiliza fornecedores que processam dados (operadores)?</span>
                                    </div>
                                </div>

                                {/* API Key */}
                                <div className="space-y-2 pt-6 border-t border-border">
                                    <label className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Gemini API Key (Opcional)</label>
                                    <div className="text-xs text-muted-foreground mb-1">Se não preenchido, usará a chave do servidor.</div>
                                    <input
                                        {...register('apiKey')}
                                        type="password"
                                        className="w-full px-4 py-3 bg-muted/50 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-muted-foreground"
                                        placeholder="AIza..."
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                Gerando Documentos... (2-3 min)
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-5 h-5 mr-2" />
                                                Gerar Kit de Adequação
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start text-destructive">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {result && (
                            <div className="mt-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Adequação Concluída!</h3>
                                    <p className="text-muted-foreground">
                                        Seus documentos foram gerados e validados com sucesso pela nossa IA.
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/50 rounded-lg text-left text-xs font-mono text-muted-foreground h-48 overflow-y-auto border border-border">
                                    <pre>{result.logs}</pre>
                                </div>

                                <Button
                                    onClick={() => window.location.href = result.downloadUrl}
                                    className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Baixar Pacote Final (.zip)
                                </Button>

                                <button
                                    onClick={() => setResult(null)}
                                    className="block w-full mt-4 text-muted-foreground hover:text-foreground text-sm underline"
                                >
                                    Gerar novo kit
                                </button>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
