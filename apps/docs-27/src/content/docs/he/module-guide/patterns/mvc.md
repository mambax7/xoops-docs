---
title: "MVC תבנית ב-XOOPS"
description: "יישום ארכיטקטורת Model-View-Controller במודולים של XOOPS"
---
<span class="version-badge version-xmf">XMF נדרש</span> <span class="version-badge version-40x">4.0.x מקורי</span>

:::הערה[לא בטוח אם זה התבנית הנכונה?]
ראה [בחירת דפוס גישה לנתונים](../Choosing-Data-Access-Pattern.md) לקבלת הדרכה לגבי מתי להשתמש ב-MVC לעומת דפוסים פשוטים יותר.
:::

:::זהירות[הבהרה: XOOPS אדריכלות]
**סטנדרטי XOOPS 2.5.x** משתמש בתבנית **Page Controller** (נקראת גם Transaction Script), לא MVC. מודולים מדור קודם משתמשים ב-`index.php` עם כולל ישיר, אובייקטים גלובליים (`$xoopsUser`, `$xoopsDB`), וגישה לנתונים מבוססת מטפל.

**כדי להשתמש ב-MVC ב-XOOPS 2.5.x**, אתה זקוק ל-**XMF Framework** המספקת תמיכה בניתוב ובבקר.

**XOOPS 4.0** יתמוך באופן טבעי ב-MVC עם PSR-15 תוכנת ביניים וניתוב מתאים.

ראה גם: [אדריכלות XOOPS נוכחית](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

דפוס ה-Model-View-Controller (MVC) הוא דפוס ארכיטקטוני בסיסי להפרדת חששות במודולים XOOPS. דפוס זה מחלק יישום לשלושה רכיבים מחוברים זה לזה.

## MVC הסבר

### דגם
**המודל** מייצג את הנתונים וההיגיון העסקי של האפליקציה שלך. זה:
- ניהול התמדה של נתונים
- מיישמת כללים עסקיים
- מאמת נתונים
- מתקשר עם מסד הנתונים
- אינו תלוי בממשק המשתמש

### הצג
ה-**View** אחראי להצגת הנתונים למשתמש. זה:
- מעבד HTML תבניות
- מציג נתוני דגם
- מטפל במצגת ממשק משתמש
- שולח פעולות משתמש לבקר
- צריך להכיל היגיון מינימלי

### בקר
**הבקר** מטפל באינטראקציות של משתמשים ובקואורדינטות בין דגם לתצוגה. זה:
- מקבל בקשות משתמשים
- מעבד נתוני קלט
- קורא לשיטות מודל
- בוחר תצוגות מתאימות
- מנהל את זרימת האפליקציה

## XOOPS יישום

ב- XOOPS, דפוס MVC מיושם באמצעות מטפלים ותבניות עם מנוע Smarty המספק תמיכה בתבניות.

### מבנה מודל בסיסי
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```
### הטמעת בקר
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```
### הצג תבנית
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```
## שיטות עבודה מומלצות

- שמור על היגיון עסקי במודלים
- שמור מצגת בתצוגות  
- שמור routing/coordination בבקרים
- אין לערבב חששות בין שכבות
- אימות כל הקלט ברמת הבקר

## תיעוד קשור

ראה גם:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) לגישה מתקדמת לנתונים
- [שכבת שירות](../Patterns/Service-Layer.md) להפשטה של לוגיקה עסקית
- [קוד-ארגון](../Best-Practices/Code-Organization.md) עבור מבנה הפרויקט
- [בדיקה](../Best-Practices/Testing.md) עבור אסטרטגיות בדיקה של MVC

---

תגיות: #mvc #patterns #architecture #module-development #design-patterns