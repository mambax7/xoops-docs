---
title: "Classe XoopsObjectHandler"
description: "Classe manipuladora base para operações CRUD em instâncias de XoopsObject com persistência em banco de dados"
---

A classe `XoopsObjectHandler` e sua extensão `XoopsPersistableObjectHandler` fornecem uma interface padronizada para executar operações CRUD (Criar, Ler, Atualizar, Excluir) em instâncias de `XoopsObject`. Isso implementa o padrão Data Mapper, separando a lógica de domínio do acesso ao banco de dados.

## Visão Geral da Classe

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## Hierarquia de Classes

```
XoopsObjectHandler (Base Abstrata)
└── XoopsPersistableObjectHandler (Implementação Estendida)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Manipuladores de Módulos Personalizados]
```

## XoopsObjectHandler

### Construtor

```php
public function __construct(XoopsDatabase $db)
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Instância de conexão com o banco de dados |

**Exemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Cria uma nova instância de objeto.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$isNew` | bool | Se o objeto é novo (padrão: true) |

**Retorna:** `XoopsObject|null` - Nova instância de objeto

**Exemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Recupera um objeto pela sua chave primária.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$id` | int | Valor da chave primária |

**Retorna:** `XoopsObject|null` - Instância de objeto ou nulo se não encontrado

**Exemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Salva um objeto no banco de dados (inserir ou atualizar).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objeto a ser salvo |
| `$force` | bool | Força operação mesmo que o objeto não tenha mudado |

**Retorna:** `bool` - Verdadeiro em caso de sucesso

**Exemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "Usuário salvo com ID: " . $user->getVar('uid');
} else {
    echo "Falha ao salvar: " . implode(', ', $user->getErrors());
}
```

---

### delete

Exclui um objeto do banco de dados.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objeto a ser excluído |
| `$force` | bool | Forçar exclusão |

**Retorna:** `bool` - Verdadeiro em caso de sucesso

**Exemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "Usuário excluído";
}
```

---

## XoopsPersistableObjectHandler

O `XoopsPersistableObjectHandler` estende `XoopsObjectHandler` com métodos adicionais para consultas e operações em massa.

### Construtor

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Conexão com o banco de dados |
| `$table` | string | Nome da tabela (sem prefixo) |
| `$className` | string | Nome completo da classe do objeto |
| `$keyName` | string | Nome do campo de chave primária |
| `$identifierName` | string | Campo identificador legível |

**Exemplo:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Nome da tabela
            'Article',               // Nome da classe
            'article_id',            // Chave primária
            'title'                  // Campo identificador
        );
    }
}
```

---

### getObjects

Recupera múltiplos objetos correspondentes aos critérios.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critérios de consulta (opcional) |
| `$idAsKey` | bool | Usar chave primária como chave do array |
| `$asObject` | bool | Retornar objetos (true) ou arrays (false) |

**Retorna:** `array` - Array de objetos ou arrays associativos

**Exemplo:**
```php
$handler = xoops_getHandler('user');

// Obter todos os usuários ativos
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Obter usuários com ID como chave
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Acessar por ID

// Obter como arrays em vez de objetos
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Conta objetos correspondentes aos critérios.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critérios de consulta (opcional) |

**Retorna:** `int` - Contagem de objetos correspondentes

**Exemplo:**
```php
$handler = xoops_getHandler('user');

// Contar todos os usuários
$totalUsers = $handler->getCount();

// Contar usuários ativos
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Ativos: $activeUsers";
```

---

### getAll

Recupera todos os objetos (alias para getObjects sem critérios).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critérios de consulta |
| `$fields` | array | Campos específicos a recuperar |
| `$asObject` | bool | Retornar como objetos |
| `$idAsKey` | bool | Usar ID como chave do array |

**Exemplo:**
```php
$handler = xoops_getHandler('module');

// Obter todos os módulos
$modules = $handler->getAll();

// Obter apenas campos específicos
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Recupera apenas as chaves primárias dos objetos correspondentes.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critérios de consulta |

**Retorna:** `array` - Array de valores de chave primária

**Exemplo:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array de IDs de usuários administradores
```

---

### getList

Recupera uma lista chave-valor para dropdowns.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Retorna:** `array` - Array associativo [id => identificador]

**Exemplo:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administradores', 2 => 'Usuários Registrados', ...]

// Para um dropdown de seleção
$form->addElement(new XoopsFormSelect('Grupo', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Exclui todos os objetos correspondentes aos critérios.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critérios para objetos a excluir |
| `$force` | bool | Forçar exclusão |
| `$asObject` | bool | Carregar objetos antes de excluir (dispara eventos) |

**Retorna:** `bool` - Verdadeiro em caso de sucesso

**Exemplo:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Excluir todos os comentários de um artigo específico
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Excluir com carregamento de objeto (dispara eventos de exclusão)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Atualiza um valor de campo para todos os objetos correspondentes.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$fieldname` | string | Campo a atualizar |
| `$fieldvalue` | mixed | Novo valor |
| `$criteria` | CriteriaElement | Critérios para objetos a atualizar |
| `$force` | bool | Forçar atualização |

**Retorna:** `bool` - Verdadeiro em caso de sucesso

**Exemplo:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Marcar todos os artigos de um autor como rascunho
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Atualizar contador de visualizações
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Estendido)

O método insert estendido com funcionalidade adicional.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Comportamento:**
- Se o objeto é novo (`isNew() === true`): INSERT
- Se o objeto existe (`isNew() === false`): UPDATE
- Chama `cleanVars()` automaticamente
- Define ID de auto-incremento em novos objetos

**Exemplo:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Criar novo artigo
$article = $handler->create();
$article->setVar('title', 'Novo Artigo');
$article->setVar('content', 'Conteúdo aqui');
$handler->insert($article);
echo "Criado com ID: " . $article->getVar('article_id');

// Atualizar artigo existente
$article = $handler->get(5);
$article->setVar('title', 'Título Atualizado');
$handler->insert($article);
```

---

## Funções Auxiliares

### xoops_getHandler

Função global para recuperar um manipulador central.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$name` | string | Nome do manipulador (user, module, group, etc.) |
| `$optional` | bool | Retornar nulo em vez de disparar erro |

**Exemplo:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Recupera um manipulador específico do módulo.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$name` | string | Nome do manipulador |
| `$dirname` | string | Nome do diretório do módulo |
| `$optional` | bool | Retornar nulo em caso de falha |

**Exemplo:**
```php
// Obter manipulador do módulo atual
$articleHandler = xoops_getModuleHandler('article');

// Obter manipulador de módulo específico
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Criando Manipuladores Personalizados

### Implementação Básica do Manipulador

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Manipulador para objetos Article
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Construtor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Obter artigos publicados
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Obter artigos por autor
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Obter artigos por categoria
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Pesquisar artigos
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Obter artigos populares pela contagem de visualizações
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Incrementar contagem de visualizações
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Sobrescrever insert para comportamento personalizado
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Definir timestamp atualizado
        $obj->setVar('updated', time());

        // Se novo, definir timestamp criado
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Sobrescrever delete para operações em cascata
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Excluir comentários associados
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Usando o Manipulador Personalizado

```php
// Obter o manipulador
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Criar um novo artigo
$article = $articleHandler->create();
$article->setVars([
    'title' => 'Meu Novo Artigo',
    'content' => 'Conteúdo do artigo aqui...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Artigo criado');
}

// Obter artigos publicados
$articles = $articleHandler->getPublished(10);

// Pesquisar artigos
$results = $articleHandler->search('xoops');

// Obter artigos populares
$popular = $articleHandler->getPopular(5);

// Atualizar contagem de visualizações
$articleHandler->incrementViews($articleId);
```

## Melhores Práticas

1. **Use Critérios para Consultas**: Sempre use objetos Criteria para consultas type-safe

2. **Estenda para Métodos Personalizados**: Adicione métodos de consulta específicos do domínio aos manipuladores

3. **Sobrescreva insert/delete**: Adicione operações em cascata e timestamps nas sobreposições

4. **Use Transação Quando Necessário**: Encapsule operações complexas em transações

5. **Aproveite getList**: Use `getList()` para dropdowns de seleção para reduzir consultas

6. **Índices de Chaves**: Certifique-se de que os campos usados nos critérios estão indexados

7. **Limitar Resultados**: Sempre use `setLimit()` para conjuntos de resultados potencialmente grandes

## Documentação Relacionada

- XoopsObject - Classe de objeto base
- ../Database/Criteria - Construção de critérios de consulta
- ../Database/XoopsDatabase - Operações de banco de dados

---

*Veja também: [Código Fonte XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
