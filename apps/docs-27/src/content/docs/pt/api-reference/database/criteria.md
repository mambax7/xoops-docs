---
title: "Classes Criteria e CriteriaCompo"
description: "Construção de consultas e filtragem avançada usando classes Criteria"
---

As classes `Criteria` e `CriteriaCompo` fornecem uma interface fluente orientada a objetos para construir consultas de banco de dados complexas. Essas classes abstraem cláusulas SQL WHERE, permitindo que os desenvolvedores construam consultas dinâmicas de forma segura e legível.

## Visão Geral da Classe

### Classe Criteria

A classe `Criteria` representa uma condição única em uma cláusula WHERE:

```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```

## Uso Básico

### Criteria Simples

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Condição única
$criteria = new Criteria('status', 'active');
// Renderiza: `status` = 'active'
```

### Diferentes Operadores

```php
// Igualdade (padrão)
$criteria = new Criteria('status', 'active', '=');

// Não igual
$criteria = new Criteria('status', 'active', '<>');

// Maior que
$criteria = new Criteria('age', 18, '>');

// Menor ou igual
$criteria = new Criteria('age', 65, '<=');

// LIKE (para correspondência de padrão)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (para múltiplos valores)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Construindo Consultas Complexas

### Lógica AND (Padrão)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renderiza: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### Lógica OR

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integração com Padrão Repository

### Exemplo de Repository

```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```

## Segurança e Proteção

### Escaping Automático

A classe `Criteria` escapa automaticamente de valores para prevenir injeção de SQL:

```php
// Seguro - o valor é escapado automaticamente
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Renderiza com segurança: `username` = '\''; DROP TABLE users; --'
```

## Referência da API

### Métodos de Criteria

| Método | Descrição | Retorna |
|--------|-------------|---------|
| `__construct()` | Inicializar uma condição criteria | void |
| `render($prefix = '')` | Renderizar para segmento de cláusula WHERE de SQL | string |
| `getColumn()` | Obter o nome da coluna | string |
| `getValue()` | Obter o valor de comparação | mixed |
| `getOperator()` | Obter o operador de comparação | string |

### Métodos de CriteriaCompo

| Método | Descrição | Retorna |
|--------|-------------|---------|
| `__construct($logic = 'AND')` | Inicializar criteria composita | void |
| `add($criteria, $logic = null)` | Adicionar criteria ou composita aninhada | void |
| `render($prefix = '')` | Renderizar para cláusula WHERE completa | string |
| `count()` | Obter número de criteria | int |
| `clear()` | Remover todas as criteria | void |

## Documentação Relacionada

- XoopsDatabase - Referência de classe de banco de dados
- ../../03-Module-Development/Patterns/Repository-Pattern - Padrão Repository em XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Padrão Service Layer

## Informações de Versão

- **Introduzido:** XOOPS 2.5.0
- **Última Atualização:** XOOPS 4.0
- **Compatibilidade:** PHP 7.4+
