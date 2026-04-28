---
title: "Meilleures pratiques de gestion des erreurs"
description: "Gestion des exceptions, journalisation et messages d'erreur conviviaux"
---

# Meilleures pratiques de gestion des erreurs dans XOOPS

Une gestion appropriée des erreurs est critique pour la fiabilité de l'application, le débogage et l'expérience utilisateur.

## Hiérarchie d'exception

```php
<?php
// Exception de base
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

// Exceptions spécifiques
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

## Motifs Try-Catch

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // Valider
            $this->validate($username, $email, $password);
            
            // Créer l'utilisateur
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // Sauvegarder
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

## Journalisation des erreurs

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

## Messages d'erreur conviviaux

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

## Gestion des erreurs du contrôleur

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

## Meilleures pratiques

- Créer des types d'exception spécifiques
- Lever tôt, capturer tard
- Journaliser toutes les exceptions avec le contexte
- Fournir des messages conviviaux pour l'utilisateur
- Utiliser un format de réponse d'erreur cohérent
- Tester les chemins de gestion des erreurs
- Ne pas exposer les informations sensibles aux utilisateurs

## Documentation connexe

Voir aussi:
- Organisation du code pour la structure du projet
- Tests pour les stratégies de test d'erreur
- ../Patterns/Couche-Service pour les exceptions de service

---

Tags: #best-practices #error-handling #exceptions #logging #module-development
