---
title: "הערות למפתחים"
---

בעוד ההתקנה בפועל של XOOPS לשימוש בפיתוח דומה להתקנה הרגילה שתוארה כבר, ישנם הבדלים עיקריים בעת בניית מערכת מוכנה למפתחים.

הבדל אחד גדול בהתקנת מפתחים הוא שבמקום להתמקד רק בתוכן של ספריית _htdocs_, התקנת מפתחים שומרת על כל הקבצים, ושומרת אותם תחת שליטה בקוד המקור באמצעות git.

הבדל נוסף הוא שהספריות _xoops_data_ ו_xoops_lib_ יכולות בדרך כלל להישאר במקומן ללא שינוי שמות, כל עוד מערכת הפיתוח שלך אינה נגישה ישירות באינטרנט הפתוח (כלומר ברשת פרטית, כמו מאחורי נתב).

רוב המפתחים עובדים על מערכת _localhost_ הכוללת את קוד המקור, ערימת שרת אינטרנט וכל הכלים הדרושים לעבודה עם הקוד ומסד הנתונים.

תוכל למצוא מידע נוסף ב- [Tools of the Trade](../tools/tools.md) פֶּרֶק.

## Git ומארחים וירטואליים

רוב המפתחים רוצים להיות מעודכנים עם המקורות הנוכחיים, ולתרום שינויים בחזרה למעלה הזרם [XOOPS/XoopsCore27 repository on GitHub](https://github.com/XOOPS/XoopsCore27). זה אומר שבמקום להוריד ארכיון מהדורות, תרצו [fork](https://help.github.com/articles/fork-a-repo/) עותק של XOOPS והשתמש ב-**git** כדי [clone](https://help.github.com/categories/bootcamp/) המאגר הזה לתיבת ה-dev שלך.

מכיוון שלמאגר יש מבנה ספציפי, במקום _להעתיק_ קבצים מהספרייה _htdocs_ לשרת האינטרנט שלך, עדיף להפנות את שרת האינטרנט שלך לתיקיית htdocs בתוך המאגר המשובט המקומי שלך. כדי להשיג זאת, אנו בדרך כלל יוצרים _Virtual Host_ חדש, או _vhost_ שמצביע על קוד המקור הנשלט על ידי git.

ב א [WAMP](http://www.wampserver.com/) סביבה, ברירת המחדל [localhost](http://localhost/) בדף יש בקטע _כלים_ קישור ל-_הוסף מארח וירטואלי_ שמוביל לכאן:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

באמצעות זה אתה יכול להגדיר ערך VirtualHost שייכנס ישירות למאגר הנשלט (עדיין) git שלך.

הנה דוגמה לערך ב `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

ייתכן שתצטרך גם להוסיף ערך ב `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

עכשיו, אתה יכול להתקין על `http://xoops.localhost/` לבדיקה, תוך שמירה על המאגר שלך שלם, ושמירה על שרת האינטרנט בתוך ספריית htdocs עם URL. בנוסף, אתה יכול לעדכן את העותק המקומי שלך של XOOPS למאסטר העדכני ביותר בכל עת מבלי להתקין מחדש או להעתיק קבצים. בנוסף, אתה יכול לבצע שיפורים ותיקונים לקוד כדי לתרום לו בחזרה XOOPS בְּאֶמצָעוּת GitHub.

## Composer תלות

XOOPS 2.7.0 שימושים [Composer](https://getcomposer.org/) לנהל את זה PHP תלות. עץ התלות חי בו `htdocs/xoops_lib/` בתוך מאגר המקור:

* `composer.dist.json` היא הרשימה הראשית של התלות שנשלחה עם המהדורה.
* `composer.json` הוא העותק המקומי, אותו תוכל להתאים אישית עבור סביבת הפיתוח שלך במידת הצורך.
* `composer.lock` מצמיד גרסאות מדויקות כך שהתקנות ניתנות לשחזור.
* `vendor/` מכיל את הספריות המותקנות (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, מונולוג, symfony/var-dumper, xoops/xmf, xoops/regdom, ואחרים).

לשכפול git טרי של XOOPS 2.7.0, החל משורש הריפו, הרץ:

```text
cd htdocs/xoops_lib
composer install
```

שימו לב שאין `composer.json` בשורש הריפו - הפרויקט חי תחתיו `htdocs/xoops_lib/`, אז אתה חייב `cd` לתוך הספרייה הזו לפני ההפעלה Composer.

שחרור tarballs ספינה עם `vendor/` מאוכלס מראש, אבל ייתכן שלא שיבוטים של git. לִשְׁמוֹר `vendor/` ללא פגע בהתקנות פיתוח - XOOPS יטען את התלות שלו משם בזמן ריצה.

ה [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) ספרייה ספינות כמו א Composer תלות ב-2.7.0, כך שתוכל להשתמש `Xmf\Request`, `Xmf\Database\TableLoad`, ושיעורים קשורים בקוד המודול שלך ללא כל התקנה נוספת.

## מודול DebugBar

XOOPS 2.7.0 שולח מודול **DebugBar** המבוסס על Symfony VarDumper. זה מוסיף סרגל כלים של ניפוי באגים לדפים שעובדו שחושף מידע על בקשה, מסד נתונים ותבניות. התקן אותו מאזור הניהול של המודולים באתרי פיתוח והיערכות. אל תשאיר אותו מותקן באתר הפקה הפונה לציבור אלא אם כן אתה יודע שאתה רוצה.


