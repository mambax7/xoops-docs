---
title: "Operações de Banco de Dados"
---

## Visão Geral

O XOOPS fornece uma camada de abstração de banco de dados que suporta padrões legados procedurais e abordagens modernas orientadas a objetos. Este guia cobre operações de banco de dados comuns para desenvolvimento de módulo.

## Conexão de Banco de Dados

### Obtendo a Instância de Banco de Dados

```php
// Abordagem legada
global $xoopsDB;

// Abordagem moderna via factory
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via auxiliar XMF
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Operações Básicas

### Consultas SELECT

```php
// Consulta simples
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// Com parâmetros (abordagem segura)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Linha única
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### Operações INSERT

```php
// Insert básico
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Obter ID do último insert
$newId = $db->getInsertId();
```

### Operações UPDATE

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Verificar linhas afetadas
$affectedRows = $db->getAffectedRows();
```

### Operações DELETE

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Usando Criteria

O sistema Criteria fornece uma forma type-safe de construir consultas:

```php
use Criteria;
use CriteriaCompo;

// Criteria simples
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Criteria composta
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Operadores de Criteria

| Operador | Descrição |
|----------|-----------|
| `=` | Igual (padrão) |
| `!=` | Não igual |
| `<` | Menor que |
| `>` | Maior que |
| `<=` | Menor ou igual |
| `>=` | Maior ou igual |
| `LIKE` | Correspondência de padrão |
| `IN` | Em conjunto de valores |

```php
// Criteria LIKE
$criteria = new Criteria('title', '%search%', 'LIKE');

// Criteria IN
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Intervalo de data
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## Manipuladores de Objeto

### Métodos de Manipulador

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Criar novo objeto
$item = $handler->create();

// Obter por ID
$item = $handler->get($id);

// Obter múltiplos
$items = $handler->getObjects($criteria);

// Obter como matriz
$items = $handler->getAll($criteria);

// Contar
$count = $handler->getCount($criteria);

// Salvar
$success = $handler->insert($item);

// Deletar
$success = $handler->delete($item);
```

### Métodos de Manipulador Personalizado

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```

## Transações

```php
// Iniciar transação
$db->query('START TRANSACTION');

try {
    // Realizar múltiplas operações
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Confirmar se todos bem-sucedidos
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Reverter em erro
    $db->query('ROLLBACK');
    throw $e;
}
```

## Instruções Preparadas (Moderno)

```php
// Usando PDO através da camada de banco de dados do XOOPS
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Gerenciamento de Esquema

### Criando Tabelas

```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migrações

```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## Boas Práticas

1. **Sempre Quoted Strings** - Usar `$db->quoteString()` para entrada do usuário
2. **Usar Intval** - Converter inteiros com `intval()` ou declarações de tipo
3. **Preferir Manipuladores** - Usar manipuladores de objeto sobre SQL bruto quando possível
4. **Usar Criteria** - Construir consultas com Criteria para type safety
5. **Tratar Erros** - Verificar valores de retorno e tratar falhas
6. **Usar Transações** - Envolver operações relacionadas em transações

## Documentação Relacionada

- ../04-API-Reference/Kernel/Criteria - Construção de consulta com Criteria
- ../04-API-Reference/Core/XoopsObjectHandler - Padrão de manipulador
- ../02-Core-Concepts/Database/Database-Layer - Abstração de banco de dados
- Database/Database-Schema - Guia de design de esquema
