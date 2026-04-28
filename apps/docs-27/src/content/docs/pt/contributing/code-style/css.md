---
title: "Diretrizes de CSS e SCSS"
description: "Padrões de codificação CSS/SCSS do XOOPS e melhores práticas"
---

> XOOPS segue padrões CSS modernos com pré-processamento SCSS, focando em manutenibilidade e performance.

---

## Visão Geral

Padrões CSS do XOOPS enfatizam:

- **Pré-processamento SCSS** para organização
- **Metodologia BEM** para nomenclatura
- **Design responsivo mobile-first**
- **Acessibilidade e HTML semântico**
- **Otimização de performance**

---

## Estrutura de Arquivo

### Organização SCSS

```
styles/
├── abstracts/           # Variáveis, mixins, funções
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # Reset, tipografia, padrões
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # Componentes reutilizáveis
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # Layout da página
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # Estilos específicos da página
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # Importar todos os arquivos
```

### Nomenclatura de Arquivo

```scss
// Use minúsculas com hífens
_button.scss        // Componente
_modal-dialog.scss  // Componente de múltiplas palavras
_colors.scss        // Variáveis
```

---

## Convenções de Nomenclatura

### Metodologia BEM

BEM = Block Element Modifier

```scss
// Block: Componente independente
.button { }

// Block__Element: Filho de block
.button__text { }
.button__icon { }

// Block--Modifier: Variação de block
.button--primary { }
.button--disabled { }
.button--small { }

// Exemplo complexo
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### Melhores Práticas de Nomenclatura

```scss
// ✅ Nomenclatura BEM descritiva
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ Evitar
.form-f { }                 // Muito abreviado
.form_field { }             // Use hífens, não underscores
.formField { }              // Não use camelCase
.form-field-2 { }           // Não use números para variantes
.form-field.active { }      // Use modificadores, não classes
```

---

## Formatação

### Estrutura Básica

```scss
.component {
  // 1. Posicionamento e layout
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. Modelo de caixa
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. Tipografia
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. Efeitos visuais
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. Animações
  transition: all 0.3s ease;
}
```

### Espaçamento e Indentação

```scss
// Use 2 espaços para indentação
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// Propriedades em linhas separadas
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ Não compacte
.component { display: flex; color: red; }
```

### Seletores

```scss
// Um seletor por linha
.button,
.button-group,
.button-list {
  // ...
}

// Não pule linhas entre seletores
// ✅
.component {
}

.component__element {
}

// ❌
.component {
}


.component__element {
}
```

---

## Variáveis

### Nomenclatura de Variável

```scss
// Use nomes descritivos
$color-primary: #0066cc;
$color-secondary: #666666;
$color-danger: #dc3545;

$font-base: 16px;
$font-size-small: 0.875rem;
$font-size-large: 1.25rem;

$spacing-unit: 0.5rem;
$spacing-small: 0.5rem;
$spacing-medium: 1rem;
$spacing-large: 2rem;

$border-radius-small: 2px;
$border-radius-medium: 4px;
$border-radius-large: 8px;

$transition-duration: 0.3s;
$transition-timing: ease-in-out;
```

### Organização de Variável

```scss
// _variables.scss

// Cores
$color-primary: #0066cc;
$color-secondary: #666666;

// Tipografia
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// Espaçamento
$spacing-unit: 0.5rem;
$spacing-xs: $spacing-unit;
$spacing-sm: $spacing-unit * 2;
$spacing-md: $spacing-unit * 4;
$spacing-lg: $spacing-unit * 8;

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

---

## Cores

### Sistema de Cor

```scss
// Paleta primária
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// Paleta secundária
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// Cores semânticas
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// Cores neutras
$color-white: #ffffff;
$color-black: #000000;
$color-gray-100: #f8f9fa;
$color-gray-200: #e9ecef;
$color-gray-300: #dee2e6;
$color-gray-400: #ced4da;
$color-gray-500: #adb5bd;
$color-gray-600: #6c757d;
$color-gray-700: #495057;
$color-gray-800: #343a40;
$color-gray-900: #212529;

// Uso
.button {
  background-color: $color-primary;
  color: $color-white;

  &:hover {
    background-color: $color-primary-dark;
  }

  &--danger {
    background-color: $color-danger;
  }
}
```

---

## Tipografia

### Declarações de Fonte

```scss
// Definir variáveis de tipografia
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// Tamanhos de fonte
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// Pesos de fonte
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Hierarquia de Cabeçalho

```scss
h1, .h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-lg;
}

h2, .h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-md;
}

h3, .h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-md;
}

p {
  font-size: $font-size-base;
  line-height: $line-height-base;
  margin-bottom: $spacing-md;
}

small {
  font-size: $font-size-small;
}
```

---

## Mixins

### Mixins Comuns

```scss
// Mixin de breakpoint responsivo
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}

// Uso
.component {
  font-size: 0.875rem;

  @include respond-to('md') {
    font-size: 1rem;
  }

  @include respond-to('lg') {
    font-size: 1.125rem;
  }
}

// Mixin de flexbox
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Uso
.modal__overlay {
  @include flex-center;
  height: 100vh;
}

// Mixin truncar texto
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Uso
.breadcrumb__item {
  @include truncate;
  max-width: 200px;
}

// Mixin clearfix (legado)
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

---

## Design Responsivo

### Abordagem Mobile-First

```scss
// Estilos base (mobile)
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// Tablets e acima
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// Desktops e acima
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

### Sistema de Breakpoint

```scss
// Definir breakpoints
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px,
);

// Mixin flexível para qualquer breakpoint
@mixin media($breakpoint) {
  $min-width: map-get($breakpoints, $breakpoint);
  @media (min-width: $min-width) {
    @content;
  }
}

// Uso
.component {
  width: 100%;

  @include media('md') {
    width: 50%;
  }

  @include media('lg') {
    width: 33.333%;
  }
}
```

---

## Melhores Práticas

### Faça

- Use variáveis SCSS para cores, espaçamento, fonts
- Siga convenção de nomenclatura BEM
- Design responsivo mobile-first
- Organize arquivos por propósito
- Escreva mixins reutilizáveis
- Mantenha seletores simples (máx 3 níveis de profundidade)
- Use HTML semântico
- Minimize especificidade
- Comente seções complexas

### Não Faça

- Use estilos inline
- Use !important (quase nunca)
- Crie seletores excessivamente específicos
- Use seletores de ID para estilo
- Aninha muito profundo (máx 3-4 níveis)
- Use px para tamanhos de fonte (use rem)
- Crie números mágicos (use variáveis)
- Deixe CSS não usado
- Esqueça acessibilidade

---

## Acessibilidade

### Contraste de Cor

```scss
// Certifique-se contraste suficiente
// Nível AA: 4.5:1 para texto normal
// Nível AAA: 7:1 para texto normal

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // Taxa de contraste: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // Taxa de contraste: 9.3:1 ✅
}
```

### Estados de Foco

```scss
// Sempre forneça estilos de foco
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

### HTML Semântico com CSS

```scss
// Use estrutura semântica apropriada
main {
  padding: $spacing-lg;
}

article {
  margin-bottom: $spacing-xl;
  border-bottom: 1px solid #eee;
  padding-bottom: $spacing-xl;
}

header {
  background-color: #f5f5f5;
  padding: $spacing-md;
}

nav {
  display: flex;
  gap: $spacing-md;
}
```

---

## Performance

### Otimizar Seletores

```scss
// ✅ Eficiente
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ Ineficiente (muito específico, aninhamento profundo)
div.container section.content article .button {
  // ...
}
```

### Minimizar Repintos

```scss
// Agrupar animações
.component {
  // Mudar múltiplas propriedades de uma vez
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

// Ou use shorthand
.component {
  transition: all 0.3s ease;
}
```

---

## Ferramentas

### Configuração Stylelint

```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "color-hex-length": "short",
    "selector-pseudo-class-no-unknown": null,
    "scss/dollar-variable-pattern": "^[a-z]"
  }
}
```

---

## Documentação Relacionada

- Padrões JavaScript
- Código de Conduta
- Fluxo de Contribuição
- Padrões PHP

---

#xoops #css #scss #styling #coding-standards #best-practices
