---
title: "FAQ de Temas"
description: "Perguntas frequentes sobre temas do XOOPS"
---

# Perguntas Frequentes sobre Temas

> Perguntas e respostas comuns sobre temas do XOOPS, customização e gerenciamento.

---

## Instalação e Ativação de Tema

### P: Como instalo um novo tema no XOOPS?

**R:**
1. Baixar arquivo zip do tema
2. Ir para XOOPS Admin > Aparência > Temas
3. Clicar em "Enviar" e selecionar arquivo zip
4. O tema aparece na lista de temas
5. Clicar para ativá-lo para seu site

Alternativa: Extrair manualmente em diretório `/themes/` e atualizar painel admin.

---

### P: Upload de tema falha com "Permissão negada"

**R:** Corrigir permissões do diretório de temas:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### P: Como defino um tema diferente para usuários específicos?

**R:**
1. Ir para Gerenciador de Usuário > Editar Usuário
2. Ir para aba "Outro"
3. Selecionar tema preferido em dropdown "User Theme"
4. Salvar

Temas selecionados pelo usuário sobrescrevem o tema padrão do site.

---

### P: Posso ter temas diferentes para admin e site de usuário?

**R:** Sim, definir em XOOPS Admin > Configurações:

1. **Tema de frontend** - Tema padrão do site
2. **Tema de admin** - Tema do painel de controle de admin (geralmente separado)

Procure por configurações como:
- `theme_set` - Tema de frontend
- `admin_theme` - Tema de admin

---

## Customização de Tema

### P: Como customizo um tema existente?

**R:** Criar um tema filho para preservar atualizações:

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Create copy for editing *}
    ├── style.css
    ├── templates/
    └── images/
```

Depois editar `theme.html` no seu tema customizado.

---

### P: Como altero as cores do tema?

**R:** Editar arquivo CSS do tema:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

Para temas XOOPS:

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### P: Como adiciono CSS customizado a um tema?

**R:** Várias opções:

**Opção 1: Editar theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Opção 2: Criar custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Opção 3: Configurações Admin (se suportado)**
Ir para XOOPS Admin > Configurações > Configurações de Tema e adicionar CSS customizado.

---

### P: Como modifico templates HTML de tema?

**R:** Localizar arquivo de template:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Editar com sintaxe Smarty correta:

```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS Theme Template *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## Estrutura de Tema

### P: Quais arquivos são necessários em um tema?

**R:** Estrutura mínima:

```
themes/mytheme/
├── theme.html              {* Main template (required) *}
├── style.css              {* Stylesheet (optional but recommended) *}
├── screenshot.png         {* Preview image for admin (optional) *}
├── images/                {* Theme images *}
│   └── logo.png
└── templates/             {* Optional: Additional templates *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

Veja Estrutura de Tema para detalhes.

---

### P: Como crio um tema do zero?

**R:** Criar a estrutura:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Criar `theme.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

Criar `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Variáveis de Tema

### P: Quais variáveis estão disponíveis em templates de tema?

**R:** Variáveis comuns de tema XOOPS:

```smarty
{* Site Information *}
{$xoops_sitename}          {* Site name *}
{$xoops_url}               {* Site URL *}
{$xoops_theme}             {* Current theme name *}

{* Page Content *}
{$xoops_contents}          {* Main page content *}
{$xoops_pagetitle}         {* Page title *}
{$xoops_headers}           {* Meta tags, styles in head *}

{* Module Information *}
{$xoops_module_header}     {* Module-specific header *}
{$xoops_moduledesc}        {* Module description *}

{* User Information *}
{$xoops_isuser}            {* Is user logged in? *}
{$xoops_userid}            {* User ID *}
{$xoops_uname}             {* Username *}

{* Blocks *}
{$xoops_blocks}            {* All block content *}

{* Other *}
{$xoops_charset}           {* Document charset *}
{$xoops_version}           {* XOOPS version *}
```

---

### P: Como adiciono variáveis customizadas ao meu tema?

**R:** Em seu código PHP antes de renderizar:

```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```

No tema:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Estilo de Tema

### P: Como faço meu tema responsivo?

**R:** Usar CSS Grid ou Flexbox:

```css
/* themes/mytheme/style.css */

/* Mobile first approach */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

Ou usar integração Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```

---

### P: Como adiciono modo escuro ao meu tema?

**R:**
```css
/* themes/mytheme/style.css */

/* Light mode (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* Or with CSS class */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

Alternar com JavaScript:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## Problemas de Tema

### P: Tema mostra erros "unrecognized template variable"

**R:** A variável não está sendo passada ao template. Verifique:

1. **Variável é atribuída** em PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Template existe** onde especificado
3. **Sintaxe de template está correta**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### P: Mudanças de CSS não aparecem no navegador

**R:** Limpar cache do navegador:

1. Atualização forçada: `Ctrl+Shift+R` (Cmd+Shift+R no Mac)
2. Limpar cache de tema no servidor:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Verificar caminho de arquivo CSS no tema:
```bash
ls -la themes/mytheme/style.css
```

---

### P: Imagens no tema não carregam

**R:** Verificar caminhos de imagem:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### P: Templates de tema faltando ou causando erros

**R:** Veja Erros de Template para depuração.

---

## Distribuição de Tema

### P: Como empacoto um tema para distribuição?

**R:** Criar um zip distribuível:

```bash
# Structure
mytheme/
├── theme.html           {* Required *}
├── style.css
├── screenshot.png       {* 300x225 recommended *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optional *}
    ├── header.html
    └── footer.html

# Create zip
zip -r mytheme.zip mytheme/
```

---

### P: Posso vender meu tema do XOOPS?

**R:** Verificar licença do XOOPS:
- Temas usando classes/templates do XOOPS devem respeitar licença do XOOPS
- Temas puros de CSS/HTML têm menos restrições
- Verificar Diretrizes de Contribuição do XOOPS para detalhes

---

## Performance de Tema

### P: Como otimizo performance de tema?

**R:**
1. **Minimizar CSS/JS** - Remover código não utilizado
2. **Otimizar imagens** - Usar formatos apropriados (WebP, AVIF)
3. **Usar CDN** para recursos
4. **Lazy load** imagens:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-bust versions**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Veja FAQ de Performance para mais detalhes.

---

## Documentação Relacionada

- Erros de Template
- Estrutura de Tema
- FAQ de Performance
- Depuração de Smarty

---

#xoops #themes #faq #troubleshooting #customization
