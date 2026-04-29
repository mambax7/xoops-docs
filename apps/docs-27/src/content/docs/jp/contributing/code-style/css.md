---
title: "CSS と SCSS ガイドライン"
description: "XOOPS CSS/SCSS コーディング標準とベストプラクティス"
---

> XOOPS は SCSS プリプロセッシング機能を備えた現代的な CSS 標準に従い、保守性とパフォーマンスに焦点を当てています。

---

## 概要

XOOPS CSS 標準は以下を重視:

- **SCSS プリプロセッシング** 構成用
- **BEM 方法論** 命名用
- **モバイルファースト** レスポンシブ デザイン
- **アクセシビリティと セマンティック HTML**
- **パフォーマンス最適化**

---

## ファイル構造

### SCSS 構成

```
styles/
├── abstracts/           # 変数、ミックスイン、関数
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # リセット、タイポグラフィ、デフォルト
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # 再利用可能なコンポーネント
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # ページ レイアウト
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # ページ固有のスタイル
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # すべてのファイルをインポート
```

### ファイル命名

```scss
// 小文字とハイフンを使用
_button.scss        // コンポーネント
_modal-dialog.scss  // 複数語のコンポーネント
_colors.scss        // 変数
```

---

## 命名規則

### BEM 方法論

BEM = Block Element Modifier

```scss
// ブロック: スタンドアロン コンポーネント
.button { }

// ブロック__エレメント: ブロックの子
.button__text { }
.button__icon { }

// ブロック--修飾子: ブロックのバリエーション
.button--primary { }
.button--disabled { }
.button--small { }

// 複雑な例
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### 命名ベストプラクティス

```scss
// ✅ 説明的な BEM 命名
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ 避ける
.form-f { }                 // 省略しすぎ
.form_field { }             // ハイフンではなくアンダースコア
.formField { }              // camelCase を使用しない
.form-field-2 { }           // バリエーション用に数字を使用しない
.form-field.active { }      // クラスではなく修飾子を使用
```

---

## フォーマット

### 基本構造

```scss
.component {
  // 1. ポジショニングとレイアウト
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. ボックス モデル
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. タイポグラフィ
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. 視覚効果
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. アニメーション
  transition: all 0.3s ease;
}
```

### スペーシングとインデント

```scss
// インデントに 2 スペースを使用
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// プロパティは別行に
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ コンパクト化しない
.component { display: flex; color: red; }
```

### セレクター

```scss
// セレクターは 1 行に 1 つ
.button,
.button-group,
.button-list {
  // ...
}

// セレクター間の行をスキップしない
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

## 変数

### 変数命名

```scss
// 説明的な名前を使用
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

### 変数構成

```scss
// _variables.scss

// 色
$color-primary: #0066cc;
$color-secondary: #666666;

// タイポグラフィ
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// スペーシング
$spacing-unit: 0.5rem;
$spacing-xs: $spacing-unit;
$spacing-sm: $spacing-unit * 2;
$spacing-md: $spacing-unit * 4;
$spacing-lg: $spacing-unit * 8;

// ブレークポイント
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

---

## 色

### 色システム

```scss
// プライマリ パレット
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// セカンダリ パレット
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// セマンティック 色
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// ニュートラル 色
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

// 使用法
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

## タイポグラフィ

### フォント宣言

```scss
// タイポグラフィ変数を定義
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// フォント サイズ
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// フォント ウェイト
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 見出し 階層

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

## ミックスイン

### 一般的なミックスイン

```scss
// レスポンシブ ブレークポイント ミックスイン
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

// 使用法
.component {
  font-size: 0.875rem;

  @include respond-to('md') {
    font-size: 1rem;
  }

  @include respond-to('lg') {
    font-size: 1.125rem;
  }
}

// Flexbox ミックスイン
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 使用法
.modal__overlay {
  @include flex-center;
  height: 100vh;
}

// テキスト切り詰め ミックスイン
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 使用法
.breadcrumb__item {
  @include truncate;
  max-width: 200px;
}

// Clearfix ミックスイン (レガシー)
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

---

## レスポンシブ デザイン

### モバイルファースト アプローチ

```scss
// ベース スタイル (モバイル)
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// タブレット以上
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// デスクトップ以上
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

### ブレークポイント システム

```scss
// ブレークポイントを定義
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px,
);

// 任意のブレークポイント用の柔軟なミックスイン
@mixin media($breakpoint) {
  $min-width: map-get($breakpoints, $breakpoint);
  @media (min-width: $min-width) {
    @content;
  }
}

// 使用法
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

## コンポーネント

### ボタン コンポーネント

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

  // バリエーション
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

  // アイコン
  &__icon {
    margin-right: 0.5em;

    &:last-child {
      margin-right: 0;
      margin-left: 0.5em;
    }
  }
}
```

### フォーム コンポーネント

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

## ベストプラクティス

### すべき こと

- SCSS 変数を使用 (色、スペーシング、フォント)
- BEM 命名規則に従う
- モバイルファースト レスポンシブ デザイン
- ファイルを目的別に構成
- 再利用可能なミックスインを作成
- セレクターをシンプルに保つ (深さ最大 3)
- セマンティック HTML を使用
- 特異性を最小化
- 複雑なセクションをコメント

### しないこと

- インライン スタイルを使用しない
- !important を使用しない (ほぼ使用しない)
- 特異性の高いセレクターを作成しない
- ID セレクターをスタイリングに使用しない
- ネストが深すぎない (最大 3-4 レベル)
- フォント サイズに px を使用しない (rem を使用)
- マジック ナンバーを作成しない (変数を使用)
- 未使用の CSS を放置しない
- アクセシビリティを忘れない

---

## アクセシビリティ

### 色のコントラスト

```scss
// 十分なコントラストを確保
// レベル AA: 通常テキスト 4.5:1
// レベル AAA: 通常テキスト 7:1

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // コントラスト比: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // コントラスト比: 9.3:1 ✅
}
```

### フォーカス状態

```scss
// 常にフォーカス スタイルを提供
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

### セマンティック HTML と CSS

```scss
// 適切なセマンティック構造を使用
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

## パフォーマンス

### セレクター最適化

```scss
// ✅ 効率的
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ 非効率 (特異性が高い、ネストが深い)
div.container section.content article .button {
  // ...
}
```

### 再描画を最小化

```scss
// アニメーションをグループ化
.component {
  // 複数のプロパティを同時に変更
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

// または短縮形を使用
.component {
  transition: all 0.3s ease;
}
```

---

## ツール

### Stylelint 構成

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

## 関連ドキュメント

- JavaScript 標準
- 行動規範
- 貢献ワークフロー
- PHP 標準

---

#xoops #css #scss #styling #coding-standards #best-practices
