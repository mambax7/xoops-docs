---
title: "ข้อผิดพลาดในการจัดการแนวทางปฏิบัติที่ดีที่สุด"
description: "การจัดการข้อยกเว้น การบันทึก และข้อความแสดงข้อผิดพลาดที่ใช้งานง่าย"
---
# ข้อผิดพลาดในการจัดการแนวทางปฏิบัติที่ดีที่สุดใน XOOPS

การจัดการข้อผิดพลาดอย่างเหมาะสมเป็นสิ่งสำคัญสำหรับความน่าเชื่อถือของแอปพลิเคชัน การดีบัก และประสบการณ์ผู้ใช้

## ลำดับชั้นข้อยกเว้น
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
## รูปแบบลองจับ
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
## ข้อผิดพลาดในการบันทึก
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
## ข้อความแสดงข้อผิดพลาดที่ใช้งานง่าย
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
## การจัดการข้อผิดพลาดของคอนโทรลเลอร์
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
## แนวทางปฏิบัติที่ดีที่สุด

- สร้างประเภทข้อยกเว้นเฉพาะ
-โยนเร็ว จับช้า
- บันทึกข้อยกเว้นทั้งหมดพร้อมบริบท
- จัดทำข้อความที่เป็นมิตรต่อผู้ใช้
- ใช้รูปแบบการตอบสนองข้อผิดพลาดที่สอดคล้องกัน
- ทดสอบเส้นทางการจัดการข้อผิดพลาด
- อย่าเปิดเผยข้อมูลที่ละเอียดอ่อนแก่ผู้ใช้

## เอกสารที่เกี่ยวข้อง

ดูเพิ่มเติมที่:
- Code-Organization สำหรับโครงสร้างโครงการ
- การทดสอบกลยุทธ์การทดสอบข้อผิดพลาด
- ../Patterns/Service-Layer สำหรับข้อยกเว้นการบริการ

---

แท็ก: #แนวปฏิบัติที่ดีที่สุด #การจัดการข้อผิดพลาด #ข้อยกเว้น #การบันทึก #การพัฒนาโมดูล