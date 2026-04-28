---
title: "Páginas Admin de Módulo"
description: "Criando páginas de administração de módulo padronizadas e compatíveis com XMF"
---

A classe `Xmf\Module\Admin` fornece uma maneira consistente de criar interfaces de administração de módulo. Usar XMF para páginas admin garante compatibilidade futura com versões XOOPS futuras enquanto mantém uma experiência de usuário uniforme.

## Visão Geral

A classe ModuleAdmin no XOOPS Frameworks facilitou a administração, mas sua API evoluiu entre versões. O wrapper `Xmf\Module\Admin`:

- Fornece uma API estável que funciona entre versões XOOPS
- Trata automaticamente diferenças de API entre versões
- Garante que seu código admin seja compatível com futuro
- Oferece métodos estáticos convenientes para tarefas comuns

## Começando

### Criando uma Instância Admin

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Isto retorna ou uma instância `Xmf\Module\Admin` ou uma classe nativa do sistema se já compatível.

## Gerenciamento de Ícone

### O Problema de Localização de Ícone

Ícones se moveram entre versões XOOPS, causando dores de cabeça de manutenção. XMF resolve isto com métodos utilitários.

### Encontrando Ícones

**Forma antiga (dependente de versão):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**Forma XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

O método `iconUrl()` retorna uma URL completa, então você não precisa se preocupar com construção de caminho.

### Tamanhos de Ícone

```php
// Ícones 16x16
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// Ícones 32x32 (padrão)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Apenas o caminho (sem nome de arquivo)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Ícones do Menu

Para arquivos admin menu.php:

**Forma antiga:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**Forma XMF:**
```php
// Obter caminho para ícones
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Páginas Admin Padrão

### Página de Index

**Formato antigo:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Formato XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Página About

**Formato antigo:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Formato XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Nota:** Em versões futuras XOOPS, informação de PayPal é definida em xoops_version.php. A chamada `setPaypal()` garante compatibilidade com versões atuais enquanto não têm efeito em versões mais novas.

## Navegação

### Exibir Menu de Navegação

```php
$admin = \Xmf\Module\Admin::getInstance();

// Exibir navegação para página atual
$admin->displayNavigation('items.php');

// Ou obter string HTML
$navHtml = $admin->renderNavigation('items.php');
```

## Caixas de Informação

### Criando Caixas de Informação

```php
$admin = \Xmf\Module\Admin::getInstance();

// Adicionar uma caixa de informação
$admin->addInfoBox('Estatísticas do Módulo');

// Adicionar linhas à caixa de informação
$admin->addInfoBoxLine('Total de Itens: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Usuários Ativos: ' . $userCount, 'default', 'blue');

// Exibir a caixa de informação
$admin->displayInfoBox();
```

## Caixas de Configuração

Caixas de configuração exibem requisitos do sistema e verificações de status.

### Linhas de Configuração Básica

```php
$admin = \Xmf\Module\Admin::getInstance();

// Adicionar uma mensagem simples
$admin->addConfigBoxLine('Módulo está configurado corretamente', 'default');

// Verificar se diretório existe
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Verificar diretório com permissões
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Verificar se módulo está instalado
$admin->addConfigBoxLine('xlanguage', 'module');

// Verificar módulo com aviso se faltando
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### Métodos de Conveniência

```php
$admin = \Xmf\Module\Admin::getInstance();

// Adicionar mensagem de erro
$admin->addConfigError('Diretório de upload não é gravável');

// Adicionar mensagem de sucesso/aceitação
$admin->addConfigAccept('Tabelas de banco de dados verificadas');

// Adicionar mensagem de aviso
$admin->addConfigWarning('Diretório de cache deve ser limpo');

// Verificar versão do módulo
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### Tipos de Caixa de Configuração

| Tipo | Valor | Comportamento |
|------|-------|----------|
| `default` | Cadeia de mensagem | Exibe mensagem diretamente |
| `folder` | Caminho do diretório | Mostra aceitação se existe, erro se não |
| `chmod` | `[caminho, permissão]` | Verifica se diretório existe com permissão |
| `module` | Nome do módulo | Aceita se instalado, erro se não |
| `module` | `[nome, 'warning']` | Aceita se instalado, aviso se não |

## Botões de Item

Adicione botões de ação para páginas admin:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Adicionar botões
$admin->addItemButton('Adicionar Novo Item', 'item.php?op=new', 'add');
$admin->addItemButton('Importar Items', 'import.php', 'import');

// Exibir botões (alinhado à esquerda por padrão)
$admin->displayButton('left');

// Ou obter HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## Exemplos Completos de Página Admin

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Exibir navegação
$adminObject->displayNavigation(basename(__FILE__));

// Adicionar caixa de informação com estatísticas
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Verificar configuração
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Verificar módulos opcionais
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Exibir página index
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Obter operação
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Adicionar botões de ação
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // Listar items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Exibir tabela
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Código de manipulação de formulário...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Definir ID de PayPal para doações (opcional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Exibir página about
// Passar false para ocultar logo XOOPS, true para mostrá-lo
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Obter caminho de ícone usando XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categorias
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissões
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// Sobre
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Referência da API

### Métodos Estáticos

| Método | Descrição |
|--------|-----------|
| `getInstance()` | Obter instância admin |
| `iconUrl($name, $size)` | Obter URL de ícone (tamanho: 16 ou 32) |
| `menuIconPath($image)` | Obter caminho de ícone para menu.php |
| `setPaypal($paypal)` | Definir ID de PayPal para página about |

### Métodos de Instância

| Método | Descrição |
|--------|-----------|
| `displayNavigation($menu)` | Exibir menu de navegação |
| `renderNavigation($menu)` | Retornar HTML de navegação |
| `addInfoBox($title)` | Adicionar caixa de informação |
| `addInfoBoxLine($text, $type, $color)` | Adicionar linha à caixa de informação |
| `displayInfoBox()` | Exibir caixa de informação |
| `renderInfoBox()` | Retornar HTML de caixa de informação |
| `addConfigBoxLine($value, $type)` | Adicionar linha de verificação de config |
| `addConfigError($value)` | Adicionar erro à caixa de config |
| `addConfigAccept($value)` | Adicionar sucesso à caixa de config |
| `addConfigWarning($value)` | Adicionar aviso à caixa de config |
| `addConfigModuleVersion($moddir, $version)` | Verificar versão do módulo |
| `addItemButton($title, $link, $icon, $extra)` | Adicionar botão de ação |
| `displayButton($position, $delimiter)` | Exibir botões |
| `renderButton($position, $delimiter)` | Retornar HTML de botões |
| `displayIndex()` | Exibir página index |
| `renderIndex()` | Retornar HTML de página index |
| `displayAbout($logo_xoops)` | Exibir página about |
| `renderAbout($logo_xoops)` | Retornar HTML de página about |

## Veja Também

- ../Basics/XMF-Module-Helper - Classe module helper
- Permission-Helper - Gerenciamento de permissões
- ../XMF-Framework - Visão geral do framework

---

#xmf #admin #module-development #navigation #icons
