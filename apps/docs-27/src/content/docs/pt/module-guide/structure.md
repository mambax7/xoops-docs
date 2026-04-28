---
title: "Estrutura do Módulo"
---

## Visão Geral

Uma estrutura de módulo bem organizada é fundamental para o desenvolvimento sustentável de XOOPS. Este guia cobre layouts de módulo legados e modernos (PSR-4).

## Layout Padrão de Módulo

### Estrutura Legada

```
modules/mymodule/
├── admin/                      # Arquivos do painel de admin
│   ├── index.php              # Dashboard de admin
│   ├── menu.php               # Definição de menu de admin
│   ├── permissions.php        # Gerenciamento de permissão
│   └── templates/             # Templates de admin
├── assets/                     # Recursos de frontend
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # Classes PHP
│   ├── Common/                # Utilitários compartilhados
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Elementos de formulário customizado
│   └── Handler/               # Handlers de objeto
├── include/                    # Arquivos de include
│   ├── common.php             # Inicialização comum
│   ├── functions.php          # Funções utilitárias
│   ├── oninstall.php          # Hooks de instalação
│   ├── onupdate.php           # Hooks de atualização
│   └── onuninstall.php        # Hooks de desinstalação
├── language/                   # Traduções
│   ├── english/
│   │   ├── admin.php          # Cadeias de admin
│   │   ├── main.php           # Cadeias de frontend
│   │   ├── modinfo.php        # Cadeias de informações de módulo
│   │   └── help/              # Arquivos de ajuda
│   └── other_language/
├── sql/                        # Esquemas de banco de dados
│   └── mysql.sql              # Esquema MySQL
├── templates/                  # Templates Smarty
│   ├── admin/
│   └── blocks/
├── blocks/                     # Funções de bloco
├── preloads/                   # Classes de preload
├── xoops_version.php          # Manifesto do módulo
├── header.php                 # Cabeçalho do módulo
├── footer.php                 # Rodapé do módulo
└── index.php                  # Ponto de entrada principal
```

### Estrutura PSR-4 Moderna

```
modules/mymodule/
├── src/                        # Fonte autocarregada PSR-4
│   ├── Controller/            # Manipuladores de solicitação
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Lógica de negócio
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Acesso de dados
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Objetos de domínio
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Data transfer objects
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # Eventos de domínio
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Exceções customizadas
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Tipos de valor
│   │   └── ArticleId.php
│   └── Middleware/            # Middleware HTTP
│       └── AuthenticationMiddleware.php
├── config/                     # Configuração
│   ├── routes.php             # Definições de rota
│   ├── services.php           # Configuração de DI container
│   └── events.php             # Listeners de evento
├── migrations/                 # Migrações de banco de dados
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # Arquivos de teste
│   ├── Unit/
│   └── Integration/
├── templates/                  # Templates Smarty
├── language/                   # Traduções (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Recursos de frontend
├── module.json                 # Manifesto do módulo (XOOPS 4.0)
└── composer.json              # Configuração Composer
```

## Arquivos Principais Explicados

### xoops_version.php (Manifesto Legado)

```php
<?php
$modversion = [
    'name'           => 'My Module',
    'version'        => '1.0.0',
    'description'    => 'Module description',
    'author'         => 'Your Name',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0',
    'dirname'        => basename(__DIR__),
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',
    'image'          => 'assets/images/logo.png',

    // System
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,

    // Database
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // Templates
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // Blocks
    'blocks'         => [
        [
            'file'        => 'blocks/recent.php',
            'name'        => '_MI_MYMOD_BLOCK_RECENT',
            'description' => '_MI_MYMOD_BLOCK_RECENT_DESC',
            'show_func'   => 'mymodule_recent_show',
            'edit_func'   => 'mymodule_recent_edit',
            'template'    => 'mymodule_block_recent.tpl',
            'options'     => '5|0',
        ],
    ],

    // Config
    'config'         => [
        [
            'name'        => 'items_per_page',
            'title'       => '_MI_MYMOD_ITEMS_PER_PAGE',
            'description' => '_MI_MYMOD_ITEMS_PER_PAGE_DESC',
            'formtype'    => 'textbox',
            'valuetype'   => 'int',
            'default'     => 10,
        ],
    ],
];
```

### module.json (Manifesto XOOPS 4.0)

```json
{
    "name": "My Module",
    "slug": "mymodule",
    "version": "1.0.0",
    "description": "Module description",
    "author": "Your Name",
    "license": "GPL-2.0-or-later",
    "php": ">=8.2",

    "namespace": "XoopsModules\\MyModule",
    "autoload": "src/",

    "admin": {
        "menu": "config/admin-menu.php"
    },

    "routes": "config/routes.php",
    "services": "config/services.php",
    "events": "config/events.php",

    "templates": [
        {"file": "index.tpl", "description": "Index page"}
    ],

    "config": {
        "items_per_page": {
            "type": "int",
            "default": 10,
            "title": "@mymodule.config.items_per_page"
        }
    }
}
```

## Propósitos de Diretório

| Diretório | Objetivo |
|-----------|---------|
| `admin/` | Interface de administração |
| `assets/` | CSS, JavaScript, imagens |
| `blocks/` | Funções de renderização de bloco |
| `class/` | Classes PHP (legado) |
| `config/` | Arquivos de configuração (moderno) |
| `include/` | Arquivos de include compartilhados |
| `language/` | Arquivos de tradução |
| `migrations/` | Migrações de banco de dados |
| `sql/` | Esquema inicial de banco de dados |
| `src/` | Código fonte PSR-4 |
| `templates/` | Templates Smarty |
| `tests/` | Arquivos de teste |

## Melhores Práticas

1. **Separar Responsabilidades** - Manter lógica de negócio fora de templates
2. **Use Namespaces** - Organizar código com namespacing apropriado
3. **Siga PSR-4** - Usar convenções de autoload padrão
4. **Externalizar Configuração** - Manter configuração separada do código
5. **Documentar Estrutura** - Incluir README explicando organização

## Documentação Relacionada

- Module-Development - Guia completo de desenvolvimento
- Best-Practices/Code-Organization - Padrões de organização de código
- Module Manifest - Configuração de manifesto
- Database/Database-Schema - Design de banco de dados
