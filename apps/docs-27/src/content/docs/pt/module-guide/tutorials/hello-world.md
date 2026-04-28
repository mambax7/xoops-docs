---
title: "Módulo Olá Mundo"
description: "Tutorial passo a passo para criar seu primeiro módulo XOOPS"
---

# Tutorial do Módulo Olá Mundo

Este tutorial o guia através da criação de seu primeiro módulo XOOPS. No final, você terá um módulo funcionando que exibe "Olá Mundo" em ambas as áreas de frontend e administrador.

## Pré-requisitos

- XOOPS 2.5.x instalado e executando
- PHP 8.0 ou superior
- Conhecimento básico de PHP
- Editor de texto ou IDE (PhpStorm recomendado)

## Passo 1: Criar a Estrutura de Diretório

Crie a seguinte estrutura de diretório em `/modules/helloworld/`:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Passo 2: Criar a Definição do Módulo

Crie `xoops_version.php`:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Informações Básicas do Módulo
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Status do Módulo
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Configuração de Admin
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Menu Principal
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Templates de Admin
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// Sem tabelas de banco de dados necessárias para este módulo simples
$modversion['tables'] = [];
```

## Passo 3: Criar Arquivos de Idioma

### modinfo.php (Informações do Módulo)

Crie `language/english/modinfo.php`:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (Idioma de Frontend)

Crie `language/english/main.php`:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (Idioma de Admin)

Crie `language/english/admin.php`:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## Passo 4: Criar o Index de Frontend

Crie `index.php` na raiz do módulo:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Carregar arquivo de idioma
xoops_loadLanguage('main', 'helloworld');

// Obter o helper do módulo
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Definir template de página
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Incluir cabeçalho XOOPS
require XOOPS_ROOT_PATH . '/header.php';

// Obter configuração de módulo
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Gerar conteúdo de página
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Contador de visitantes simples (usando sessão)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Atribuir variáveis ao template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Incluir rodapé XOOPS
require XOOPS_ROOT_PATH . '/footer.php';
```

## Passo 5: Criar o Template de Frontend

Crie `templates/helloworld_index.tpl`:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## Passo 6: Criar Arquivos de Admin

### Cabeçalho de Admin

Crie `admin/admin_header.php`:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Carregar arquivo de idioma de admin
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Obter helper de módulo
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Diretório de módulo
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Rodapé de Admin

Crie `admin/admin_footer.php`:

```php
<?php
/**
 * Admin Footer
 */

// Exibir rodapé de admin
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Menu de Admin

Crie `admin/menu.php`:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Página de Index de Admin

Crie `admin/index.php`:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Exibir navegação de admin
$adminObject->displayNavigation('index.php');

// Criar caixa de informação de admin
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Exibir caixa de informação
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Exibir rodapé de admin
require_once __DIR__ . '/admin_footer.php';
```

## Passo 7: Criar Template de Admin

Crie `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Passo 8: Criar o Logo do Módulo

Crie ou copie uma imagem PNG (tamanho recomendado: 92x92 pixels) para:
`assets/images/logo.png`

Você pode usar qualquer editor de imagem para criar um logo simples, ou usar um placeholder de um site como placeholder.com.

## Passo 9: Instalar o Módulo

1. Faça login em seu site XOOPS como administrador
2. Vá para **System Admin** > **Modules**
3. Encontre "Hello World" na lista de módulos disponíveis
4. Clique no botão **Install**
5. Confirme a instalação

## Passo 10: Testar Seu Módulo

### Teste de Frontend

1. Navegue até seu site XOOPS
2. Clique em "Hello World" no menu principal
3. Você deve ver a mensagem de boas-vindas e hora atual

### Teste de Admin

1. Vá para a área de administrador
2. Clique em "Hello World" no menu de admin
3. Você deve ver o dashboard de admin

## Solução de Problemas

### Módulo Não Aparecendo na Lista de Instalação

- Verificar permissões de arquivo (755 para diretórios, 644 para arquivos)
- Verificar `xoops_version.php` para erros de sintaxe
- Limpar cache XOOPS

### Template Não Carregando

- Garantir que arquivos de template estejam no diretório correto
- Verificar que nomes de arquivo de template correspondem aos em `xoops_version.php`
- Verificar que a sintaxe Smarty está correta

### Cadeias de Idioma Não Aparecendo

- Verificar caminhos de arquivo de idioma
- Garantir que constantes de idioma sejam definidas
- Verificar que a pasta de idioma correta existe

## Próximos Passos

Agora que você tem um módulo funcionando, continue aprendendo com:

- Building-a-CRUD-Module - Adicionar funcionalidade de banco de dados
- ../Patterns/MVC-Pattern - Organizar seu código apropriadamente
- ../Best-Practices/Testing - Adicionar testes PHPUnit

## Referência Completa de Arquivo

Seu módulo completo deve ter estes arquivos:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Resumo

Parabéns! Você criou seu primeiro módulo XOOPS. Conceitos principais cobertos:

1. **Estrutura do Módulo** - Layout de diretório padrão de módulo XOOPS
2. **xoops_version.php** - Definição e configuração do módulo
3. **Arquivos de Idioma** - Suporte de internacionalização
4. **Templates** - Integração de template Smarty
5. **Interface de Admin** - Painel de administrador básico

Veja também: ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
