---
title: "Amalan Terbaik Pembangunan Modul"
---
## Gambaran KeseluruhanDokumen ini menyatukan amalan terbaik untuk membangunkan modul XOOPS berkualiti tinggi. Mengikuti garis panduan ini memastikan modul yang boleh diselenggara, selamat dan berprestasi.## Seni bina### Ikuti Seni Bina BersihSusun kod ke dalam lapisan:
```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```
### Tanggungjawab TunggalSetiap kelas harus mempunyai satu sebab untuk menukar:
```
php
// Good: Focused classes
class ArticleRepository { /* persistence only */ }
class ArticleValidator { /* validation only */ }
class ArticleNotifier { /* notifications only */ }

// Bad: God class
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```
### Suntikan KetergantunganSuntikan kebergantungan, jangan buatnya:
```
php
// Good
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Bad
public function __construct() {
    $this->repository = new ArticleRepository();
}
```
## Kualiti Kod### Jenis KeselamatanGunakan jenis dan pengisytiharan jenis yang ketat:
```
php
<?php

declare(strict_types=1);

final class ArticleService
{
    public function findById(int $id): ?Article
    {
        // ...
    }

    public function create(CreateArticleDTO $dto): Article
    {
        // ...
    }
}
```
### Pengendalian RalatGunakan pengecualian dengan sewajarnya:
```
php
// Throw specific exceptions
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Catch at appropriate level
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```
### Keselamatan NolElakkan null jika boleh:
```
php
// Use null object pattern
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Use Optional/Maybe pattern
public function findById(int $id): ?Article
{
    // Explicitly nullable return
}
```
## Pangkalan data### Gunakan Kriteria untuk Pertanyaan
```
php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```
### Keluarkan Input Pengguna
```
php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```
### Gunakan Transaksi
```
php
$db->query('START TRANSACTION');

try {
    $handler->insert($article);
    $handler->insert($metadata);
    $db->query('COMMIT');
} catch (\Exception $e) {
    $db->query('ROLLBACK');
    throw $e;
}
```
## Keselamatan### Sentiasa Sahkan Input
```
php
use XMF\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Additional validation
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```
### Gunakan Token CSRF
```
php
// In form
$form->addElement(new XoopsFormHiddenToken());

// On submit
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```
### Semak Kebenaran
```
php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```
## Prestasi### Gunakan Caching
```
php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```
### Optimumkan Pertanyaan
```
php
// Use indexes
// Add to sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Select only needed columns
$handler->getObjects($criteria, false, true); // asArray = true

// Use pagination
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```
## Ujian### Tulis Ujian Unit
```
php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('Title', 'Content');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```
## Dokumentasi Berkaitan- Kod Bersih - Prinsip kod bersih
- Kod-Organisasi - Struktur projek
- Pengujian - Panduan ujian
- ../02-Core-Concepts/Security/Security-Best-Practices - Panduan keselamatan