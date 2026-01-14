# Guia de Uso: Sistema de Cores Centralizado

## 📁 Localização

**ÚNICO ARQUIVO DE CORES:** `/src/styles/colors.css`

Este é o **único lugar** onde você precisa modificar cores para mudar a paleta inteira do projeto.

## 🎨 Como Alterar as Cores

### 1. Abra o arquivo central de cores

```bash
/root/dpo2u-landing-page/src/styles/colors.css
```

### 2. Encontre a cor que deseja alterar

Todas as cores estão organizadas em seções:

- **Cores Primárias da Marca** (Sapphire, Emerald, Purple, Ocean, Platinum, Chrome) - cores com variações de 50 a 900
- **Cores Semânticas** (success, warning, error, info)
- **Cores de UI/Interface** (primary, secondary, accent, background, foreground, etc.)
- **Gradientes**
- **Cores do Dashboard**
- **Cores para Gráficos e Visualizações**

### 3. Modifique o valor da cor

Por exemplo, para mudar a cor primária azul (Sapphire 500):

**ANTES:**
```css
--color-sapphire-500: #4F46E5;  /* DPO2U Primary Blue */
```

**DEPOIS:**
```css
--color-sapphire-500: #0066CC;  /* Novo azul */
```

### 4. Salve o arquivo

As mudanças serão aplicadas automaticamente em **TODO o projeto**:
- Landing page
- Dashboard
- Componentes
- Gráficos
- Visualizações

## 📚 Referências no Código

### Em CSS

Use com a função `var()`:

```css
.meu-elemento {
  color: var(--color-sapphire-500);
  background: var(--gradient-hero);
  border-color: var(--color-border);
}
```

### Em JavaScript/TypeScript

Use `getComputedStyle()`:

```typescript
const getColor = (varName: string): string => {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(varName).trim();
};

// Exemplo de uso
const primaryColor = getColor('--color-sapphire-500');
```

## 🔍 Variáveis Disponíveis

### Cores Principais

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `--color-sapphire-500` | Azul principal DPO2U | #4F46E5 |
| `--color-emerald-500` | Verde tecnológico | #00d494 |
| `--color-purple-500` | Roxo acentuado | #7C3AED |
| `--color-ocean-500` | Azul oceano | #0ea5e9 |

### Cores Semânticas

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `--color-success` | Sucesso | #10b981 |
| `--color-warning` | Aviso | #00d494 |
| `--color-error` | Erro | #ef4444 |
| `--color-info` | Informação | #3b82f6 |

### Gradientes

| Variável | Descrição |
|----------|-----------|
| `--gradient-hero` | Gradiente do hero |
| `--gradient-premium` | Gradiente premium |
| `--gradient-tech` | Gradiente tecnológico |
| `--gradient-success` | Gradiente de sucesso |

### Cores de Gráficos

| Variável | Uso |
|----------|-----|
| `--chart-primary` | Cor primária dos gráficos |
| `--chart-secondary` | Cor secundária dos gráficos |
| `--chart-color-1` a `--chart-color-5` | Paleta de 5 cores para gráficos |
| `--graph-project`, `--graph-area`, etc. | Cores específicas para tipos de nós no grafo |

## 🎨 Criando um Novo Tema

Para criar um tema alternativo:

1. Copie `colors.css` para `colors-dark.css` (ou outro nome)
2. Modifique todas as cores no novo arquivo
3. Altere o import em `globals.css`:

```css
/* Tema claro (padrão) */
@import '../styles/colors.css';

/* OU tema escuro */
@import '../styles/colors-dark.css';
```

## ✅ Verificação

Para verificar se todas as cores estão centralizadas:

```bash
# Deve retornar poucos ou nenhum resultado (exceto node_modules)
grep -r "#[0-9a-fA-F]\{6\}" src/ --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
```

## 🚀 Exemplos de Uso

### Mudando a Cor Primary de Azul para Verde

```css
/* Em /src/styles/colors.css */
--color-primary: #00d494;  /* Era #006dff */
```

Isso mudará:
- Botões primários
- Links
- Focus rings
- Todos os gráficos que usam a cor primária

### Mudando o Gradiente do Hero

```css
/* Em /src/styles/colors.css */
--gradient-hero: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
```

Isso mudará o gradiente de fundo da seção hero automaticamente.

## 📝 Notas Importantes

- ✅ Sempre edite APENAS o arquivo `colors.css`
- ✅ Mantenha o formato de variável CSS `--nome-da-variavel`
- ✅ Use cores em formato hexadecimal `#RRGGBB`
- ❌ NÃO adicione cores hardcoded em componentes
- ❌ NÃO duplique definições de cores em outros arquivos

## 🐛 Solução de Problemas

### As cores não mudaram após editar colors.css

1. Limpe o cache do navegador
2. Certifique-se de que salvou o arquivo
3. Verifique se há erros no console do navegador
4. Recompile o projeto: `npm run build`

### Cor não aplicada em um componente específico

Verifique se o componente está usando `var(--color-*)` ou `getColor('--color-*')` ao invés de cores hardcoded.

## 📞 Suporte

Se encontrar cores que ainda estão hardcoded e não foram centralizadas, procure por:
- Valores hexadecimais `#RRGGBB` no código fonte
- Use o grep acima para localizar
