---
title: "Variáveis de Template"
description: "Variáveis Smarty disponíveis em templates XOOPS"
---

XOOPS fornece automaticamente muitas variáveis aos templates Smarty. Esta referência documenta as variáveis disponíveis para desenvolvimento de templates de tema e módulo.

## Documentação Relacionada

- Smarty-Basics - Fundamentos do Smarty no XOOPS
- Theme-Development - Criando temas XOOPS
- Smarty-4-Migration - Atualizando de Smarty 3 para 4

## Variáveis Globais de Tema

Estas variáveis estão disponíveis em templates de tema (`theme.tpl`):

### Informações do Site

| Variável | Descrição | Exemplo |
|----------|-------------|---------|
| `$xoops_sitename` | Nome do site de preferências | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Título da página atual | `"Welcome"` |
| `$xoops_slogan` | Slogan do site | `"Just Use It!"` |
| `$xoops_url` | URL completa do XOOPS | `"https://example.com"` |
| `$xoops_langcode` | Código de idioma | `"en"` |
| `$xoops_charset` | Conjunto de caracteres | `"UTF-8"` |

### Tags Meta

| Variável | Descrição |
|----------|-------------|
| `$xoops_meta_keywords` | Palavras-chave meta |
| `$xoops_meta_description` | Descrição meta |
| `$xoops_meta_robots` | Tag meta robots |
| `$xoops_meta_rating` | Classificação de conteúdo |
| `$xoops_meta_author` | Tag meta autor |
| `$xoops_meta_copyright` | Aviso de copyright |

### Informações de Tema

| Variável | Descrição |
|----------|-------------|
| `$xoops_theme` | Nome do tema atual |
| `$xoops_imageurl` | URL do diretório de imagens do tema |
| `$xoops_themecss` | URL do arquivo CSS principal do tema |
| `$xoops_icons32_url` | URL dos ícones 32x32 |
| `$xoops_icons16_url` | URL dos ícones 16x16 |

### Conteúdo da Página

| Variável | Descrição |
|----------|-------------|
| `$xoops_contents` | Conteúdo principal da página |
| `$xoops_module_header` | Conteúdo head específico do módulo |
| `$xoops_footer` | Conteúdo do rodapé |
| `$xoops_js` | JavaScript para incluir |

### Navegação e Menus

| Variável | Descrição |
|----------|-------------|
| `$xoops_mainmenu` | Menu de navegação principal |
| `$xoops_usermenu` | Menu do usuário |

### Variáveis de Bloco

| Variável | Descrição |
|----------|-------------|
| `$xoops_lblocks` | Array de blocos esquerdos |
| `$xoops_rblocks` | Array de blocos direitos |
| `$xoops_cblocks` | Array de blocos centrais |
| `$xoops_showlblock` | Mostrar blocos esquerdos (boolean) |
| `$xoops_showrblock` | Mostrar blocos direitos (boolean) |
| `$xoops_showcblock` | Mostrar blocos centrais (boolean) |

## Variáveis do Usuário

Quando um usuário está logado:

| Variável | Descrição |
|----------|-------------|
| `$xoops_isuser` | Usuário está logado (boolean) |
| `$xoops_isadmin` | Usuário é administrador (boolean) |
| `$xoops_userid` | ID do usuário |
| `$xoops_uname` | Nome de usuário |
| `$xoops_isowner` | Usuário é proprietário do conteúdo atual (boolean) |

### Acessando Propriedades do Objeto Usuário

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Variáveis do Módulo

Em templates de módulo:

| Variável | Descrição |
|----------|-------------|
| `$xoops_dirname` | Nome do diretório do módulo |
| `$xoops_modulename` | Nome de exibição do módulo |
| `$mod_url` | URL do módulo (quando atribuído) |

### Padrão Comum de Template de Módulo

```php
// Em PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* Em template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## Variáveis de Bloco

Cada bloco em `$xoops_lblocks`, `$xoops_rblocks` e `$xoops_cblocks` tem:

| Propriedade | Descrição |
|----------|-------------|
| `$block.id` | ID do bloco |
| `$block.title` | Título do bloco |
| `$block.content` | Conteúdo HTML do bloco |
| `$block.template` | Nome do template do bloco |
| `$block.module` | Nome do módulo |
| `$block.weight` | Peso/ordem do bloco |

### Exemplo de Exibição de Bloco

```smarty
<{foreach item=block from=$xoops_lblocks}>
<div class="block block-<{$block.module}>">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
<{/foreach}>
```

## Variáveis de Formulário

Ao usar classes XoopsForm:

```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Template *}
<div class="form-container">
    <{$form}>
</div>
```

## Variáveis de Paginação

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* Template *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## Atribuindo Variáveis Personalizadas

### Valores Simples

```php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```

```smarty
<h1><{$my_title}></h1>
<p><{$item_count}> items found</p>
<{if $is_featured}>Featured!<{/if}>
```

### Arrays

```php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```

```smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```

### Objetos

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Ou para XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Acesso a array *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Acesso a método de objeto *}
<h2><{$item_obj->getVar('title')}></h2>
```

### Arrays Aninhados

```php
$category = [
    'id' => 1,
    'name' => 'Technology',
    'items' => [
        ['id' => 1, 'title' => 'Article 1'],
        ['id' => 2, 'title' => 'Article 2'],
    ]
];
$GLOBALS['xoopsTpl']->assign('category', $category);
```

```smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```

## Variáveis Integradas Smarty

### $smarty.now

Timestamp atual:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Acessar constantes PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Acessar variáveis de requisição (use com cuidado):

```smarty
{* Apenas para leitura, sempre escapar saída! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Variáveis de servidor:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Informações de loop:

```smarty
<{foreach $items as $item name=itemloop}>
    <{* Index (0-based) *}>
    Index: <{$smarty.foreach.itemloop.index}>

    <{* Iteration (1-based) *}>
    Number: <{$smarty.foreach.itemloop.iteration}>

    <{* First item *}>
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{* Last item *}>
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Total count *}>
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## Variáveis de Ajudante XMF

Ao usar XMF, ajudantes adicionais estão disponíveis:

```php
// Em PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* Em template *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```

## URLs de Imagem e Recurso

```smarty
{* Imagens do tema *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Imagens do módulo *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Diretório de upload *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Usando ícones *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```

## Exibição Condicional Baseada em Usuário

```smarty
{* Mostrar apenas para usuários logados *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Mostrar apenas para administradores *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Mostrar apenas para proprietário do conteúdo *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```

## Variáveis de Idioma

```php
// Em PHP - carregar arquivo de idioma
xoops_loadLanguage('main', 'mymodule');

// Atribuir constantes de idioma
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* Em template *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

Ou usar constantes diretamente:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Depurando Variáveis

Para ver todas as variáveis disponíveis:

```smarty
{* Exibir console de debug *}
<{debug}>

{* Imprimir variável específica *}
<pre><{$myvar|@print_r}></pre>

{* Exportar variável *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #templates #variables #xoops #reference
