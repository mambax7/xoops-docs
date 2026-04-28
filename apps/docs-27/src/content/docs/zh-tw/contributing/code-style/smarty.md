---
title: "Smarty 模板約定"
description: "XOOPS Smarty 模板編碼標準和最佳實踐"
---

> XOOPS 使用 Smarty 進行模板化。本指南涵蓋開發 Smarty 模板的約定和最佳實踐。

---

## 概述

XOOPS Smarty 模板遵循：

- **XOOPS 模板結構和命名**
- **可訪問性標準** (WCAG)
- **語義 HTML5 標記**
- **BEM 風格類命名**
- **性能優化**

---

## 文件結構

### 模板組織

```
templates/
├── admin/                   # 管理模板
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # 塊模板
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # 共享模板
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # 電子郵件模板
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # 頁面模板
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # 存儲在 DB 中以便主題覆蓋
└── db:modulename_footer.tpl
```

### 文件命名

```smarty
{* XOOPS 模板文件使用模塊前綴 *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* 管理模板 *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## 文件頭部

### 模板頭部註釋

```smarty
{*
 * XOOPS 模塊 - 模塊名稱
 * @file 項目列表模板
 * @author 您的名稱 <email@example.com>
 * @copyright 2026 XOOPS 項目
 * @license GPL-2.0-or-later
 * 此模板顯示的內容說明
 *}

<h1><{$page_title}></h1>
```

---

## 變量和命名

### 變量命名約定

```smarty
{* 使用描述性名稱 *}
<{$page_title}>              {* ✅ 清晰 *}
<{$items}>                   {* ✅ 清晰 *}
<{$user_count}>              {* ✅ 清晰 *}

<{$p_t}>                     {* ❌ 不清楚的縮寫 *}
<{$x}>                       {* ❌ 不清楚 *}
```

### 變量範圍

```smarty
{* 全局 XOOPS 變量 *}
<{$xoops_url}>              {* 根 URL *}
<{$xoops_sitename}>         {* 網站名稱 *}
<{$xoops_requesturi}>       {* 當前 URI *}
<{$xoops_isadmin}>          {* 管理員模式標誌 *}
<{$xoops_user_is_admin}>    {* 用戶是否為管理員 *}

{* 常見模塊變量 *}
<{$module_id}>              {* 當前模塊 ID *}
<{$module_name}>            {* 當前模塊名稱 *}
<{$moduledir}>              {* 模塊目錄 *}
<{$lang}>                   {* 當前語言 *}
```

---

## 格式化和間距

### 基本結構

```smarty
{*
 * 模板頭部
 *}

{* 包含其他模板 *}
<{include file="db:modulename_header.tpl"}>

{* 主要內容 *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* 渲染項目 *}
  <{else}>
    {* 顯示空狀態 *}
  <{/if}>
</main>

{* 頁腳 *}
<{include file="db:modulename_footer.tpl"}>
```

### 縮進

```smarty
{* 縮進使用 2 個空格 *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* 不要跳過塊內的行 *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```

### 標籤周圍的間距

```smarty
{* 標籤分隔符內沒有空格 *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* 修飾符中管道後有空格 *}
<{$text|truncate:50}>        {* ✅ *}

{* 條件中的運算符周圍有空格 *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```

---

## 控制結構

### 條件

```smarty
{* 簡單 if/else *}
<{if $is_published}>
  <span class="status--published">已發佈</span>
<{else}>
  <span class="status--draft">草稿</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">活躍</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">待審核</div>
<{else}>
  <div class="alert--danger">不活躍</div>
<{/if}>

{* 內聯三元 (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```

### 循環

```smarty
{* 基本 foreach *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* 使用鍵和計數器 *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* 檢查是否為空 *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">未找到項目</p>
<{/if}>
```

---

## 變量輸出

### 基本輸出

```smarty
{* 按原樣顯示變量 *}
<{$title}>

{* 如果為空則顯示默認值 *}
<{$title|default:'未標題化'}>

{* HTML 轉義（默認為安全） *}
<{$content}>                  {* 默認已轉義 *}
<{$content|escape:'html'}>    {* 明確轉義 *}

{* 原始輸出（謹慎使用！） *}
<{$html_content|escape:false}>

{* 特殊編碼 *}
<{$url|escape:'url'}>         {* 用於 URL 背景 *}
<{$json|escape:'javascript'}> {* 用於 JavaScript *}
```

### 修飾符

```smarty
{* 文本格式化 *}
<{$text|upper}>              {* 轉換為大寫 *}
<{$text|lower}>              {* 轉換為小寫 *}
<{$text|capitalize}>         {* 首字母大寫 *}
<{$text|truncate:50:'...'}>  {* 截斷到 50 字符 *}

{* 數字格式化 *}
<{$price|number_format:2}>   {* 格式化數字 *}

{* 日期格式化 *}
<{$date|date_format:'%Y-%m-%d'}> {* 格式化日期 *}

{* 數組操作 *}
<{$items|@count}>            {* 計數項目（注意 @） *}
<{$items|@array_keys}>       {* 獲取鍵 *}

{* 鏈接修飾符 *}
<{$title|upper|truncate:30:'...'}> {* 鏈接多個 *}
```

---

## 常量

### 使用 XOOPS 常量

```smarty
{* 使用 PHP 定義的 define()d 常量 *}
{* 這些必須首先在 PHP 中定義 *}

{* 核心常量 *}
<{$smarty.const._MD_MODULENAME_TITLE}>
<{$smarty.const._MD_MODULENAME_SUBMIT}>

{* 模塊常量 *}
<{$smarty.const.MODULEDIR}>
<{$smarty.const.MODULEURL}>

{* 自定義常量 *}
<{$smarty.const._MY_CONSTANT}>
```

### 語言常量

```smarty
{* 對 i18n 使用語言常量 *}
{* 在語言文件中定義：define('_MD_MODULENAME_TITLE', 'English Title'); *}

<h1><{$smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$smarty.const._MD_MODULENAME_SUBMIT}></button>
```

---

## HTML 最佳實踐

### 語義標記

```smarty
{* 使用語義 HTML 元素 *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">由 <{$item.author}></span>
  </footer>
</article>
```

### 可訪問性

```smarty
{* 使用語義 HTML 確保可訪問性 *}

{* 具有有意義文本的鏈接 *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ 有意義的鏈接文本 *}
</a>

{* 圖像帶有替代文本 *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* 帶有輸入的表單標籤 *}
<label for="email-input" class="form-field__label">
  電子郵件地址
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* 按順序標題 *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ 按順序 *}

{* 在需要時使用 aria 屬性 *}
<nav aria-label="主導航">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  菜單
</button>
```

---

## 最佳實踐

### 做

- 使用語義 HTML5
- 為圖像添加替代文本
- 對文本使用語言常量
- 轉義輸出（默認）
- 保持邏輯最小
- 使用有意義的變量名
- 包含文件頭部
- 使用 BEM 風格類名
- 使用屏幕閱讀器測試

### 不做

- 不混合邏輯和表現
- 不忘記替代文本
- 不使用未轉義的原始 HTML
- 不在模板中創建全局變量
- 不使用已棄用的 Smarty 功能
- 不過度嵌套模板
- 不忽視可訪問性
- 不硬編碼文本（使用常量）

---

## 相關文檔

- JavaScript 標準
- CSS 指南
- 行為準則
- PHP 標準

---

#xoops #smarty #templates #conventions #best-practices
