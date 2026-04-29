---
title: "Βέλτιστες πρακτικές χειρισμού σφαλμάτων"
description: "Διαχείριση εξαιρέσεων, καταγραφή και φιλικά προς το χρήστη μηνύματα σφάλματος"
---

# Βέλτιστες πρακτικές χειρισμού σφαλμάτων στο XOOPS

Ο σωστός χειρισμός σφαλμάτων είναι κρίσιμος για την αξιοπιστία της εφαρμογής, τον εντοπισμό σφαλμάτων και την εμπειρία χρήστη.

## Ιεραρχία εξαιρέσεων

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

## Μοτίβα Try-Catch

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

## Σφάλματα καταγραφής

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

## Μηνύματα λάθους φιλικά προς το χρήστη

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

## Χειρισμός σφαλμάτων ελεγκτή

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

## Βέλτιστες πρακτικές

- Δημιουργήστε συγκεκριμένους τύπους εξαιρέσεων
- Πέτα νωρίς, πιάσε αργά
- Καταγραφή όλων των εξαιρέσεων με περιβάλλον
- Παρέχετε μηνύματα φιλικά προς το χρήστη
- Χρησιμοποιήστε συνεπή μορφή απόκρισης σφαλμάτων
- Δοκιμή διαδρομών χειρισμού σφαλμάτων
- Μην εκθέτετε ευαίσθητες πληροφορίες στους χρήστες

## Σχετική τεκμηρίωση

Δείτε επίσης:
- Κώδικας-Οργάνωση για τη δομή του έργου
- Δοκιμές για στρατηγικές ελέγχου σφαλμάτων
- ../Patterns/Service-Layer για εξαιρέσεις υπηρεσιών

---

Ετικέτες: #βέλτιστες πρακτικές #διαχείριση σφαλμάτων #εξαιρέσεις #καταγραφή #ανάπτυξη ενότητας
