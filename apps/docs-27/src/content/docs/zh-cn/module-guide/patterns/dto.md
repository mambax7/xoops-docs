---
title: “DTO XOOPS中的模式”
description: “用于干净数据处理的数据传输对象”
---

# DTO XOOPS 中的模式（数据传输对象）

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::提示[两个版本均适用]
DTO 是普通的 PHP 对象，没有框架依赖性。它们在 XOOPS 2.5.x 和 XOOPS 4.0.x 中的工作方式相同。对于PHP 8.2+，使用构造函数属性提升和只读类以获得更清晰的语法。
:::

数据传输对象 (DTO) 是用于在应用程序的不同层之间传输数据的简单对象。 DTO 有助于保持层之间的清晰边界并减少对实体对象的依赖。

## DTO 概念

### 什么是 DTO？
DTO 是：
- 具有属性的简单值对象
- 不可变或创建后读取-only
- 没有业务逻辑或方法
- 针对数据传输进行了优化
- 独立于持久化机制

### 何时使用 DTO

**在以下情况下使用 DTO：**
- 在层之间传输数据
- 通过API公开数据
- 聚合来自多个实体的数据
- 隐藏内部实现细节
- 针对不同消费者改变数据结构

## 基本DTO实施

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
    
    // Read-only accessors
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

## Request/Input DTO

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

## 服务中的使用

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

## 在 API 控制器中的使用

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

## 最佳实践

- 保持 DTO 的重点和具体性
- 使 DTO 不可变或读取-only
- 不要在 DTO 中包含业务逻辑
- 使用单独的 DTO 进行输入和输出
- 清楚地记录DTO属性
- 保持 DTO 简单 - 只是数据容器

## 相关文档

另请参阅：
- [Service-Layer](../Patterns/Service-Layer.md) 用于服务集成
- [Repository-Pattern](../Patterns/Repository-Pattern.md)用于数据访问
- [MVC-Pattern](../Patterns/MVC-Pattern.md)用于控制器的使用
- [Testing](../Best-Practices/Testing.md)用于DTO测试

---

标签：#dto #data-transfer-objects #设计-patterns #模区块-development