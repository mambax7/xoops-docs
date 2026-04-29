---
title: “CSS 和 SCSS 指南”
description: “XOOPS CSS/SCSS编码标准和最佳实践”
---

> XOOPS 遵循现代 CSS 标准，并进行 SCSS 预处理，重点关注可维护性和性能。

---

## 概述

XOOPS CSS标准强调：

- **SCSS 组织预处理**
- **BEM命名方法**
- **移动-first响应式设计**
- **辅助功能和语义HTML**
- **性能优化**

---

## 文件结构

### SCSS 组织

```
styles/
├── abstracts/           # Variables, mixins, functions
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # Reset, typography, defaults
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # Reusable components
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # Page layout
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # Page-specific styles
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # Import all files
```

### 文件命名

```scss
// Use lowercase with hyphens
_button.scss        // Component
_modal-dialog.scss  // Multi-word component
_colors.scss        // Variables
```

---

## 命名约定

### BEM方法论

BEM = 区块元素修改器

```scss
// Block: Standalone component
.button { }

// Block__Element: Child of block
.button__text { }
.button__icon { }

// Block--Modifier: Variation of block
.button--primary { }
.button--disabled { }
.button--small { }

// Complex example
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### 命名最佳实践

```scss
// ✅ Descriptive BEM naming
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ Avoid
.form-f { }                 // Too abbreviated
.form_field { }             // Use hyphens, not underscores
.formField { }              // Don't use camelCase
.form-field-2 { }           // Don't use numbers for variants
.form-field.active { }      // Use modifiers, not classes
```

---

## 格式化

### 基本结构

```scss
.component {
  // 1. Positioning and layout
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. Box model
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. Typography
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. Visual effects
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. Animations
  transition: all 0.3s ease;
}
```

### 间距和缩进

```scss
// Use 2 spaces for indentation
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// Properties on separate lines
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ Don't compact
.component { display: flex; color: red; }
```

### 选择器

```scss
// One selector per line
.button,
.button-group,
.button-list {
  // ...
}

// Don't skip lines between selectors
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

## 变量

### 变量命名

```scss
// Use descriptive names
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

### 变量组织

```scss
// _variables.scss

// Colors
$color-primary: #0066cc;
$color-secondary: #666666;

// Typography
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// Spacing
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

## 颜色

### 颜色系统

```scss
// Primary palette
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// Secondary palette
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// Semantic colors
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// Neutral colors
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

// Usage
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

## 版式

### 字体声明

```scss
// Define typography variables
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// Font sizes
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// Font weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 标题层次结构

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

## 混合

### 常见的混入

```scss
// Responsive breakpoint mixin
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

// Usage
.component {
  font-size: 0.875rem;

  @include respond-to('md') {
    font-size: 1rem;
  }

  @include respond-to('lg') {
    font-size: 1.125rem;
  }
}

// Flexbox mixin
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Usage
.modal__overlay {
  @include flex-center;
  height: 100vh;
}

// Truncate text mixin
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Usage
.breadcrumb__item {
  @include truncate;
  max-width: 200px;
}

// Clearfix mixin (legacy)
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

---

## 响应式设计

### 移动-First方法

```scss
// Base styles (mobile)
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// Tablets and up
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// Desktops and up
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

### 断点系统

```scss
// Define breakpoints
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px,
);

// Flexible mixin for any breakpoint
@mixin media($breakpoint) {
  $min-width: map-get($breakpoints, $breakpoint);
  @media (min-width: $min-width) {
    @content;
  }
}

// Usage
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

## 组件

### 按钮组件

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border: 1px solid transparent;
  border-radius: $border-radius-medium;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Variants
  &--primary {
    background-color: $color-primary;
    color: $color-white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }

  &--secondary {
    background-color: $color-secondary;
    color: $color-white;
  }

  &--danger {
    background-color: $color-danger;
    color: $color-white;
  }

  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-small;
  }

  &--large {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-large;
  }

  // Icons
  &__icon {
    margin-right: 0.5em;

    &:last-child {
      margin-right: 0;
      margin-left: 0.5em;
    }
  }
}
```

### 表单组件

```scss
.form-group {
  margin-bottom: $spacing-lg;
}

.form-field {
  display: flex;
  flex-direction: column;

  &__label {
    font-weight: $font-weight-semibold;
    margin-bottom: 0.5rem;
    color: $color-secondary-dark;
  }

  &__input,
  &__select,
  &__textarea {
    padding: $spacing-sm;
    border: 1px solid #ddd;
    border-radius: $border-radius-medium;
    font-size: $font-size-base;
    font-family: inherit;
    transition: border-color $transition-duration;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  &__help {
    font-size: $font-size-small;
    color: $color-gray-600;
    margin-top: 0.25rem;
  }

  &--error {
    .form-field__input,
    .form-field__select {
      border-color: $color-danger;

      &:focus {
        box-shadow: 0 0 0 3px rgba($color-danger, 0.1);
      }
    }

    .form-field__error {
      color: $color-danger;
      font-size: $font-size-small;
      margin-top: 0.25rem;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

---

## 最佳实践

### 做

- 使用SCSS变量来表示颜色、间距、字体
- 遵循BEM命名约定
- 移动-first响应式设计
- 按用途组织文件
- 编写可重用的mixin
- 保持选择器简单（最多 3 级深度）
- 使用语义HTML
- 最小化特异性
- 评论复杂的部分

### 不要

- 使用内联样式
- 使用！important（几乎从不）
- 创建过于具体的选择器
- 使用 ID 选择器进行样式设置
- 嵌套太深（最多 3-4 层）
- 使用 px 作为字体大小（使用 rem）
- 创建幻数（使用变量）
- 保留未使用的CSS
- 忘记可访问性

---

## 辅助功能

### 颜色对比

```scss
// Ensure sufficient contrast
// Level AA: 4.5:1 for normal text
// Level AAA: 7:1 for normal text

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // Contrast ratio: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // Contrast ratio: 9.3:1 ✅
}
```

### 焦点状态

```scss
// Always provide focus styles
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

### 语义 HTML 与 CSS

```scss
// Use proper semantic structure
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

## 性能

### 优化选择器

```scss
// ✅ Efficient
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ Inefficient (too specific, deep nesting)
div.container section.content article .button {
  // ...
}
```

### 尽量减少重绘

```scss
// Group animations
.component {
  // Change multiple properties at once
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

// Or use shorthand
.component {
  transition: all 0.3s ease;
}
```

---

## 工具

### Stylelint 配置

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

## 相关文档

- JavaScript标准
- 行为准则
- 贡献工作流程
- PHP标准

---

#XOOPS #css #scss #styling #coding-standards #best-practices