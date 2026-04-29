---
title：“XOOPS中的存储库模式”
description：“数据访问抽象层实现”
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[不确定这是否是正确的模式？]
有关比较处理程序、存储库、服务和 CQRS 的决策树，请参阅[Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md)。
:::

:::提示[今天和明天都有效]
存储库模式**适用于 XOOPS 2.5.x 和 XOOPS 4.0.x**。在 2.5.x 中，将现有的 `XOOPSPersistableObjectHandler` 包装在 Repository 类中以获得抽象优势：

|方法| XOOPS2.5.x | XOOPS4.0 |
|----------|-------------|------------|
|直接处理程序访问 | `XOOPS_getModuleHandler()` |通过 DI 容器 |
|存储库包装 | ✅ 推荐 | ✅ 原生图案 |
|使用模拟进行测试 | ✅ 带有手动DI | ✅ 容器自动装配 |

**立即从存储库模式开始**，为 XOOPS 4.0 迁移准备模区块。
:::

存储库模式是一种数据访问模式，它抽象了数据库操作，为访问数据提供了干净的接口。它充当业务逻辑层和数据映射层之间的中间人。

## 存储库概念

存储库模式提供：
- 数据库实现细节的抽象
- 轻松模拟单元测试
- 集中式数据访问逻辑
- 灵活地更改数据库而不影响业务逻辑
- 跨应用程序可重用的数据访问逻辑

## 何时使用存储库

**在以下情况下使用存储库：**
- 在应用层之间传输数据
- 需要更改数据库实现
- 使用模拟编写可测试的代码
- 抽象数据访问模式

## 实现模式

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## 服务中的使用

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## 最佳实践

- 使用接口定义存储库合约
- 每个存储库处理一种实体类型
- 将业务逻辑保留在服务中，而不是存储库中
- 使用实体对象进行数据映射
- 对无效操作抛出适当的异常

## 相关文档

另请参阅：
- [MVC-Pattern](../Patterns/MVC-Pattern.md)用于控制器集成
- [Service-Layer](../Patterns/Service-Layer.md)用于服务实施
- [DTO-Pattern](DTO-Pattern.md) 用于数据传输对象
- [Testing](../Best-Practices/Testing.md)用于存储库测试

---

标签：#repository-pattern #data-access #design-patterns #module-development