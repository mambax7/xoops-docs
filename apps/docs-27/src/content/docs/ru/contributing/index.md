---
title: "Рекомендации по участию"
description: "Как участвовать в разработке XOOPS CMS, стандарты кодирования и рекомендации сообщества"
---

# 🤝 Участие в XOOPS

> Присоединитесь к сообществу XOOPS и помогите сделать его лучшей CMS в мире.

---

## 📋 Обзор

XOOPS — это проект с открытым исходным кодом, который процветает благодаря вкладу сообщества. Независимо от того, исправляете ли вы ошибки, добавляете функции, улучшаете документацию или помогаете другим, ваш вклад ценен.

---

## 🗂️ Содержание раздела

### Рекомендации
- Кодекс поведения
- Рабочий процесс участия
- Рекомендации по pull request
- Отчеты об ошибках

### Стиль кода
- Стандарты кодирования PHP
- Стандарты JavaScript
- Рекомендации CSS
- Стандарты шаблонов Smarty

### Решения об архитектуре
- Индекс ADR
- Шаблон ADR
- ADR-001: Модульная архитектура
- ADR-002: Абстракция базы данных

---

## 🚀 Начало работы

### 1. Настройка среды разработки

```bash
# Разветвите репозиторий на GitHub
# Затем клонируйте свой форк
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Добавьте удалённый репозиторий upstream
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Установите зависимости
composer install
```

### 2. Создание ветки для функции

```bash
# Синхронизируйте с upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Внесение изменений

Следуйте стандартам кодирования и напишите тесты для новых функций.

### 4. Отправка pull request

```bash
# Зафиксируйте изменения
git add .
git commit -m "Add: Brief description of changes"

# Отправьте на ваш форк
git push origin feature/my-feature
```

Затем создайте pull request на GitHub.

---

## 📝 Стандарты кодирования

### Стандарты PHP

XOOPS следует стандартам кодирования PSR-1, PSR-4 и PSR-12.

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

### Основные соглашения

| Правило | Пример |
|------|---------|
| Имена классов | `PascalCase` |
| Имена методов | `camelCase` |
| Константы | `UPPER_SNAKE_CASE` |
| Переменные | `$camelCase` |
| Файлы | `ClassName.php` |
| Отступ | 4 пробела |
| Длина строки | Макс 120 символов |

### Шаблоны Smarty

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

## 🔀 Рабочий процесс Git

### Наименование ветвей

| Тип | Шаблон | Пример |
|------|---------|---------|
| Функция | `feature/description` | `feature/add-user-export` |
| Исправление | `fix/description` | `fix/login-validation` |
| Критическое исправление | `hotfix/description` | `hotfix/security-patch` |
| Выпуск | `release/version` | `release/2.7.0` |

### Сообщения коммитов

Следуйте условным коммитам:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Типы:**
- `feat`: Новая функция
- `fix`: Исправление ошибки
- `docs`: Документация
- `style`: Стиль кода (форматирование)
- `refactor`: Рефакторинг кода
- `test`: Добавление тестов
- `chore`: Обслуживание

**Примеры:**
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

## 🧪 Тестирование

### Запуск тестов

```bash
# Запустить все тесты
./vendor/bin/phpunit

# Запустить конкретный набор тестов
./vendor/bin/phpunit --testsuite unit

# Запустить с покрытием
./vendor/bin/phpunit --coverage-html coverage/
```

### Написание тестов

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

## 📋 Контрольный список pull request

Перед отправкой PR убедитесь:

- [ ] Код соответствует стандартам кодирования XOOPS
- [ ] Все тесты проходят
- [ ] Новые функции имеют тесты
- [ ] Документация обновлена при необходимости
- [ ] Нет конфликтов слияния с основной ветвью
- [ ] Сообщения коммитов описательны
- [ ] Описание PR объясняет изменения
- [ ] Связанные проблемы связаны

---

## 🏗️ Записи решений об архитектуре

ADR документируют значительные решения об архитектуре.

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

### Текущие ADR

| ADR | Название | Статус |
|-----|-------|--------|
| ADR-001 | Модульная архитектура | Принято |
| ADR-002 | Объектно-ориентированный доступ к базе данных | Принято |
| ADR-003 | Механизм шаблонов Smarty | Принято |
| ADR-004 | Дизайн системы безопасности | Принято |
| ADR-005 | PSR-15 Middleware (4.0.x) | Предложено |

---

## 🎖️ Признание

Участники признаны через:

- **Список участников** - Указан в репозитории
- **Примечания к выпуску** - Упоминается в выпусках
- **Зал славы** - Выдающиеся участники
- **Сертификация модуля** - Значок качества для модулей

---

## 🔗 Связанная документация

- Дорожная карта XOOPS 4.0
- Основные концепции
- Разработка модулей

---

## 📚 Ресурсы

- [GitHub Repository](https://github.com/XOOPS/XoopsCore27)
- [Issue Tracker](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [Discord Community](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
