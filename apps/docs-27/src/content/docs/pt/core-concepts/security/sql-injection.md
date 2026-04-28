---
title: "Prevenção de Injeção de SQL"
description: "Práticas de segurança de banco de dados e prevenção de injeção de SQL no XOOPS"
---

Injeção de SQL é uma das vulnerabilidades de aplicação web mais perigosas e comuns. Este guia cobre como proteger seus módulos XOOPS contra ataques de injeção de SQL.

## Documentação Relacionada

- Security-Best-Practices - Guia abrangente de segurança
- CSRF-Protection - Sistema de token e classe XoopsSecurity
- Input-Sanitization - MyTextSanitizer e validação

## Entendendo Injeção de SQL

Injeção de SQL ocorre quando entrada do usuário é incluída diretamente em consultas SQL sem sanitização ou parametrização adequada.

### Exemplo de Código Vulnerável

```php
// PERIGOSO - NÃO USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Se um usuário passar `1 OR 1=1` como o ID, a consulta se torna:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Isto retorna todos os registros em vez de apenas um.

## Usando Consultas Parametrizadas

A defesa mais eficaz contra injeção de SQL é usar consultas parametrizadas (prepared statements).

### Consulta Parametrizada Básica

```php
// Obter conexão de banco de dados
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SEGURO - Usando consulta parametrizada
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Múltiplos Parâmetros

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Parâmetros Nomeados

Algumas abstrações de banco de dados suportam parâmetros nomeados:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Usando XoopsObject e XoopsObjectHandler

XOOPS fornece acesso orientado a objetos ao banco de dados que ajuda a prevenir injeção de SQL através do sistema Criteria.

### Uso Básico de Criteria

```php
// Obter o manipulador
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Criar criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Obter objetos - automaticamente seguro contra injeção de SQL
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo para Múltiplas Condições

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Opcional: Adicionar ordenação e limites
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Operadores Criteria

```php
// Igual (padrão)
$criteria->add(new Criteria('status', 'active'));

// Não igual
$criteria->add(new Criteria('status', 'deleted', '!='));

// Maior que
$criteria->add(new Criteria('count', 100, '>'));

// Menor que ou igual
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (para correspondência parcial)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (múltiplos valores)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### Condições OR

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// Condição OR
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Prefixos de Tabela

Sempre use o sistema de prefixo de tabela XOOPS:

```php
// Correto - usando prefixo
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Também correto
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## Consultas INSERT

### Usando Prepared Statements

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

### Usando XoopsObject

```php
// Criar novo objeto
$item = $itemHandler->create();

// Definir valores - manipulador escapa automaticamente
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Inserir
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## Consultas UPDATE

### Usando Prepared Statements

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

### Usando XoopsObject

```php
// Obter objeto existente
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## Consultas DELETE

### Usando Prepared Statements

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Usando XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Exclusão em Massa com Criteria

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Escapando Quando Necessário

Se você não puder usar prepared statements, use escapamento adequado:

```php
// Usando mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

No entanto, **sempre prefira prepared statements** ao escapamento.

## Construindo Consultas Dinâmicas com Segurança

### Nomes de Coluna Dinâmicos Seguros

Nomes de coluna não podem ser parametrizados. Valide contra uma lista branca:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Valor seguro padrão
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Nomes de Tabela Dinâmicos Seguros

Similarly, valide nomes de tabela:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Construindo Cláusulas WHERE Dinamicamente

```php
$criteria = new CriteriaCompo();

// Adicionar condições baseadas em entrada
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## Consultas LIKE

Tenha cuidado com consultas LIKE para evitar injeção de curinga:

```php
// Escapar caracteres especiais no termo de pesquisa
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Então usar em LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## Cláusulas IN

Ao usar cláusulas IN, certifique-se de que todos os valores são tipados corretamente:

```php
// Array de IDs da entrada do usuário
$inputIds = $_POST['ids'] ?? [];

// Sanitizar: garantir que todos são inteiros
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

Ou com Criteria:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Segurança de Transação

Ao executar múltiplas consultas relacionadas:

```php
// Iniciar transação
$xoopsDB->query("START TRANSACTION");

try {
    // Consulta 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Consulta 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Confirmar
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Reverter em caso de erro
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## Tratamento de Erro

Nunca exponha erros SQL aos usuários:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Registrar o erro real para depuração
    error_log('Database error: ' . $xoopsDB->error());

    // Mostrar mensagem genérica ao usuário
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## Erros Comuns a Evitar

### Erro 1: Interpolação Direta de Variáveis

```php
// ERRADO
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// CORRETO
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Erro 2: Usando addslashes()

```php
// ERRADO - addslashes NÃO é suficiente
$safe = addslashes($_GET['input']);

// CORRETO - usar consultas parametrizadas ou escapamento adequado
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Erro 3: Confiando em IDs Numéricos

```php
// ERRADO - assumindo que a entrada é numérica
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// CORRETO - fazer casting explícito para inteiro
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Erro 4: Injeção de Segunda Ordem

```php
// Dados do banco de dados NÃO são automaticamente seguros
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// ERRADO - confiando em dados do banco de dados
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// CORRETO - sempre usar parâmetros
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## Testes de Segurança

### Teste Suas Consultas

Teste seus formulários com essas entradas para verificar injeção de SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Se alguma dessas causar comportamento ou erros inesperados, você tem uma vulnerabilidade.

### Testes Automatizados

Use ferramentas de teste de injeção de SQL automatizadas durante o desenvolvimento:

- SQLMap
- Burp Suite
- OWASP ZAP

## Resumo de Boas Práticas

1. **Sempre usar consultas parametrizadas** (prepared statements)
2. **Usar XoopsObject/XoopsObjectHandler** quando possível
3. **Usar classes Criteria** para construir consultas
4. **Lista branca de valores permitidos** para nomes de coluna e tabela
5. **Fazer casting de valores numéricos** explicitamente com `(int)` ou `(float)`
6. **Nunca expor erros de banco de dados** aos usuários
7. **Usar transações** para múltiplas consultas relacionadas
8. **Testar injeção de SQL** durante o desenvolvimento
9. **Escapar curingas LIKE** em consultas de pesquisa
10. **Sanitizar valores da cláusula IN** individualmente

---

#security #sql-injection #database #xoops #prepared-statements #Criteria
