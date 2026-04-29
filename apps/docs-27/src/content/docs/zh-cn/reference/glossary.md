---
title：“XOOPS术语表”
description：“XOOPS-specific术语和概念的定义”
---

> XOOPS-specific术语和概念的综合词汇表。

---

## 一个

### 管理框架
XOOPS 2.3 中引入的标准化管理界面框架，提供跨模区块的一致管理页面。

### 自动加载
在需要时自动加载 PHP 类，使用现代 XOOPS 中的 PSR-4 标准。

---

##乙

### 区块
可以定位在主题区域中的 self-contained 内容单元。区块可以显示模区块内容、自定义HTML或动态数据。

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### 引导程序
在执行模区块代码之前初始化XOOPS核心的过程，通常通过`mainfile.php`和`header.php`进行。

---

## C

### 标准/CriteriaCompo
用于以对象-oriented方式构建数据库查询条件的类。

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF（交叉-Site请求伪造）
通过 `XOOPSFormHiddenToken` 使用安全令牌在 XOOPS 中阻止了安全攻击。

---

##D

### DI（依赖注入）
计划用于 XOOPS 4.0 的设计模式，其中依赖项是注入的，而不是内部创建的。

### 目录名
模区块的目录名称，用作整个系统的唯一标识符。

### DTYPE（数据类型）
定义 XOOPSObject 变量如何存储和清理的常量：
- `XOBJ_DTYPE_INT` - 整数
- `XOBJ_DTYPE_TXTBOX` - 文本（单行）
- `XOBJ_DTYPE_TXTAREA` - 文本（多-line）
- `XOBJ_DTYPE_EMAIL` - 电子邮件地址

---

## E

### 活动
XOOPS生命周期中的事件，可以通过预加载或挂钩触发自定义代码。

---

## F

### 框架
请参阅XMF（XOOPS模区块框架）。

### 表单元素
XOOPS 表单系统的组件，代表 HTML 表单字段。

---

## G

### 组
具有共享权限的用户的集合。核心群体包括：网站管理员、注册用户、匿名用户。

---

## H

### 处理程序
管理 XOOPSObject 实例的 CRUD 操作的类。

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### 助手
一个实用程序类，提供对模区块处理程序、配置和服务的轻松访问。

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### 内核
核心XOOPS类提供基本功能：数据库访问、用户管理、安全性等。

---

## L

### 语言文件
PHP 包含国际化常量的文件，存储在 `language/[code]/` 目录中。

---

## 米

### 主文件。php
XOOPS 的主要配置文件包含数据库凭据和路径定义。

### MCP（型号-Controller-Presenter）
类似于MVC的架构模式，经常用于XOOPS模区块开发。

### 中间件
位于请求和响应之间的软件，计划在 XOOPS 4.0 中使用 PSR-15。

### 模区块
扩展 XOOPS 功能的 self-contained 软件包，安装在 `modules/` 目录中。

### MOC（内容地图）
链接到相关内容的概述注释的黑曜石概念。

---

## N

### 命名空间
PHP 组织类的功能，用于 XOOPS 2.5+：
```php
namespace XoopsModules\MyModule;
```

### 通知
XOOPS系统用于通过电子邮件或私信提醒用户有关事件的信息。

---

## 哦

### 对象
请参阅 XOOPSObject。

---

## P

### 权限
通过组和权限处理程序管理访问控制。

### 预加载
挂钩到 XOOPS 事件的类，从 `preloads/` 目录自动加载。

### PSR（PHP标准建议）
PHP-FIG至XOOPS 4.0的标准将全面实施。

---

## R

### 渲染器
以特定格式（Bootstrap 等）输出表单元素或其他 UI 组件的类。

---

## S

### Smarty
XOOPS 使用的模板引擎用于将表示与逻辑分离。

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```### 服务
提供可重用业务逻辑的类，通常通过 Helper 访问。

---

## T

### 模板
Smarty文件（`.tpl`或`.html`）定义模区块的表示层。

### 主题
定义网站视觉外观的模板和资源的集合。

### 代币
确保表单提交来自合法来源的安全机制（CSRF保护）。

---

##你

### uid
用户 ID - 系统中每个用户的唯一标识符。

---

## V

### 变量（Var）
使用 `initVar()` 在 XOOPSObject 上定义的字段。

---

## W

### 小部件
一个小型的自我-contained UI 组件，类似于区块。

---

## X

### XMF（XOOPS模区块框架）
用于现代XOOPS模区块开发的实用程序和类的集合。

### XOBJ_DTYPE
用于在 XOOPSObject 中定义变量数据类型的常量。

### XOOPS数据库
提供查询执行和转义的数据库抽象层。

### XOOPSForm
用于以编程方式创建 HTML 表单的表单生成系统。

### XOOPSObject
XOOPS中所有数据对象的基类，提供变量管理和清理。

### XOOPS_version.php
定义模区块属性、表、区块、模板和配置的模区块清单文件。

---

## 常见缩写词

|缩写词|意义|
|---------|---------|
| XOOPS |可扩展对象-Oriented门户系统|
| XMF | XOOPS模区块框架|
| CSRF | Cross-Site请求伪造|
| XSS |交叉-Site脚本|
| ORM |对象-Relational映射|
| PSR| PHP标准推荐|
| DI |依赖注入 |
| MVC|型号-View-Controller |
| CRUD|创建、读取、更新、删除 |

---

## 🔗 相关文档

- 核心概念
- API参考
- 外部资源

---

#XOOPS #词汇表#reference #terminology #definitions