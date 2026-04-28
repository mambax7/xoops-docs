---
title: "Permission Helper"
description: "Gerenciando permissões de grupo XOOPS com o XMF Permission Helper"
---

XOOPS tem um poderoso e flexível sistema de permissões baseado em filiação em grupo do usuário. O XMF Permission Helper simplifica o trabalho com estas permissões, reduzindo verificações complexas de permissão para chamadas de método único.

## Visão Geral

O sistema de permissões XOOPS associa grupos com:
- ID de Módulo
- Nome de Permissão
- ID de Item

Verificar permissões tradicionalmente requer encontrar grupos de usuário, procurar IDs de módulo e consultar tabelas de permissão. O XMF Permission Helper manipula tudo isto automaticamente.

## Começando

### Criando um Permission Helper

```php
// Para o módulo atual
$permHelper = new \Xmf\Module\Helper\Permission();

// Para um módulo específico
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

O helper automaticamente usa os grupos do usuário atual e o ID do módulo especificado.

## Verificando Permissões

### O Usuário Tem Permissão?

Verifique se o usuário atual tem uma permissão específica para um item:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Verificar se usuário pode visualizar tópico ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Exibir o tópico
} else {
    // Mostrar mensagem de acesso negado
}
```

### Verificar com Redirecionamento

Redirecione automaticamente usuários que carecem de permissão:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Redireciona para index.php após 3 segundos se sem permissão
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'Você não tem permissão para visualizar este tópico'
);

// Código aqui só executa se usuário tem permissão
displayTopic($topicId);
```

### Sobrescrita de Admin

Por padrão, usuários admin sempre têm permissão. Para verificar mesmo para admins:

```php
// Verificação normal - admins sempre têm permissão
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Verificar mesmo para admins (terceiro parâmetro = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### Obter IDs de Item Permitidos

Recupere todos os IDs de item que grupos específicos têm permissão para:

```php
// Obter items que os grupos do usuário atual podem visualizar
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Obter items que um grupo específico pode visualizar
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Usar em queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Gerenciando Permissões

### Obter Grupos para um Item

Encontre quais grupos têm uma permissão específica:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Obter grupos que podem visualizar tópico 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Retorna: [1, 2, 5] (array de IDs de grupo)
```

### Salvar Permissões

Conceda permissão a grupos específicos:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Permitir grupos 1, 2 e 3 visualizar tópico 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Deletar Permissões

Remova todas as permissões para um item (tipicamente ao deletar o item):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Deletar permissão de view para este tópico
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Para múltiplos tipos de permissão:

```php
// Deletar múltiplos tipos de permissão ao mesmo tempo
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Integração com Formulário

### Adicionando Seleção de Permissão a Formulários

O helper pode criar um elemento de formulário para seleção de grupos:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Construir seu formulário
$form = new XoopsThemeForm('Editar Tópico', 'topicform', 'save.php');

// Adicionar campo de título, etc.
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Adicionar seletor de permissão
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Nome de permissão
        $topicId,                              // ID de item
        'Grupos com Permissão de Visualizar Tópico'   // Legenda
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Salvar', 'submit'));
```

### Opções de Elemento de Formulário

A assinatura completa do método:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Nome de permissão
    $gperm_itemid,    // ID de item
    $caption,         // Legenda do elemento de formulário
    $name,            // Nome do elemento (auto-gerado se vazio)
    $include_anon,    // Incluir grupo anônimo (padrão: false)
    $size,            // Número de linhas visíveis (padrão: 5)
    $multiple         // Permitir múltipla seleção (padrão: true)
)
```

### Processando Submissão de Formulário

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Obter nome do campo auto-gerado
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Obter grupos selecionados do formulário
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Salvar as permissões
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### Nome de Campo Padrão

O helper gera nomes de campo consistentes:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Retorna algo como: 'mymodule_viewtopic_42'
```

## Exemplo Completo: Items Protegidos por Permissão

### Criando um Item com Permissões

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Salvar dados do item
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Salvar permissão de view
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Salvar permissão de edit
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item salvo');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Editar Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // Seletor de permissão de view
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Grupos que podem visualizar')
        );

        // Seletor de permissão de edit
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Grupos que podem editar')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Salvar', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Visualizando com Verificação de Permissão

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Verificar permissão de view - redireciona se negada
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'Você não tem permissão para visualizar este item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// Usuário tem permissão, exibir o item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Mostrar botão de edit apenas se usuário tem permissão de edit
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Deletando com Limpeza de Permissão

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Deletar o item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Limpar todas as permissões para este item
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deletado');
}
```

## Referência da API

| Método | Descrição |
|--------|-----------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Verificar se usuário tem permissão |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Verificar e redirecionar se negada |
| `getItemIds($name, $groupIds)` | Obter IDs de item que grupos podem acessar |
| `getGroupsForItem($name, $itemId)` | Obter grupos com permissão |
| `savePermissionForItem($name, $itemId, $groups)` | Salvar permissões |
| `deletePermissionForItem($name, $itemId)` | Deletar permissões |
| `getGroupSelectFormForItem(...)` | Criar elemento select de formulário |
| `defaultFieldName($name, $itemId)` | Obter nome de campo de formulário padrão |

## Veja Também

- ../Basics/XMF-Module-Helper - Documentação do module helper
- Module-Admin-Pages - Criação de interface admin
- ../Basics/Getting-Started-with-XMF - Básico de XMF

---

#xmf #permissions #security #groups #forms
