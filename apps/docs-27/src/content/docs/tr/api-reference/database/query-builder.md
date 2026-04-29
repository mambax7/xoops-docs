---
title: "XOOPS Sorgu Oluşturucu"
description: "Zincirlenebilir bir arayüzle SELECT, INSERT, UPDATE, DELETE sorguları oluşturmak için modern akıcı sorgu oluşturucu API"
---
XOOPS Sorgu Oluşturucu, SQL sorguları oluşturmak için modern, akıcı bir arayüz sağlar. SQL enjeksiyonunun önlenmesine yardımcı olur, okunabilirliği artırır ve birden fazla database sistemi için database soyutlaması sağlar.

## Sorgu Oluşturucu Mimarisi
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
## QueryBuilder Sınıfı

Akıcı arayüze sahip ana sorgu oluşturucu sınıfı.

### Sınıfa Genel Bakış
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
### Statik Yöntemler

#### tablo

Bir tablo için yeni bir sorgu oluşturucu oluşturur.
```php
public static function table(string $table): QueryBuilder
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$table` | dize | Tablo adı (önekli veya öneksiz) |

**Döndürür:** `QueryBuilder` - Sorgu oluşturucu örneği

**Örnek:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```
## SELECT Sorgular

### seç

Seçilecek sütunları belirtir.
```php
public function select(...$columns): self
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `...$columns` | dizi | Sütun adları veya ifadeleri |

**Döndürür:** `self` - Yöntem zincirleme için

**Örnek:**
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
### nerede

Bir WHERE koşulu ekler.
```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$column` | dize | Sütun adı |
| `$operator` | dize | Karşılaştırma operatörü |
| `$value` | karışık | Karşılaştırılacak değer |

**Döndürür:** `self` - Yöntem zincirleme için

**Operatörler:**

| Operatör | Açıklama | Örnek |
|----------|----------------|-----------|
| `=` | Eşit | `->where('status', '=', 'active')` |
| `!=` veya `<>` | Eşit değil | `->where('status', '!=', 'deleted')` |
| `>` | Şundan büyük: | `->where('price', '>', 100)` |
| `<` | |'dan az | `->where('price', '<', 100)` |
| `>=` | Büyük veya eşit | `->where('age', '>=', 18)` |
| `<=` | Daha az veya eşit | `->where('age', '<=', 65)` |
| `LIKE` | Desen uyumu | `->where('name', 'LIKE', '%john%')` |
| `IN` | Listede | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Listede yok | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Menzil | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Boş | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Boş değil | `->where('deleted_at', 'IS NOT NULL')` |

**Örnek:**
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
### veyaNerede

VEYA koşulu ekler.
```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```
**Örnek:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```
### neredeIn / neredeNotIn

IN/NOT IN için uygun yöntemler.
```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```
**Örnek:**
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
### WhereNull / WhereNotNull

NULL çekleri için uygun yöntemler.
```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```
**Örnek:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```
### neredeArasında

Değerin iki değer arasında olup olmadığını kontrol eder.
```php
public function whereBetween(string $column, array $values): self
```
**Örnek:**
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
### katıl

Bir INNER JOIN ekler.
```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```
**Örnek:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```
### leftKatıl / sağKatıl

Alternatif birleştirme türleri.
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
**Örnek:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```
### groupBy

Sonuçları sütunlara göre gruplandırır.
```php
public function groupBy(...$columns): self
```
**Örnek:**
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
### sahip olmak

Bir HAVING koşulu ekler.
```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```
**Örnek:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```
### orderBy

Sonuçları sipariş eder.
```php
public function orderBy(string $column, string $direction = 'ASC'): self
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$column` | dize | Sütun sipariş etme ölçütü |
| `$direction` | dize | `ASC` veya `DESC` |

**Örnek:**
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
### limit / ofset

Sonuçları sınırlar ve dengeler.
```php
public function limit(int $limit): self
public function offset(int $offset): self
```
**Örnek:**
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
## Yürütme Yöntemleri

### al

Sorguyu yürütür ve tüm sonuçları döndürür.
```php
public function get(): array
```
**Döndürür:** `array` - Sonuç satırlarının dizisi

**Örnek:**
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
### ilk

İlk sonucu alır.
```php
public function first(): ?array
```
**Döndürür:** `?array` - İlk satır veya boş

**Örnek:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```
### son

Son sonucu alır.
```php
public function last(): ?array
```
**Örnek:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```
### sayısı

Sonuçların sayısını alır.
```php
public function count(): int
```
**Döndürür:** `int` - Satır sayısı

**Örnek:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```
### mevcut

Sorgunun herhangi bir sonuç döndürüp döndürmediğini kontrol eder.
```php
public function exists(): bool
```
**Döndürür:** `bool` - Sonuçlar mevcutsa doğru

**Örnek:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```
### toplam

Toplam değerleri alır.
```php
public function aggregate(string $function, string $column): mixed
```
**Örnek:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```
## INSERT Sorgular

### ekle

Bir satır ekler.
```php
public function insert(array $values): bool
```
**Örnek:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```
### insertMany

Birden çok satır ekler.
```php
public function insertMany(array $rows): bool
```
**Örnek:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```
## UPDATE Sorgular

### güncelleme

Satırları günceller.
```php
public function update(array $values): int
```
**Döndürür:** `int` - Etkilenen satır sayısı

**Örnek:**
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
### artırma / azaltma

Bir sütunu artırır veya azaltır.
```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```
**Örnek:**
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
## DELETE Sorgular

### sil

Satırları siler.
```php
public function delete(): int
```
**Döndürür:** `int` - Silinen satırların sayısı

**Örnek:**
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
### kısalt

Tablodaki tüm satırları siler.
```php
public function truncate(): bool
```
**Örnek:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```
## Gelişmiş Özellikler

### Ham İfadeler
```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```
### Alt sorgular
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
### SQL'yi alma
```php
public function toSql(): string
```
**Örnek:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```
## Tam Örnekler

### Birleşimlerle Karmaşık Seçim
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
### QueryBuilder ile sayfalandırma
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
### Toplamalarla Veri Analizi
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
## En İyi Uygulamalar

1. **Parametreli Sorguları Kullan** - QueryBuilder parametre bağlamayı otomatik olarak yönetir
2. **Zincir Yöntemleri** - Okunabilir kod için akıcı arayüzden yararlanın
3. **Test SQL Çıktısı** - Oluşturulan sorguları doğrulamak için `toSql()`'yi kullanın
4. **Dizinleri Kullan** - Sık sorgulanan sütunların dizine eklendiğinden emin olun
5. **Sonuçları Sınırla** - Büyük veri kümeleri için her zaman `limit()` kullanın
6. **Toplamları Kullan** - Veritabanının PHP yerine counting/summing yapmasını sağlayın
7. **Çıktıdan Kaçış** - Görüntülenen verilerden her zaman `htmlspecialchars()` ile çıkın
8. **Dizin Performansı** - Yavaş sorguları izleyin ve buna göre optimize edin

## İlgili Belgeler

- XoopsDatabase - database katmanı ve bağlantıları
- Kriterler - Eski Kriterlere dayalı sorgulama sistemi
- ../Core/XoopsObject - Veri nesnesi kalıcılığı
- ../Module/Module-System - module database işlemleri

---

*Ayrıca bakınız: [XOOPS database API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*