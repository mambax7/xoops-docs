---
title: "XOOPS Query Builder"
description: "Moderne flydende forespørgselsbygger API til opbygning af SELECT, INSERT, UPDATE, DELETE forespørgsler med en kædebar grænseflade"
---

XOOPS Query Builder giver en moderne, flydende grænseflade til opbygning af SQL-forespørgsler. Det hjælper med at forhindre SQL-injektion, forbedrer læsbarheden og giver databaseabstraktion til flere databasesystemer.

## Forespørgselsbyggerarkitektur

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

## QueryBuilder klasse

Hovedforespørgselsbyggerklassen med flydende grænseflade.

### Klasseoversigt

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

### Statiske metoder

#### tabel

Opretter en ny forespørgselsbygger til en tabel.

```php
public static function table(string $table): QueryBuilder
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$table` | streng | Tabelnavn (med eller uden præfiks) |

**Returneringer:** `QueryBuilder` - Forespørgselsbyggerforekomst

**Eksempel:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## SELECT Forespørgsler

### vælg

Angiver kolonner, der skal vælges.

```php
public function select(...$columns): self
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `...$columns` | række | Kolonnenavne eller -udtryk |

**Returneringer:** `self` - Til metodekæde

**Eksempel:**
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

### hvor

Tilføjer en WHERE-tilstand.

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$column` | streng | Kolonnenavn |
| `$operator` | streng | Sammenligningsoperatør |
| `$value` | blandet | Værdi at sammenligne |

**Returneringer:** `self` - Til metodekæde

**Operatører:**

| Operatør | Beskrivelse | Eksempel |
|--------|-------------|--------|
| `=` | Lige | `->where('status', '=', 'active')` |
| `!=` eller `<>` | Ikke lige | `->where('status', '!=', 'deleted')` |
| `>` | Større end | `->where('price', '>', 100)` |
| `<` | Mindre end | `->where('price', '<', 100)` |
| `>=` | Større eller lig | `->where('age', '>=', 18)` |
| `<=` | Mindre eller lig | `->where('age', '<=', 65)` |
| `LIKE` | Mønster match | `->where('name', 'LIKE', '%john%')` |
| `IN` | På listen | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Ikke på listen | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Rækkevidde | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Er null | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Ikke null | `->where('deleted_at', 'IS NOT NULL')` |

**Eksempel:**
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

### eller Hvor

Tilføjer en OR-betingelse.

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**Eksempel:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### whereIn / whereNotIn

Praktiske metoder til IN/NOT IN.

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**Eksempel:**
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

Praktiske metoder til NULL-tjek.

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**Eksempel:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### whereBetween

Kontrollerer, om værdien er mellem to værdier.

```php
public function whereBetween(string $column, array $values): self
```

**Eksempel:**
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

### deltag

Tilføjer en INNER JOIN.

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Eksempel:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### leftJoin / rightJoin

Alternative sammenføjningstyper.

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

**Eksempel:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### gruppeAf

Grupperer resultater efter kolonne(r).

```php
public function groupBy(...$columns): self
```

**Eksempel:**
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

### have

Tilføjer en HAVING-tilstand.

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**Eksempel:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### bestil efter

Ordrer resultater.

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$column` | streng | Kolonne til bestilling efter |
| `$direction` | streng | `ASC` eller `DESC` |

**Eksempel:**
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

### grænse / offset

Begrænser og forskyder resultater.

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**Eksempel:**
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

## Udførelsesmetoder

### få

Udfører forespørgsel og returnerer alle resultater.

```php
public function get(): array
```

**Returneringer:** `array` - Array af resultatrækker

**Eksempel:**
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

### først

Får det første resultat.

```php
public function first(): ?array
```

**Returneringer:** `?array` - Første række eller null

**Eksempel:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### sidst

Får det sidste resultat.

```php
public function last(): ?array
```

**Eksempel:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### tæller

Får optællingen af resultater.

```php
public function count(): int
```

**Returneringer:** `int` - Antal rækker

**Eksempel:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### findes

Kontrollerer, om forespørgslen giver resultater.

```php
public function exists(): bool
```

**Returneringer:** `bool` - Sandt, hvis resultater findes

**Eksempel:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### samlet

Får samlede værdier.

```php
public function aggregate(string $function, string $column): mixed
```

**Eksempel:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```

## INSERT Forespørgsler### indsæt

Indsætter en række.

```php
public function insert(array $values): bool
```

**Eksempel:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### indsæt Mange

Indsætter flere rækker.

```php
public function insertMany(array $rows): bool
```

**Eksempel:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## UPDATE Forespørgsler

### opdatering

Opdaterer rækker.

```php
public function update(array $values): int
```

**Returneringer:** `int` - Antal berørte rækker

**Eksempel:**
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

### stigning/mindsk

Forøger eller formindsker en kolonne.

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**Eksempel:**
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

## DELETE Forespørgsler

### slet

Sletter rækker.

```php
public function delete(): int
```

**Returneringer:** `int` - Antal slettede rækker

**Eksempel:**
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

### afkorte

Sletter alle rækker fra tabellen.

```php
public function truncate(): bool
```

**Eksempel:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## Avancerede funktioner

### Rå udtryk

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### Underforespørgsler

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

### Henter SQL

```php
public function toSql(): string
```

**Eksempel:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## Fuldstændige eksempler

### Kompleks udvalg med sammenføjninger

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

### Sideinddeling med QueryBuilder

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

### Dataanalyse med aggregater

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

## Bedste praksis

1. **Brug parametriserede forespørgsler** - QueryBuilder håndterer parameterbinding automatisk
2. **Kædemetoder** - Udnyt flydende grænseflade til læsbar kode
3. **Test SQL output** - Brug `toSql()` til at bekræfte genererede forespørgsler
4. **Brug indekser** - Sørg for, at hyppigt forespurgte kolonner er indekseret
5. **Begræns resultater** - Brug altid `limit()` til store datasæt
6. **Brug aggregater** - Lad databasen tælle/summere i stedet for PHP
7. **Escape-output** - Undgå altid viste data med `htmlspecialchars()`
8. **Indeksydelse** - Overvåg langsomme forespørgsler og optimer derefter

## Relateret dokumentation

- XoopsDatabase - Databaselag og forbindelser
- Kriterier - Legacy Criteria-baseret forespørgselssystem
- ../Core/XoopsObject - Dataobjektpersistens
- ../Module/Module-System - Moduldatabaseoperationer

---

*Se også: [XOOPS Database API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*
