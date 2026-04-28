---
title: "Рекомендации по безопасности"
---

## Обзор

Этот документ описывает лучшие практики безопасности для разработки XOOPS, охватывающие валидацию входных данных, кодирование выходных данных, аутентификацию, авторизацию и защиту от распространённых уязвимостей веб-приложений.

## Принципы безопасности

```mermaid
flowchart TB
    subgraph "Defense in Depth"
        A[Input Validation] --> B[Authentication]
        B --> C[Authorization]
        C --> D[Data Sanitization]
        D --> E[Output Encoding]
        E --> F[Audit Logging]
    end
```

## Валидация входных данных

### Санитизация запроса

```php
use Xoops\Core\Request;

// Всегда используйте типизированные геттеры
$id = Request::getInt('id', 0, 'GET');
$name = Request::getString('name', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');

// Никогда не используйте raw $_GET/$_POST/$_REQUEST
// Плохо: $id = $_GET['id'];
// Хорошо: $id = Request::getInt('id', 0, 'GET');
```

### Правила валидации

```php
// Валидируйте перед использованием
if ($id <= 0) {
    throw new InvalidArgumentException('Invalid ID');
}

if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    throw new InvalidArgumentException('Invalid username format');
}

// Используйте whitelist валидацию для enum'ов
$allowedStatuses = ['draft', 'published', 'archived'];
if (!in_array($status, $allowedStatuses, true)) {
    throw new InvalidArgumentException('Invalid status');
}
```

## Предотвращение SQL инъекций

### Использование параметризованных запросов

```php
// ХОРОШО: Параметризованный запрос
$sql = "SELECT * FROM {$xoopsDB->prefix('users')} WHERE uid = ?";
$result = $xoopsDB->query($sql, [$userId]);

// ПЛОХО: Конкатенация строк (уязвимо!)
// $sql = "SELECT * FROM users WHERE uid = " . $userId;
```

### Использование объектов Criteria

```php
use Criteria;
use CriteriaCompo;

$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', $userId, '='));
$criteria->add(new Criteria('created', time() - 86400, '>'));

$articles = $articleHandler->getObjects($criteria);
```

## Предотвращение XSS

### Кодирование выходных данных

```php
use Xoops\Core\Text\Sanitizer;

// Контекст HTML
$safeName = htmlspecialchars($userName, ENT_QUOTES, 'UTF-8');

// В шаблонах (автоматически экранируется)
{$userName|escape}

// Для богатого контента
$sanitizer = Sanitizer::getInstance();
$safeContent = $sanitizer->sanitizeForDisplay($content);
```

### Политика безопасности контента

```php
// Установка заголовков CSP
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
```

## Защита от CSRF

### Реализация токена

```php
// Генерация токена
use Xoops\Core\Security;

$token = Security::createToken();

// В форме
echo '<input type="hidden" name="XOOPS_TOKEN_REQUEST" value="' . $token . '">';

// Проверка при отправке
if (!Security::checkToken()) {
    die('Security token mismatch');
}
```

### Использование XoopsForm

```php
// Автоматически добавляет CSRF токен
$form = new XoopsThemeForm('Edit Article', 'articleform', 'save.php');
$form->addElement(new XoopsFormHiddenToken());
```

## Аутентификация

### Обработка пароля

```php
// Хеширование пароля (PHP 5.5+)
$hashedPassword = password_hash($plainPassword, PASSWORD_ARGON2ID);

// Проверка пароля
if (password_verify($plainPassword, $storedHash)) {
    // Пароль верен
}

// Проверка необходимости переваяша
if (password_needs_rehash($storedHash, PASSWORD_ARGON2ID)) {
    $newHash = password_hash($plainPassword, PASSWORD_ARGON2ID);
    // Обновление сохранённого хеша
}
```

### Безопасность сеанса

```php
// Регенерация ID сеанса после входа
session_regenerate_id(true);

// Установка безопасных параметров куки сеанса
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Lax');
```

## Авторизация

### Проверка разрешений

```php
// Проверка администратора модуля
if (!$xoopsUser || !$xoopsUser->isAdmin($xoopsModule->mid())) {
    redirect_header('index.php', 3, 'Access denied');
}

// Проверка разрешений группы
$grouppermHandler = xoops_getHandler('groupperm');
$groups = $xoopsUser ? $xoopsUser->getGroups() : [XOOPS_GROUP_ANONYMOUS];

if (!$grouppermHandler->checkRight('view_item', $itemId, $groups, $moduleId)) {
    throw new AccessDeniedException('Permission denied');
}
```

### Доступ на основе ролей

```php
class PermissionChecker
{
    public function canEdit(Article $article, ?XoopsUser $user): bool
    {
        if (!$user) {
            return false;
        }

        // Администратор может редактировать всё
        if ($user->isAdmin()) {
            return true;
        }

        // Автор может редактировать своё
        if ($article->getAuthorId() === $user->uid()) {
            return true;
        }

        // Проверка разрешения редактора
        return $this->hasPermission($user, 'article_edit');
    }
}
```

## Безопасность загрузки файлов

```php
class SecureUploader
{
    private array $allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    private array $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    public function validate(array $file): bool
    {
        // Проверка размера файла
        if ($file['size'] > 2 * 1024 * 1024) {
            throw new FileTooLargeException();
        }

        // Проверка MIME типа
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, $this->allowedMimeTypes, true)) {
            throw new InvalidFileTypeException();
        }

        // Проверка расширения
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions, true)) {
            throw new InvalidFileTypeException();
        }

        // Генерация безопасного имени файла
        return true;
    }

    public function generateSafeFilename(string $original): string
    {
        $extension = strtolower(pathinfo($original, PATHINFO_EXTENSION));
        return bin2hex(random_bytes(16)) . '.' . $extension;
    }
}
```

## Логирование аудита

```php
class SecurityLogger
{
    public function logAuthAttempt(string $username, bool $success, string $ip): void
    {
        $data = [
            'username' => $username,
            'success' => $success,
            'ip' => $ip,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'timestamp' => time()
        ];

        // Логирование в базе данных или файле
        $this->log('auth', $data);
    }

    public function logSensitiveAction(int $userId, string $action, array $context): void
    {
        $data = [
            'user_id' => $userId,
            'action' => $action,
            'context' => json_encode($context),
            'ip' => $_SERVER['REMOTE_ADDR'],
            'timestamp' => time()
        ];

        $this->log('audit', $data);
    }
}
```

## Заголовки безопасности

```php
// Рекомендуемые заголовки безопасности
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// HSTS (только для HTTPS сайтов)
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
```

## Ограничение частоты запросов

```php
class RateLimiter
{
    public function check(string $key, int $maxAttempts, int $windowSeconds): bool
    {
        $cacheKey = 'rate_limit:' . $key;
        $attempts = (int) $this->cache->get($cacheKey, 0);

        if ($attempts >= $maxAttempts) {
            return false; // Частотно ограничено
        }

        $this->cache->increment($cacheKey, 1, $windowSeconds);
        return true;
    }
}

// Использование
$limiter = new RateLimiter();
if (!$limiter->check('login:' . $ip, 5, 300)) {
    throw new TooManyRequestsException('Too many login attempts');
}
```

## Контрольный список безопасности

- [ ] Все входные данные пользователя валидируются и санитизируются
- [ ] Параметризованные запросы для всех операций с базой данных
- [ ] Кодирование выходных данных для всего контента, созданного пользователем
- [ ] CSRF токены на всех формах, изменяющих состояние
- [ ] Безопасное хеширование пароля (Argon2id)
- [ ] Безопасность сеанса настроена
- [ ] Валидация загрузки файлов
- [ ] Заголовки безопасности установлены
- [ ] Ограничение частоты запросов реализовано
- [ ] Логирование аудита включено
- [ ] Сообщения об ошибках не раскрывают конфиденциальную информацию

## Связанная документация

- Authentication System
- Permission System
- Input Validation
