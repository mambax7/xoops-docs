---
title: "Publisher - Referência da API"
description: "Referência completa da API do módulo Publisher com classes, métodos e exemplos de código"
---

# Referência da API do Publisher

> Referência completa para classes, métodos, funções e endpoints da API do módulo Publisher.

---

## Estrutura do Módulo

### Organização de Classes

```
Classes do Módulo Publisher:

├── Item / ItemHandler
│   ├── Obter artigos
│   ├── Criar artigos
│   ├── Atualizar artigos
│   └── Deletar artigos
│
├── Category / CategoryHandler
│   ├── Obter categorias
│   ├── Criar categorias
│   ├── Atualizar categorias
│   └── Deletar categorias
│
├── Comment / CommentHandler
│   ├── Obter comentários
│   ├── Criar comentários
│   ├── Moderar comentários
│   └── Deletar comentários
│
└── Helper
    ├── Funções utilitárias
    ├── Funções de formatação
    └── Verificações de permissão
```

---

## Classe Item

### Visão Geral

A classe `Item` representa um único artigo/item no Publisher.

**Namespace:** `XoopsModules\Publisher\`

**Arquivo:** `modules/publisher/class/Item.php`

### Construtor

```php
// Criar novo item
$item = new Item();

// Obter item existente
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### Propriedades e Métodos

#### Obter Propriedades

```php
// Obter ID do artigo
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// Obter título
$title = $item->getVar('title');
$title = $item->title();

// Obter descrição
$description = $item->getVar('description');
$description = $item->description();

// Obter corpo/conteúdo
$body = $item->getVar('body');
$body = $item->body();

// Obter subtítulo
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// Obter autor
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// Obter nome do autor
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// Obter categoria
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// Obter status
$status = $item->getVar('status');
$status = $item->status();

// Obter data de publicação
$date = $item->getVar('datesub');
$date = $item->date();

// Obter data de modificação
$modified = $item->getVar('datemod');
$modified = $item->modified();

// Obter contagem de visualizações
$views = $item->getVar('counter');
$views = $item->views();

// Obter imagem
$image = $item->getVar('image');
$image = $item->image();

// Obter status de destaque
$featured = $item->getVar('featured');
```

#### Definir Propriedades

```php
// Definir título
$item->setVar('title', 'Novo Título de Artigo');

// Definir corpo
$item->setVar('body', '<p>Conteúdo do artigo aqui</p>');

// Definir descrição
$item->setVar('description', 'Descrição breve');

// Definir categoria
$item->setVar('categoryid', 5);

// Definir status (0=rascunho, 1=publicado, etc)
$item->setVar('status', 1);

// Definir destaque
$item->setVar('featured', 1);

// Definir imagem
$item->setVar('image', 'path/to/image.jpg');
```

#### Métodos

```php
// Obter data formatada
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// Obter URL do item
$url = $item->url();

// Obter URL da categoria
$catUrl = $item->categoryUrl();

// Verificar se está publicado
$isPublished = $item->isPublished();

// Obter URL de edição
$editUrl = $item->editUrl();

// Obter URL de exclusão
$deleteUrl = $item->deleteUrl();

// Obter resumo/sumário
$summary = $item->getSummary(100);
$summary = $item->description();

// Obter todas as tags
$tags = $item->getTags();

// Obter comentários
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// Obter classificação
$rating = $item->getRating();

// Obter contagem de classificações
$ratingCount = $item->getRatingCount();
```

---

## Classe ItemHandler

### Visão Geral

O `ItemHandler` gerencia operações CRUD para artigos.

**Arquivo:** `modules/publisher/class/ItemHandler.php`

### Recuperar Itens

```php
// Obter item único por ID
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// Obter todos os itens
$items = $itemHandler->getAll();

// Obter itens com condições
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // Apenas publicados
$criteria->add(new Criteria('categoryid', 5)); // Categoria específica
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// Obter itens por categoria
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// Obter itens recentes
$items = $itemHandler->getRecent($limit = 10);

// Obter itens em destaque
$items = $itemHandler->getFeatured($limit = 5);

// Contar itens
$total = $itemHandler->getCount($criteria);
```

### Criar Item

```php
// Criar novo item
$item = $itemHandler->create();

// Definir propriedades
$item->setVar('title', 'Título do Artigo');
$item->setVar('body', '<p>Conteúdo</p>');
$item->setVar('description', 'Descrição breve');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // Rascunho
$item->setVar('datesub', time());

// Salvar
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Artigo criado: " . $itemId;
} else {
    echo "Erro: " . implode(', ', $item->getErrors());
}
```

### Atualizar Item

```php
// Obter item
$item = $itemHandler->get($itemId);

// Modificar
$item->setVar('title', 'Título Atualizado');
$item->setVar('body', '<p>Conteúdo atualizado</p>');
$item->setVar('status', 1); // Publicar

// Salvar
if ($itemHandler->insert($item)) {
    echo "Item atualizado";
} else {
    echo "Erro: " . implode(', ', $item->getErrors());
}
```

### Deletar Item

```php
// Obter item
$item = $itemHandler->get($itemId);

// Deletar
if ($itemHandler->delete($item)) {
    echo "Item deletado";
} else {
    echo "Erro ao deletar item";
}

// Deletar por ID
$itemHandler->deleteByPrimary($itemId);
```

---

## Classe Category

### Visão Geral

A classe `Category` representa uma categoria ou seção.

**Arquivo:** `modules/publisher/class/Category.php`

### Métodos

```php
// Obter ID da categoria
$catId = $category->getVar('categoryid');
$catId = $category->id();

// Obter nome
$name = $category->getVar('name');
$name = $category->name();

// Obter descrição
$desc = $category->getVar('description');
$desc = $category->description();

// Obter imagem
$image = $category->getVar('image');
$image = $category->image();

// Obter categoria pai
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// Obter status
$status = $category->getVar('status');

// Obter URL
$url = $category->url();

// Obter contagem de itens
$count = $category->itemCount();

// Obter subcategorias
$subs = $category->getSubCategories();

// Obter objeto da categoria pai
$parent = $category->getParent();
```

---

## Classe CategoryHandler

### Visão Geral

O `CategoryHandler` gerencia operações CRUD de categoria.

**Arquivo:** `modules/publisher/class/CategoryHandler.php`

### Recuperar Categorias

```php
// Obter categoria única
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// Obter todas as categorias
$categories = $catHandler->getAll();

// Obter categorias raiz (sem pai)
$roots = $catHandler->getRoots();

// Obter subcategorias
$subs = $catHandler->getByParent($parentId);

// Obter categorias com critério
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### Criar Categoria

```php
// Criar nova
$category = $catHandler->create();

// Definir valores
$category->setVar('name', 'Notícias');
$category->setVar('description', 'Itens de notícias');
$category->setVar('parentid', 0); // Nível raiz
$category->setVar('status', 1);

// Salvar
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Erro";
}
```

### Atualizar Categoria

```php
// Obter categoria
$category = $catHandler->get($categoryId);

// Modificar
$category->setVar('name', 'Nome Atualizado');

// Salvar
$catHandler->insert($category);
```

### Deletar Categoria

```php
// Obter categoria
$category = $catHandler->get($categoryId);

// Deletar
$catHandler->delete($category);
```

---

## Funções Auxiliares

### Funções Utilitárias

A classe Helper fornece funções utilitárias:

**Arquivo:** `modules/publisher/class/Helper.php`

```php
// Obter instância do assistente
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Obter instância do módulo
$module = $helper->getModule();

// Obter manipulador
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// Obter valor de configuração
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// Verificar permissão
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// Obter URL
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// Obter caminho base
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### Funções de Formatação

```php
// Formatar data
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// Truncar texto
$excerpt = $helper->truncate($text, $length = 100);

// Sanitizar entrada
$clean = $helper->sanitize($input);

// Preparar saída
$output = $helper->prepare($data);

// Obter breadcrumb
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## API JavaScript

### Funções JavaScript do Frontend

O Publisher inclui API JavaScript para interações do frontend:

```javascript
// Incluir biblioteca JS do Publisher
<script src="/modules/publisher/assets/js/publisher.js"></script>

// Verificar se objeto Publisher existe
if (typeof Publisher !== 'undefined') {
    // Usar API do Publisher
}

// Obter dados do artigo
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// Obter dados da categoria
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// Enviar classificação
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Classificação salva');
});

// Carregar mais artigos
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // Manipular artigos carregados
});

// Buscar artigos
Publisher.search(query, function(results) {
    // Manipular resultados de busca
});
```

### Endpoints Ajax

O Publisher fornece endpoints AJAX para interações do frontend:

```javascript
// Obter artigo via AJAX
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// Enviar comentário via AJAX
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// Obter classificações
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## API REST (Se Habilitada)

### Endpoints da API

Se o Publisher expõe REST API:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### Exemplos de Chamadas da API

```php
// Obter itens via REST
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// Obter item único
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// Criar item
$url = 'http://example.com/modules/publisher/api/items';
$data = array(
    'title' => 'Novo Artigo',
    'body' => 'Conteúdo aqui',
    'categoryid' => 1
);
$options = array(
    'http' => array(
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data)
    )
);
$response = file_get_contents($url, false, stream_context_create($options));
```

---

## Esquema do Banco de Dados

### Tabelas

#### publisher_categories

```
- categoryid (PK)
- name
- description
- image
- parentid (FK)
- status
- created
- modified
```

#### publisher_items

```
- itemid (PK)
- categoryid (FK)
- uid (FK para users)
- title
- subtitle
- description
- body
- image
- status
- featured
- datesub
- datemod
- counter (visualizações)
```

#### publisher_comments

```
- commentid (PK)
- itemid (FK)
- uid (FK)
- comment
- datesub
- approved
```

#### publisher_files

```
- fileid (PK)
- itemid (FK)
- filename
- description
- uploaded
```

---

## Eventos e Ganchos

### Eventos do Publisher

```php
// Evento de criação de item
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// Item atualizado
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// Item deletado
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// Artigo comentado
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### Escutar Eventos

```php
// Registrar escuta de evento
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// Ou em plugin
public function onItemCreated($item) {
    // Manipular criação de item
}
```

---

## Exemplos de Código

### Obter Artigos Recentes

```php
<?php
// Obter artigos publicados recentes
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // Publicados
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>Leia Mais</a>\n\n";
}
?>
```

### Criar Artigo Programaticamente

```php
<?php
// Criar artigo
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Artigo Programático');
$item->setVar('description', 'Criado via API');
$item->setVar('body', '<p>Conteúdo completo aqui</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // Publicado
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Artigo criado: " . $item->getVar('itemid');
} else {
    echo "Erro: " . implode(', ', $item->getErrors());
}
?>
```

### Obter Artigos por Categoria

```php
<?php
// Obter artigos da categoria
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Artigos na categoria " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### Atualizar Status do Artigo

```php
<?php
// Alterar status do artigo
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // Publicar

    if ($itemHandler->insert($item)) {
        echo "Artigo publicado";
    } else {
        echo "Erro ao publicar artigo";
    }
} else {
    echo "Artigo não encontrado";
}
?>
```

### Obter Árvore de Categorias

```php
<?php
// Construir árvore de categorias
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$roots = $catHandler->getRoots();

function displayTree($category, $level = 0) {
    echo str_repeat("  ", $level) . $category->name() . "\n";

    $subs = $category->getSubCategories();
    foreach ($subs as $sub) {
        displayTree($sub, $level + 1);
    }
}

foreach ($roots as $root) {
    displayTree($root);
}
?>
```

---

## Tratamento de Erros

### Manipular Erros

```php
<?php
// Tratamento de erro try/catch
try {
    $itemHandler = xoops_getModuleHandler('Item', 'publisher');
    $item = $itemHandler->get($itemId);

    if (!$item) {
        throw new Exception('Item não encontrado');
    }

    $item->setVar('title', 'Novo Título');

    if (!$itemHandler->insert($item)) {
        throw new Exception('Falha ao salvar item');
    }
} catch (Exception $e) {
    error_log('Erro do Publisher: ' . $e->getMessage());
    // Manipular erro
}
?>
```

### Obter Mensagens de Erro

```php
<?php
// Obter mensagens de erro do objeto
$item = $itemHandler->create();
// ... definir variáveis ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Erro: " . $error . "\n";
    }
}
?>
```

---

## Documentação Relacionada

- Ganchos e Eventos
- Templates Personalizados
- Análise do Módulo Publisher
- Templates e Blocos no Publisher
- Criação de Artigos
- Gerenciamento de Categorias

---

## Recursos

- [Repositório GitHub do Publisher](https://github.com/XoopsModules25x/publisher)
- [API XOOPS](../../04-API-Reference/API-Reference.md)
- [Documentação do PHP](https://www.php.net/docs.php)

---

#publisher #api #referência #código #classes #métodos #xoops
