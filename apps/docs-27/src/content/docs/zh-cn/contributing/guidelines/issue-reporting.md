---
title: “问题报告指南”
description: “如何有效地报告错误、功能请求和其他问题”
---

> 有效的错误报告和功能请求对于 XOOPS 开发至关重要。本指南可帮助您创建高-quality问题。

---

## 报告之前

### 检查现有问题

**始终先搜索：**

1. 前往[GitHub Issues](https://github.com/XOOPS/XOOPSCore27/issues)
2.搜索与您的问题相关的关键词
3. 检查已解决的问题 - 可能已经解决
4. 查看拉取请求 - 可能正在进行中

使用搜索过滤器：
- `is:issue is:open label:bug` - 未解决的错误
- `is:issue is:open label:feature` - 开放功能请求
- `is:issue sort:updated` - 最近更新的问题

### 这真的是一个问题吗？

首先考虑：

- **配置问题？** - 检查文档
- **使用问题？** - 在论坛或 Discord 社区上提问
- **安全问题？** - 请参阅下面的#security-issues部分
- **模区块-specific?** - 向模区块维护者报告
- **主题-specific?** - 向主题作者报告

---

## 问题类型

### 错误报告

bug 是意外的行为或缺陷。

**示例：**
- 登录无法正常工作
- 数据库错误
- 缺少表单验证
- 安全漏洞

### 功能请求

功能请求是对新功能的建议。

**示例：**
- 添加对新功能的支持
- 改进现有功能
- 添加缺失的文档
- 性能改进

### 增强

增强功能改进了现有功能。

**示例：**
- 更好的错误消息
- 改进的性能
- 更好的API设计
- 更好的用户体验

### 文档

文档问题包括文档缺失或不正确。

**示例：**
- API 文档不完整
- 过时的指南
- 缺少代码示例
- 文档中的拼写错误

---

## 报告错误

### 错误报告模板

```markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```

### 好的错误报告示例

```markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```

### 糟糕的错误报告示例

```markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```

---

## 报告功能请求

### 功能请求模板

```markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```

### 良好的功能请求示例

```markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```

---

## 安全问题

### 公开举报NOT

**永远不要针对安全漏洞创建公共问题。**

### 私下举报

1. **向安全团队发送电子邮件：** security@XOOPS.org
2. **包括：**
   - 漏洞描述
   - 重现步骤
   - 潜在影响
   - 您的联系信息

### 负责任的披露

- 我们将在48小时内确认收货
- 我们将每 7 天提供更新
- 我们将制定修复时间表
- 您可以请求对发现的认可
- 协调公开披露时间

### 安全问题示例

```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```

---

## 问题标题最佳实践

### 好标题

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### 糟糕的标题

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### 标题指南

- **具体** - 提及内容和地点
- **简洁** - 少于 75 个字符
- **使用现在时** - “显示空白页”而不是“显示空白”
- **包括上下文** - “在管理面板中”，“在安装期间”
- **避免使用通用词** - 不是“修复”、“帮助”、“问题”

---

## 问题描述最佳实践

### 包括基本信息

1. **内容** - 问题的清晰描述
2. **哪里** - 哪个页面、模区块或功能
3. **何时** - 重现步骤
4. **环境** - 版本、操作系统、浏览器、PHP
5. **为什么** - 为什么这很重要

### 使用代码格式

```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Include Screenshots

For UI issues, include:
- Screenshot of the problem
- Screenshot of expected behavior
- Annotate what's wrong (arrows, circles)

### Use Labels

Add labels to categorize:
- `bug` - Bug report
- `enhancement` - Enhancement request
- `documentation` - Documentation issue
- `help wanted` - Looking for help
- `good first issue` - Good for new contributors

---

## After Reporting

### Be Responsive

- Check for questions in the issue comments
- Provide additional information if requested
- Test suggested fixes
- Verify bug still exists with new versions

### Follow Etiquette

- Be respectful and professional
- Assume good intentions
- Don't demand fixes - developers are volunteers
- Offer to help if possible
- Thank contributors for their work

### Keep Issue Focused

- Stay on topic
- Don't discuss unrelated issues
- Link to related issues instead
- Don't use issues for feature voting

---

## What Happens to Issues

### Triage Process

1. **New issue created** - GitHub notifies maintainers
2. **Initial review** - Checked for clarity and duplicates
3. **Label assignment** - Categorized and prioritized
4. **Assignment** - Assigned to someone if appropriate
5. **Discussion** - Additional info gathered if needed

### Priority Levels

- **Critical** - Data loss, security, complete breakage
- **High** - Major feature broken, affects many users
- **Medium** - Part of feature broken, workaround available
- **Low** - Minor issue, cosmetic, or niche use case

### Resolution Outcomes

- **Fixed** - Issue resolved in a PR
- **Won't fix** - Rejected for technical or strategic reasons
- **Duplicate** - Same as another issue
- **Invalid** - Not actually an issue
- **Needs more info** - Waiting for additional details

---

## Issue Examples

### Example: Good Bug Report

```markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```

### 示例：良好的功能请求

```markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```

---

## 相关文档

- 行为准则
- 贡献工作流程
- 拉取请求指南
- 贡献概述

---

#XOOPS#问题#bug-reporting#功能-requests#github