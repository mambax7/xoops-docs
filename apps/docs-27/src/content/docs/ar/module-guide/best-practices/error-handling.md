---
title: "أفضل ممارسات معالجة الخطأ"
description: "إدارة الاستثناء والتسجيل والرسائل الخطأ الودية للمستخدم"
dir: rtl
lang: ar
---

# أفضل ممارسات معالجة الخطأ في XOOPS

معالجة الخطأ الصحيحة حاسمة لموثوقية التطبيق والتصحيح وتجربة المستخدم.

## تسلسل الهرم للاستثناء

```php
<?php
// استثناء أساسي
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

// استثناءات محددة
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

## أنماط Try-Catch

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // تحقق
            $this->validate($username, $email, $password);
            
            // أنشئ مستخدماً
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // احفظ
            $userId = $this->userRepository->save($user);
            
            return $userId;
            
        } catch (ValidationException $e) {
            \xoops_logger()->error($e->getMessage());
            throw $e;
            
        } catch (\Exception $e) {
            \xoops_logger()->critical($e->getMessage());
            throw new \RuntimeException('فشل في إنشاء المستخدم');
        }
    }
}
?>
```

## تسجيل الأخطاء

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

## رسائل خطأ ودية للمستخدم

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
                return 'لم يتم العثور على المورد المطلوب.';
                
            case $e instanceof UnauthorizedException:
                return 'ليس لديك إذن.';
                
            default:
                return 'حدث خطأ غير متوقع.';
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

## معالجة خطأ المتحكم

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

## أفضل الممارسات

- إنشاء أنواع استثناء محددة
- رمي في وقت مبكر، التقط متأخراً
- سجل جميع الاستثناءات مع السياق
- قدم رسائل ودية للمستخدم
- استخدم صيغة استجابة خطأ متسقة
- اختبر مسارات معالجة الخطأ
- لا تكشف معلومات حساسة للمستخدمين

## الوثائق ذات الصلة

انظر أيضاً:
- Code-Organization لهيكل المشروع
- Testing لاستراتيجيات اختبار الخطأ
- ../Patterns/Service-Layer لاستثناءات الخدمة

---

Tags: #best-practices #error-handling #exceptions #logging #module-development
