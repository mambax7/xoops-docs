---
title: "משוך את הנחיות הבקשה"
description: "הנחיות להגשת בקשות משיכה לפרויקטים של XOOPS"
---
מסמך זה מספק הנחיות מקיפות להגשת בקשות משיכה לפרויקטים של XOOPS. הקפדה על הנחיות אלו מבטיחה סקירת קוד חלקה וזמני מיזוג מהירים יותר.

## לפני יצירת בקשת משיכה

### שלב 1: בדוק אם קיימים בעיות
```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```
### שלב 2: מזלג ושכפל את המאגר
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
### שלב 3: צור סניף תכונה
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
### שלב 4: בצע את השינויים שלך
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
## התחייבות לתקני הודעה

### Good Commit Messages

השתמש בהודעות ברורות ותיאוריות בהתאם לדפוסים הבאים:
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
### קטגוריות סוג התחייבות

| הקלד | תיאור | דוגמה |
|------|----------------|--------|
| `feat` | תכונה חדשה | `feat: add user dashboard widget` |
| `fix` | תיקון באגים | `fix: resolve cache invalidation bug` |
| `docs` | תיעוד | `docs: update API reference` |
| `style` | סגנון קוד (ללא שינוי הגיוני) | `style: format imports` |
| `refactor` | Refactoring קוד | `refactor: simplify service layer` |
| `perf` | שיפור ביצועים | `perf: optimize database queries` |
| `test` | שינויים בבדיקה | `test: add integration tests` |
| `chore` | Build/tooling שינויים | `chore: update dependencies` |

## Pull Request Description

### תבנית יחסי ציבור
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
## דרישות איכות הקוד

### סגנון קוד

פעל לפי הנחיות סגנון קוד:
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
## דרישות בדיקה

### בדיקות יחידה
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
### בדיקות ריצה
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```
## עבודה עם סניפים

### עדכן את הסניף
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
## יצירת בקשת המשיכה

### פורמט כותרת יחסי ציבור
```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```
## תהליך סקירת קוד

### מה הסוקרים מחפשים

1. **נכונות**
   - האם הקוד פותר את הבעיה המוצהרת?
   - האם תיקי קצה מטופלים?
   - האם טיפול בשגיאות מתאים?

2. **איכות**
   - האם זה עומד בתקני קידוד?
   - האם ניתן לתחזוקה?
   - האם זה נבדק היטב?

3. **ביצועים**
   - יש רגרסיות בביצועים?
   - האם השאילתות עוברות אופטימיזציה?
   - האם השימוש בזיכרון סביר?

4. **אבטחה**
   - אימות קלט?
   - SQL מניעת הזרקה?
   - Authentication/authorization?

### תגובה למשוב
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
## בעיות ופתרונות נפוצים של יחסי ציבור

### בעיה 1: יחסי ציבור גדולים מדי

**בעיה:** סוקרים לא יכולים לסקור יחסי ציבור מסיביים ביעילות

**פתרון:** חלקו לאנשי יחסי ציבור קטנים יותר
- יחסי ציבור ראשונים: שינויים הליבה
- יחסי ציבור שני: מבחנים
- יחסי ציבור שלישי: תיעוד

### בעיה 2: אין בדיקות כלולים

**בעיה:** בודקים לא יכולים לאמת את הפונקציונליות

**פתרון:** הוסף מבחנים מקיפים לפני ההגשה

### בעיה 3: התנגשות עם ראשי

**בעיה:** הסניף שלך לא מסונכרן עם הראשי

**פתרון:** בסיס מחדש ב-main האחרון
```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```
## לאחר המיזוג

### ניקוי
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
## סיכום שיטות עבודה מומלצות

### מה לעשות

- צור הודעות מחויבות תיאוריות
- צור יחסי ציבור ממוקדים, חד-תכליתיים
- כלול בדיקות לפונקציונליות חדשה
- עדכון תיעוד
- התייחסות לנושאים הקשורים
- שמור על תיאורי יחסי ציבור ברורים
- השב מייד לביקורות

### אל תעשה

- כלול שינויים לא קשורים
- מיזוג ראשי לתוך הסניף שלך (השתמש בבסיס מחדש)
- דחיפה בכוח לאחר תחילת הבדיקה
- דלג על מבחנים
- הגשת עבודות בתהליך
- התעלם ממשוב על סקירת קוד

## תיעוד קשור

- ../Contributing - סקירה תורמת
- סגנון קוד - הנחיות סגנון קוד
- ../../03-Module-Development/Best-Practices/Testing - בדיקות שיטות עבודה מומלצות
- ../Architecture-Decisions/ADR-Index - הנחיות אדריכליות

## משאבים

- [תיעוד Git](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [התחייבויות קונבנציונליות](https://www.conventionalcommits.org/)
- [XOOPS GitHub ארגון](https://github.com/XOOPS)

---

**עדכון אחרון:** 2026-01-31
**חל על:** כל הפרויקטים XOOPS
**מאגר:** https://github.com/XOOPS/XOOPS