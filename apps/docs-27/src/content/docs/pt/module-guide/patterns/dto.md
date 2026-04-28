---
title: "Padrão DTO em XOOPS"
description: "Data Transfer Objects para manipulação limpa de dados"
---

# Padrão DTO (Data Transfer Objects) em XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Funciona em Ambas as Versões]
DTOs são objetos PHP simples sem dependências de framework. Funcionam identicamente em XOOPS 2.5.x e XOOPS 4.0.x. Para PHP 8.2+, use promoção de propriedade do construtor e classes readonly para sintaxe mais limpa.
:::

Data Transfer Objects (DTOs) são objetos simples usados para transferir dados entre diferentes camadas de uma aplicação. DTOs ajudam a manter limites claros entre camadas e reduzem dependências de objetos de entidade.

## Conceito de DTO

### O que é um DTO?
Um DTO é:
- Um objeto de valor simples com propriedades
- Imutável ou somente leitura após criação
- Sem lógica de negócio ou métodos
- Otimizado para transferência de dados
- Independente de mecanismos de persistência

### Quando Usar DTOs

**Use DTOs quando:**
- Transferir dados entre camadas
- Expor dados através de APIs
- Agregar dados de múltiplas entidades
- Ocultar detalhes de implementação interna
- Alterar estrutura de dados para diferentes consumidores

## Implementação Básica de DTO

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // Acessores somente leitura
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## DTO de Requisição/Entrada

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## Uso em Serviços

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## Uso em Controladores de API

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## Melhores Práticas

- Mantenha DTOs focados e específicos
- Torne DTOs imutáveis ou somente leitura
- Não inclua lógica de negócio em DTOs
- Use DTOs separados para entrada e saída
- Documente claramente as propriedades de DTO
- Mantenha DTOs simples - apenas contêineres de dados

## Documentação Relacionada

Veja também:
- [Service-Layer](../Patterns/Service-Layer.md) para integração de serviço
- [Repository-Pattern](../Patterns/Repository-Pattern.md) para acesso de dados
- [MVC-Pattern](../Patterns/MVC-Pattern.md) para uso de controlador
- [Testing](../Best-Practices/Testing.md) para teste de DTO

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
