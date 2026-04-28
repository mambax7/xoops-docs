---
title: "Padrão Camada de Serviço em XOOPS"
description: "Abstração de lógica de negócio e injeção de dependência"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Não tem certeza se este é o padrão certo?]
Veja [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) para árvore de decisão comparando handlers, repositórios, serviços e CQRS.
:::

:::tip[Funciona Hoje e Amanhã]
O padrão Service Layer **funciona em XOOPS 2.5.x e XOOPS 4.0.x**. Os conceitos são universais—apenas a sintaxe difere:

| Recurso | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Versão PHP | 7.4+ | 8.2+ |
| Constructor Injection | ✅ Fiação manual | ✅ Autowiring de container |
| Typed Properties | `@var` docblocks | Declarações de tipo nativas |
| Readonly Properties | ❌ Não disponível | ✅ Palavra-chave `readonly` |

Os exemplos de código abaixo usam sintaxe PHP 8.2+. Para 2.5.x, omita `readonly` e use declarações de propriedade tradicionais.
:::

O Padrão Service Layer encapsula lógica de negócio em classes de serviço dedicadas, fornecendo uma separação clara entre controladores e camadas de acesso de dados. Este padrão promove reusabilidade de código, testabilidade e manutenibilidade.

## Conceito de Camada de Serviço

### Objetivo
A Camada de Serviço:
- Contém lógica de negócio de domínio
- Coordena múltiplos repositórios
- Lida com operações complexas
- Gerencia transações
- Realiza validação e autorização
- Fornece operações de alto nível para controladores

### Benefícios
- Lógica de negócio reutilizável em múltiplos controladores
- Fácil de testar isoladamente
- Implementação centralizada de regra de negócio
- Separação clara de responsabilidades
- Código de controlador simplificado

## Injeção de Dependência

```php
<?php
// Serviço com dependências injetadas
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validar
        $this->validate($username, $email, $password);
        
        // Criar usuário
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Salvar
        $userId = $this->userRepository->save($user);
        
        // Enviar email de boas-vindas
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## Container de Serviço

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Registrar repositórios
        $this->services['userRepository'] = new UserRepository($db);
        
        // Registrar serviços
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## Uso em Controladores

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## Melhores Práticas

- Cada serviço lida com uma preocupação de domínio
- Serviços dependem de interfaces, não implementações
- Use injeção de construtor para dependências
- Serviços devem ser testáveis isoladamente
- Lance exceções específicas de domínio
- Serviços não devem depender de detalhes de solicitação HTTP
- Mantenha serviços focados e coesos

## Documentação Relacionada

Veja também:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) para integração de controlador
- [Repository-Pattern](../Patterns/Repository-Pattern.md) para acesso de dados
- [DTO-Pattern](DTO-Pattern.md) para data transfer objects
- [Testing](../Best-Practices/Testing.md) para teste de serviço

---

Tags: #service-layer #business-logic #dependency-injection #design-patterns
