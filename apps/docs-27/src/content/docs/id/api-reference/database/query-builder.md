---
title: "XOOPS Pembuat Kueri"
description: "Pembuat kueri modern yang lancar API untuk membuat kueri SELECT, INSERT, UPDATE, DELETE dengan antarmuka yang dapat dirantai"
---

XOOPS Query Builder menyediakan antarmuka yang modern dan lancar untuk membuat kueri SQL. Ini membantu mencegah injeksi SQL, meningkatkan keterbacaan, dan menyediakan abstraksi database untuk beberapa sistem database.

## Arsitektur Pembuat Kueri

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

## Kelas QueryBuilder

Kelas pembuat kueri utama dengan antarmuka yang lancar.

### Ikhtisar Kelas

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

### Metode Statis

#### meja

Membuat pembuat kueri baru untuk tabel.

```php
public static function table(string $table): QueryBuilder
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$table` | tali | Nama tabel (dengan atau tanpa awalan) |

**Pengembalian:** `QueryBuilder` - Contoh pembuat kueri

**Contoh:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## PILIH Kueri

### pilih

Menentukan kolom yang akan dipilih.

```php
public function select(...$columns): self
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `...$columns` | susunan | Nama atau ekspresi kolom |

**Pengembalian:** `self` - Untuk rangkaian metode

**Contoh:**
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

### dimana

Menambahkan kondisi WHERE.

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$column` | tali | Nama kolom |
| `$operator` | tali | Operator perbandingan |
| `$value` | campuran | Nilai untuk membandingkan |

**Pengembalian:** `self` - Untuk rangkaian metode

**Operator:**

| Operator | Deskripsi | Contoh |
|----------|-------------|---------|
| `=` | Sama | `->where('status', '=', 'active')` |
| `!=` atau `<>` | Tidak sama | `->where('status', '!=', 'deleted')` |
| `>` | Lebih besar dari | `->where('price', '>', 100)` |
| `<` | Kurang dari | `->where('price', '<', 100)` |
| `>=` | Lebih besar atau sama | `->where('age', '>=', 18)` |
| `<=` | Kurang atau sama | `->where('age', '<=', 65)` |
| `LIKE` | Pencocokan pola | `->where('name', 'LIKE', '%john%')` |
| `IN` | Dalam daftar | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | Tidak ada dalam daftar | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | Rentang | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | Apakah nol | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | Bukan nol | `->where('deleted_at', 'IS NOT NULL')` |

**Contoh:**
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

### atau Dimana

Menambahkan kondisi OR.

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**Contoh:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### di manaDi/di manaTidakDi

Metode kenyamanan untuk IN/NOT IN.

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**Contoh:**
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

### di manaNull / di manaNotNull

Metode kemudahan untuk pemeriksaan NULL.

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**Contoh:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### di mana Antara

Memeriksa apakah nilai berada di antara dua nilai.

```php
public function whereBetween(string $column, array $values): self
```

**Contoh:**
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

### bergabung

Menambahkan INNER JOIN.

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**Contoh:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### kiriGabung / kananGabung

Jenis gabungan alternatif.

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

**Contoh:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### grupOleh

Kelompokkan hasil berdasarkan kolom.

```php
public function groupBy(...$columns): self
```

**Contoh:**
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

### memiliki

Menambahkan kondisi HAVING.

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**Contoh:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### dipesanOleh

Hasil pesanan.

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$column` | tali | Kolom untuk diurutkan berdasarkan |
| `$direction` | tali | `ASC` atau `DESC` |

**Contoh:**
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

### batas / offset

Batasi dan offset hasil.

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**Contoh:**
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

## Metode Eksekusi

### dapatkan

Menjalankan kueri dan mengembalikan semua hasil.

```php
public function get(): array
```

**Pengembalian:** `array` - Kumpulan baris hasil

**Contoh:**
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

### pertama

Mendapatkan hasil pertama.

```php
public function first(): ?array
```

**Pengembalian:** `?array` - Baris pertama atau nol

**Contoh:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### terakhir

Mendapatkan hasil terakhir.

```php
public function last(): ?array
```

**Contoh:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### hitungan

Mendapat hitungan hasil.

```php
public function count(): int
```

**Pengembalian:** `int` - Jumlah baris

**Contoh:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### ada

Memeriksa apakah kueri mengembalikan hasil apa pun.

```php
public function exists(): bool
```

**Pengembalian:** `bool` - Benar jika ada hasil**Contoh:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### agregat

Mendapat nilai agregat.

```php
public function aggregate(string $function, string $column): mixed
```

**Contoh:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```

## MASUKKAN Kueri

### masukkan

Menyisipkan satu baris.

```php
public function insert(array $values): bool
```

**Contoh:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### masukkanBanyak

Menyisipkan beberapa baris.

```php
public function insertMany(array $rows): bool
```

**Contoh:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## PERBARUI Pertanyaan

### pembaruan

Memperbarui baris.

```php
public function update(array $values): int
```

**Pengembalian:** `int` - Jumlah baris yang terpengaruh

**Contoh:**
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

### kenaikan/penurunan

Menambah atau mengurangi kolom.

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**Contoh:**
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

## HAPUS Pertanyaan

### hapus

Menghapus baris.

```php
public function delete(): int
```

**Pengembalian:** `int` - Jumlah baris yang dihapus

**Contoh:**
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

### terpotong

Menghapus semua baris dari tabel.

```php
public function truncate(): bool
```

**Contoh:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## Fitur Lanjutan

### Ekspresi Mentah

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### Subkueri

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

### Mendapatkan SQL

```php
public function toSql(): string
```

**Contoh:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## Contoh Lengkap

### Pilih Kompleks dengan Gabungan

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

### Paginasi dengan QueryBuilder

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

### Analisis Data dengan Agregat

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

## Praktik Terbaik

1. **Gunakan Kueri Parameterisasi** - QueryBuilder menangani pengikatan parameter secara otomatis
2. **Metode Rantai** - Manfaatkan antarmuka yang lancar untuk kode yang dapat dibaca
3. **Uji Output SQL** - Gunakan `toSql()` untuk memverifikasi kueri yang dihasilkan
4. **Gunakan Indeks** - Pastikan kolom yang sering ditanyakan diindeks
5. **Batasi Hasil** - Selalu gunakan `limit()` untuk kumpulan data besar
6. **Gunakan Agregat** - Biarkan database melakukan counting/summing, bukan PHP
7. **Escape Output** - Selalu keluar dari data yang ditampilkan dengan `htmlspecialchars()`
8. **Kinerja Indeks** - Pantau kueri yang lambat dan optimalkan

## Dokumentasi Terkait

- XoopsDatabase - Lapisan database dan koneksi
- Kriteria - Sistem kueri berbasis Kriteria Warisan
- ../Core/XoopsObject - Persistensi objek data
- ../Module/Module-System - Operasi basis data module

---

*Lihat juga: [Basis Data XOOPS API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*
