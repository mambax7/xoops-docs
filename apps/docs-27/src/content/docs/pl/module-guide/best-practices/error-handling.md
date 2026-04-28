---
title: "Najlepsze praktyki obsługi błędów"
description: "Zarządzanie wyjątkami, rejestrowanie i komunikaty błędów przyjazne użytkownikowi"
---

# Najlepsze praktyki obsługi błędów w XOOPS

Właściwa obsługa błędów jest krytyczna dla niezawodności aplikacji, debugowania i doświadczenia użytkownika.

## Hierarchia wyjątków

```php
<?php
// Base exception
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

// Specific exceptions
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

## Wzorce try-catch

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // Validate
            $this->validate($username, $email, $password);
            
            // Create user
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // Save
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

## Rejestrowanie błędów

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

## Komunikaty błędów przyjazne użytkownikowi

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
                return 'The requested resource was not found.';
                
            case $e instanceof UnauthorizedException:
                return 'You do not have permission.';
                
            default:
                return 'An unexpected error occurred.';
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

## Obsługa błędów w kontrolerze

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

## Najlepsze praktyki

- Twórz konkretne typy wyjątków
- Rzucaj wcześnie, łap późno
- Rejestruj wszystkie wyjątki z kontekstem
- Dostarczaj komunikaty przyjazne użytkownikowi
- Używaj spójnego formatu odpowiedzi na błędy
- Testuj ścieżki obsługi błędów
- Nie ujawniaj poufnych informacji użytkownikom

## Powiązana dokumentacja

Zobacz też:
- Organizacja kodu dla struktury projektu
- Testowanie dla strategii testowania błędów
- ../Patterns/Service-Layer dla wyjątków usługi

---

Tags: #best-practices #error-handling #exceptions #logging #module-development
