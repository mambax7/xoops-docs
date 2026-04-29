---
title: "Hata İşleme En İyi Uygulamaları"
description: "İstisna yönetimi, günlük kaydı ve user dostu hata mesajları"
---
# XOOPS'de Hata İşleme En İyi Uygulamaları

Doğru hata işleme, uygulama güvenilirliği, hata ayıklama ve user deneyimi açısından kritik öneme sahiptir.

## İstisna Hiyerarşisi
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
## Yakala-Dene Desenleri
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
## Günlük Hataları
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
## user Dostu Hata Mesajları
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
## Denetleyici Hata İşleme
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
## En İyi Uygulamalar

- Belirli istisna türleri oluşturun
- Erken at, geç yakala
- Tüm istisnaları bağlamla birlikte günlüğe kaydedin
- user dostu mesajlar sağlayın
- Tutarlı hata yanıt formatı kullanın
- Hata işleme yollarını test edin
- Hassas bilgileri kullanıcılara ifşa etmeyin

## İlgili Belgeler

Ayrıca bakınız:
- Proje yapısı için Kod Organizasyonu
- Hata testi stratejilerinin test edilmesi
- ../Patterns/Service-Layer hizmet istisnaları için

---

Etiketler: #en iyi uygulamalar #hata yönetimi #istisnalar #günlüğe kaydetme #module geliştirme