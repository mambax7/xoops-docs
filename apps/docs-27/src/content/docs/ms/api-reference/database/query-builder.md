---
title: "XOOPS Pembina Pertanyaan"
description: "API pembina pertanyaan fasih moden untuk membina pertanyaan SELECT, INSERT, UPDATE, DELETE dengan antara muka boleh rantai"
---
Pembina Pertanyaan XOOPS menyediakan antara muka moden yang lancar untuk membina pertanyaan SQL. Ia membantu menghalang suntikan SQL, meningkatkan kebolehbacaan dan menyediakan abstraksi pangkalan data untuk berbilang sistem pangkalan data.## Seni Bina Pembina Pertanyaan
```
mermaid
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
## Kelas QueryBuilderKelas pembina pertanyaan utama dengan antara muka yang lancar.### Gambaran Keseluruhan Kelas
```
php
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
### Kaedah Statik#### mejaMencipta pembina pertanyaan baharu untuk jadual.
```
php
public static function table(string $table): QueryBuilder
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$table` | rentetan | Nama jadual (dengan atau tanpa awalan) |**Pemulangan:** `QueryBuilder` - Contoh pembina pertanyaan**Contoh:**
```
php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```
## SELECT Pertanyaan### pilihMenentukan lajur untuk dipilih.
```
php
public function select(...$columns): self
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `...$columns` | tatasusunan | Nama lajur atau ungkapan |**Pemulangan:** `self` - Untuk rantaian kaedah**Contoh:**
```
php
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
### di manaMenambah keadaan WHERE.
```
php
public function where(string $column, string $operator = '=', mixed $value = null): self
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$column` | rentetan | Nama lajur |
| `$operator` | rentetan | Operator perbandingan |
| `$value` | bercampur | Nilai untuk dibandingkan |**Pemulangan:** `self` - Untuk rantaian kaedah**Pengusaha:**| Operator | Penerangan | Contoh |
|----------|-------------|---------|
| `=` | Sama | `->where('status', '=', 'active')` |
| `!=` atau `<>` | Tidak sama | `->where('status', '!=', 'deleted')` |
| `>` | Lebih besar daripada | `->where('price', '>', 100)` |
| `<` | Kurang daripada | `->where('price', '<', 100)` |
| `>=` | Lebih besar atau sama | `->where('age', '>=', 18)` |
| `<=` | Kurang atau sama | `->where('age', '<=', 65)` |
| `LIKE` | Padanan corak | `->where('name', 'LIKE', '%john%')` |
| `IN` | Dalam senarai | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Tiada dalam senarai | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Julat | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Adakah batal | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Bukan batal | `->where('deleted_at', 'IS NOT NULL')` |**Contoh:**
```
php
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
### atau Di manaMenambah syarat ATAU.
```
php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```
**Contoh:**
```
php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```
### whereIn / whereNotInKaedah mudah untuk IN/NOT IN.
```
php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```
**Contoh:**
```
php
QueryBuilder::table('posts')
    ->select('*')
    ->whereIn('status', ['published', 'scheduled'])
    ->get();

QueryBuilder::table('comments')
    ->select('*')
    ->whereNotIn('spam_score', [8, 9, 10])
    ->get();
```
### whereNull / whereNotNullKaedah mudah untuk pemeriksaan NULL.
```
php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```
**Contoh:**
```
php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```
### di mana AntaraMenyemak sama ada nilai berada di antara dua nilai.
```
php
public function whereBetween(string $column, array $values): self
```
**Contoh:**
```
php
QueryBuilder::table('products')
    ->select('*')
    ->whereBetween('price', [10, 100])
    ->get();

QueryBuilder::table('orders')
    ->select('*')
    ->whereBetween('created_at', ['2024-01-01', '2024-12-31'])
    ->get();
```
### sertaiMenambah INNER JOIN.
```
php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```
**Contoh:**
```
php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```
### kiriSertai / kananSertaiJenis gabungan alternatif.
```
php
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
**Contoh:**
```
php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```
### kumpulanOlehKumpulan keputusan mengikut lajur.
```
php
public function groupBy(...$columns): self
```
**Contoh:**
```
php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count', 'SUM(total) as total_spent')
    ->groupBy('user_id')
    ->get();

QueryBuilder::table('sales')
    ->select('department', 'region', 'SUM(amount) as total')
    ->groupBy('department', 'region')
    ->get();
```
### mempunyaiMenambah keadaan HAVING.
```
php
public function having(string $column, string $operator = '=', mixed $value = null): self
```
**Contoh:**
```
php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```
### pesananOlehHasil pesanan.
```
php
public function orderBy(string $column, string $direction = 'ASC'): self
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$column` | rentetan | Lajur untuk dipesan oleh |
| `$direction` | rentetan | `ASC` atau `DESC` |**Contoh:**
```
php
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
### had / offsetHad dan mengimbangi keputusan.
```
php
public function limit(int $limit): self
public function offset(int $offset): self
```
**Contoh:**
```
php
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
## Kaedah Pelaksanaan### dapatkanMelaksanakan pertanyaan dan mengembalikan semua hasil.
```
php
public function get(): array
```
**Pemulangan:** `array` - Tatasusunan baris hasil**Contoh:**
```
php
$users = QueryBuilder::table('users')
    ->select('id', 'username', 'email')
    ->where('status', '=', 'active')
    ->orderBy('username')
    ->get();

foreach ($users as $user) {
    echo $user['username'] . ' (' . $user['email'] . ')' . "\n";
}
```
### dahuluMendapat keputusan pertama.
```
php
public function first(): ?array
```
**Pemulangan:** `?array` - Baris pertama atau batal**Contoh:**
```
php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```
### terakhirMendapat keputusan terakhir.
```
php
public function last(): ?array
```
**Contoh:**
```
php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```
### kiraanMendapat kiraan keputusan.
```
php
public function count(): int
```
**Pemulangan:** `int` - Bilangan baris**Contoh:**
```
php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```
### wujudMenyemak sama ada pertanyaan mengembalikan sebarang hasil.
```
php
public function exists(): bool
```
**Pemulangan:** `bool` - Benar jika keputusan wujud**Contoh:**
```
php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```
### agregatMendapat nilai agregat.
```
php
public function aggregate(string $function, string $column): mixed
```
**Contoh:**
```
php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```
## INSERT Pertanyaan### masukkanSisipkan baris.
```
php
public function insert(array $values): bool
```
**Contoh:**
```
php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```
### masukkanBanyakMemasukkan berbilang baris.
```
php
public function insertMany(array $rows): bool
```
**Contoh:**
```
php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```
## UPDATE Pertanyaan### kemas kiniMengemas kini baris.
```
php
public function update(array $values): int
```
**Pemulangan:** `int` - Bilangan baris yang terjejas**Contoh:**
```
php
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
### kenaikan / penurunanPenambahan atau pengurangan lajur.
```
php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```
**Contoh:**
```
php
// Increment view count
QueryBuilder::table('posts')
    ->where('id', '=', 123)
    ->increment('views');

// Decrement stock
QueryBuilder::table('products')
    ->where('id', '=', 456)
    ->decrement('stock', 5);
```
## DELETE Pertanyaan### padamMemadam baris.
```
php
public function delete(): int
```
**Pemulangan:** `int` - Bilangan baris yang dipadamkan**Contoh:**
```
php
// Delete single record
QueryBuilder::table('comments')
    ->where('id', '=', 789)
    ->delete();

// Delete multiple records
QueryBuilder::table('log_entries')
    ->where('created_at', '<', date('Y-m-d', strtotime('-30 days')))
    ->delete();
```
### potongMemadam semua baris daripada jadual.
```
php
public function truncate(): bool
```
**Contoh:**
```
php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```
## Ciri Lanjutan### Ungkapan Mentah
```
php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```
### Subqueries
```
php
$recentPostIds = QueryBuilder::table('posts')
    ->select('id')
    ->where('created_at', '>', date('Y-m-d', strtotime('-7 days')))
    ->toSql();

$comments = QueryBuilder::table('comments')
    ->select('*')
    ->whereIn('post_id', $recentPostIds)
    ->get();
```
### Mendapatkan SQL
```
php
public function toSql(): string
```
**Contoh:**
```
php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```
## Contoh Lengkap### Pilih Kompleks dengan Gabungan
```
php
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
### Penomboran dengan QueryBuilder
```
php
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
### Analisis Data dengan Agregat
```
php
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
## Amalan Terbaik1. **Gunakan Pertanyaan Berparameter** - QueryBuilder mengendalikan pengikatan parameter secara automatik
2. **Kaedah Rantaian** - Manfaatkan antara muka yang fasih untuk kod yang boleh dibaca
3. **Uji Output SQL** - Gunakan `toSql()` untuk mengesahkan pertanyaan yang dijana
4. **Gunakan Indeks** - Pastikan lajur yang kerap ditanya diindeks
5. **Had Keputusan** - Sentiasa gunakan `limit()` untuk set data yang besar
6. **Gunakan Agregat** - Biarkan pangkalan data melakukan counting/summing dan bukannya PHP
7. **Escape Output** - Sentiasa melarikan data yang dipaparkan dengan `htmlspecialchars()`
8. **Prestasi Indeks** - Pantau pertanyaan perlahan dan optimumkan dengan sewajarnya## Dokumentasi Berkaitan- XoopsDatabase - Lapisan pangkalan data dan sambungan
- Kriteria - Sistem pertanyaan berasaskan Kriteria Warisan
- ../Core/XoopsObject - Kegigihan objek data
- ../Module/Module-System - Operasi pangkalan data modul---

*Lihat juga: [API Pangkalan Data XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*