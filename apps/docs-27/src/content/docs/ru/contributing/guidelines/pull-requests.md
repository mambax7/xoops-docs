---
title: "Рекомендации по pull request"
description: "Рекомендации для отправки pull request в проекты XOOPS"
---

Этот документ предоставляет комплексные рекомендации для отправки pull request в проекты XOOPS. Следование этим рекомендациям обеспечивает плавное рассмотрение кода и более быстрое слияние.

## Перед созданием pull request

### Шаг 1: Проверьте существующие проблемы

```
1. Посетите репозиторий GitHub
2. Перейдите на вкладку Issues
3. Поищите существующие проблемы, связанные с вашим изменением
4. Проверьте как открытые, так и закрытые проблемы
```

### Шаг 2: Заложить форк и клонировать репозиторий

```bash
# Заложить репозиторий на GitHub
# Нажмите кнопку "Fork" на странице репозитория

# Клонировать ваш форк
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Добавить удаленный апстрим
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Проверить удаленные серверы
git remote -v
# Должно показать: origin (ваш форк) и upstream (официальный)
```

### Шаг 3: Создать ветку функции

```bash
# Обновить главную ветку
git fetch upstream
git checkout main
git merge upstream/main

# Создать ветку функции
# Используйте описательные названия: bugfix/issue-number или feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### Шаг 4: Сделать ваши изменения

```bash
# Внесите изменения в ваши файлы
# Следуйте рекомендациям стиля кода

# Подготовить изменения
git add .

# Совершить с четким сообщением
git commit -m "Fix database connection timeout issue"

# Создать несколько фиксаций для логических изменений
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## Стандарты сообщений коммитов

### Хорошие сообщения коммитов

Используйте четкие описательные сообщения согласно этим шаблонам:

```
# Формат
<type>: <subject>

<body>

<footer>

# Пример 1: Исправление ошибки
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Пример 2: Функция
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### Категории типов коммитов

| Тип | Описание | Пример |
|------|-------------|---------|
| `feat` | Новая функция | `feat: add user dashboard widget` |
| `fix` | Исправление ошибки | `fix: resolve cache invalidation bug` |
| `docs` | Документация | `docs: update API reference` |
| `style` | Стиль кода (без изменения логики) | `style: format imports` |
| `refactor` | Рефакторинг кода | `refactor: simplify service layer` |
| `perf` | Улучшение производительности | `perf: optimize database queries` |
| `test` | Изменения тестов | `test: add integration tests` |
| `chore` | Сборка/инструменты изменения | `chore: update dependencies` |

## Описание pull request

### Шаблон PR

```markdown
## Описание
Четкое описание сделанных изменений и почему.

## Тип изменения
- [ ] Исправление ошибки
- [ ] Новая функция
- [ ] Нарушающее изменение
- [ ] Обновление документации

## Связанные проблемы
Closes #123
Related to #456

## Сделанные изменения
- Изменение 1
- Изменение 2
- Изменение 3

## Тестирование
- [ ] Протестировано локально
- [ ] Все тесты проходят
- [ ] Добавлены новые тесты
- [ ] Шаги ручного тестирования включены

## Контрольный список
- [ ] Код следует рекомендациям стиля
- [ ] Проведена самопроверка
- [ ] Добавлены комментарии к сложной логике
- [ ] Документация обновлена
- [ ] Нет новых предупреждений
- [ ] Добавлены тесты для новой функциональности
- [ ] Все тесты проходят
```

## Требования качества кода

### Стиль кода

Следуйте рекомендациям Code-Style:

```php
<?php
// Хорошо: Стиль PSR-12
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

## Требования к тестированию

### Модульные тесты

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

### Запуск тестов

```bash
# Запустить все тесты
vendor/bin/phpunit

# Запустить конкретный файл теста
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Запустить с покрытием
vendor/bin/phpunit --coverage-html coverage/
```

## Работа с ветками

### Держите ветку обновленной

```bash
# Получить последнее из апстрима
git fetch upstream

# Переложить на последний main
git rebase upstream/main

# Или объединить, если вы предпочитаете
git merge upstream/main

# Force push если переложили (предупреждение: только на вашей ветке!)
git push -f origin bugfix/123-fix-database-connection
```

## Создание pull request

### Формат названия PR

```
[Type] Short description (fix/feature/docs)

Примеры:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Процесс рассмотрения кода

### На что смотрят рецензенты

1. **Правильность**
   - Решает ли код заявленную проблему?
   - Обработаны ли крайние случаи?
   - Уместна ли обработка ошибок?

2. **Качество**
   - Следует ли это стандартам кодирования?
   - Легко ли это поддерживать?
   - Хорошо ли это протестировано?

3. **Производительность**
   - Есть ли регрессии производительности?
   - Оптимизированы ли запросы?
   - Разумно ли использование памяти?

4. **Безопасность**
   - Валидация входа?
   - Предотвращение SQL-инъекции?
   - Аутентификация/авторизация?

### Ответ на обратную связь

```bash
# Решить обратную связь
# Отредактировать файлы на основе комментариев обзора

# Совершить изменения
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Отправить изменения
git push origin bugfix/123-fix-database-connection
```

## Распространенные проблемы PR и решения

### Проблема 1: PR слишком большой

**Проблема:** Рецензенты не могут эффективно рассматривать огромные PR

**Решение:** Разбить на меньшие PR
- Первый PR: Основные изменения
- Второй PR: Тесты
- Третий PR: Документация

### Проблема 2: Нет включенных тестов

**Проблема:** Рецензенты не могут проверить функциональность

**Решение:** Добавить комплексные тесты перед отправкой

### Проблема 3: Конфликты с главной ветвой

**Проблема:** Ваша ветка не синхронизирована с главной

**Решение:** Переложить на последний main

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## После слияния

### Очистка

```bash
# Переключиться на главную
git checkout main

# Обновить главную
git pull upstream main

# Удалить локальную ветку
git branch -d bugfix/123-fix-database-connection

# Удалить удаленную ветку
git push origin --delete bugfix/123-fix-database-connection
```

## Краткое резюме лучших практик

### Делайте

- Создавайте описательные сообщения коммитов
- Делайте сосредоточенные PR с единственной целью
- Включайте тесты для новой функциональности
- Обновляйте документацию
- Ссылайтесь на связанные проблемы
- Держите описания PR в ясности
- Отвечайте быстро на обзоры

### Не делайте

- Включайте несвязанные изменения
- Объединяйте главную в вашу ветку (используйте rebase)
- Force push после начала обзора
- Пропускайте тесты
- Отправляйте незавершенную работу
- Игнорируйте отзывы рецензентов

## Связанная документация

- ../Contributing - Contributing overview
- Code-Style - Рекомендации стиля кода
- ../../03-Module-Development/Best-Practices/Testing - Лучшие практики тестирования
- ../Architecture-Decisions/ADR-Index - Архитектурные рекомендации

## Ресурсы

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**Последнее обновление:** 2026-01-31
**Применяется к:** Все проекты XOOPS
**Репозиторий:** https://github.com/XOOPS/XOOPS
