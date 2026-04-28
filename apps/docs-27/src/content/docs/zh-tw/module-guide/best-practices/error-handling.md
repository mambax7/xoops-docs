---
title: "錯誤處理最佳實踐"
description: "例外狀況管理、記錄和使用者易懂的錯誤訊息"
---

# XOOPS 中的錯誤處理最佳實踐

適當的錯誤處理對於應用程式可靠性、除錯和使用者體驗至關重要。

## 例外狀況層級結構

```php
<?php
// 基本例外狀況
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

// 特定例外狀況
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

## Try-Catch 模式

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // 驗證
            $this->validate($username, $email, $password);
            
            // 建立使用者
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // 儲存
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

## 記錄錯誤

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

## 使用者易懂的錯誤訊息

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

## 控制器錯誤處理

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

## 最佳實踐

- 建立特定的例外狀況型別
- 及早擲回、延遲擷取
- 記錄具有內容的所有例外狀況
- 提供使用者易懂的訊息
- 使用一致的錯誤回應格式
- 測試錯誤處理路徑
- 不要向使用者公開敏感資訊

## 相關文件

另外參閱：
- Code-Organization 以進行專案結構
- Testing 以進行錯誤測試策略
- ../Patterns/Service-Layer 以進行服務例外狀況

---

標籤: #best-practices #error-handling #exceptions #logging #module-development
