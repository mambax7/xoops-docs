---
title: שדרוג מ-XOOPS 2.5 ל-2.7
description: מדריך שלב אחר שלב לשדרוג בטוח של התקנת XOOPS מ-2.5.x ל-2.7.x.
---
:::זהירות[גבה תחילה]
גבה תמיד את מסד הנתונים והקבצים שלך לפני השדרוג. אין חריגים.
:::

## מה השתנה ב-2.7

- **PHP 8.2+ נדרש** — PHP 7.x אינו נתמך עוד
- **Composer-managed תלות** — ספריות ליבה המנוהלות באמצעות `composer.json`
- **PSR-4 טעינה אוטומטית** — כיתות מודול יכולות להשתמש במרחבי שמות
- **משופר XoopsObject** — בטיחות מסוג `getVar()` חדשה, הוצאה משימוש `obj2Array()`
- **מערכת Bootstrap 5 admin** - פאנל ניהול נבנה מחדש עם Bootstrap 5

## רשימת רשימת טרום-שדרוג

- [ ] PHP 8.2+ זמין בשרת שלך
- [ ] גיבוי מלא של מסד הנתונים (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] גיבוי קובץ מלא של ההתקנה שלך
- [ ] רשימה של מודולים מותקנים וגרסאותיהם
- [ ] ערכת נושא מותאמת אישית מגובה בנפרד

## שלבי שדרוג

### 1. הכנס את האתר למצב תחזוקה
```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```
### 2. הורד XOOPS 2.7
```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```
### 3. החלף קבצי ליבה

העלה את הקבצים החדשים, **לא כולל**:
- `uploads/` — הקבצים שהעלית
- `xoops_data/` — התצורה שלך
- `modules/` — המודולים המותקנים שלך
- `themes/` — ערכות הנושא שלך
- `mainfile.php` — תצורת האתר שלך
```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```
### 4. הפעל את סקריפט השדרוג

נווט אל `https://yourdomain.com/upgrade/` בדפדפן שלך.
אשף השדרוג יחיל העברות של מסד נתונים.

### 5. עדכון מודולים

XOOPS 2.7 מודולים חייבים להיות תואמים PHP 8.2.
בדוק ב-[Module Ecosystem](/xoops-docs/2.7/module-guide/introduction/) עבור גרסאות מעודכנות.

ב-Admin → Modules, לחץ על **עדכן** עבור כל מודול מותקן.

### 6. הסר את מצב התחזוקה ובדוק

הסר את הקו `XOOPS_MAINTENANCE` מ-`mainfile.php` ו
ודא שכל הדפים נטענים כהלכה.

## בעיות נפוצות

**שגיאות "הכיתה לא נמצאה" לאחר השדרוג**
- הפעל `composer dump-autoload` בשורש XOOPS
- נקה את ספריית `xoops_data/caches/`

**המודול נשבר לאחר עדכון**
- בדוק את מהדורות GitHub של המודול עבור גרסה תואמת 2.7
- המודול עשוי להזדקק לשינויי קוד עבור PHP 8.2 (פונקציות שהוצאו משימוש, מאפיינים מוקלדים)

**פאנל ניהול CSS שבור**
- נקה את cache הדפדפן שלך
- ודא ש-`xoops_lib/` הוחלפה במלואה במהלך העלאת הקובץ