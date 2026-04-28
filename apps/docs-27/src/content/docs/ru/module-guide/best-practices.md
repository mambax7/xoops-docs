---
title: "Лучшие практики разработки модулей"
---

## Обзор

Этот документ объединяет лучшие практики для разработки высококачественных модулей XOOPS. Следование этим рекомендациям обеспечивает поддерживаемые, безопасные и производительные модули.

## Архитектура

### Следуйте чистой архитектуре

Организуйте код в слои:

```
src/
├── Domain/          # Бизнес-логика, сущности
├── Application/     # Варианты использования, сервисы
├── Infrastructure/  # База данных, внешние сервисы
└── Presentation/    # Контроллеры, шаблоны
```

### Единая ответственность

Каждый класс должен иметь одну причину для изменения:

```php
// Хорошо: Сфокусированные классы
class ArticleRepository { /* только персистентность */ }
class ArticleValidator { /* только валидация */ }
class ArticleNotifier { /* только уведомления */ }

// Плохо: Класс-монстр
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### Внедрение зависимостей

Внедряйте зависимости, не создавайте их:

```php
// Хорошо
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Плохо
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Качество кода

### Типобезопасность

Используйте строгие типы и объявления типов:

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

### Обработка ошибок

Используйте исключения надлежащим образом:

```php
// Генерируйте конкретные исключения
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Ловите на подходящем уровне
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Безопасность null

Избегайте null, где это возможно:

```php
// Используйте паттерн null object
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Используйте паттерн Optional/Maybe
public function findById(int $id): ?Article
{
    // Явно nullable возврат
}
```

## База данных

### Используйте Criteria для запросов

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Экранируйте пользовательский ввод

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Используйте транзакции

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

## Безопасность

### Всегда проверяйте входные данные

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Дополнительная валидация
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### Используйте CSRF токены

```php
// В форме
$form->addElement(new XoopsFormHiddenToken());

// При отправке
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### Проверяйте разрешения

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Производительность

### Используйте кэширование

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Оптимизируйте запросы

```php
// Используйте индексы
// Добавьте в sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Выбирайте только нужные столбцы
$handler->getObjects($criteria, false, true); // asArray = true

// Используйте постраничное отображение
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Тестирование

### Напишите модульные тесты

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

## Связанная документация

- Clean-Code - Принципы чистого кода
- Code-Organization - Структура проекта
- Testing - Руководство по тестированию
- ../02-Core-Concepts/Security/Security-Best-Practices - Руководство по безопасности
