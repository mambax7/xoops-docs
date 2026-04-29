---
title: "XOOPS Querybouwer"
description: "Moderne vloeiende querybuilder API voor het bouwen van SELECT-, INSERT-, UPDATE-, DELETE-query's met een koppelbare interface"
---
De XOOPS Query Builder biedt een moderne, vloeiende interface voor het bouwen van SQL-query's. Het helpt injectie van SQL te voorkomen, verbetert de leesbaarheid en biedt databaseabstractie voor meerdere databasesystemen.

## Query Builder-architectuur

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

## QueryBuilder-klasse

De belangrijkste klasse voor het bouwen van query's met een vloeiende interface.

### Klassenoverzicht

```php
namespace Xoops\Database;

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

### Statische methoden

#### tabel

Creëert een nieuwe querybuilder voor een tabel.

```php
public static function table(string $table): QueryBuilder
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$table` | tekenreeks | Tabelnaam (met of zonder voorvoegsel) |

**Retourneert:** `QueryBuilder` - Instantie voor het maken van query's

**Voorbeeld:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## SELECT-query's

### selecteren

Specificeert de kolommen die moeten worden geselecteerd.

```php
public function select(...$columns): self
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `...$columns` | array | Kolomnamen of expressies |

**Retouren:** `self` - Voor het koppelen van methoden

**Voorbeeld:**
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

### waar

Voegt een voorwaarde WHERE toe.

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$column` | tekenreeks | Kolomnaam |
| `$operator` | tekenreeks | Vergelijkingsoperator |
| `$value` | gemengd | Waarde om te vergelijken |

**Retouren:** `self` - Voor het koppelen van methoden

**Exploitanten:**

| Exploitant | Beschrijving | Voorbeeld |
|----------|-------------|---------|
| `=` | Gelijke | `->where('status', '=', 'active')` |
| `!=` of `<>` | Niet gelijk | `->where('status', '!=', 'deleted')` |
| `>` | Groter dan | `->where('price', '>', 100)` |
| `<` | Minder dan | `->where('price', '<', 100)` |
| `>=` | Groter of gelijk | `->where('age', '>=', 18)` |
| `<=` | Minder of gelijk | `->where('age', '<=', 65)` |
| `LIKE` | Patroonovereenkomst | `->where('name', 'LIKE', '%john%')` |
| `IN` | In lijst | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Niet in lijst | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Bereik | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Is nul | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Niet nul | `->where('deleted_at', 'IS NOT NULL')` |

**Voorbeeld:**
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

### ofWaar

Voegt een OR-voorwaarde toe.

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**Voorbeeld:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### waarIn / waarNietIn

Gemaksmethoden voor IN/NOT IN.

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**Voorbeeld:**
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

### waarNull / waarNietNull

Gemaksmethoden voor NULL-controles.

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**Voorbeeld:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### waartussen

Controleert of de waarde tussen twee waarden ligt.

```php
public function whereBetween(string $column, array $values): self
```

**Voorbeeld:**
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

### meedoen

Voegt een INNER JOIN toe.

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Voorbeeld:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### leftJoin / rechtsJoin

Alternatieve join-typen.

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

**Voorbeeld:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### groepBy

Groepeert resultaten op kolom(men).

```php
public function groupBy(...$columns): self
```

**Voorbeeld:**
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

### hebben

Voegt een voorwaarde HAVING toe.

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**Voorbeeld:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### bestellenDoor

Resultaten bestellen.

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$column` | tekenreeks | Kolom om te ordenen op |
| `$direction` | tekenreeks | `ASC` of `DESC` |

**Voorbeeld:**
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

### limiet / offset

Beperkt en compenseert resultaten.

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**Voorbeeld:**
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

## Uitvoeringsmethoden

### krijgen

Voert de query uit en retourneert alle resultaten.

```php
public function get(): array
```

**Retouren:** `array` - Array met resultaatrijen

**Voorbeeld:**
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

### eerst

Krijgt het eerste resultaat.

```php
public function first(): ?array
```

**Retourneert:** `?array` - Eerste rij of nul

**Voorbeeld:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### laatste

Krijgt het laatste resultaat.

```php
public function last(): ?array
```

**Voorbeeld:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### tellen

Krijgt het aantal resultaten.

```php
public function count(): int
```

**Retouren:** `int` - Aantal rijen

**Voorbeeld:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### bestaat

Controleert of de zoekopdracht resultaten oplevert.

```php
public function exists(): bool
```

**Retourneert:** `bool` - Waar als er resultaten bestaan

**Voorbeeld:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### aggregaat

Haalt verzamelde waarden op.

```php
public function aggregate(string $function, string $column): mixed
```

**Voorbeeld:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```

## INSERT-query's

### invoegen

Voegt een rij in.
```php
public function insert(array $values): bool
```

**Voorbeeld:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### invoegenVeel

Voegt meerdere rijen in.

```php
public function insertMany(array $rows): bool
```

**Voorbeeld:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## UPDATE-query's

### bijwerken

Werkt rijen bij.

```php
public function update(array $values): int
```

**Retouren:** `int` - Aantal betrokken rijen

**Voorbeeld:**
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

### verhogen/verlagen

Verhoogt of verlaagt een kolom.

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**Voorbeeld:**
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

## DELETE-query's

### verwijderen

Verwijdert rijen.

```php
public function delete(): int
```

**Retourneert:** `int` - Aantal verwijderde rijen

**Voorbeeld:**
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

### afkappen

Verwijdert alle rijen uit de tabel.

```php
public function truncate(): bool
```

**Voorbeeld:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## Geavanceerde functies

### Ruwe expressies

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### Subquery's

```php
$recentPostIds = QueryBuilder::table('posts')
    ->select('id')
    ->where('created_at', '>', date('Y-m-d', strtotime('-7 days')))
    ->toSql();

$comments = QueryBuilder::table('comments')
    ->select('*')
    ->whereIn('post_id', $recentPostIds)
    ->get();
```

### De SQL verkrijgen

```php
public function toSql(): string
```

**Voorbeeld:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## Volledige voorbeelden

### Complexe selectie met joins

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

### Paginering met QueryBuilder

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

### Gegevensanalyse met aggregaten

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

## Beste praktijken

1. **Gebruik geparametriseerde query's** - QueryBuilder verwerkt parameterbinding automatisch
2. **Kettingmethoden** - Maak gebruik van een vloeiende interface voor leesbare code
3. **SQL-uitvoer testen** - Gebruik `toSql()` om gegenereerde query's te verifiëren
4. **Gebruik indexen** - Zorg ervoor dat veelgebruikte kolommen worden geïndexeerd
5. **Beperk resultaten** - Gebruik altijd `limit()` voor grote datasets
6. **Gebruik aggregaten** - Laat de database tellen/optellen in plaats van PHP
7. **Escape-uitvoer** - Ontsnap altijd weergegeven gegevens met `htmlspecialchars()`
8. **Indexprestaties** - Houd langzame zoekopdrachten in de gaten en optimaliseer dienovereenkomstig

## Gerelateerde documentatie

- XoopsDatabase - Databaselaag en verbindingen
- Criteria - Op verouderde criteria gebaseerd querysysteem
- ../Core/XoopsObject - Persistentie van gegevensobjecten
- ../Module/Module-System - Moduledatabasebewerkingen

---

*Zie ook: [XOOPS-database API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*