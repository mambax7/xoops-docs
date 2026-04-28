---
title: "أفضل الممارسات في CSS لمواضيع XOOPS"
dir: rtl
lang: ar
---

## نظرة عامة

يغطي هذا الدليل تنظيم CSS وتقنيات التخطيط الحديثة وتحسين الأداء لتطوير موضوع XOOPS.

## معمارية CSS

### تنظيم الملفات

```
themes/mytheme/css/
├── style.css           # ورقة النمط الرئيسية (تستورد الآخرين)
├── base/
│   ├── _reset.css     # إعادة تعيين/تطبيع CSS
│   ├── _typography.css # أنماط الخط
│   └── _variables.css # خصائص CSS المخصصة
├── components/
│   ├── _blocks.css    # تصميم الكتل
│   ├── _buttons.css   # أنماط الزر
│   ├── _forms.css     # عناصر النموذج
│   └── _navigation.css # قوائم التنقل
├── layout/
│   ├── _header.css    # رأس الموقع
│   ├── _footer.css    # تذييل الموقع
│   ├── _sidebar.css   # أشرطة جانبية
│   └── _grid.css      # نظام الشبكة
└── modules/           # تجاوزات خاصة بالوحدة
    ├── _news.css
    └── _publisher.css
```

### ورقة النمط الرئيسية

```css
/* style.css */
@import 'base/_variables.css';
@import 'base/_reset.css';
@import 'base/_typography.css';

@import 'layout/_grid.css';
@import 'layout/_header.css';
@import 'layout/_footer.css';
@import 'layout/_sidebar.css';

@import 'components/_blocks.css';
@import 'components/_buttons.css';
@import 'components/_forms.css';
@import 'components/_navigation.css';

@import 'modules/_news.css';
@import 'modules/_publisher.css';
```

## خصائص CSS المخصصة

### المتغيرات

```css
/* _variables.css */
:root {
    /* Colors */
    --color-primary: #3498db;
    --color-primary-dark: #2980b9;
    --color-secondary: #2c3e50;
    --color-accent: #e74c3c;

    --color-text: #333;
    --color-text-light: #666;
    --color-text-muted: #999;

    --color-bg: #fff;
    --color-bg-alt: #f5f5f5;
    --color-border: #ddd;

    /* Typography */
    --font-family: system-ui, -apple-system, sans-serif;
    --font-family-heading: var(--font-family);
    --font-size-base: 16px;
    --line-height: 1.6;

    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Layout */
    --max-width: 1200px;
    --sidebar-width: 250px;
    --header-height: 60px;

    /* Borders */
    --border-radius: 4px;
    --border-width: 1px;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}
```

### الوضع الداكن

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-text: #e0e0e0;
        --color-text-light: #b0b0b0;
        --color-bg: #1a1a1a;
        --color-bg-alt: #2d2d2d;
        --color-border: #444;
    }
}

/* Manual toggle */
[data-theme="dark"] {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
}
```

## التخطيط الحديث

### CSS Grid لتخطيط الصفحة

```css
/* _grid.css */
.page-container {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr var(--sidebar-width);
    grid-template-areas:
        "header header header"
        "left   main   right"
        "footer footer footer";
    gap: var(--spacing-lg);
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--spacing-md);
}

.site-header { grid-area: header; }
.sidebar-left { grid-area: left; }
.content-main { grid-area: main; }
.sidebar-right { grid-area: right; }
.site-footer { grid-area: footer; }

/* No left sidebar */
.no-left-sidebar .page-container {
    grid-template-columns: 1fr var(--sidebar-width);
    grid-template-areas:
        "header header"
        "main   right"
        "footer footer";
}

/* No sidebars */
.no-sidebars .page-container {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main"
        "footer";
}
```

### Flexbox للمكونات

```css
.block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
}

.nav-menu {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    list-style: none;
    padding: 0;
}
```

## التصميم سريع الاستجابة

### نقاط التوقف الموجهة للهاتف أولا

```css
/* Mobile first - base styles */
.page-container {
    display: block;
    padding: var(--spacing-sm);
}

/* Tablet */
@media (min-width: 768px) {
    .page-container {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        gap: var(--spacing-md);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .page-container {
        grid-template-columns: var(--sidebar-width) 1fr var(--sidebar-width);
        gap: var(--spacing-lg);
    }
}
```

### استعلامات الحاوية

```css
/* Modern container queries */
.block {
    container-type: inline-size;
}

@container (min-width: 300px) {
    .block-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
```

## تصميم الكتل

```css
/* _blocks.css */
.block {
    background: var(--color-bg);
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-md);
    overflow: hidden;
}

.block-title {
    background: var(--color-bg-alt);
    padding: var(--spacing-sm) var(--spacing-md);
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    border-bottom: var(--border-width) solid var(--color-border);
}

.block-content {
    padding: var(--spacing-md);
}

.block-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.block-content li {
    padding: var(--spacing-sm) 0;
    border-bottom: var(--border-width) solid var(--color-border);
}

.block-content li:last-child {
    border-bottom: none;
}
```

## الأداء

### CSS حرج

```html
<head>
    <!-- Inline critical CSS -->
    <style>
        /* Above-the-fold styles */
        body { font-family: system-ui; margin: 0; }
        .header { background: #fff; height: 60px; }
    </style>

    <!-- Load full CSS async -->
    <link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
</head>
```

### نصائح التحسين

1. **تقليل الخصوصية** - تجنب التداخل العميق
2. **استخدم الخصائص الحديثة** - `gap` بدلا من الهوامش
3. **قلل إعادة الطلاء** - استخدم `transform` للرسوم المتحركة
4. **تحميل كسول** - قم بتحميل CSS للوحدة فقط عند الحاجة

```css
/* Good - low specificity */
.block-title { }

/* Avoid - high specificity */
.sidebar .block .block-header .block-title { }
```

## الوثائق ذات الصلة

- Theme-Structure - تنظيم ملفات المواضيع
- Theme-Development - دليل المواضيع الكامل
- ../Templates/Smarty-Templating - تكامل القالب
- ../../03-Module-Development/Block-Development - تصميم الكتلة
