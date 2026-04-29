---
title: "सर्वोत्तम प्रथाओं को संभालने में त्रुटि"
description: "अपवाद प्रबंधन, लॉगिंग और उपयोगकर्ता के अनुकूल त्रुटि संदेश"
---
#XOOPS में सर्वोत्तम प्रथाओं को संभालने में त्रुटि

एप्लिकेशन की विश्वसनीयता, डिबगिंग और उपयोगकर्ता अनुभव के लिए उचित त्रुटि प्रबंधन महत्वपूर्ण है।

## अपवाद पदानुक्रम

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

## आज़माएं-पकड़ने के पैटर्न

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

## लॉगिंग त्रुटियाँ

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

## उपयोगकर्ता के अनुकूल त्रुटि संदेश

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

## नियंत्रक त्रुटि प्रबंधन

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

## सर्वोत्तम प्रथाएँ

- विशिष्ट अपवाद प्रकार बनाएं
- जल्दी फेंको, देर से पकड़ो
- सभी अपवादों को संदर्भ के साथ लॉग करें
- उपयोगकर्ता के अनुकूल संदेश प्रदान करें
- लगातार त्रुटि प्रतिक्रिया प्रारूप का प्रयोग करें
- परीक्षण त्रुटि प्रबंधन पथ
- उपयोगकर्ताओं के सामने संवेदनशील जानकारी उजागर न करें

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- परियोजना संरचना के लिए कोड-संगठन
- त्रुटि परीक्षण रणनीतियों के लिए परीक्षण
- सेवा अपवादों के लिए ../पैटर्न/सेवा-परत

---

टैग: #सर्वोत्तम अभ्यास #त्रुटि-प्रबंधन #अपवाद #लॉगिंग #मॉड्यूल-विकास