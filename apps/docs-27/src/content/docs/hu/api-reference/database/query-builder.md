---
title: "XOOPS Query Builder"
description: "Modern gördülékeny lekérdezéskészítő API SELECT, INSERT, UPDATE és DELETE lekérdezések készítéséhez láncolható felülettel"
---
A XOOPS Query Builder modern, gördülékeny felületet biztosít a SQL lekérdezések készítéséhez. Segít megelőzni a SQL injekciót, javítja az olvashatóságot, és adatbázis-absztrakciót biztosít több adatbázisrendszer számára.

## Query Builder architektúra

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

## QueryBuilder osztály

A fő lekérdezéskészítő osztály gördülékeny felülettel.

### Osztály áttekintése

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

### Statikus módszerek

#### táblázat

Új lekérdezéskészítőt hoz létre egy táblához.

```php
public static function table(string $table): QueryBuilder
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$table` | húr | A táblázat neve (előtaggal vagy anélkül) |

**Vissza:** `QueryBuilder` – Lekérdezéskészítő példány

**Példa:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## SELECT Lekérdezések

### válassza ki

Meghatározza a kiválasztandó oszlopokat.

```php
public function select(...$columns): self
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `...$columns` | tömb | Oszlopnevek vagy kifejezések |

**Visszaküldés:** `self` - Metódusláncoláshoz

**Példa:**
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

### hol

Hozzáad egy WHERE feltételt.

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$column` | húr | Oszlop neve |
| `$operator` | húr | Összehasonlító operátor |
| `$value` | vegyes | Összehasonlítandó érték |

**Visszaküldés:** `self` - Metódusláncoláshoz

**Üzemeltetők:**

| Üzemeltető | Leírás | Példa |
|----------|-------------|---------|
| `=` | Egyenlő | `->where('status', '=', 'active')` |
| `!=` vagy `<>` | Nem egyenlő | `->where('status', '!=', 'deleted')` |
| `>` | Nagyobb mint | `->where('price', '>', 100)` |
| `<` | Kevesebb, mint | `->where('price', '<', 100)` |
| `>=` | Nagyobb vagy egyenlő | `->where('age', '>=', 18)` |
| `<=` | Kisebb vagy egyenlő | `->where('age', '<=', 65)` |
| `LIKE` | Minta egyezés | `->where('name', 'LIKE', '%john%')` |
| `IN` | A listában | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Nincs a listán | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Tartomány | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | nulla | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Nem null | `->where('deleted_at', 'IS NOT NULL')` |

**Példa:**
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

### vagyHol

VAGY feltételt ad hozzá.

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**Példa:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### whereIn / whereNotIn

Kényelmes módszerek a IN/NOT IN-hez.

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**Példa:**
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

Kényelmes módszerek a NULL ellenőrzésekhez.

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**Példa:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### whereBetween

Ellenőrzi, hogy az érték két érték között van-e.

```php
public function whereBetween(string $column, array $values): self
```

**Példa:**
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

### csatlakozz

Hozzáad egy INNER JOIN.

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Példa:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### leftCsatlakozás / jobbCsatlakozás

Alternatív csatlakozási típusok.

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

**Példa:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### groupBy

Az eredményeket oszlop(ok) szerint csoportosítja.

```php
public function groupBy(...$columns): self
```

**Példa:**
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

### birtoklás

Hozzáad egy HAVING feltételt.

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**Példa:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### Rendelés szerint

Rendelési eredmények.

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$column` | húr | Oszlop sorrendben |
| `$direction` | húr | `ASC` vagy `DESC` |

**Példa:**
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

Korlátozza és ellensúlyozza az eredményeket.

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**Példa:**
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

## Végrehajtási módszerek

### kap

Végrehajtja a lekérdezést, és visszaadja az összes eredményt.

```php
public function get(): array
```

**Visszaküldés:** `array` - Eredménysorok tömbje

**Példa:**
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

### először

Megszerzi az első eredményt.

```php
public function first(): ?array
```

**Visszaküldés:** `?array` - Első sor vagy nulla

**Példa:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### utolsó

Megkapja az utolsó eredményt.

```php
public function last(): ?array
```

**Példa:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### szám

Lekéri az eredmények számát.

```php
public function count(): int
```

**Visszaküldés:** `int` - Sorok száma

**Példa:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### létezik

Ellenőrzi, hogy a lekérdezés ad-e eredményt.

```php
public function exists(): bool
```

**Vissza:** `bool` - Igaz, ha vannak eredmények

**Példa:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### összesített

Összesített értékeket kap.

```php
public function aggregate(string $function, string $column): mixed
```

**Példa:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```
## INSERT Lekérdezések

### beszúrás

Beszúr egy sort.

```php
public function insert(array $values): bool
```

**Példa:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### insertMany

Több sort szúr be.

```php
public function insertMany(array $rows): bool
```

**Példa:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## UPDATE Lekérdezések

### frissítés

Frissíti a sorokat.

```php
public function update(array $values): int
```

**Visszaküldés:** `int` - Az érintett sorok száma

**Példa:**
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

### növelés/csökkentés

Növeli vagy csökkenti az oszlopot.

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**Példa:**
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

## DELETE Lekérdezések

### törlés

Törli a sorokat.

```php
public function delete(): int
```

**Visszaküldés:** `int` - Törölt sorok száma

**Példa:**
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

### csonka

Törli az összes sort a táblázatból.

```php
public function truncate(): bool
```

**Példa:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## Speciális funkciók

### Nyers kifejezések

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### Allekérdezések

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

### A SQL beszerzése

```php
public function toSql(): string
```

**Példa:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## Teljes példák

### Összetett kiválasztás csatlakozásokkal

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

### Lapozás a QueryBuilder segítségével

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

### Adatelemzés aggregátumokkal

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

## Bevált gyakorlatok

1. **Paraméteres lekérdezések használata** – A QueryBuilder automatikusan kezeli a paraméter-összerendelést
2. **Láncmódszerek** - Használja ki a folyékony interfészt az olvasható kódhoz
3. **A SQL kimenet tesztelése** – A `toSql()` segítségével ellenőrizze a generált lekérdezéseket
4. **Használjon indexeket** – Győződjön meg arról, hogy a gyakran lekérdezett oszlopok indexelve vannak
5. **Eredmények korlátozása** – Mindig használja a `limit()`-t nagy adatkészletekhez
6. **Aggregátumok használata** – Hagyja, hogy az adatbázis counting/summing helyett PHP
7. **Kilépési kimenet** – Mindig meneküljön ki a megjelenített adatokból a `htmlspecialchars()` segítségével
8. **Index teljesítménye** - Figyelje a lassú lekérdezéseket, és ennek megfelelően optimalizálja

## Kapcsolódó dokumentáció

- XOOPSDatabase - Adatbázis réteg és kapcsolatok
- Feltételek - Örökös Kritérium alapú lekérdező rendszer
- ../Core/XOOPSObject - Adatobjektum fennmaradása
- ../module/module-System - modul adatbázis-műveletek

---

*Lásd még: [XOOPS adatbázis API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class)*
