---
title: "Começando com XMF"
description: "Instalação, conceitos básicos e primeiros passos com o XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Este guia cobre os conceitos fundamentais do XOOPS Module Framework (XMF) e como começar a usá-lo em seus módulos.

## Pré-requisitos

- XOOPS 2.5.8 ou posterior instalado
- PHP 7.2 ou posterior
- Compreensão básica de programação orientada a objetos em PHP

## Entendendo Namespaces

XMF usa namespaces PHP para organizar suas classes e evitar conflitos de nomenclatura. Todas as classes XMF estão no namespace `Xmf`.

### Problema do Espaço Global

Sem namespaces, todas as classes PHP compartilham um espaço global. Isto pode causar conflitos:

```php
<?php
// Isto entraria em conflito com o ArrayObject nativo do PHP
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Erro fatal: Cannot redeclare class ArrayObject
```

### Solução com Namespaces

Namespaces criam contextos de nomenclatura isolados:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Sem conflito - isto é \MyNamespace\ArrayObject
```

### Usando Namespaces XMF

Você pode referenciar classes XMF de várias maneiras:

**Caminho completo do namespace:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Com declaração use:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Múltiplas importações:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Autoloading

Uma das maiores conveniências do XMF é o carregamento automático de classes. Você nunca precisa incluir manualmente arquivos de classe XMF.

### Carregamento Tradicional XOOPS

A forma antiga requeria carregamento explícito:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### Autoloading XMF

Com XMF, as classes carregam automaticamente quando referenciadas:

```php
$input = Xmf\Request::getString('input', '');
```

Ou com uma declaração use:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

O autoloader segue o padrão [PSR-4](http://www.php-fig.org/psr/psr-4/) e também gerencia dependências nas quais XMF depende.

## Exemplos de Uso Básico

### Lendo Entrada de Requisição

```php
use Xmf\Request;

// Obter valor inteiro com padrão de 0
$id = Request::getInt('id', 0);

// Obter valor string com padrão vazio
$title = Request::getString('title', '');

// Obter comando (alfanumérico, minúsculo)
$op = Request::getCmd('op', 'list');

// Obter email com validação
$email = Request::getEmail('email', '');

// Obter de hash específico (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### Usando o Helper de Módulo

```php
use Xmf\Module\Helper;

// Obter helper para seu módulo
$helper = Helper::getHelper('mymodule');

// Ler configuração do módulo
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Acessar o objeto do módulo
$module = $helper->getModule();
$version = $module->getVar('version');

// Obter um handler
$itemHandler = $helper->getHandler('items');

// Carregar arquivo de idioma
$helper->loadLanguage('admin');

// Verificar se é o módulo atual
if ($helper->isCurrentModule()) {
    // Estamos neste módulo
}

// Verificar direitos de admin
if ($helper->isUserAdmin()) {
    // Usuário tem acesso admin
}
```

### Helpers de Caminho e URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Obter URL do módulo
$moduleUrl = $helper->url('images/logo.png');
// Retorna: https://example.com/modules/mymodule/images/logo.png

// Obter caminho do módulo
$modulePath = $helper->path('templates/view.tpl');
// Retorna: /var/www/html/modules/mymodule/templates/view.tpl

// Caminhos de upload
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Depuração com XMF

XMF fornece ferramentas de depuração úteis:

```php
// Despejar uma variável com formatação legal
\Xmf\Debug::dump($myVariable);

// Despejar múltiplas variáveis
\Xmf\Debug::dump($var1, $var2, $var3);

// Despejar dados POST
\Xmf\Debug::dump($_POST);

// Mostrar um rastreamento de pilha
\Xmf\Debug::backtrace();
```

A saída de depuração é colapsível e exibe objetos e arrays em um formato fácil de ler.

## Recomendação de Estrutura de Projeto

Ao construir módulos baseados em XMF, organize seu código:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Helper customizado opcional
    ItemHandler.php     # Seus handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## Padrão Comum de Inclusão

Um ponto de entrada típico do módulo:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Obter operação da requisição
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Incluir cabeçalho XOOPS
require_once XOOPS_ROOT_PATH . '/header.php';

// Lógica do seu módulo aqui
switch ($op) {
    case 'view':
        // Manipular view
        break;
    case 'list':
    default:
        // Manipular list
        break;
}

// Incluir rodapé XOOPS
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Próximos Passos

Agora que você compreende o básico, explore:

- XMF-Request - Documentação detalhada de manipulação de requisições
- XMF-Module-Helper - Referência completa do helper de módulo
- ../Recipes/Permission-Helper - Gerenciamento de permissões de usuário
- ../Recipes/Module-Admin-Pages - Construindo interfaces administrativas

## Veja Também

- ../XMF-Framework - Visão geral do framework
- ../Reference/JWT - Suporte a JSON Web Token
- ../Reference/Database - Utilitários de banco de dados

---

#xmf #getting-started #namespaces #autoloading #basics
