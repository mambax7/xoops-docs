---
title: "Các phương pháp hay nhất về xử lý lỗi"
description: "Quản lý ngoại lệ, ghi nhật ký và thông báo lỗi thân thiện với người dùng"
---
# Cách xử lý lỗi tốt nhất trong XOOPS

Việc xử lý lỗi thích hợp là rất quan trọng đối với độ tin cậy của ứng dụng, việc gỡ lỗi và trải nghiệm người dùng.

## Phân cấp ngoại lệ

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

## Mẫu thử bắt

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

## Lỗi ghi nhật ký

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

## Thông báo lỗi thân thiện với người dùng

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

## Xử lý lỗi bộ điều khiển

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

## Các phương pháp hay nhất

- Tạo các loại ngoại lệ cụ thể
- Ném sớm, bắt muộn
- Ghi lại tất cả các trường hợp ngoại lệ với ngữ cảnh
- Cung cấp tin nhắn thân thiện với người dùng
- Sử dụng định dạng phản hồi lỗi nhất quán
- Kiểm tra đường dẫn xử lý lỗi
- Không tiết lộ thông tin nhạy cảm cho người dùng

## Tài liệu liên quan

Xem thêm:
- Code-Organization cho cấu trúc dự án
- Kiểm tra các chiến lược kiểm tra lỗi
- ../Patterns/Service-Layer cho các ngoại lệ dịch vụ

---

Tags: #các phương pháp hay nhất #xử lý lỗi #ngoại lệ #ghi nhật ký #phát triển mô-đun