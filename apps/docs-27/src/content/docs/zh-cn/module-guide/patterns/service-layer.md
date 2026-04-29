---
title：“XOOPS中的服务层模式”
description：“业务逻辑抽象和依赖注入”
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[不确定这是否是正确的模式？]
有关比较处理程序、存储库、服务和 CQRS 的决策树，请参阅[Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md)。
:::

:::提示[今天和明天都有效]
服务层模式**适用于 XOOPS 2.5.x 和 XOOPS 4.0.x**。这些概念是通用的——只是语法不同：

|特色| XOOPS2.5.x | XOOPS4.0 |
|--------|-------------|------------|
| PHP版本| 7.4+ | 8.2+ |
|构造函数注入 | ✅ 手动接线 | ✅ 容器自动装配 |
|类型化属性 | `@var` 文档区块 |本机类型声明 |
|只读属性 | ❌ 不可用 | ✅ `readonly` 关键字 |

下面的代码示例使用 PHP 8.2+ 语法。对于 2.5.x，省略 `readonly` 并使用传统的属性声明。
:::

服务层模式将业务逻辑封装在专用服务类中，在控制器和数据访问层之间提供清晰的分离。该模式提高了代码的可重用性、可测试性和可维护性。

## 服务层概念

### 目的
服务层：
- 包含领域业务逻辑
- 协调多个存储库
- 处理复杂的操作
- 管理交易
- 执行验证和授权
- 为控制器提供高-level操作

### 好处
- 跨多个控制器可重用的业务逻辑
- 易于隔离测试
- 集中式业务规则实施
- 明确的关注点分离
- 简化的控制器代码

## 依赖注入

```php
<?php
// Service with injected dependencies
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
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
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

## 服务容器

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
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

## 在控制器中的用法

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

## 最佳实践

- 每项服务处理一个领域问题
- 服务依赖于接口，而不是实现
- 使用构造函数注入依赖项
- 服务应该可以单独测试
- 抛出域-specific异常
- 服务不应依赖于 HTTP 请求详细信息
- 保持服务的重点和凝聚力

## 相关文档

另请参阅：
- [MVC-Pattern](../Patterns/MVC-Pattern.md)用于控制器集成
- [Repository-Pattern](../Patterns/Repository-Pattern.md)用于数据访问
- [DTO-Pattern](DTO-Pattern.md) 对于数据传输对象
- [Testing](../Best-Practices/Testing.md)用于服务测试

---

标签：#服务-layer#业务-logic#依赖-injection#设计-patterns