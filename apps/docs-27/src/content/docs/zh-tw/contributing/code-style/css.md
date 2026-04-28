---
title: "CSS 和 SCSS 指南"
description: "XOOPS CSS/SCSS 編碼標準和最佳實踐"
---

> XOOPS 遵循現代 CSS 標準，採用 SCSS 預處理，強調可維護性和性能。

---

## 概述

XOOPS CSS 標準強調：

- **SCSS 預處理** 用於組織
- **BEM 方法論** 用於命名
- **移動優先響應式設計**
- **可訪問性和語義 HTML**
- **性能優化**

---

## 文件結構

### SCSS 組織

```
styles/
├── abstracts/           # 變量、混合、函數
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # 重置、排版、默認值
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # 可重用組件
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # 頁面佈局
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # 頁面特定樣式
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # 導入所有文件
```

### 文件命名

```scss
// 使用小寫和連字符
_button.scss        // 組件
_modal-dialog.scss  // 多字組件
_colors.scss        // 變量
```

---

## 命名約定

### BEM 方法論

BEM = 塊元素修飾符

```scss
// 塊：獨立組件
.button { }

// 塊__元素：塊的子級
.button__text { }
.button__icon { }

// 塊--修飾符：塊的變體
.button--primary { }
.button--disabled { }
.button--small { }

// 複雜示例
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

---

## 格式化

### 基本結構

```scss
.component {
  // 1. 定位和佈局
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. 盒模型
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. 排版
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. 視覺效果
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. 動畫
  transition: all 0.3s ease;
}
```

### 間距和縮進

```scss
// 縮進使用 2 個空格
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// 屬性在單獨的行上
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ 不要緊湊
.component { display: flex; color: red; }
```

---

## 變量

### 變量命名

```scss
// 使用描述性名稱
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

---

## 顏色系統

```scss
// 主要調色板
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// 語義顏色
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// 中性顏色
$color-white: #ffffff;
$color-black: #000000;
$color-gray-100: #f8f9fa;
// ... 更多灰色等級
```

---

## 排版

```scss
// 定義排版變量
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// 字體大小
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// 字體權重
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

---

## 混合

### 常見混合

```scss
// 響應式斷點混合
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  }
}

// Flexbox 混合
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 截斷文本混合
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 響應式設計

### 移動優先方法

```scss
// 基礎樣式（移動）
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// 平板及更大
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// 桌面及更大
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

---

## 組件

### 按鈕組件

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

  // 變體
  &--primary {
    background-color: $color-primary;
    color: $color-white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }
}
```

---

## 最佳實踐

### 做

- 使用 SCSS 變量用於顏色、間距、字體
- 遵循 BEM 命名約定
- 移動優先響應式設計
- 按目的組織文件
- 編寫可重用的混合
- 簡單選擇器（最多 3 層深）
- 使用語義 HTML
- 最小化特異性
- 為複雜部分添加註釋

### 不做

- 不使用內聯樣式
- 不使用 !important（幾乎不）
- 不創建過度特定的選擇器
- 不為樣式使用 ID 選擇器
- 不嵌套過深（最多 3-4 層）
- 不為字體大小使用 px（使用 rem）
- 不創建魔術數字（使用變量）
- 不留下未使用的 CSS
- 不忘記可訪問性

---

## 無障礙訪問

### 顏色對比

```scss
// 確保足夠的對比度
// 級別 AA：正常文本 4.5:1
// 級別 AAA：正常文本 7:1

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // 對比度比：8.6:1 ✅
}
```

### 焦點狀態

```scss
// 始終提供焦點樣式
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

---

## 相關文檔

- JavaScript 標準
- 行為準則
- 貢獻工作流程
- PHP 標準

---

#xoops #css #scss #styling #coding-standards #best-practices
