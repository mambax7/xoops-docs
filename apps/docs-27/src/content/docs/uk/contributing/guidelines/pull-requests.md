---
title: "Інструкції щодо запиту на витяг"
description: "Інструкції щодо надсилання запитів на підключення до проектів XOOPS"
---
У цьому документі містяться вичерпні вказівки щодо надсилання запитів на підключення до проектів XOOPS. Дотримання цих вказівок забезпечує плавний перегляд коду та швидше злиття.

## Перед створенням Pull Request

### Крок 1. Перевірте наявні проблеми
```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```
### Крок 2: Розщеплення та клонування репозиторію
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
### Крок 3: Створіть гілку функції
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
### Крок 4: Внесіть зміни
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
## Стандарти повідомлень фіксації

### Хороші повідомлення фіксації

Використовуйте чіткі описові повідомлення за такими шаблонами:
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
### Категорії типу фіксації

| Тип | Опис | Приклад |
|------|-------------|---------|
| `feat` | Нова функція | `feat: add user dashboard widget` |
| `fix` | Виправлення помилок | `fix: resolve cache invalidation bug` |
| `docs` | Документація | `docs: update API reference` |
| `style` | Стиль коду (без зміни логіки) | `style: format imports` |
| `refactor` | Рефакторинг коду | `refactor: simplify service layer` |
| `perf` | Покращення продуктивності | `perf: optimize database queries` |
| `test` | Перевірка змін | `test: add integration tests` |
| `chore` | Build/tooling зміни | `chore: update dependencies` |

## Опис запиту на отримання

### PR шаблон
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
## Вимоги до якості коду

### Стиль коду

Дотримуйтесь інструкцій щодо стилю коду:
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
## Вимоги до тестування

### Модульні тести
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
### Виконання тестів
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```
## Робота з філіями

### Підтримуйте оновлення гілки
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
## Створення Pull Request

### Формат назви PR
```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```
## Процес перевірки коду

### Що шукають рецензенти

1. **Правильність**
   - Чи вирішує код поставлену проблему?
   - Чи обробляються крайові випадки?
   - Чи доцільна обробка помилок?

2. **Якість**
   - Чи відповідає він стандартам кодування?
   - Це ремонтопридатне?
   — Добре перевірено?

3. **Продуктивність**
   - Чи є регресії продуктивності?
   - Чи оптимізовані запити?
   - Чи доцільне використання пам'яті?

4. **Безпека**
   - Перевірка введених даних?
   - SQL профілактика ін'єкцій?
   - Authentication/authorization?

### Відповідь на відгуки
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
## Поширені проблеми з PR і їх вирішення

### Проблема 1: PR занадто великий

**Проблема:** рецензенти не можуть ефективно розглядати масові рекламні оголошення

**Рішення:** Розбийте на менші PR
- Перший PR: основні зміни
- Другий ПР: Тести
- Третій PR: Документація

### Проблема 2: тести не включені

**Проблема:** Рецензенти не можуть перевірити функціональність

**Рішення:** додайте комплексні тести перед подачею

### Проблема 3: Конфлікти з Main

**Проблема:** Ваша гілка не синхронізована з основною

**Рішення:** Перебазуйте на останню основну базу
```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```
## Після злиття

### Очищення
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
## Підсумок найкращих практик

### Що робити

- Створюйте описові повідомлення комітів
- Здійснюйте цілеспрямований, одноцільовий PR
- Включіть тести для нових функцій
- Оновити документацію
- Довідкові питання
- Зберігайте чіткі описи PR
- Швидко відповідайте на відгуки

### Не варто

- Включіть непов'язані зміни
- Об’єднайте main у свою гілку (використовуйте rebase)
- Примусове натискання після початку перегляду
- Пропустити тести
- Надіслати незавершену роботу
- Ігноруйте відгуки про перевірку коду

## Пов'язана документація

- ../Contributing - Огляд участі
- Code-Style - Правила стилю коду
- ../../03-Module-Development/Best-Practices/Testing - Тестування найкращих практик
- ../Architecture-Decisions/ADR-Index - Архітектурні рекомендації

## Ресурси

- [Документація Git](https://git-scm.com/doc)
- [GitHub Довідка щодо запиту витягування](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Звичайні коміти](https://www.conventionalcommits.org/)
- [XOOPS GitHub Організація](https://github.com/XOOPS)

---

**Останнє оновлення:** 2026-01-31
**Стосується:** Усі проекти XOOPS
**Репозиторій:** https://github.com/XOOPS/XOOPS