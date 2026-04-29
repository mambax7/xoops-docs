---
title: "دستورالعمل های درخواست را بکشید"
description: "دستورالعمل‌های ارسال درخواست‌های کشش به پروژه‌های XOOPS"
---
این سند دستورالعمل های جامعی را برای ارسال درخواست های کشش به پروژه های XOOPS ارائه می دهد. پیروی از این دستورالعمل‌ها، بازبینی کد نرم و زمان‌های ادغام سریع‌تر را تضمین می‌کند.

## قبل از ایجاد یک درخواست کشش

### مرحله 1: مشکلات موجود را بررسی کنید

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### مرحله 2: مخزن را Fork و کلون کنید

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

### مرحله 3: یک شاخه ویژگی ایجاد کنید

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

### مرحله 4: تغییرات خود را ایجاد کنید

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

## استانداردهای پیام متعهد

### پیام های تعهد خوب

از پیام های واضح و توصیفی به دنبال این الگوها استفاده کنید:

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

### دسته بندی های نوع commit

| نوع | توضیحات | مثال |
|------|-------------|---------|
| `feat` | ویژگی جدید | `feat: add user dashboard widget` |
| `fix` | رفع اشکال | `fix: resolve cache invalidation bug` |
| `docs` | مستندات | `docs: update API reference` |
| `style` | سبک کد (بدون تغییر منطقی) | `style: format imports` |
| `refactor` | بازسازی کد | `refactor: simplify service layer` |
| `perf` | بهبود عملکرد | `perf: optimize database queries` |
| `test` | تغییرات تست | `test: add integration tests` |
| `chore` | تغییرات Build/tooling | `chore: update dependencies` |

## توضیحات درخواست کشش

### الگوی روابط عمومی

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

## الزامات کیفیت کد

### سبک کد

دستورالعمل‌های Code-Style را دنبال کنید:

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

## الزامات تست

### تست های واحد

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use XOOPS\Database\XoopsDatabase;

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

### تست های در حال اجرا

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## کار با شعبه ها

### شعبه را به روز نگه دارید

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

## ایجاد درخواست کشش

### قالب عنوان PR

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## فرآیند بررسی کد

### آنچه که داوران به دنبال آن هستند

1. **صحت**
   - آیا کد مشکل بیان شده را حل می کند؟
   - آیا موارد لبه رسیدگی می شود؟
   - آیا رسیدگی به خطا مناسب است؟

2. **کیفیت**
   - آیا از استانداردهای کدنویسی پیروی می کند؟
   - آیا قابل نگهداری است؟
   - آیا به خوبی تست شده است؟

3. **عملکرد**
   - آیا رگرسیون عملکردی وجود دارد؟
   - آیا پرس و جوها بهینه شده اند؟
   - آیا استفاده از حافظه معقول است؟

4. **امنیت**
   - اعتبار سنجی ورودی؟
   - جلوگیری از تزریق SQL؟
   - Authentication/authorization؟

### پاسخ به بازخورد

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

## مسائل و راه حل های رایج روابط عمومی

### مسئله 1: روابط عمومی خیلی بزرگ است

**مشکل:** داوران نمی توانند روابط عمومی گسترده را به طور موثر بررسی کنند

** راه حل: ** به PR های کوچکتر تقسیم کنید
- روابط عمومی اول: تغییرات اصلی
- روابط عمومی دوم: تست ها
- روابط عمومی سوم: مستندسازی

### شماره 2: بدون آزمون گنجانده شده است

**مشکل:** بازبینان نمی توانند عملکرد را تأیید کنند

**راه حل:** قبل از ارسال تست های جامع را اضافه کنید

### مسئله 3: درگیری با اصلی

**مشکل:** شعبه شما با main همگام نیست

** راه حل: ** بر روی جدیدترین اصلی قرار دهید

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## پس از ادغام

### پاکسازی

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

## خلاصه بهترین شیوه ها

### کارها

- پیام های commit توصیفی ایجاد کنید
- روابط عمومی متمرکز و تک منظوره ایجاد کنید
- شامل تست هایی برای عملکرد جدید
- به روز رسانی اسناد
- ارجاع به مسائل مرتبط
- توضیحات روابط عمومی را واضح نگه دارید
- فورا به نظرات پاسخ دهید

### نباید

- شامل تغییرات نامرتبط
- اصلی را در شاخه خود ادغام کنید (از rebase استفاده کنید)
- فشار اجباری پس از شروع بررسی
- رد شدن از آزمون ها
- ارسال کار در حال انجام
- بازخورد بررسی کد را نادیده بگیرید

## مستندات مرتبط

- ../Contributing - مرور کلی
- Code-Style - دستورالعمل های سبک کد
- ../../03-Module-Development/Best-Practices/Testing - تست بهترین شیوه ها
- ../Architecture-Decisions/ADR-Index - دستورالعمل های معماری

## منابع

- [اسناد Git](https://git-scm.com/doc)
- [راهنمای درخواست کشش GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [تعهدات متعارف](https://www.conventionalcommits.org/)
- [سازمان XOOPS GitHub](https://github.com/XOOPS)

---

**آخرین به روز رسانی: ** 31-01-2026
** برای:** همه پروژه های XOOPS اعمال می شود
**مخزن:** https://github.com/XOOPS/XOOPS