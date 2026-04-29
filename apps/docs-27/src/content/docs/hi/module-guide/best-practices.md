---
title: "मॉड्यूल विकास सर्वोत्तम अभ्यास"
---
## अवलोकन

यह दस्तावेज़ उच्च गुणवत्ता वाले XOOPS मॉड्यूल विकसित करने के लिए सर्वोत्तम प्रथाओं को समेकित करता है। इन दिशानिर्देशों का पालन रखरखाव योग्य, सुरक्षित और निष्पादन योग्य मॉड्यूल सुनिश्चित करता है।

##वास्तुकला

### स्वच्छ वास्तु का पालन करें

कोड को परतों में व्यवस्थित करें:

```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```

### एकल जिम्मेदारी

प्रत्येक वर्ग के पास परिवर्तन का एक कारण होना चाहिए:

```php
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

### निर्भरता इंजेक्शन

निर्भरताएँ इंजेक्ट करें, उन्हें बनाएँ नहीं:

```php
// Good
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Bad
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## कोड गुणवत्ता

### सुरक्षा प्रकार

सख्त प्रकार और प्रकार की घोषणाओं का उपयोग करें:

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

### त्रुटि प्रबंधन

अपवादों का उचित उपयोग करें:

```php
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

### अशक्त सुरक्षा

जहां संभव हो शून्य से बचें:

```php
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

## डेटाबेस

### प्रश्नों के लिए Criteria का उपयोग करें

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### उपयोगकर्ता इनपुट से बचें

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### लेनदेन का उपयोग करें

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

## सुरक्षा

### हमेशा इनपुट मान्य करें

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Additional validation
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### CSRF टोकन का उपयोग करें

```php
// In form
$form->addElement(new XoopsFormHiddenToken());

// On submit
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### अनुमतियाँ जाँचें

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## प्रदर्शन

### कैशिंग का उपयोग करें

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### क्वेरीज़ अनुकूलित करें

```php
// Use indexes
// Add to sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Select only needed columns
$handler->getObjects($criteria, false, true); // asArray = true

// Use pagination
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## परीक्षण

### यूनिट टेस्ट लिखें

```php
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

## संबंधित दस्तावेज़ीकरण

- क्लीन-कोड - क्लीन कोड सिद्धांत
- कोड-संगठन - परियोजना संरचना
- परीक्षण - परीक्षण मार्गदर्शिका
- ../02-कोर-अवधारणाएं/सुरक्षा/सुरक्षा-सर्वोत्तम अभ्यास - सुरक्षा गाइड