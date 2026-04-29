---
title：“MVC XOOPS中的模式”
description：“-View-Controller模区块中的模型XOOPS架构实现”
---

<span class="version-badge version-xmf">XMF 必需</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[不确定这是否是正确的模式？]
有关何时使用 MVC 与更简单的模式的指导，请参阅[Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md)。
:::

:::警告[澄清：XOOPS架构]
**标准 XOOPS 2.5.x** 使用 **页面控制器** 模式（也称为事务脚本），而不是 MVC。旧模区块使用 `index.php` 进行直接包含、全局对象（`$XOOPSUser`、`$XOOPSDB`）和处理程序-based 数据访问。

**要在 XOOPS 2.5.x** 中使用 MVC，您需要 **XMF 框架**，它提供路由和控制器支持。

**XOOPS 4.0** 将原生支持 MVC、PSR-15 中间件和正确的路由。

另请参阅：[Current XOOPS Architecture](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

模型-View-Controller (MVC) 模式是用于分离XOOPS 模区块中关注点的基本架构模式。该模式将应用程序划分为三个互连的组件。

## MVC 解释

### 型号
**模型** 代表应用程序的数据和业务逻辑。它：
- 管理数据持久性
- 实施业务规则
- 验证数据
- 与数据库通信
- 独立于用户界面

### 查看
**视图** 负责向用户呈现数据。它：
- 渲染HTML模板
- 显示模型数据
- 处理用户界面呈现
- 将用户操作发送到控制器
- 应包含最少的逻辑

### 控制器
**控制器** 处理模型和视图之间的用户交互和协调。它：
- 接收用户请求
- 处理输入数据
- 调用模型方法
- 选择适当的视图
- 管理应用程序流程

## XOOPS 实施

在XOOPS中，MVC模式是使用处理程序和模板以及提供模板支持的Smarty引擎来实现的。

### 基本模型结构
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### 控制器实现
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### 查看模板
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## 最佳实践

- 将业务逻辑保留在模型中
- 将演示文稿保留在视图中  
- 将routing/coordination保留在控制器中
- 不要混合各层之间的关注点
- 验证控制器级别的所有输入

## 相关文档

另请参阅：
- [Repository-Pattern](../Patterns/Repository-Pattern.md)用于高级数据访问
- [Service-Layer](../Patterns/Service-Layer.md)用于业务逻辑抽象
- [Code-Organization](../Best-Practices/Code-Organization.md)用于项目结构
- [Testing](../Best-Practices/Testing.md) 适用于 MVC 测试策略

---

标签：#mvc #patterns #architecture #module-development #设计-patterns