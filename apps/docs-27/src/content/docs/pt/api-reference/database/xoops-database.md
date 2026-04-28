---
title: "Classe XoopsDatabase"
description: "Camada de abstração de banco de dados fornecendo gerenciamento de conexão, execução de consultas e tratamento de resultados"
---

A classe `XoopsDatabase` fornece uma camada de abstração de banco de dados para XOOPS, manipulando gerenciamento de conexão, execução de consultas, processamento de resultados e tratamento de erros. Suporta múltiplos drivers de banco de dados através de uma arquitetura de driver.

## Visão Geral da Classe

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## Hierarquia de Classe

```
XoopsDatabase (Classe Base Abstrata)
├── XoopsMySQLDatabase (Extensão MySQL)
│   └── XoopsMySQLDatabaseProxy (Proxy de Segurança)
└── XoopsMySQLiDatabase (Extensão MySQLi)
    └── XoopsMySQLiDatabaseProxy (Proxy de Segurança)

XoopsDatabaseFactory
└── Cria instâncias de driver apropriadas
```

## Obtendo uma Instância de Banco de Dados

### Usando a Factory

```php
// Recomendado: Use a factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Usando getInstance

```php
// Alternativa: Acesso singleton direto
$db = XoopsDatabase::getInstance();
```

### Variável Global

```php
// Legado: Use variável global
global $xoopsDB;
```

## Métodos Principais

### connect

Estabelece uma conexão com banco de dados.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$selectdb` | bool | Se deve selecionar o banco de dados |

**Retorna:** `bool` - Verdadeiro em conexão bem-sucedida

**Exemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Conectado com sucesso";
}
```

---

### query

Executa uma consulta SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$sql` | string | String de consulta SQL |
| `$limit` | int | Máximo de linhas a retornar (0 = sem limite) |
| `$start` | int | Offset de inicialização |

**Retorna:** `resource|bool` - Recurso de resultado ou falso em caso de falha

**Exemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Consulta simples
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Consulta com limite
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // Primeiras 10 linhas

// Consulta com offset
$result = $db->query($sql, 10, 20); // 10 linhas começando na linha 20
```

---

### queryF

Executa uma consulta forçando a operação (ignora verificações de segurança).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Casos de Uso:**
- Operações INSERT, UPDATE, DELETE
- Quando precisa contornar restrições de leitura apenas

**Exemplo:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### prefix

Prepara o prefixo de tabela de banco de dados.

```php
public function prefix(string $table = ''): string
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$table` | string | Nome da tabela sem prefixo |

**Retorna:** `string` - Nome da tabela com prefixo

**Exemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (se prefixo é "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (apenas o prefixo)
```

---

### fetchArray

Busca uma linha de resultado como um array associativo.

```php
abstract public function fetchArray($result): ?array
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$result` | resource | Recurso de resultado da consulta |

**Retorna:** `array|null` - Array associativo ou null se não há mais linhas

**Exemplo:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "Usuário: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

Busca uma linha de resultado como um objeto.

```php
abstract public function fetchObject($result): ?object
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$result` | resource | Recurso de resultado da consulta |

**Retorna:** `object|null` - Objeto com propriedades para cada coluna

**Exemplo:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Nome de usuário: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

Busca uma linha de resultado como um array numérico.

```php
abstract public function fetchRow($result): ?array
```

**Exemplo:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Nome de usuário: " . $row[0] . ", Email: " . $row[1];
}
```

---

### fetchBoth

Busca uma linha de resultado como array associativo e numérico.

```php
abstract public function fetchBoth($result): ?array
```

**Exemplo:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // Por nome
echo $row[0];        // Por índice
```

---

### getRowsNum

Obtém o número de linhas em um conjunto de resultados.

```php
abstract public function getRowsNum($result): int
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$result` | resource | Recurso de resultado da consulta |

**Retorna:** `int` - Número de linhas

**Exemplo:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Encontrados $count usuários ativos";
```

---

### getAffectedRows

Obtém o número de linhas afetadas pela última consulta.

```php
abstract public function getAffectedRows(): int
```

**Retorna:** `int` - Número de linhas afetadas

**Exemplo:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Atualizadas $affected linhas";
```

---

### getInsertId

Obtém o ID gerado automaticamente do último INSERT.

```php
abstract public function getInsertId(): int
```

**Retorna:** `int` - Último ID inserido

**Exemplo:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Artigo criado com ID: $newId";
```

---

### escape

Escapa uma string para uso seguro em consultas SQL.

```php
abstract public function escape(string $string): string
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$string` | string | String a escapar |

**Retorna:** `string` - String escapada (sem aspas)

**Exemplo:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escapa e cita uma string para SQL.

```php
public function quoteString(string $string): string
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$string` | string | String a citar |

**Retorna:** `string` - String escapada e citada

**Exemplo:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Libera a memória associada a um resultado.

```php
abstract public function freeRecordSet($result): void
```

**Exemplo:**
```php
$result = $db->query($sql);
// Processar resultados...
$db->freeRecordSet($result);  // Liberar memória
```

---

## Tratamento de Erros

### error

Obtém a última mensagem de erro.

```php
abstract public function error(): string
```

**Exemplo:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Erro de banco de dados: " . $db->error();
}
```

---

### errno

Obtém o último número de erro.

```php
abstract public function errno(): int
```

**Exemplo:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Erro #" . $db->errno() . ": " . $db->error();
}
```

---

## Consultas Preparadas (MySQLi)

O driver MySQLi suporta consultas preparadas para segurança aprimorada.

### prepare

Cria uma consulta preparada.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Exemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### Consulta Preparada com Múltiplos Parâmetros

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Artigo criado com ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## Suporte de Transações

### beginTransaction

Inicia uma transação.

```php
public function beginTransaction(): bool
```

### commit

Confirma a transação atual.

```php
public function commit(): bool
```

### rollback

Reverte a transação atual.

```php
public function rollback(): bool
```

**Exemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Múltiplas operações
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Verificar erros
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transação concluída";

} catch (Exception $e) {
    $db->rollback();
    echo "Transação falhou: " . $e->getMessage();
}
```

---

## Exemplos Completos de Uso

### Operações CRUD Básicas

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// CREATE
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### Consulta de Paginação

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Obter contagem total
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Obter página de resultados
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### Consulta de Busca com LIKE

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Limite a 50 resultados

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### Consulta de Join

```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## Classe SqlUtility

Classe auxiliar para operações de arquivo SQL.

### splitMySqlFile

Divide um arquivo SQL em consultas individuais.

```php
public static function splitMySqlFile(string $content): array
```

**Exemplo:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Erro ao executar: " . $query . "\n";
        echo "Erro: " . $db->error() . "\n";
    }
}
```

### prefixQuery

Substitui placeholders de tabela por nomes de tabela com prefixo.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Exemplo:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Melhores Práticas

### Segurança

1. **Sempre escape da entrada do usuário**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Use consultas preparadas quando disponível**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Use quoteString para valores**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Desempenho

1. **Sempre use LIMIT para tabelas grandes**:
```php
$result = $db->query($sql, 100);  // Limitar resultados
```

2. **Libere conjuntos de resultados quando feito**:
```php
$db->freeRecordSet($result);
```

3. **Use índices apropriados** em suas definições de tabela

4. **Prefira handlers sobre SQL bruto** quando possível

### Tratamento de Erros

1. **Sempre verifique se há erros**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Use transações para múltiplas operações relacionadas**:
```php
$db->beginTransaction();
// ... operações ...
$db->commit();  // ou $db->rollback();
```

## Documentação Relacionada

- Criteria - Sistema de criteria de consulta
- QueryBuilder - Construção de consulta fluente
- ../Core/XoopsObjectHandler - Persistência de objeto

---

*Veja também: [Código-Fonte do XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
