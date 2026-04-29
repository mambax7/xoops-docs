---
title: "XOOPS Query Builder"
description: "Moderní plynulý tvůrce dotazů API pro vytváření dotazů SELECT, INSERT, UPDATE, DELETE s řetězitelným rozhraním"
---

XOOPS Query Builder poskytuje moderní, plynulé rozhraní pro vytváření dotazů SQL. Pomáhá předcházet vkládání SQL, zlepšuje čitelnost a poskytuje abstrakci databáze pro více databázových systémů.

## Architektura Query Builder

```mermaid
graph TD
    A[QueryBuilder] -->|builds| B[SELECT Queries]
    A -->|builds| C[INSERT Queries]
    A -->|builds| D[UPDATE Queries]
    A -->|builds| E[DELETE Queries]

    F[Table] -->|chains| G[select]
    F -->|chains| H[where]
    F -->|chains| I[orderBy]
    F -->|chains| J[limit]

    G -->|chains| K[join]
    G -->|chains| H
    H -->|chains| I
    I -->|chains| J

    L[Execute Methods] -->|returns| M[Results]
    L -->|returns| N[Count]
    L -->|returns| O[First/Last]
```

## Třída QueryBuilder

Hlavní třída pro tvorbu dotazů s plynulým rozhraním.

### Přehled třídy

```php
namespace XOOPS\Database;

class QueryBuilder
{
    protected string $table = '';
    protected string $type = 'SELECT';
    protected array $selects = [];
    protected array $joins = [];
    protected array $wheres = [];
    protected array $orders = [];
    protected int $limit = 0;
    protected int $offset = 0;
    protected array $bindings = [];
}
```

### Statické metody

#### stůl

Vytvoří nový tvůrce dotazů pro tabulku.

```php
public static function table(string $table): QueryBuilder
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$table` | řetězec | Název tabulky (s prefixem nebo bez něj) |

**Vrátí:** `QueryBuilder` – Instance tvůrce dotazů

**Příklad:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## Dotazy SELECT

### vybrat

Určuje sloupce k výběru.

```php
public function select(...$columns): self
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `...$columns` | pole | Názvy sloupců nebo výrazy |

**Vrátí:** `self` – Pro řetězení metod

**Příklad:**
```php
// Simple select
QueryBuilder::table('users')
    ->select('id', 'username', 'email')
    ->get();

// Select with aliases
QueryBuilder::table('users')
    ->select('id as user_id', 'username as name')
    ->get();

// Select all columns
QueryBuilder::table('users')
    ->select('*')
    ->get();

// Select with expressions
QueryBuilder::table('orders')
    ->select('id', 'COUNT(*) as total_items')
    ->groupBy('id')
    ->get();
```

### kde

Přidá podmínku WHERE.

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$column` | řetězec | Název sloupce |
| `$operator` | řetězec | Srovnávací operátor |
| `$value` | smíšené | Hodnota k porovnání |

**Vrátí:** `self` - Pro řetězení metod

**Operátoři:**

| Provozovatel | Popis | Příklad |
|----------|-------------|---------|
| `=` | Rovné | `->where('status', '=', 'active')` |
| `!=` nebo `<>` | Nerovná se | `->where('status', '!=', 'deleted')` |
| `>` | Větší než | `->where('price', '>', 100)` |
| `<` | Méně než | `->where('price', '<', 100)` |
| `>=` | Větší nebo rovno | `->where('age', '>=', 18)` |
| `<=` | Menší nebo rovno | `->where('age', '<=', 65)` |
| `LIKE` | Shoda vzoru | `->where('name', 'LIKE', '%john%')` |
| `IN` | V seznamu | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Není v seznamu | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Rozsah | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Je null | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Není null | `->where('deleted_at', 'IS NOT NULL')` |

**Příklad:**
```php
// Single condition
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->get();

// Multiple conditions (AND)
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->where('age', '>=', 18)
    ->get();

// IN operator
QueryBuilder::table('products')
    ->select('*')
    ->where('category_id', 'IN', [1, 2, 3])
    ->get();

// LIKE operator
QueryBuilder::table('users')
    ->select('*')
    ->where('email', 'LIKE', '%@example.com')
    ->get();

// NULL check
QueryBuilder::table('users')
    ->select('*')
    ->where('deleted_at', 'IS NULL')
    ->get();
```

### nebo kde

Přidá podmínku OR.

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**Příklad:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### whereIn / whereNotIn

Pohodlné metody pro IN/NOT IN.

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**Příklad:**
```php
QueryBuilder::table('posts')
    ->select('*')
    ->whereIn('status', ['published', 'scheduled'])
    ->get();

QueryBuilder::table('comments')
    ->select('*')
    ->whereNotIn('spam_score', [8, 9, 10])
    ->get();
```

### whereNull / whereNotNull

Pohodlné metody pro kontroly NULL.

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**Příklad:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### kde Mezi

Zkontroluje, zda je hodnota mezi dvěma hodnotami.

```php
public function whereBetween(string $column, array $values): self
```

**Příklad:**
```php
QueryBuilder::table('products')
    ->select('*')
    ->whereBetween('price', [10, 100])
    ->get();

QueryBuilder::table('orders')
    ->select('*')
    ->whereBetween('created_at', ['2024-01-01', '2024-12-31'])
    ->get();
```

### připojte se

Přidá INNER JOIN.

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Příklad:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### vlevoPřipojit se / vpravoPřipojit se

Alternativní typy spojení.

```php
public function leftJoin(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self

public function rightJoin(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Příklad:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### groupBy

Seskupí výsledky podle sloupců.

```php
public function groupBy(...$columns): self
```

**Příklad:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count', 'SUM(total) as total_spent')
    ->groupBy('user_id')
    ->get();

QueryBuilder::table('sales')
    ->select('department', 'region', 'SUM(amount) as total')
    ->groupBy('department', 'region')
    ->get();
```

### mít

Přidá podmínku HAVING.

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**Příklad:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### objednávkaBy

Výsledky objednávek.

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$column` | řetězec | Sloupec na objednávku podle |
| `$direction` | řetězec | `ASC` nebo `DESC` |

**Příklad:**
```php
// Single order
QueryBuilder::table('users')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->get();

// Multiple orders
QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('category_id', 'ASC')
    ->orderBy('created_at', 'DESC')
    ->get();

// Random order
QueryBuilder::table('quotes')
    ->select('*')
    ->orderBy('RAND()')
    ->get();
```

### limit / offset

Omezuje a kompenzuje výsledky.

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**Příklad:**
```php
// Simple limit
QueryBuilder::table('posts')
    ->select('*')
    ->limit(10)
    ->get();

// Pagination
$page = 2;
$perPage = 20;
$offset = ($page - 1) * $perPage;

QueryBuilder::table('posts')
    ->select('*')
    ->limit($perPage)
    ->offset($offset)
    ->get();
```

## Způsoby provedení

### získat

Provede dotaz a vrátí všechny výsledky.

```php
public function get(): array
```

**Vrátí:** `array` - Pole řádků výsledků

**Příklad:**
```php
$users = QueryBuilder::table('users')
    ->select('id', 'username', 'email')
    ->where('status', '=', 'active')
    ->orderBy('username')
    ->get();

foreach ($users as $user) {
    echo $user['username'] . ' (' . $user['email'] . ')' . "\n";
}
```

### první

Získá první výsledek.

```php
public function first(): ?array
```

**Vrátí:** `?array` - První řádek nebo null

**Příklad:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### poslední

Získá poslední výsledek.

```php
public function last(): ?array
```

**Příklad:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### počítat

Získá počet výsledků.

```php
public function count(): int
```

**Vrátí:** `int` - Počet řádků

**Příklad:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### existuje

Zkontroluje, zda dotaz vrací nějaké výsledky.

```php
public function exists(): bool
```

**Vrátí:** `bool` - True, pokud existují výsledky

**Příklad:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### agregát

Získá agregované hodnoty.

```php
public function aggregate(string $function, string $column): mixed
```

**Příklad:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```

## Dotazy INSERT

### vložit

Vloží řádek.

```php
public function insert(array $values): bool
```

**Příklad:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### vložteMnoho

Vloží více řádků.

```php
public function insertMany(array $rows): bool
```

**Příklad:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## Dotazy UPDATE

### aktualizace

Aktualizuje řádky.

```php
public function update(array $values): int
```

**Vrátí:** `int` – Počet ovlivněných řádků

**Příklad:**
```php
// Update single user
QueryBuilder::table('users')
    ->where('id', '=', 123)
    ->update([
        'email' => 'newemail@example.com',
        'updated_at' => date('Y-m-d H:i:s')
    ]);

// Update multiple rows
QueryBuilder::table('posts')
    ->where('status', '=', 'draft')
    ->where('created_at', '<', date('Y-m-d', strtotime('-30 days')))
    ->update([
        'status' => 'archived'
    ]);
```

### zvýšení / sníženíZvyšuje nebo snižuje sloupec.

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**Příklad:**
```php
// Increment view count
QueryBuilder::table('posts')
    ->where('id', '=', 123)
    ->increment('views');

// Decrement stock
QueryBuilder::table('products')
    ->where('id', '=', 456)
    ->decrement('stock', 5);
```

## Dotazy DELETE

### smazat

Vymaže řádky.

```php
public function delete(): int
```

**Vrátí:** `int` - Počet smazaných řádků

**Příklad:**
```php
// Delete single record
QueryBuilder::table('comments')
    ->where('id', '=', 789)
    ->delete();

// Delete multiple records
QueryBuilder::table('log_entries')
    ->where('created_at', '<', date('Y-m-d', strtotime('-30 days')))
    ->delete();
```

### zkrátit

Odstraní všechny řádky z tabulky.

```php
public function truncate(): bool
```

**Příklad:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## Pokročilé funkce

### Syrové výrazy

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### Dílčí dotazy

```php
$recentPostIds = QueryBuilder::table('posts')
    ->select('id')
    ->where('created_at', '>', date('Y-m-d', strtotime('-7 days')))
    ->toSQL();

$comments = QueryBuilder::table('comments')
    ->select('*')
    ->whereIn('post_id', $recentPostIds)
    ->get();
```

### Získání SQL

```php
public function toSQL(): string
```

**Příklad:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSQL();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## Kompletní příklady

### Komplexní výběr se spojeními

```php
<?php
/**
 * Get posts with author and category info
 */

$posts = QueryBuilder::table('posts')
    ->select(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'users.username as author',
        'categories.name as category'
    )
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->orderBy('posts.created_at', 'DESC')
    ->limit(10)
    ->get();

foreach ($posts as $post) {
    echo '<article>';
    echo '<h2>' . htmlspecialchars($post['title']) . '</h2>';
    echo '<p class="meta">By ' . htmlspecialchars($post['author']) . ' in ' . htmlspecialchars($post['category']) . '</p>';
    echo '<p>' . htmlspecialchars($post['content']) . '</p>';
    echo '</article>';
}
```

### Stránkování pomocí QueryBuilderu

```php
<?php
/**
 * Paginated results
 */

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Get total count
$total = QueryBuilder::table('articles')
    ->where('status', '=', 'published')
    ->count();

// Get page results
$articles = QueryBuilder::table('articles')
    ->select('*')
    ->where('status', '=', 'published')
    ->orderBy('created_at', 'DESC')
    ->limit($perPage)
    ->offset($offset)
    ->get();

// Calculate pagination
$pages = ceil($total / $perPage);

// Display results
foreach ($articles as $article) {
    echo '<div class="article">' . htmlspecialchars($article['title']) . '</div>';
}

// Display pagination links
if ($pages > 1) {
    echo '<nav class="pagination">';
    for ($i = 1; $i <= $pages; $i++) {
        if ($i == $page) {
            echo '<span class="current">' . $i . '</span>';
        } else {
            echo '<a href="?page=' . $i . '">' . $i . '</a>';
        }
    }
    echo '</nav>';
}
```

### Analýza dat s agregáty

```php
<?php
/**
 * Sales analysis
 */

// Total sales by region
$regionSales = QueryBuilder::table('orders')
    ->select('region', QueryBuilder::raw('SUM(total) as total_sales'), QueryBuilder::raw('COUNT(*) as order_count'))
    ->groupBy('region')
    ->orderBy('total_sales', 'DESC')
    ->get();

foreach ($regionSales as $region) {
    echo $region['region'] . ': $' . number_format($region['total_sales'], 2) . ' (' . $region['order_count'] . ' orders)' . "\n";
}

// Average order value
$avgOrderValue = QueryBuilder::table('orders')
    ->aggregate('AVG', 'total');

echo 'Average order value: $' . number_format($avgOrderValue, 2);
```

## Nejlepší postupy

1. **Použít parametrizované dotazy** – QueryBuilder zpracovává vazbu parametrů automaticky
2. **Chain Methods** – Využití plynulého rozhraní pro čitelný kód
3. **Otestujte výstup SQL** – Použijte `toSQL()` k ověření generovaných dotazů
4. **Používejte indexy** – Zajistěte, aby byly často dotazované sloupce indexovány
5. **Omezit výsledky** – Pro velké datové sady vždy používejte `limit()`
6. **Použijte agregáty** – Nechte databázi dělat counting/summing místo PHP
7. **Escape Output** – Vždy unikne zobrazená data pomocí `htmlspecialchars()`
8. **Výkon indexu** – Monitorujte pomalé dotazy a podle toho optimalizujte

## Související dokumentace

- XOOPSDatabase - Databázová vrstva a připojení
- Kritéria - Starší systém dotazů založený na kritériích
- ../Core/XOOPSObject - Trvalost datových objektů
- ../Module/Module-System - Operace s databází modulu

---

*Viz také: [XOOPS Database API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class)*