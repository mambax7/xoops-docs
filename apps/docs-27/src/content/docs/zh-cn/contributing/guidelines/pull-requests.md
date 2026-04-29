---
title: “拉取请求指南”
description: “向XOOPS项目提交拉取请求的指南”
---

本文档提供了向 XOOPS 项目提交拉取请求的综合指南。遵循这些准则可确保顺利的代码审查和更快的合并时间。

## 创建拉取请求之前

### 第 1 步：检查现有问题

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### 第 2 步：分叉并克隆存储库

```bash
# Fork the repository on GitHub
# Click "Fork" button on the repository page

# Clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verify remotes
git remote -v
# Should show: origin (your fork) and upstream (official)
```

### 步骤 3：创建功能分支

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### 第 4 步：做出改变

```bash
# Make changes to your files
# Follow code style guidelines

# Stage changes
git add .

# Commit with clear message
git commit -m "Fix database connection timeout issue"

# Create multiple commits for logical changes
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## 提交消息标准

### 良好的提交消息

使用遵循以下模式的清晰的描述性消息：

```
# Format
<type>: <subject>

<body>

<footer>

# Example 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Example 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### 提交类型类别

|类型 |描述 |示例|
|------|-------------|---------|
| `feat` |新功能| `feat: add user dashboard widget` |
| `fix` |错误修复 | `fix: resolve cache invalidation bug` |
| `docs` |文档 | `docs: update API reference` |
| `style` |代码风格（无逻辑变化）| `style: format imports` |
| `refactor` |代码重构 | `refactor: simplify service layer` |
| `perf` |绩效提升| `perf: optimize database queries` |
| `test`|测试变更 | `test: add integration tests` |
| `chore` | Build/tooling变更| `chore: update dependencies` |

## 拉取请求描述

### 公关模板

```markdown
## Description
Clear description of changes made and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing steps included

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Added tests for new functionality
- [ ] All tests passing
```

## 代码质量要求

### 代码风格

遵循《准则》-Style 准则：

```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## 测试要求

### 单元测试

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### 运行测试

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## 使用分支机构

### 保持分支更新

```bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```

## 创建拉取请求

### PR 标题格式

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## 代码审查流程

### 审稿人寻找什么

1. **正确性**
   - 该代码是否解决了所述问题？
   - 边缘情况是否得到处理？
   - 错误处理是否适当？

2. **质量**
   - 它遵循编码标准吗？
   - 可以维护吗？
   - 还好吗-tested？

3. **性能**
   - 有性能下降吗？
   - 查询是否优化？
   - 内存使用是否合理？

4. **安全**
   - 输入验证？
   - SQL注射预防？
   - Authentication/authorization?

### 回复反馈

```bash
# Address feedback
# Edit files based on review comments

# Commit changes
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Push changes
git push origin bugfix/123-fix-database-connection
```

## 常见公关问题及解决方案

### 问题 1：PR 太大

**问题：** 审阅者无法有效审阅大量 PR

**解决方案：** 分成更小的 PR
- 第一个 PR：核心变更
- 第二次 PR：测试
- 第三个 PR：文档

### 问题 2：不包含测试

**问题：** 审阅者无法验证功能

**解决方案：** 提交前添加综合测试

### 问题 3：与 Main 的冲突

**问题：** 您的分支与主分支不同步

**解决方案：** 基于最新的 main

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## 合并后

### 清理

```bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```

## 最佳实践总结

### 要做的事

- 创建描述性提交消息
- 制作有针对性的单一-purpose PR
- 包括新功能的测试
- 更新文档
- 参考相关问题
- 保持公关描述清晰
- 及时回复评论

### 不该做的事

- 包括不相关的更改
- 将 main 合并到你的分支中（使用 rebase）
- 审核开始后强制推送
- 跳过测试
- 提交正在进行的工作
- 忽略代码审查反馈

## 相关文档

- ../Contributing - 贡献概述
- 代码-Style - 代码风格指南
- ../../03-Module-Development/Best-Practices/Testing - 测试最佳实践
- ../Architecture-Decisions/ADR-Index - 架构指南

## 资源

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**最后更新：** 2026-01-31
**适用于：** 所有XOOPS项目
**存储库：** https://github.com/XOOPS/XOOPS