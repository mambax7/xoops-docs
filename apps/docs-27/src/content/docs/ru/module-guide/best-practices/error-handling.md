---
title: "Лучшие практики обработки ошибок"
description: "Управление исключениями, логирование и удобные сообщения об ошибках"
---

# Лучшие практики обработки ошибок в XOOPS

Надлежащая обработка ошибок имеет решающее значение для надежности приложения, отладки и пользовательского опыта.

## Иерархия исключений

```php
<?php
// Базовое исключение
class ModuleException extends \Exception
{
    protected $statusCode = 500;
    
    public function __construct($message = '', $code = 0, $statusCode = 500)
    {
        parent::__construct($message, $code);
        $this->statusCode = $statusCode;
    }
    
    public function getStatusCode()
    {
        return $this->statusCode;
    }
}

// Конкретные исключения
class ValidationException extends ModuleException
{
    protected $statusCode = 400;
    private $errors = [];
    
    public function __construct($message, $errors = [])
    {
        parent::__construct($message, 0, 400);
        $this->errors = $errors;
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
}

class NotFoundException extends ModuleException
{
    protected $statusCode = 404;
}

class UnauthorizedException extends ModuleException
{
    protected $statusCode = 403;
}
?>
```

## Паттерны Try-Catch

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // Валидация
            $this->validate($username, $email, $password);
            
            // Создание пользователя
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // Сохранение
            $userId = $this->userRepository->save($user);
            
            return $userId;
            
        } catch (ValidationException $e) {
            \xoops_logger()->error($e->getMessage());
            throw $e;
            
        } catch (\Exception $e) {
            \xoops_logger()->critical($e->getMessage());
            throw new \RuntimeException('Failed to create user');
        }
    }
}
?>
```

## Логирование ошибок

```php
<?php
class ErrorHandler
{
    public static function logError($message, $context = [])
    {
        \xoops_logger()->error($message, $context);
    }
    
    public static function logException(\Exception $e)
    {
        $context = [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ];
        
        \xoops_logger()->critical($e->getMessage(), $context);
    }
}
?>
```

## Удобные сообщения об ошибках для пользователя

```php
<?php
class ErrorHandler
{
    public static function getUserMessage(\Exception $e)
    {
        switch (true) {
            case $e instanceof ValidationException:
                return $e->getMessage();
                
            case $e instanceof NotFoundException:
                return 'Запрашиваемый ресурс не найден.';
                
            case $e instanceof UnauthorizedException:
                return 'У вас нет прав доступа.';
                
            default:
                return 'Произошла неожиданная ошибка.';
        }
    }
    
    public static function getStatusCode(\Exception $e)
    {
        if (method_exists($e, 'getStatusCode')) {
            return $e->getStatusCode();
        }
        return 500;
    }
}
?>
```

## Обработка ошибок в контроллере

```php
<?php
class UserController
{
    public function registerAction()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return [];
            }
            
            $userId = $this->userService->register(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return ['success' => true, 'userId' => $userId];
            
        } catch (\Exception $e) {
            ErrorHandler::logException($e);
            
            return [
                'success' => false,
                'message' => ErrorHandler::getUserMessage($e),
                'statusCode' => ErrorHandler::getStatusCode($e),
            ];
        }
    }
}
?>
```

## Лучшие практики

- Создавайте конкретные типы исключений
- Генерируйте рано, ловите поздно
- Логируйте все исключения с контекстом
- Предоставляйте удобные сообщения пользователю
- Используйте согласованный формат ответа об ошибке
- Тестируйте пути обработки ошибок
- Не раскрывайте конфиденциальную информацию пользователям

## Связанная документация

Смотрите также:
- Code-Organization для структуры проекта
- Testing для стратегий тестирования ошибок
- ../Patterns/Service-Layer для исключений сервиса

---

Tags: #best-practices #error-handling #exceptions #logging #module-development
