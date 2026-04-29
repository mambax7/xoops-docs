---
title: "נספח 5: הגבר את האבטחה שלך XOOPS הַתקָנָה"
---

לאחר ההתקנה XOOPS 2.7.0, בצע את הצעדים הבאים כדי להקשיח את האתר. כל שלב הוא אופציונלי בנפרד, אך יחד הם מעלים את האבטחה הבסיסית של ההתקנה באופן משמעותי.

## 1. התקן והגדר את מודול המגן

החבילה `protector` מודול הוא ה XOOPS חומת אש. אם לא התקנת אותו במהלך האשף הראשוני, התקן אותו ממסך Admin → מודולים כעת.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

פתח את לוח הניהול של Protector ובדוק את האזהרות שהוא מציג. מוֹרֶשֶׁת PHP הנחיות כגון `register_globals` כבר לא קיים (PHP 8.2+ הסיר אותם), כך שלא תראה את האזהרות האלה יותר. אזהרות נוכחיות מתייחסות בדרך כלל להרשאות ספרייה, הגדרות הפעלה ותצורת נתיב אמון.

## 2. נעילה `mainfile.php` ו `secure.php`

כאשר תוכנית ההתקנה מסתיימת היא מנסה לסמן את שני הקבצים כקריאה בלבד, אך חלק מהמארחים מחזירים את ההרשאות. אמת והגש בקשה מחדש במידת הצורך:

- `mainfile.php` → `0444` (בעלים, קבוצה, אחר לקריאה בלבד)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` מגדיר את קבועי הנתיב (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) ודגלי ייצור. `secure.php` מחזיק באישורי מסד הנתונים:

- ב-2.5.x, האישורים של מסד הנתונים היו חיים בהם `mainfile.php`. כעת הם מאוחסנים ב `xoops_data/data/secure.php`, אשר נטען על ידי `mainfile.php` בזמן ריצה. שְׁמִירָה `secure.php` בְּתוֹך `xoops_data/` - ספרייה שמומלץ להעביר מחוץ לשורש המסמך - מקשה הרבה יותר על תוקף להגיע לאישורים HTTP.

## 3. זז `xoops_lib/` ו `xoops_data/` מחוץ לשורש המסמך

אם עדיין לא עשית זאת, העבר את שתי הספריות הללו רמה אחת מעל שורש האינטרנט שלך ושנה את שמם. לאחר מכן עדכן את הקבועים המתאימים ב `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

הצבת ספריות אלו מחוץ לשורש המסמך מונעת גישה ישירה אליה Composerשל `vendor/` עץ, תבניות שמור, קבצי הפעלה, נתונים שהועלו ואישורי מסד הנתונים `secure.php`.

## 4. תצורת תחום קובצי Cookie

XOOPS 2.7.0 מציג שני קבועים של תחום קובצי Cookie `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

הנחיות:

- עזוב `XOOPS_COOKIE_DOMAIN` ריק אם אתה משרת XOOPS מתוך שם מארח בודד או מ-IP.
- השתמש במארח המלא (למשל. `www.example.com`) כדי להגדיר קובצי Cookie לשם המארח הזה בלבד.
- השתמש בדומיין הניתן לרישום (למשל. `example.com`) כאשר אתה רוצה לשתף עוגיות על פני `www.example.com`, `blog.example.com`וכו'
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` מאפשר XOOPS TLDs מורכבים מפוצלים נכון (`co.uk`, `com.au`, …) במקום להגדיר בטעות קובץ Cookie על האפקטיבי TLD.

## 5. דגלים של הפקה `mainfile.php`

`mainfile.dist.php` ספינות עם שני הדגלים האלה מוגדרים `false` לייצור:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

השאר אותם בהפקה. אפשר אותם באופן זמני בסביבת פיתוח או בימוי כאשר אתה רוצה:

- חפש שיחות מתמשכות של מסד נתונים מדור קודם (`XOOPS_DB_LEGACY_LOG = true`);
- משטח `E_USER_DEPRECATED` הודעות ופלט ניפוי באגים אחר (`XOOPS_DEBUG = true`).

## 6. מחק את תוכנית ההתקנה

לאחר סיום ההתקנה:

1. מחק כל שמו שונה `install_remove_*` ספרייה משורש האינטרנט.
2. מחק כל `install_cleanup_*.php` סקריפט שהאשף יצר במהלך הניקוי.
3. אשר את `install/` הספרייה כבר לא נגישה מעל HTTP.

השארת ספריית מתקין מושבתת אך קיימת היא סיכון נמוך אך ניתן להימנע ממנו.

## 7. שמור XOOPS ומודולים עדכניים

XOOPS עוקב אחר קצב תיקון קבוע. הירשם ל- XoopsCore27 GitHub מאגר עבור הודעות שחרור, ועדכן את האתר שלך וכל מודולי צד שלישי בכל פעם שגרסה חדשה נשלחת. עדכוני האבטחה עבור 2.7.x מתפרסמים דרך דף ההפצות של המאגר.
