---
title: "Desenvolvimento de Módulo"
description: "Guia abrangente para desenvolver módulos XOOPS usando práticas PHP modernas"
---

Esta seção fornece documentação abrangente para desenvolver módulos XOOPS usando práticas PHP modernas, padrões de design e melhores práticas.

## Visão Geral

O desenvolvimento de módulo XOOPS evoluiu significativamente ao longo dos anos. Módulos modernos aproveitam:

- **Arquitetura MVC** - Separação limpa de responsabilidades
- **Recursos PHP 8.x** - Declarações de tipo, atributos, argumentos nomeados
- **Padrões de Design** - Padrões Repository, DTO, Service Layer
- **Testes** - PHPUnit com práticas de teste modernas
- **Framework XMF** - Utilitários do XOOPS Module Framework

## Estrutura da Documentação

### Tutoriais

Guias passo a passo para construir módulos XOOPS do zero.

- Tutorials/Hello-World-Module - Seu primeiro módulo XOOPS
- Tutorials/Building-a-CRUD-Module - Funcionalidade completa Create, Read, Update, Delete

### Padrões de Design

Padrões arquiteturais usados no desenvolvimento moderno de módulo XOOPS.

- Patterns/MVC-Pattern - Arquitetura Model-View-Controller
- Patterns/Repository-Pattern - Abstração de acesso de dados
- Patterns/DTO-Pattern - Data Transfer Objects para fluxo de dados limpo

### Melhores Práticas

Diretrizes para escrever código mantível e de alta qualidade.

- Best-Practices/Clean-Code - Princípios de código limpo para XOOPS
- Best-Practices/Code-Smells - Anti-padrões comuns e como corrigi-los
- Best-Practices/Testing - Estratégias de teste PHPUnit

### Exemplos

Análise de módulo do mundo real e exemplos de implementação.

- Publisher-Module-Analysis - Análise profunda do módulo Publisher

## Estrutura de Diretório de Módulo

Um módulo XOOPS bem organizado segue esta estrutura de diretório:

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
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
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## Arquivos Principais Explicados

### xoops_version.php

O arquivo de definição do módulo que informa XOOPS sobre seu módulo:

```php
<?php
$modversion = [];

// Informações Básicas
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Sinalizadores de Módulo
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Configuração de Admin
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Banco de Dados
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocos
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Preferências do Módulo
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Arquivo Comum de Include

Crie um arquivo de bootstrap comum para seu módulo:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Constantes do módulo
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload de classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## Requisitos de Versão PHP

Módulos modernos de XOOPS devem ter como alvo PHP 8.0 ou superior para aproveitar:

- **Constructor Property Promotion**
- **Named Arguments**
- **Union Types**
- **Match Expressions**
- **Attributes**
- **Nullsafe Operator**

## Começando

1. Comece com o tutorial Tutorials/Hello-World-Module
2. Progresso para Tutorials/Building-a-CRUD-Module
3. Estude o Patterns/MVC-Pattern para orientação de arquitetura
4. Aplique as práticas Best-Practices/Clean-Code ao longo
5. Implemente Best-Practices/Testing desde o início

## Recursos Relacionados

- ../05-XMF-Framework/XMF-Framework - Utilitários do XOOPS Module Framework
- Database-Operations - Trabalhando com o banco de dados XOOPS
- ../04-API-Reference/Template/Template-System - Templating Smarty em XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Protegendo seu módulo

## Histórico de Versão

| Versão | Data | Alterações |
|---------|------|---------|
| 1.0 | 2025-01-28 | Documentação inicial |
