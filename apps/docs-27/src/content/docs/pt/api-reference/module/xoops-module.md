---
title: "Referência da API XoopsModule"
description: "Referência completa da API para XoopsModule e classes do sistema de módulos"
---

> Documentação completa da API para o sistema de módulos XOOPS.

---

## Arquitetura do Sistema de Módulos

```mermaid
graph TB
    subgraph "Carregamento de Módulo"
        A[Requisição] --> B[Roteador]
        B --> C{Módulo Existe?}
        C -->|Sim| D[Carregar xoops_version.php]
        C -->|Não| E[Erro 404]
        D --> F[Inicializar Módulo]
        F --> G[Verificar Permissões]
        G --> H[Executar Controlador]
    end

    subgraph "Componentes do Módulo"
        I[XoopsModule] --> J[Config]
        I --> K[Templates]
        I --> L[Blocos]
        I --> M[Manipuladores]
        I --> N[Preloads]
    end

    H --> I
```

---

## Classe XoopsModule

### Definição de Classe

```php
class XoopsModule extends XoopsObject
{
    // Propriedades
    public $modinfo;      // Array de informações do módulo
    public $adminmenu;    // Itens do menu admin

    // Métodos
    public function __construct();
    public function loadInfo(string $dirname, bool $verbose = true): bool;
    public function getInfo(string $name = null): mixed;
    public function setInfo(string $name, mixed $value): bool;
    public function mainLink(): string;
    public function subLink(): string;
    public function loadAdminMenu(): void;
    public function getAdminMenu(): array;
    public function loadConfig(): bool;
    public function getConfig(string $name = null): mixed;
}
```

### Propriedades

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `mid` | int | ID do módulo |
| `name` | string | Nome de exibição |
| `version` | string | Número da versão |
| `dirname` | string | Nome do diretório |
| `isactive` | int | Status ativo (0/1) |
| `hasmain` | int | Tem área principal |
| `hasadmin` | int | Tem área de administração |
| `hassearch` | int | Tem função de busca |
| `hasconfig` | int | Tem configuração |
| `hascomments` | int | Tem comentários |
| `hasnotification` | int | Tem notificações |

### Métodos Principais

```php
// Obter instância do módulo
$module = $GLOBALS['xoopsModule'];

// Ou carregar por dirname
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');

// Obter informações do módulo
$version = $module->getVar('version');
$name = $module->getVar('name');
$dirname = $module->getVar('dirname');

// Obter config do módulo
$config = $module->getConfig();
$specificConfig = $module->getConfig('items_per_page');

// Verificar se o módulo tem recurso
$hasAdmin = $module->getVar('hasadmin');
$hasSearch = $module->getVar('hassearch');

// Obter caminho do módulo
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $module->getVar('dirname');
$moduleUrl = XOOPS_URL . '/modules/' . $module->getVar('dirname');
```

---

## XoopsModuleHandler

### Definição de Classe

```php
class XoopsModuleHandler extends XoopsPersistableObjectHandler
{
    public function create(bool $isNew = true): XoopsModule;
    public function get(int $id): ?XoopsModule;
    public function getByDirname(string $dirname): ?XoopsModule;
    public function insert(XoopsObject $module, bool $force = false): bool;
    public function delete(XoopsObject $module, bool $force = false): bool;
    public function getList(?CriteriaElement $criteria = null): array;
    public function getObjects(?CriteriaElement $criteria = null): array;
}
```

### Exemplos de Uso

```php
// Obter handler
$moduleHandler = xoops_getHandler('module');

// Obter todos os módulos ativos
$criteria = new Criteria('isactive', 1);
$activeModules = $moduleHandler->getObjects($criteria);

// Obter módulo por dirname
$publisherModule = $moduleHandler->getByDirname('publisher');

// Obter módulos com administração
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('isactive', 1));
$criteria->add(new Criteria('hasadmin', 1));
$adminModules = $moduleHandler->getObjects($criteria);

// Verificar se o módulo está instalado
$module = $moduleHandler->getByDirname('mymodule');
if ($module && $module->getVar('isactive')) {
    // Módulo está instalado e ativo
}
```

---

## Ciclo de Vida do Módulo

```mermaid
stateDiagram-v2
    [*] --> Uninstalled

    Uninstalled --> Installing: Instalar Módulo
    Installing --> Installed: Sucesso
    Installing --> Uninstalled: Falha

    Installed --> Active: Ativar
    Installed --> Uninstalling: Desinstalar

    Active --> Inactive: Desativar
    Active --> Updating: Atualização Disponível

    Inactive --> Active: Ativar
    Inactive --> Uninstalling: Desinstalar

    Updating --> Active: Atualização com Sucesso
    Updating --> Active: Falha na Atualização

    Uninstalling --> Uninstalled: Sucesso
    Uninstalling --> Installed: Falha

    Uninstalled --> [*]
```

---

## Estrutura do xoops_version.php

```php
<?php
// Module metadata
$modversion['name']        = _MI_MYMODULE_NAME;
$modversion['version']     = '1.0.0';
$modversion['description'] = _MI_MYMODULE_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0+';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = basename(__DIR__);

// Requirements
$modversion['min_php']     = '7.4';
$modversion['min_xoops']   = '2.5.10';
$modversion['min_admin']   = '1.2';
$modversion['min_db']      = ['mysql' => '5.7', 'mysqli' => '5.7'];

// Features
$modversion['hasMain']     = 1;
$modversion['hasAdmin']    = 1;
$modversion['hasSearch']   = 1;
$modversion['hasComments'] = 1;
$modversion['hasNotification'] = 1;

// Admin Menu
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database tables
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    $modversion['dirname'] . '_items',
    $modversion['dirname'] . '_categories',
];

// Templates
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Item template'],
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_block_recent_show',
    'edit_func'   => 'mymodule_block_recent_edit',
    'options'     => '10|0',
    'template'    => 'mymodule_block_recent.tpl',
];

// Config options
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// Search
$modversion['search'] = [
    'file' => 'include/search.inc.php',
    'func' => 'mymodule_search',
];

// Comments
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
    'callbackFile' => 'include/comment_functions.php',
    'callback' => [
        'approve' => 'mymodule_comment_approve',
        'update'  => 'mymodule_comment_update',
    ],
];

// Notifications
$modversion['notification'] = [
    'lookup_file' => 'include/notification.inc.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => _MI_MYMODULE_NOTIFY_GLOBAL_DESC,
            'subscribe_from' => ['index.php'],
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => _MI_MYMODULE_NOTIFY_ITEM_DESC,
            'subscribe_from' => ['item.php'],
            'item_name'      => 'item_id',
            'allow_bookmark' => 1,
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'description'   => _MI_MYMODULE_NOTIFY_NEW_ITEM_DESC,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SBJ,
        ],
    ],
];
```

---

## Padrão de Helper de Módulo

```php
<?php
namespace XoopsModules\MyModule;

class Helper extends \Xmf\Module\Helper
{
    public function __construct()
    {
        $this->dirname = basename(dirname(__DIR__));
    }

    public static function getInstance(): self
    {
        static $instance = null;
        if ($instance === null) {
            $instance = new self();
        }
        return $instance;
    }

    public function getHandler(string $name): ?object
    {
        return $this->getHandlerByName($name);
    }

    public function getConfig(string $name = null)
    {
        return parent::getConfig($name);
    }
}

// Uso
$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');
$perPage = $helper->getConfig('items_per_page');
```

---

## Fluxo de Instalação do Módulo

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Database
    participant FileSystem

    Admin->>System: Instalar Módulo
    System->>FileSystem: Ler xoops_version.php
    FileSystem-->>System: Config do Módulo

    System->>Database: Criar tabelas (mysql.sql)
    Database-->>System: Tabelas criadas

    System->>Database: Inserir registro de módulo
    System->>Database: Inserir opções de config
    System->>Database: Inserir templates
    System->>Database: Inserir blocos

    System->>FileSystem: Compilar templates
    FileSystem-->>System: Templates compilados

    System->>Database: Definir módulo como ativo
    System-->>Admin: Instalação completa
```

---

## Documentação Relacionada

- API XoopsObject
- Guia de Desenvolvimento de Módulo
- Arquitetura XOOPS

---

#xoops #api #module #xoopsmodule #reference
