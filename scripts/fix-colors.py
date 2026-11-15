#!/usr/bin/env python3
"""
Script para padronizar cores hardcoded nos arquivos TSX do projeto DPO2U.
Substitui classes Tailwind genéricas (slate, gray, blue, etc.) pelos tokens
de design da marca (brand-sapphire, brand-emerald, brand-purple, brand-platinum).

Mapeamento de cores:
- slate-* dark backgrounds → brand-chrome-* / brand-platinum-*
- gray-* → brand-gray-* / brand-platinum-*
- blue-* → brand-sapphire-* / brand-ocean-*
- purple-* → brand-purple-*
- emerald-* / green-* → brand-emerald-*
- zinc-* → brand-chrome-*
"""

import re
import os
import sys
from pathlib import Path

# Diretório raiz do projeto
ROOT = Path("/home/ubuntu/dpo2u-landing-page/src")

# ─── Mapeamento de substituições ───────────────────────────────────────────────
# Formato: (padrão_regex, substituição)
# Ordem importa: mais específico primeiro
REPLACEMENTS = [
    # ── Backgrounds escuros (slate-9xx, slate-8xx) → brand-chrome / brand-platinum
    (r'\bslate-950\b', 'brand-chrome-900'),
    (r'\bslate-900\b', 'brand-chrome-900'),
    (r'\bslate-800\b', 'brand-chrome-800'),
    (r'\bslate-700\b', 'brand-platinum-800'),
    (r'\bslate-600\b', 'brand-platinum-700'),
    (r'\bslate-500\b', 'brand-platinum-600'),
    (r'\bslate-400\b', 'brand-platinum-500'),
    (r'\bslate-300\b', 'brand-platinum-400'),
    (r'\bslate-200\b', 'brand-platinum-300'),
    (r'\bslate-100\b', 'brand-platinum-200'),
    (r'\bslate-50\b',  'brand-platinum-100'),

    # ── Gray → brand-gray / brand-platinum
    (r'\bgray-900\b', 'brand-gray-900'),
    (r'\bgray-800\b', 'brand-gray-800'),
    (r'\bgray-700\b', 'brand-gray-700'),
    (r'\bgray-600\b', 'brand-gray-600'),
    (r'\bgray-500\b', 'brand-gray-500'),
    (r'\bgray-400\b', 'brand-gray-400'),
    (r'\bgray-300\b', 'brand-gray-300'),
    (r'\bgray-200\b', 'brand-gray-200'),
    (r'\bgray-100\b', 'brand-gray-100'),
    (r'\bgray-50\b',  'brand-gray-50'),

    # ── Zinc → brand-chrome
    (r'\bzinc-900\b', 'brand-chrome-900'),
    (r'\bzinc-800\b', 'brand-chrome-800'),
    (r'\bzinc-700\b', 'brand-chrome-700'),
    (r'\bzinc-600\b', 'brand-chrome-600'),
    (r'\bzinc-500\b', 'brand-chrome-500'),
    (r'\bzinc-400\b', 'brand-chrome-400'),
    (r'\bzinc-300\b', 'brand-chrome-300'),
    (r'\bzinc-200\b', 'brand-chrome-200'),
    (r'\bzinc-100\b', 'brand-chrome-100'),
    (r'\bzinc-50\b',  'brand-chrome-50'),

    # ── Blue → brand-sapphire / brand-ocean
    (r'\bblue-900\b', 'brand-sapphire-900'),
    (r'\bblue-800\b', 'brand-sapphire-800'),
    (r'\bblue-700\b', 'brand-sapphire-700'),
    (r'\bblue-600\b', 'brand-sapphire-600'),
    (r'\bblue-500\b', 'brand-sapphire-500'),
    (r'\bblue-400\b', 'brand-sapphire-400'),
    (r'\bblue-300\b', 'brand-sapphire-300'),
    (r'\bblue-200\b', 'brand-sapphire-200'),
    (r'\bblue-100\b', 'brand-sapphire-100'),
    (r'\bblue-50\b',  'brand-sapphire-50'),

    # ── Purple → brand-purple
    (r'\bpurple-900\b', 'brand-purple-900'),
    (r'\bpurple-800\b', 'brand-purple-800'),
    (r'\bpurple-700\b', 'brand-purple-700'),
    (r'\bpurple-600\b', 'brand-purple-600'),
    (r'\bpurple-500\b', 'brand-purple-500'),
    (r'\bpurple-400\b', 'brand-purple-400'),
    (r'\bpurple-300\b', 'brand-purple-300'),
    (r'\bpurple-200\b', 'brand-purple-200'),
    (r'\bpurple-100\b', 'brand-purple-100'),
    (r'\bpurple-50\b',  'brand-purple-50'),

    # ── Emerald / Green → brand-emerald
    (r'\bemerald-900\b', 'brand-emerald-900'),
    (r'\bemerald-800\b', 'brand-emerald-800'),
    (r'\bemerald-700\b', 'brand-emerald-700'),
    (r'\bemerald-600\b', 'brand-emerald-600'),
    (r'\bemerald-500\b', 'brand-emerald-500'),
    (r'\bemerald-400\b', 'brand-emerald-400'),
    (r'\bemerald-300\b', 'brand-emerald-300'),
    (r'\bemerald-200\b', 'brand-emerald-200'),
    (r'\bemerald-100\b', 'brand-emerald-100'),
    (r'\bemerald-50\b',  'brand-emerald-50'),

    (r'\bgreen-900\b', 'brand-emerald-900'),
    (r'\bgreen-800\b', 'brand-emerald-800'),
    (r'\bgreen-700\b', 'brand-emerald-700'),
    (r'\bgreen-600\b', 'brand-emerald-600'),
    (r'\bgreen-500\b', 'brand-emerald-500'),
    (r'\bgreen-400\b', 'brand-emerald-400'),
    (r'\bgreen-300\b', 'brand-emerald-300'),
    (r'\bgreen-200\b', 'brand-emerald-200'),
    (r'\bgreen-100\b', 'brand-emerald-100'),
    (r'\bgreen-50\b',  'brand-emerald-50'),
]

# Arquivos a processar (relativos a ROOT)
TARGET_FILES = [
    "app/page.tsx",
    "app/about.tsx",
    "app/midnight.tsx",
    "app/midnight-protocol.tsx",
    "app/private-stack.tsx",
    "app/self-funding-agent.tsx",
    "app/compliance.tsx",
    "app/compliance-automate.tsx",
    "app/mcp.tsx",
    "app/mcp-brain.tsx",
    "app/erc8004.tsx",
    "components/Header.tsx",
    "components/Footer.tsx",
    "components/FAQSection.tsx",
    "components/navigation/MobileNav.tsx",
    "components/forms/ConsultoriaForm.tsx",
    "components/forms/SystemMultiagenteForm.tsx",
    "components/consent/CookieBanner.tsx",
    "components/modals/DataProcessingModal.tsx",
    "components/enhanced/CustomerJourneyMap.tsx",
    "components/enhanced/IntegrationCapabilities.tsx",
    "components/enhanced/LiveSystemStatusDashboard.tsx",
    "components/enhanced/ROICalculator.tsx",
    "components/enhanced/SecurityComplianceShowcase.tsx",
    "components/enhanced/TechnicalArchitectureDashboard.tsx",
    "components/midnight/BuildTimeline.tsx",
    "components/midnight/CompactContractsShowcase.tsx",
    "components/midnight/MidnightZKDemo.tsx",
    "components/ui/dialog.tsx",
    "components/ui/premium-dialog.tsx",
]

def process_file(filepath: Path) -> tuple[int, list[str]]:
    """Processa um arquivo e retorna (número de substituições, lista de mudanças)."""
    if not filepath.exists():
        return 0, [f"  SKIP: arquivo não encontrado"]

    content = filepath.read_text(encoding='utf-8')
    original = content
    changes = []
    total = 0

    for pattern, replacement in REPLACEMENTS:
        # Só substitui dentro de strings className (entre aspas)
        # Usa lookahead/lookbehind para garantir que está dentro de uma classe CSS
        new_content, count = re.subn(pattern, replacement, content)
        if count > 0:
            clean_pattern = pattern.replace('\\b', '').replace('\\', '')
            changes.append(f"  {clean_pattern} → {replacement} ({count}x)")
            total += count
            content = new_content

    if content != original:
        filepath.write_text(content, encoding='utf-8')

    return total, changes

def main():
    print("=" * 70)
    print("DPO2U — Padronização de Cores UI")
    print("=" * 70)

    grand_total = 0
    files_changed = 0

    for rel_path in TARGET_FILES:
        filepath = ROOT / rel_path
        count, changes = process_file(filepath)

        if count > 0:
            print(f"\n✓ {rel_path} ({count} substituições)")
            for c in changes:
                print(c)
            grand_total += count
            files_changed += 1
        else:
            print(f"  — {rel_path} (sem alterações)")

    print("\n" + "=" * 70)
    print(f"TOTAL: {grand_total} substituições em {files_changed} arquivos")
    print("=" * 70)

if __name__ == '__main__':
    main()
