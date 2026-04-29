---
title: "XOOPS थीम्स के लिए CSS सर्वोत्तम अभ्यास"
---
## अवलोकन

यह मार्गदर्शिका XOOPS थीम विकास के लिए CSS संगठन, आधुनिक लेआउट तकनीक और प्रदर्शन अनुकूलन को कवर करती है।

## CSS आर्किटेक्चर

### फ़ाइल संगठन

```
themes/mytheme/css/
├── style.css           # Main stylesheet (imports others)
├── base/
│   ├── _reset.css     # CSS reset/normalize
│   ├── _typography.css # Font styles
│   └── _variables.css # CSS custom properties
├── components/
│   ├── _blocks.css    # Block styling
│   ├── _buttons.css   # Button styles
│   ├── _forms.css     # Form elements
│   └── _navigation.css # Nav menus
├── layout/
│   ├── _header.css    # Site header
│   ├── _footer.css    # Site footer
│   ├── _sidebar.css   # Sidebars
│   └── _grid.css      # Grid system
└── modules/           # Module-specific overrides
    ├── _news.css
    └── _publisher.css
```

### मुख्य स्टाइलशीट

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

## CSS कस्टम गुण

### चर

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

### डार्क मोड

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

## आधुनिक लेआउट

### पेज लेआउट के लिए CSS ग्रिड

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

### घटकों के लिए फ्लेक्सबॉक्स

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

## उत्तरदायी डिजाइन

### मोबाइल-प्रथम ब्रेकप्वाइंट

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

### कंटेनर प्रश्न

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

## ब्लॉक स्टाइलिंग

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

## प्रदर्शन

### क्रिटिकल CSS

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

### अनुकूलन युक्तियाँ

1. **विशिष्टता को कम करें** - गहरे घोंसले बनाने से बचें
2. **आधुनिक संपत्तियों का उपयोग करें** - मार्जिन के बजाय `gap`
3. **पुनरावृत्ति कम करें** - एनिमेशन के लिए `transform` का उपयोग करें
4. **आलसी लोड** - जरूरत पड़ने पर ही मॉड्यूल CSS लोड करें

```css
/* Good - low specificity */
.block-title { }

/* Avoid - high specificity */
.sidebar .block .block-header .block-title { }
```

## संबंधित दस्तावेज़ीकरण

- थीम-संरचना - थीम फ़ाइल संगठन
- थीम-विकास - संपूर्ण थीम गाइड
- ../Templates/Smarty-टेम्पलेटिंग - टेम्पलेट एकीकरण
- ../../03-मॉड्यूल-विकास/ब्लॉक-विकास - ब्लॉक स्टाइलिंग