---
title: “贡献指南”
description: “如何为 XOOPS CMS 开发、编码标准和社区指南做出贡献”
---

# 🤝 贡献于XOOPS

> 加入 XOOPS 社区并帮助其成为世界上最好的 CMS。

---

## 📋 概述

XOOPS 是一个开放的-source 项目，依靠社区贡献而蓬勃发展。无论您是修复错误、添加功能、改进文档还是帮助他人，您的贡献都是有价值的。

---

## 🗂️ 部分内容

### 指南
- 行为准则
- 贡献工作流程
- 拉取请求指南
- 问题报告

### 代码风格
- PHP编码标准
- JavaScript标准
- CSS 指南
- Smarty 模板标准

### 架构决策
- ADR索引
- ADR模板
- ADR-001：模区块化架构
- ADR-002：数据库抽象

---

## 🚀 开始使用

### 1.搭建开发环境

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```

### 2.创建功能分支

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. 做出改变

遵循编码标准并为新功能编写测试。

### 4. 提交拉取请求

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

然后在 GitHub 上创建拉取请求。

---

## 📝 编码标准

### PHP 标准

XOOPS遵循PSR-1、PSR-4和PSR-12编码标准。

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### 关键约定

|规则|示例|
|------|---------|
|类名| `PascalCase`|
|方法名称 | `camelCase` |
|常数| `UPPER_SNAKE_CASE`|
|变量| `$camelCase`|
|文件| `ClassName.php` |
|缩进 | 4 个空格 |
|线长|最多 120 个字符 |

### Smarty 模板

```smarty
{* File: templates/mymodule_index.tpl *}
{* Description: Index page template *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Git 工作流程

### 分支命名

|类型 |图案|示例|
|------|---------|---------|
|特色| `feature/description` | `feature/add-user-export` |
|错误修正 | `fix/description` | `fix/login-validation` |
|修补程序 | `hotfix/description` | `hotfix/security-patch` |
|发布 | `release/version` | `release/2.7.0` |

### 提交消息

遵循常规提交：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型：**
- `feat`：新功能
- `fix`：错误修复
- `docs`：文档
- `style`：代码风格（格式）
- `refactor`：代码重构
- `test`：添加测试
- `chore`：维护

**示例：**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```

```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```

---

## 🧪 测试

### 运行测试

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### 编写测试

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## 📋 拉取请求清单

在提交 PR 之前，请确保：

- [ ] 代码遵循 XOOPS 编码标准
- [ ] 所有测试均通过
- [ ] 新功能已测试
- [ ] 如果需要更新文档
- [ ] 与主分支没有合并冲突
- [ ] 提交消息是描述性的
- [ ] PR 描述解释了更改
- [ ] 相关问题已链接

---

## 🏗️架构决策记录

ADR 记录了重要的架构决策。

### ADR 模板

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue we're addressing?

## Decision
What is the change being proposed?

## Consequences
What are the positive and negative effects?

## Alternatives Considered
What other options were evaluated?
```

### 当前 ADR

| ADR |标题 |状态 |
|-----|--------|--------|
| ADR-001 |模区块化架构|已接受 |
| ADR-002 |对象-Oriented数据库访问|已接受 |
| ADR-003 | Smarty 模板引擎 |已接受 |
| ADR-004 |安全系统设计|已接受 |
| ADR-005 | PSR-15 中间件 (4.0.x) |提议|

---

## 🎖️ 认可

贡献者通过以下方式得到认可：

- **贡献者列表** - 在存储库中列出
- **发行说明** - 记入发行版
- **名人堂** - 杰出贡献者
- **模区块认证** - 模区块质量徽章

---

## 🔗 相关文档

- XOOPS 4.0 路线图
- 核心概念
- 模区块开发

---

## 📚 资源

- [GitHub Repository](https://github.com/XOOPS/XOOPSCore27)
- [Issue Tracker](https://github.com/XOOPS/XOOPSCore27/issues)
- [XOOPS Forums](https://XOOPS.org/modules/newbb/)
- [Discord Community](https://discord.gg/XOOPS)

---

#XOOPS #贡献#open-source #社区#development #coding-standards