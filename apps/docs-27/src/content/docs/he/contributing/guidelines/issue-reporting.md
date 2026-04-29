---
title: "הנחיות לדיווח על בעיות"
description: "כיצד לדווח ביעילות על באגים, בקשות תכונה ובעיות אחרות"
---
> דוחות באגים יעילים ובקשות לתכונות חיוניים לפיתוח XOOPS. מדריך זה עוזר לך ליצור בעיות באיכות גבוהה.

---

## לפני הדיווח

### בדוק בעיות קיימות

**חפש תמיד קודם:**

1. עבור אל [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
2. חפש מילות מפתח הקשורות לבעיה שלך
3. בדוק בעיות סגורות - ייתכן שכבר נפתרו
4. תסתכל על בקשות משיכה - עשוי להיות בתהליך

השתמש במסנני חיפוש:
- `is:issue is:open label:bug` - באגים פתוחים
- `is:issue is:open label:feature` - בקשות תכונה פתוחות
- `is:issue sort:updated` - בעיות שעודכנו לאחרונה

### האם זו באמת בעיה?

שקול תחילה:

- **בעיית תצורה?** - בדוק את התיעוד
- **שאלת שימוש?** - שאל בפורומים או בקהילת Discord
- **בעיית אבטחה?** - עיין בסעיף #security-issues למטה
- **ספציפי למודול?** - דווח למנהל המודול
- **ספציפי לנושא?** - דווח למחבר הנושא

---

## סוגי בעיות

### דוח באגים

באג הוא התנהגות או פגם בלתי צפויים.

**דוגמאות:**
- הכניסה לא עובדת
- שגיאות במסד נתונים
- חסר אימות טופס
- פגיעות אבטחה

### בקשת תכונה

בקשת תכונה היא הצעה לפונקציונליות חדשה.

**דוגמאות:**
- הוסף תמיכה בתכונה חדשה
- שפר את הפונקציונליות הקיימת
- הוסף תיעוד חסר
- שיפורי ביצועים

### שיפור

שיפור משפר את הפונקציונליות הקיימת.

**דוגמאות:**
- הודעות שגיאה טובות יותר
- ביצועים משופרים
- עיצוב טוב יותר של API
- חווית משתמש טובה יותר

### תיעוד

בעיות תיעוד כוללות תיעוד חסר או שגוי.

**דוגמאות:**
- תיעוד API לא שלם
- מדריכים מיושנים
- חסרות דוגמאות קוד
- שגיאות הקלדה בתיעוד

---

## דיווח על באג

### תבנית דיווח באגים
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
### דוגמה לדוח באג טוב
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
### דוגמה לקויה של דיווח באג
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

## דיווח על בקשת תכונה

### תבנית בקשת תכונה
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
### דוגמה לבקשת תכונה טובה
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

## בעיות אבטחה

### האם NOT דווח באופן פומבי

**לעולם אל תיצור בעיה ציבורית עבור פרצות אבטחה.**

### דווח באופן פרטי

1. **שלח אימייל לצוות האבטחה:** security@xoops.org
2. **כלול:**
   - תיאור הפגיעות
   - שלבים להתרבות
   - השפעה פוטנציאלית
   - פרטי הקשר שלך

### חשיפה אחראית

- אנו נאשר קבלה תוך 48 שעות
- אנו נספק עדכונים כל 7 ימים
- נעבוד על ציר זמן קבוע
- אתה יכול לבקש קרדיט על הגילוי
- תיאום עיתוי החשיפה לציבור

### דוגמה לבעיית אבטחה
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

## שיטות מומלצות של כותרת גיליון

### כותרות טובות
```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```
### כותרות גרועות
```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```
### הנחיות כותרת

- **היה ספציפי** - ציין מה ואיפה
- **היה תמציתי** - מתחת ל-75 תווים
- **השתמש בזמן הווה** - "מראה דף ריק" לא "הראה ריק"
- **כלול הקשר** - "בפאנל ניהול", "במהלך ההתקנה"
- **הימנע ממילים כלליות** - לא "תיקון", "עזרה", "בעיה"

---

## נושא תיאור שיטות עבודה מומלצות

### כלול מידע חיוני

1. **מה** - תיאור ברור של הבעיה
2. **היכן** - איזה עמוד, מודול או תכונה
3. **מתי** - שלבים לשכפול
4. **סביבה** - גרסה, מערכת הפעלה, דפדפן, PHP
5. **למה** - למה זה חשוב

### השתמש בעיצוב קוד
```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "שגיאה: לא ניתן למצוא משתמש";
}
```
```
### כלול צילומי מסך

לבעיות בממשק המשתמש, כלול:
- צילום מסך של הבעיה
- צילום מסך של התנהגות צפויה
- הערה מה לא בסדר (חצים, עיגולים)

### השתמש בתוויות

הוסף תוויות לקטגוריות:
- `bug` - דוח באג
- `enhancement` - בקשת שיפור
- `documentation` - בעיית תיעוד
- `help wanted` - מחפש עזרה
- `good first issue` - טוב לתורמים חדשים

---

## לאחר הדיווח

### היו מגיבים

- בדוק אם יש שאלות בהערות לגיליון
- ספק מידע נוסף אם תתבקש
- בדוק את התיקונים המוצעים
- ודא שהבאג עדיין קיים עם גרסאות חדשות

### עקוב אחר כללי ההתנהגות

- היו מכבדים ומקצועיים
- נניח כוונות טובות
- אל תדרוש תיקונים - מפתחים הם מתנדבים
- הציעו לעזור במידת האפשר
- תודה לתורמים על עבודתם

### שמור על התמקדות בנושא

- הישאר על הנושא
- אל תדון בנושאים לא קשורים
- קישור לנושאים קשורים במקום זאת
- אל תשתמש בבעיות להצבעת תכונה

---

## מה קורה לבעיות

### תהליך טריאג'

1. **נוצרה גיליון חדש** - GitHub מודיע למנהלים
2. **סקירה ראשונית** - נבדקה בהירות וכפולות
3. **הקצאת תווית** - מסווג ומתעדף
4. **משימה** - הוקצתה למישהו אם מתאים
5. **דיון** - מידע נוסף נאסף במידת הצורך

### רמות עדיפות

- **קריטי** - אובדן נתונים, אבטחה, שבר מוחלט
- **גבוה** - התכונה העיקרית שבורה, משפיעה על משתמשים רבים
- **בינוני** - חלק מהתכונה שבורה, פתרון זמין
- **נמוך** - בעיה קטנה, מקרה שימוש בקוסמטיקה או נישה

### תוצאות רזולוציה

- **תוקן** - הבעיה נפתרה ביח"צ
- **לא יתוקן** - נדחה מסיבות טכניות או אסטרטגיות
- **כפול** - זהה לסוגיה אחרת
- **לא חוקי** - לא ממש בעיה
- **צריך מידע נוסף** - ממתין לפרטים נוספים

---

## דוגמאות לבעיות

### דוגמה: דוח באג טוב
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
### דוגמה: בקשת תכונה טובה
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

## תיעוד קשור

- קוד התנהגות
- זרימת עבודה של תרומה
- משוך הנחיות בקשה
- סקירה תורמת

---

#xoops #בעיות #דיווח באגים #פיצ'רים-בקשות #github