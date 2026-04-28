---
title: "Mejores prácticas de desarrollo de módulos"
---

## Descripción general

Este documento consolida las mejores prácticas para desarrollar módulos XOOPS de alta calidad. Seguir estas directrices garantiza módulos mantenibles, seguros y eficientes.

## Arquitectura

### Siga la arquitectura limpia

Organice el código en capas:

```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```

### Responsabilidad única

Cada clase debe tener una única razón para cambiar:

```php
// Bien: Clases enfocadas
class ArticleRepository { /* persistencia únicamente */ }
class ArticleValidator { /* validación únicamente */ }
class ArticleNotifier { /* notificaciones únicamente */ }

// Mal: Clase diosa
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### Inyección de dependencias

Inyecte las dependencias, no las cree:

```php
// Bien
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Mal
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Calidad del código

### Seguridad de tipo

Use tipos estrictos y declaraciones de tipo:

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

### Manejo de errores

Utilice excepciones apropiadamente:

```php
// Lance excepciones específicas
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('No se puede editar este artículo');

// Capture en el nivel apropiado
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Seguridad nula

Evite nulos donde sea posible:

```php
// Use patrón de objeto nulo
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Use patrón Opcional/Quizás
public function findById(int $id): ?Article
{
    // Retorno explícitamente anulable
}
```

## Base de datos

### Use Criteria para consultas

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Escape de entrada del usuario

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Use transacciones

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

## Seguridad

### Siempre valide la entrada

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Validación adicional
if (strlen($title) < 5) {
    throw new ValidationException('Título muy corto');
}
```

### Use tokens CSRF

```php
// En formulario
$form->addElement(new XoopsFormHiddenToken());

// En envío
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Token inválido');
}
```

### Verifique permisos

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Rendimiento

### Use caché

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Optimice las consultas

```php
// Use índices
// Agregar a sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Seleccione solo columnas necesarias
$handler->getObjects($criteria, false, true); // asArray = true

// Use paginación
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Pruebas

### Escriba pruebas unitarias

```php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('Título', 'Contenido');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```

## Documentación relacionada

- Clean-Code - Principios de código limpio
- Code-Organization - Estructura del proyecto
- Testing - Guía de pruebas
- ../02-Core-Concepts/Security/Security-Best-Practices - Guía de seguridad
