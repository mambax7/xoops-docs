---
title: "Boas Práticas de Tratamento de Erros"
description: "Gerenciamento de exceção, registro e mensagens de erro amigáveis ao usuário"
---

# Boas Práticas de Tratamento de Erros em XOOPS

Tratamento apropriado de erros é crítico para confiabilidade da aplicação, depuração e experiência do usuário.

## Hierarquia de Exceção

```php
<?php
// Exceção base
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

// Exceções específicas
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

## Padrões Try-Catch

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // Validar
            $this->validate($username, $email, $password);
            
            // Criar usuário
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // Salvar
            $userId = $this->userRepository->save($user);
            
            return $userId;
            
        } catch (ValidationException $e) {
            \xoops_logger()->error($e->getMessage());
            throw $e;
            
        } catch (\Exception $e) {
            \xoops_logger()->critical($e->getMessage());
            throw new \RuntimeException('Falha ao criar usuário');
        }
    }
}
?>
```

## Registro de Erros

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

## Mensagens de Erro Amigáveis ao Usuário

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
                return 'O recurso solicitado não foi encontrado.';
                
            case $e instanceof UnauthorizedException:
                return 'Você não tem permissão.';
                
            default:
                return 'Ocorreu um erro inesperado.';
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

## Tratamento de Erros do Controller

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

## Boas Práticas

- Criar tipos de exceção específicos
- Lançar cedo, capturar tarde
- Registrar todas as exceções com contexto
- Fornecer mensagens amigáveis ao usuário
- Usar formato de resposta de erro consistente
- Testar caminhos de tratamento de erro
- Não expor informações sensíveis aos usuários

## Documentação Relacionada

Veja também:
- Organização-de-Código para estrutura do projeto
- Testes para estratégias de teste de erro
- ../Padrões/Camada-de-Serviço para exceções de serviço

---

Tags: #boas-práticas #tratamento-de-erros #exceções #registro #desenvolvimento-de-módulo
