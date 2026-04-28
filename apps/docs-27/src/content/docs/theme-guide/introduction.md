---
title: Theme Development Introduction
description: Build custom XOOPS themes using Smarty templates, CSS, and the XOOPS theme API.
---

XOOPS themes are Smarty template sets that control the entire visual presentation of your site.
A theme can override every piece of HTML the core and modules output.

## Theme Directory Structure

```
mytheme/
├── theme.html          ← Main layout template (header + footer wrapper)
├── theme_tpl.css       ← Theme CSS loaded by XOOPS
├── css/
│   └── style.css       ← Your stylesheet(s)
├── js/
│   └── theme.js        ← JavaScript files
├── images/
│   └── logo.png        ← Theme images
├── xoops_version.php   ← Theme manifest
└── templates/          ← Override module templates
    └── system/
        └── system_userinfo.tpl
```

## theme.html — The Master Layout

`theme.html` wraps every page on the site. It receives Smarty variables
injected by XOOPS core and modules.

```html
<!DOCTYPE html>
<html lang="{$xoops_langcode}">
<head>
  <meta charset="{$xoops_charset}">
  <title>{$xoops_pagetitle}</title>
  {$xoops_meta_keywords}
  {$xoops_meta_description}
  {$xoops_module_header}
  <link rel="stylesheet" href="{$xoops_themecss}">
</head>
<body class="{$xoops_module_dirname}">

  <header>
    <a href="{$xoops_url}"><img src="{$xoops_imageurl}/logo.png" alt="{$xoops_sitename}"></a>
    <nav>{$xoops_nav_main}</nav>
  </header>

  <main>
    {$xoops_contents}
  </main>

  <footer>
    {$xoops_footer}
  </footer>

  {$xoops_js_footer}
</body>
</html>
```

## Key Smarty Variables

| Variable | Description |
|---|---|
| `{$xoops_url}` | Site base URL |
| `{$xoops_contents}` | Main page content (rendered by active module) |
| `{$xoops_themecss}` | Path to `theme_tpl.css` |
| `{$xoops_imageurl}` | Path to theme `images/` folder |
| `{$xoops_sitename}` | Site name from Admin → Preferences |
| `{$xoops_pagetitle}` | Page `<title>` (set by module) |
| `{$xoops_module_header}` | CSS/JS injected by active module |
| `{$xoops_langcode}` | ISO language code, e.g. `en`, `de` |

## Next Steps

- Smarty Variables Reference (coming soon)
- Overriding Module Templates (coming soon)
- Bootstrap 5 Theme Starter (coming soon)
