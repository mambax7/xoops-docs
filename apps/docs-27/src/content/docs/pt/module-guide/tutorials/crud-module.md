---
title: "Construindo um Módulo CRUD"
description: "Tutorial completo para construir um módulo CRUD com operações de banco de dados, formulários e interface de administrador"
---

# Tutorial de Construção de Módulo CRUD

Este tutorial o guia através da construção de um módulo CRUD completo para XOOPS. Criaremos um módulo "Notas" que permite aos usuários gerenciar notas pessoais.

## Pré-requisitos

- Tutorial de Módulo Hello-World completado
- Compreensão de conceitos PHP OOP
- Conhecimento básico de SQL

## Visão Geral do Módulo

**Recursos do Módulo de Notas:**
- Criar, visualizar, editar e deletar notas
- Interface de gerenciamento de admin
- Notas específicas do usuário
- Organização por categoria
- Funcionalidade de busca

## Passo 1: Estrutura de Diretório

Crie a seguinte estrutura em `/modules/notes/`:

```
/modules/notes/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
        notes.php
        categories.php
    /assets/
        /css/
            style.css
        /images/
            logo.png
    /class/
        Note.php
        NoteHandler.php
        Category.php
        CategoryHandler.php
        Common/
            Breadcrumb.php
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /sql/
        mysql.sql
    /templates/
        /admin/
            notes_admin_index.tpl
            notes_admin_notes.tpl
            notes_admin_categories.tpl
        notes_index.tpl
        notes_view.tpl
        notes_edit.tpl
        notes_list.tpl
    index.php
    view.php
    edit.php
    xoops_version.php
```

## Passo 2: Esquema de Banco de Dados

Crie `sql/mysql.sql`:

```sql
-- Notes Module Database Schema

-- Categories Table
CREATE TABLE `notes_categories` (
    `catid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `weight` INT(5) NOT NULL DEFAULT 0,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`catid`),
    KEY `idx_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notes Table
CREATE TABLE `notes_notes` (
    `noteid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `catid` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `uid` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    `updated` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`noteid`),
    KEY `idx_catid` (`catid`),
    KEY `idx_uid` (`uid`),
    KEY `idx_status` (`status`),
    KEY `idx_created` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Passo 3: Definição do Módulo

Crie `xoops_version.php`:

```php
<?php
/**
 * Notes Module - Module Definition
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Informações Básicas
$modversion['name']        = _MI_NOTES_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_NOTES_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'notes';

// Requisitos
$modversion['min_php']   = '8.0';
$modversion['min_xoops'] = '2.5.11';

// Admin
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main
$modversion['hasMain'] = 1;

// Submenu
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_LIST,
    'url'  => 'index.php',
];
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_ADD,
    'url'  => 'edit.php',
];

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'notes_categories',
    'notes_notes',
];

// Templates
$modversion['templates'][] = ['file' => 'notes_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_view.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_edit.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_list.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_notes.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_categories.tpl', 'description' => ''];

// Configuração
$modversion['config'][] = [
    'name'        => 'notes_per_page',
    'title'       => '_MI_NOTES_PERPAGE',
    'description' => '_MI_NOTES_PERPAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// Funções de Instalação/Atualização
$modversion['onInstall'] = 'include/install.php';
$modversion['onUpdate']  = 'include/update.php';
```

## Próximos Passos

Para um tutorial completo e detalhado, consulte:

- ../Module-Development - Guia completo de desenvolvimento
- ../Patterns/MVC-Pattern - Padrões de arquitetura
- ../Patterns/Repository-Pattern - Padrão repositório
- ../Best-Practices/Testing - Estratégias de teste

## Resumo

Parabéns! Você aprendeu a construir um módulo CRUD. Conceitos principais cobertos:

1. **Design de Banco de Dados** - Tabelas com relacionamentos
2. **Classes de Entidade** - XoopsObject com propriedades tipadas
3. **Classes de Handler** - XoopsPersistableObjectHandler com métodos customizados
4. **Páginas de Frontend** - Funcionalidade de listar, visualizar e editar
5. **Tratamento de Formulário** - Proteção CSRF e validação
6. **Interface de Admin** - Telas de gerenciamento
7. **Templates** - Templates Smarty com lógica

Veja também: ../Module-Development | ../Patterns/MVC-Pattern | ../Patterns/Repository-Pattern
