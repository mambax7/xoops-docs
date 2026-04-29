---
title: "Інструкції щодо внесення"
description: "Як зробити внесок у розробку XOOPS CMS, стандарти кодування та правила спільноти"
---
# 🤝 Внесок у XOOPS

> Приєднуйтесь до спільноти XOOPS і допоможіть зробити її найкращою CMS у світі.

---

## 📋 Огляд

XOOPS — це проект із відкритим кодом, який процвітає завдяки внескам спільноти. Незалежно від того, чи ви виправляєте помилки, додаєте функції, покращуєте документацію чи допомагаєте іншим, ваш внесок є цінним.

---

## 🗂️ Зміст розділу

### Інструкції
- Кодекс поведінки
- Робочий процес внеску
- Інструкції щодо запиту на отримання
- Звіт про проблему

### Стиль коду
- Стандарти кодування PHP
- Стандарти JavaScript
- Керівні принципи CSS
- Стандарти шаблонів Smarty

### Архітектурні рішення
- Індекс ADR
- Шаблон ADR
- ADR-001: Модульна архітектура
- ADR-002: Абстракція бази даних

---

## 🚀 Початок роботи

### 1. Налаштуйте середовище розробки
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
### 2. Створіть гілку функції
```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```
### 3. Внесіть зміни

Дотримуйтеся стандартів кодування та пишіть тести для нових функцій.

### 4. Надішліть запит на отримання
```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```
Потім створіть Pull Request на GitHub.

---

## 📝 Стандарти кодування

### Стандарти PHP

XOOPS відповідає стандартам кодування PSR-1, PSR-4 і PSR-12.
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
### Ключові умовні позначення

| Правило | Приклад |
|------|---------|
| Імена класів | `PascalCase` |
| Назви методів | `camelCase` |
| Константи | `UPPER_SNAKE_CASE` |
| Змінні | `$camelCase` |
| Файли | `ClassName.php` |
| Відступ | 4 пробіли |
| Довжина лінії | Макс. 120 символів |

### Smarty Шаблони
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

## 🔀 Робочий процес Git

### Назви гілок

| Тип | Візерунок | Приклад |
|------|---------|---------|
| Особливість | `feature/description` | `feature/add-user-export` |
| Виправлення | `fix/description` | `fix/login-validation` |
| Виправлення | `hotfix/description` | `hotfix/security-patch` |
| Звільнення | `release/version` | `release/2.7.0` |

### Повідомлення фіксації

Дотримуйтеся звичайних комітів:
```
<type>(<scope>): <subject>

<body>

<footer>
```
**Типи:**
- `feat`: Нова функція
- `fix`: виправлено помилку
- `docs`: Документація
- `style`: Стиль коду (форматування)
- `refactor`: рефакторинг коду
- `test`: додавання тестів
- `chore`: Технічне обслуговування

**Приклади:**
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

## 🧪 Тестування

### Виконання тестів
```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```
### Написання тестів
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

## 📋 Контрольний список запитів на отримання

Перед подачею PR переконайтеся, що:

- [ ] Код відповідає стандартам кодування XOOPS
- [ ] Усі тести пройдені
- [ ] Нові функції мають тести
- [ ] Документацію оновлено, якщо потрібно
- [ ] Немає конфліктів злиття з основною гілкою
- [ ] Повідомлення фіксації є описовими
- [ ] PR опис пояснює зміни
- [ ] Пов’язані питання пов’язані

---

## 🏗️ Записи архітектурних рішень

ADR документують важливі архітектурні рішення.

### Шаблон ADR
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
### Поточні ADR

| ADR | Назва | Статус |
|-----|-------|--------|
| ADR-001 | Модульна архітектура | Прийнято |
| ADR-002 | Об'єктно-орієнтований доступ до бази даних | Прийнято |
| ADR-003 | Smarty Механізм шаблонів | Прийнято |
| ADR-004 | Проектування систем безпеки | Прийнято |
| ADR-005 | PSR-15 проміжне програмне забезпечення (4.0.x) | Запропонований |

---

## 🎖️ Визнання

Вкладники визнаються через:

- **Список співавторів** - зазначений у сховищі
- **Примітки до випуску** - Вказано у випусках
- **Зал слави** - видатні учасники
- **Сертифікація модулів** - значок якості для модулів

---

## 🔗 Пов’язана документація

- XOOPS 4.0 Дорожня карта
- Основні концепції
- Розробка модуля

---

## 📚 Ресурси

- [Репозиторій GitHub](https://github.com/XOOPS/XoopsCore27)
- [Відстеження проблем] (https://github.com/XOOPS/XoopsCore27/issues)
- [Форуми XOOPS](https://xoops.org/modules/newbb/)
- [Спільнота Discord] (https://discord.gg/xoops)

---

#xoops #допомога #open-source #community #development #coding-standards