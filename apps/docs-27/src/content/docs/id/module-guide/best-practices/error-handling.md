---
title: "Praktik Terbaik Penanganan Kesalahan"
description: "Manajemen pengecualian, pencatatan log, dan pesan kesalahan yang mudah digunakan"
---

# Penanganan Kesalahan Praktik Terbaik di XOOPS

Penanganan kesalahan yang tepat sangat penting untuk keandalan aplikasi, proses debug, dan pengalaman pengguna.

## Hierarki Pengecualian

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

## Pola Coba-Tangkap

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

## Kesalahan Pencatatan

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

## Pesan Kesalahan yang Ramah Pengguna

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

## Penanganan Kesalahan Pengontrol

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

## Praktik Terbaik

- Buat jenis pengecualian tertentu
- Lempar lebih awal, tangkap terlambat
- Catat semua pengecualian dengan konteks
- Memberikan pesan yang ramah pengguna
- Gunakan format respons kesalahan yang konsisten
- Uji jalur penanganan kesalahan
- Jangan memaparkan informasi sensitif kepada pengguna

## Dokumentasi Terkait

Lihat juga:
- Kode-Organisasi untuk struktur proyek
- Pengujian strategi pengujian kesalahan
- ../Patterns/Service-Layer untuk pengecualian layanan

---

Tag: #praktik terbaik #penanganan kesalahan #pengecualian #logging #pengembangan module
