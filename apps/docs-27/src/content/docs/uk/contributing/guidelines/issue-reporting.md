---
title: "Інструкції щодо звітування про проблеми"
description: "Як ефективно повідомляти про помилки, запити на функції та інші проблеми"
---
> Ефективні звіти про помилки та запити на функції мають вирішальне значення для розробки XOOPS. Цей посібник допоможе вам створити високоякісні випуски.

---

## Перед звітуванням

### Перевірте існуючі проблеми

**Завжди спочатку шукайте:**

1. Перейдіть до [Проблеми GitHub](https://github.com/XOOPS/XoopsCore27/issues)
2. Шукайте ключові слова, пов’язані з вашою проблемою
3. Перевірте закриті питання - можливо, вони вже вирішені
4. Подивіться на запити на вилучення - можливо, вони виконуються

Використовуйте пошукові фільтри:
- `is:issue is:open label:bug` - Відкриті помилки
- `is:issue is:open label:feature` - Відкрити запити функцій
- `is:issue sort:updated` - Нещодавно оновлені проблеми

### Це справді проблема?

Розглянемо спочатку:

- **Проблема конфігурації?** - Перевірте документацію
- **Питання про використання?** - Запитайте на форумах або в спільноті Discord
- **Проблема безпеки?** - Див. розділ #security-issues нижче
- **Специфічний модуль?** - Повідомте супроводжувачу модуля
- **Окрема тема?** - Звіт автору теми

---

## Типи проблем

### Звіт про помилку

Помилка — це несподівана поведінка або дефект.

**Приклади:**
- Вхід не працює
- Помилки бази даних
- Відсутня перевірка форми
- Вразливість безпеки

### Запит функції

Запит на функцію – це пропозиція щодо нових функцій.

**Приклади:**
— Додано підтримку нової функції
- Покращити наявну функціональність
- Додайте відсутню документацію
— Покращення продуктивності

### Покращення

Покращення покращує наявну функціональність.

**Приклади:**
— Кращі повідомлення про помилки
— Покращена продуктивність
- Кращий дизайн API
- Кращий досвід користувача

### Документація

Проблеми з документацією включають відсутність або неправильність документації.

**Приклади:**
- Неповна документація API
- Застарілі довідники
- Відсутні приклади коду
- Помилки в документації

---

## Повідомлення про помилку

### Шаблон звіту про помилку
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
### Гарний приклад звіту про помилку
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
### Приклад поганого звіту про помилку
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

## Повідомлення про запит функції

### Шаблон запиту функції
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
### Гарний приклад запиту функції
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

## Проблеми безпеки

### НЕ повідомляйте публічно

**Ніколи не створюйте публічну проблему щодо вразливості системи безпеки.**

### Повідомити приватно

1. **Напишіть електронного листа команді безпеки:** security@xoops.org
2. **Включити:**
   - Опис вразливості
   - Кроки для відтворення
   - Потенційний вплив
   - Ваша контактна інформація

### Відповідальне розголошення

- Ми підтвердимо отримання протягом 48 годин
- Ми будемо надавати оновлення кожні 7 днів
- Ми будемо працювати над виправленням термінів
- Ви можете запросити кредит на відкриття
- Координувати час публічного оприлюднення

### Приклад проблеми безпеки
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

## Назва проблеми Рекомендації

### Гарні назви
```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```
### Бідні назви
```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```
### Вказівки щодо назви

- **Будьте конкретними** - Згадайте, що і де
- **Будьте лаконічними** - До 75 символів
- **Використовуйте теперішній час** - «показує порожню сторінку», а не «показує порожню»
- **Включити контекст** - «на панелі адміністратора», «під час встановлення»
- **Уникайте загальних слів** - Не "виправити", "допомогти", "проблема"

---

## Опис проблеми Рекомендації

### Додайте важливу інформацію

1. **Що** – чіткий опис проблеми
2. **Де** – яка сторінка, модуль чи функція
3. **Коли** – етапи відтворення
4. **Середовище** - версія, ОС, браузер, PHP
5. **Чому** – чому це важливо

### Використовуйте форматування коду
```markdown
Error message: `Error: Cannot find user`

Code snippet:
```
php
$user = $this->getUser($id);
якщо (!$user) {
    echo "Помилка: не вдається знайти користувача";
}
```
```
### Додайте знімки екрана

Для проблем інтерфейсу користувача включіть:
- Скріншот проблеми
- Скріншот очікуваної поведінки
- Позначте, що не так (стрілки, кружечки)

### Використовуйте мітки

Додайте мітки для категоризації:
- `bug` - звіт про помилку
- `enhancement` - запит на покращення
- `documentation` - Проблема з документацією
- `help wanted` - Шукаю допомоги
- `good first issue` - Добре для нових учасників

---

## Після звітування

### Будьте чуйними

- Перевірте наявність питань у коментарях до випуску
- Надайте додаткову інформацію, якщо потрібно
— Перевірте запропоновані виправлення
- Перевірте наявність помилки в нових версіях

### Дотримуйтесь етикету

- Будьте поважними та професійними
- Припускайте добрі наміри
- Не вимагайте виправлення - розробники волонтери
- Запропонуйте допомогу, якщо це можливо
- Дякую дописувачам за роботу

### Зосередьтеся на проблемі

- Дотримуйтесь теми
- Не обговорюйте незв'язані питання
- Натомість посилання на пов’язані питання
- Не використовуйте питання для голосування за особливості

---

## Що відбувається з проблемами

### Процес сортування

1. **Створено нову проблему** - GitHub повідомляє розробників
2. **Початкова перевірка** - Перевірено на ясність і дублікати
3. **Присвоєння мітки** - категоризація та пріоритетність
4. **Призначення** - призначається комусь, якщо це доречно
5. **Обговорення** – за потреби збирається додаткова інформація

### Рівні пріоритету

- **Критичний** - втрата даних, безпека, повна поломка
- **Високий** - основна функція не працює, впливає на багатьох користувачів
- **Середній** - Частина функції не працює, доступне обхідне рішення
- **Низький** – незначна проблема, косметичний або нішевий варіант використання

### Результати вирішення

- **Виправлено** - проблему вирішено в PR
- **Не виправляється** - Відхилено з технічних або стратегічних причин
- **Дублікат** - те саме, що й інша проблема
- **Недійсний** - насправді це не проблема
- **Потрібна додаткова інформація** - Чекаємо додаткових деталей

---

## Приклади проблем

### Приклад: хороший звіт про помилку
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
### Приклад: Хороший запит на функцію
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

## Пов'язана документація

- Кодекс поведінки
- Робочий процес внеску
- Інструкції щодо запиту на отримання
- Огляд внеску

---

#xoops #issues #bug-reporting #feature-requests #github