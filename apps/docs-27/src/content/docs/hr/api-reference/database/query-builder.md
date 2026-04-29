---
title: "XOOPS Alat za sastavljanje upita"
description: "Moderni tečni alat za izradu upita API za izradu SELECT, INSERT, UPDATE, DELETE upita s lančanim sučeljem"
---
XOOPS Query Builder pruža moderno, tečno sučelje za izradu SQL upita. Pomaže u sprječavanju ubacivanja SQL, poboljšava čitljivost i pruža apstrakciju baze podataka za više sustava baza podataka.

## Arhitektura Query Builder

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

## QueryBuilder klasa

Glavni alat za izradu upita class s tečnim sučeljem.

### Pregled razreda

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

### Statičke metode

#### stol

Stvara novi alat za sastavljanje upita za tablicu.

```php
public static function table(string $table): QueryBuilder
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$table` | niz | Naziv tablice (sa ili bez prefiksa) |

**Vraća:** `QueryBuilder` - Instanca alata za izradu upita

**Primjer:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## SELECT Upiti

### odaberite

Određuje stupce za odabir.

```php
public function select(...$columns): self
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `...$columns` | niz | Nazivi stupaca ili izrazi |

**Povratak:** `self` - Za ulančavanje metoda

**Primjer:**
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

### gdje

Dodaje uvjet WHERE.

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$column` | niz | Naziv stupca |
| `$operator` | niz | Operator usporedbe |
| `$value` | mješoviti | Vrijednost za usporedbu |

**Povratak:** `self` - Za ulančavanje metoda

**Operateri:**

| Operater | Opis | Primjer |
|----------|-------------|---------|
| `=` | Jednako | `->where('status', '=', 'active')` |
| `!=` ili `<>` | Nije jednako | `->where('status', '!=', 'deleted')` |
| `>` | Veći od | `->where('price', '>', 100)` |
| `<` | Manje od | `->where('price', '<', 100)` |
| `>=` | Veće ili jednako | `->where('age', '>=', 18)` |
| `<=` | Manje ili jednako | `->where('age', '<=', 65)` |
| `LIKE` | Podudaranje uzorka | `->where('name', 'LIKE', '%john%')` |
| `IN` | Na popisu | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Nije na popisu | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Raspon | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Je nula | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Nije null | `->where('deleted_at', 'IS NOT NULL')` |

**Primjer:**
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

### ili Gdje

Dodaje uvjet ILI.

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**Primjer:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### whereIn / whereNotIn

Prikladne metode za IN/NOT IN.

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**Primjer:**
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

Pogodne metode za NULL provjere.

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**Primjer:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### gdje Između

Provjerava je li vrijednost između dvije vrijednosti.

```php
public function whereBetween(string $column, array $values): self
```

**Primjer:**
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

### pridruži se

Dodaje INNER JOIN.

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Primjer:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### lijevoJoin / desnoJoin

Alternativni tipovi spajanja.

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

**Primjer:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### groupBy

Grupira rezultate po stupcima.

```php
public function groupBy(...$columns): self
```

**Primjer:**
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

### imati

Dodaje uvjet HAVING.

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**Primjer:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### orderBy

Rezultati narudžbi.

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**Parametri:**| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$column` | niz | Stupac za poredak prema |
| `$direction` | niz | `ASC` ili `DESC` |

**Primjer:**
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

### ograničenje / pomak

Ograničava i kompenzira rezultate.

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**Primjer:**
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

## Metode izvršenja

### dobiti

Izvršava upit i vraća sve rezultate.

```php
public function get(): array
```

**Vraća:** `array` - Niz redaka rezultata

**Primjer:**
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

### prvi

Dobiva prvi rezultat.

```php
public function first(): ?array
```

**Vraća:** `?array` - prvi red ili nula

**Primjer:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### posljednji

Dobiva posljednji rezultat.

```php
public function last(): ?array
```

**Primjer:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### brojati

Dobiva broj rezultata.

```php
public function count(): int
```

**Povratak:** `int` - Broj redaka

**Primjer:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### postoji

Provjerava daje li upit rezultate.

```php
public function exists(): bool
```

**Vraća:** `bool` - Istina ako rezultati postoje

**Primjer:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### agregat

Dobiva agregatne vrijednosti.

```php
public function aggregate(string $function, string $column): mixed
```

**Primjer:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```

## INSERT Upiti

### umetnite

Umeće redak.

```php
public function insert(array $values): bool
```

**Primjer:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### umetni mnogo

Umeće više redaka.

```php
public function insertMany(array $rows): bool
```

**Primjer:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## AŽURIRAJ Upiti

### ažuriranje

Ažurira retke.

```php
public function update(array $values): int
```

**Vraća:** `int` - Broj zahvaćenih redaka

**Primjer:**
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

### povećanje / smanjenje

Povećava ili smanjuje stupac.

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**Primjer:**
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

## IZBRIŠI upite

### izbriši

Briše retke.

```php
public function delete(): int
```

**Vraća:** `int` - Broj izbrisanih redaka

**Primjer:**
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

### skrati

Briše sve retke iz tablice.

```php
public function truncate(): bool
```

**Primjer:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## Napredne značajke

### Sirovi izrazi

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### Podupiti

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

### Dobivanje SQL

```php
public function toSql(): string
```

**Primjer:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## Potpuni primjeri

### Složeni odabir sa spojevima

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

### Paginacija s QueryBuilderom

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

### Analiza podataka s agregatima

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

## Najbolji primjeri iz prakse

1. **Koristite parametrizirane upite** - QueryBuilder automatski rukuje vezanjem parametara
2. **Lančane metode** - Iskoristite tečno sučelje za čitljiv kod
3. **Testirajte izlaz SQL** - Koristite `toSql()` za provjeru generiranih upita
4. **Koristite indekse** - Osigurajte da su stupci koji se često postavljaju upite indeksirani
5. **Ograničeni rezultati** - Uvijek koristite `limit()` za velike skupove podataka
6. **Koristite agregate** - Neka baza podataka radi brojanje/zbrajanje umjesto PHP
7. **Escape Output** - Uvijek izbjegni prikazane podatke pomoću `htmlspecialchars()`
8. **Izvedba indeksa** - Pratite spore upite i optimizirajte ih u skladu s tim

## Povezana dokumentacija

- XoopsDatabase - Sloj baze podataka i veze
- Kriteriji - naslijeđeni sustav upita temeljen na kriterijima
- ../Core/XoopsObject - Postojanost podatkovnog objekta
- ../Module/Module-System - Operacije baze podataka modula

---

*Vidi također: [XOOPS baza podataka API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*
