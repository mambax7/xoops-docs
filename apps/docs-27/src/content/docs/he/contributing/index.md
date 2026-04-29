---
title: "הנחיות לתרומה"
description: "כיצד לתרום לפיתוח XOOPS CMS, תקני קידוד והנחיות קהילה"
---
# 🤝 תרומה ל- XOOPS

> הצטרף לקהילת XOOPS ועזור להפוך אותה לקהילת CMS הטובה בעולם.

---

## 📋 סקירה כללית

XOOPS הוא פרויקט בקוד פתוח המשגשג על תרומות מהקהילה. בין אם אתה מתקן באגים, מוסיף תכונות, משפר את התיעוד או עוזר לאחרים, התרומות שלך חשובות.

---

## 🗂️ תוכן המדור

### הנחיות
- קוד התנהגות
- זרימת עבודה של תרומה
- משוך הנחיות בקשה
- דיווח על בעיות

### סגנון קוד
- PHP תקני קידוד
- JavaScript תקנים
- CSS הנחיות
- Smarty תקני תבנית

### החלטות אדריכלות
- ADR אינדקס
- ADR תבנית
- ADR-001: אדריכלות מודולרית
- ADR-002: הפשטת מסד נתונים

---

## 🚀 תחילת העבודה

### 1. הגדר סביבת פיתוח
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
### 2. צור סניף תכונה
```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```
### 3. בצע שינויים

עקוב אחר תקני הקידוד וכתוב מבחנים לתכונות חדשות.

### 4. שלח בקשת משיכה
```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```
לאחר מכן צור Pull Request על GitHub.

---

## 📝 תקני קידוד

### PHP תקנים

XOOPS עוקב אחר תקני הקידוד PSR-1, PSR-4 וPSR-12.
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
### מוסכמות מפתח

| כלל | דוגמה |
|------|--------|
| שמות כיתות | `PascalCase` |
| שמות שיטות | `camelCase` |
| קבועים | `UPPER_SNAKE_CASE` |
| משתנים | `$camelCase` |
| קבצים | `ClassName.php` |
| הזחה | 4 רווחים |
| אורך קו | מקסימום 120 תווים |

### Smarty תבניות
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

## 🔀 זרימת עבודה של Git

### מתן שמות של סניפים

| הקלד | דפוס | דוגמה |
|------|--------|--------|
| תכונה | `feature/description` | `feature/add-user-export` |
| תיקוני באגים | `fix/description` | `fix/login-validation` |
| תיקון חם | `hotfix/description` | `hotfix/security-patch` |
| שחרור | `release/version` | `release/2.7.0` |

### Commit Messages

עקוב אחר התחייבויות קונבנציונליות:
```
<type>(<scope>): <subject>

<body>

<footer>
```
**סוגים:**
- `feat`: תכונה חדשה
- `fix`: תיקון באגים
- `docs`: תיעוד
- `style`: סגנון קוד (עיצוב)
- `refactor`: שינוי קוד מחדש
- `test`: הוספת מבחנים
- `chore`: תחזוקה

**דוגמאות:**
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

## 🧪 בדיקה

### בדיקות ריצה
```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```
### כתיבת מבחנים
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

## 📋 משוך את רשימת הבקשות

לפני שליחת יחסי ציבור, ודא:

- [ ] הקוד עוקב אחר תקני הקידוד של XOOPS
- [ ] כל המבחנים עוברים
- [ ] לתכונות חדשות יש בדיקות
- [ ] התיעוד עודכן במידת הצורך
- [ ] אין התנגשויות מיזוג עם הסניף הראשי
- [ ] הודעות Commit הן תיאוריות
- [ ] תיאור יחסי ציבור מסביר שינויים
- [ ] בעיות קשורות מקושרות

---

## 🏗️ רשומות החלטות אדריכלות

ADRs מתעדים החלטות אדריכליות משמעותיות.

### ADR תבנית
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
### ADR נוכחיים

| ADR | כותרת | סטטוס |
|-----|-------|--------|
| ADR-001 | אדריכלות מודולרית | מקובל |
| ADR-002 | גישה למסד נתונים מונחה עצמים | מקובל |
| ADR-003 | Smarty מנוע תבנית | מקובל |
| ADR-004 | עיצוב מערכת אבטחה | מקובל |
| ADR-005 | PSR-15 Middleware (4.0.x) | מוצע |

---

## 🎖️ הכרה

תורמים מוכרים באמצעות:

- **רשימת תורמים** - רשום במאגר
- **הערות מהדורה** - קרדיט במהדורות
- **היכל התהילה** - תורמים מצטיינים
- **הסמכת מודול** - תג איכות למודולים

---

## 🔗 תיעוד קשור

- XOOPS 4.0 מפת דרכים
- מושגי ליבה
- פיתוח מודול

---

## 📚 משאבים

- [GitHub מאגר](https://github.com/XOOPS/XoopsCore27)
- [מעקב אחר בעיות](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS פורומים](https://xoops.org/modules/newbb/)
- [קהילת דיסקורד](https://discord.gg/xoops)

---

#xoops #תרומה #קוד פתוח #קהילה #פיתוח #תקני קידוד