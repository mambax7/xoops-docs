---
title: "أفضل ممارسات تطوير الوحدات"
dir: rtl
lang: ar
---

## نظرة عامة

يوحد هذا المستند أفضل الممارسات لتطوير وحدات XOOPS عالية الجودة. يضمن اتباع هذه الإرشادات وحدات قابلة للصيانة وآمنة وفعالة.

## الهندسة المعمارية

### اتبع العمارة النظيفة

نظم الكود إلى طبقات:

```
src/
├── Domain/          # منطق الأعمال والكيانات
├── Application/     # حالات الاستخدام والخدمات
├── Infrastructure/  # قاعدة البيانات والخدمات الخارجية
└── Presentation/    # المتحكمات والقوالب
```

### مسؤولية واحدة

كل فئة يجب أن تكون لها سبب واحد للتغيير:

```php
// جيد: فئات مركزة
class ArticleRepository { /* الإصرار فقط */ }
class ArticleValidator { /* التحقق فقط */ }
class ArticleNotifier { /* الإشعارات فقط */ }

// سيء: فئة الإله
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### حقن الاعتماديات

اضخ الاعتماديات ولا تنشئها:

```php
// جيد
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// سيء
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## جودة الكود

### سلامة النوع

استخدم النوع الصارم وإعلانات النوع:

```php
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

### معالجة الخطأ

استخدم الاستثناءات بشكل صحيح:

```php
// رمي استثناءات محددة
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('لا يمكنك تعديل هذا المقال');

// التقط على المستوى المناسب
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### الأمان من القيمة الخالية

تجنب null حيث أمكن:

```php
// استخدم نمط الكائن الفارغ
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// استخدم نمط اختياري/ربما
public function findById(int $id): ?Article
{
    // عودة قابلة للإلغاء بشكل صريح
}
```

## قاعدة البيانات

### استخدم المعايير للاستعلامات

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### الهروب من مدخلات المستخدم

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### استخدم المعاملات

```php
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

## الأمن

### تحقق دائماً من الإدخال

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// التحقق الإضافي
if (strlen($title) < 5) {
    throw new ValidationException('العنوان قصير جداً');
}
```

### استخدم رموز CSRF

```php
// في النموذج
$form->addElement(new XoopsFormHiddenToken());

// عند الإرسال
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'رمز غير صحيح');
}
```

### تحقق من الأذونات

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## الأداء

### استخدم التخزين المؤقت

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### تحسين الاستعلامات

```php
// استخدم الفهارس
// أضف إلى sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// اختر الأعمدة المطلوبة فقط
$handler->getObjects($criteria, false, true); // asArray = true

// استخدم الترقيم
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## الاختبار

### اكتب اختبارات الوحدة

```php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('العنوان', 'المحتوى');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```

## الوثائق ذات الصلة

- Clean-Code - مبادئ الكود النظيف
- Code-Organization - هيكل المشروع
- Testing - دليل الاختبار
- ../02-Core-Concepts/Security/Security-Best-Practices - دليل الأمن
