---
title: "נספח 3: תרגום XOOPS לשפה מקומית"
---

XOOPS 2.7.0 נשלח עם קבצים בשפה האנגלית בלבד. תרגומים לשפות אחרות מתוחזקות על ידי הקהילה ומופצים דרך GitHub ואתרי התמיכה המקומיים השונים של XOOPS.

## היכן למצוא תרגומים קיימים

- **GitHub** - תרגומי קהילה מתפרסמים יותר ויותר כמאגרים נפרדים תחת [ארגון XOOPS](https://github.com/XOOPS) ובחשבונות של תורמים בודדים. חפש ב-GitHub עבור `xoops-language-<your-language>` או עיין בארגון XOOPS עבור חבילות נוכחיות.
- **אתרי תמיכה מקומיים של XOOPS** - קהילות XOOPS אזוריות רבות מפרסמות תרגומים באתרים משלהן. בקר ב-[https://xoops.org](https://xoops.org) ועקוב אחר הקישורים לקהילות מקומיות.
- **תרגומי מודול** - תרגומים עבור מודולים קהילתיים בודדים חיים בדרך כלל ליד המודול עצמו בארגון `XoopsModules25x` GitHub (ה-`25x` בשם הוא היסטורי; מודולים שם נשמרים הן עבור `XoopsModules25x` והן עבור .x232Q0X0Z.x02.x00.

אם כבר קיים תרגום לשפה שלך, שחרר את ספריות השפות להתקנה של XOOPS (ראה "כיצד להתקין תרגום" למטה).

## מה צריך לתרגם

XOOPS 2.7.0 שומר קבצי שפה ליד הקוד שצורך אותם. תרגום מלא מכסה את כל המיקומים הבאים:

- **Core** — `htdocs/language/english/` — קבועים ברחבי האתר המשמשים כל דף (כניסה, שגיאות נפוצות, תאריכים, תבניות דואר וכו').
- **מתקין** — `htdocs/install/language/english/` — מחרוזות המוצגות על ידי אשף ההתקנה. תרגם אותם *לפני* הפעלת תוכנית ההתקנה אם אתה רוצה חווית התקנה מקומית.
- **מודול מערכת** - `htdocs/modules/system/language/english/` - הסט הגדול ביותר ללא ספק; מכסה את כל לוח הבקרה של הניהול.
- **מודולים מצורפים** - כל אחד מ-`htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` ו-`htdocs/modules/debugbar/language/english/`.
- **נושאים** - קומץ נושאים שולחים קבצי שפה משלהם; בדוק את `htdocs/themes/<theme>/language/` אם הוא קיים.

תרגום "ליבה בלבד" הוא היחידה השימושית המינימלית ומתאים לשני הכדורים הראשונים למעלה.

## איך לתרגם

1. העתק את ספריית `english/` שלידה ושנה את שם העותק לשפה שלך. שם הספרייה צריך להיות השם האנגלי הקטן של השפה (`spanish`, `german`, `french`, `japanese`, `arabic` וכו').

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. פתחו כל קובץ `.php` בספרייה החדשה ותרגמו את **ערכי המחרוזת** בתוך הקריאות `define()`. **אל** תשנה את השמות הקבועים - הם מופנים מקוד PHP בכל הליבה.

   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **שמור כל קובץ כ-UTF-8 *ללא* BOM.** XOOPS 2.7.0 משתמש ב-`utf8mb4` מקצה לקצה (מסד נתונים, הפעלות, קבצי פלט עם סימון לפי קוד). ב-Notepad++ זוהי האפשרות **"UTF-8"**, *לא* "UTF-8-BOM". בקוד VS זה ברירת המחדל; פשוט אשר את הקידוד בשורת המצב.

4. עדכן את המטא נתונים של השפה וערכת התווים בחלק העליון של כל קובץ כך שיתאימו לשפה שלך:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` צריך להיות הקוד [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) עבור השפה שלך. `_CHARSET` הוא תמיד `UTF-8` ב-XOOPS 2.7.0 - אין עוד גרסה של ISO-8859-1.

5. חזור על הפעולה עבור המתקין, מודול המערכת וכל המודול המצורף שאתה צריך.

## כיצד להתקין תרגום

אם השגת תרגום סיים כעץ ספריות:

1. העתק כל ספריית `<language>/` אל האב התואם `language/english/` בהתקנת XOOPS. לדוגמה, העתק את `language/spanish/` אל `htdocs/language/`, `install/language/spanish/` אל `htdocs/install/language/` וכן הלאה.
2. ודא שבעלות הקבצים וההרשאות ניתנות לקריאה על ידי שרת האינטרנט.
3. בחר את השפה החדשה בזמן ההתקנה (האשף סורק את `htdocs/language/` עבור שפות זמינות) או, באתר קיים, שנה את השפה ב-**ניהול → מערכת → העדפות → הגדרות כלליות**.

## משתף את התרגום שלך בחזרה

אנא תרמו את התרגום שלכם בחזרה לקהילה.

1. צור מאגר GitHub (או סלק מאגר שפה קיים אם קיים עבור השפה שלך).
2. השתמש בשם ברור כגון `xoops-language-<language-code>` (למשל `xoops-language-es`, `xoops-language-pt-br`).
3. שיקוף את מבנה הספריות XOOPS בתוך המאגר שלך כך שהקבצים יתאימו למקום שבו הם מועתקים:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. כלול `README.md` המתעד:
   - שם השפה וקוד ISO
   - תאימות גרסת XOOPS (למשל `XOOPS 2.7.0+`)
   - מתרגם וקרדיטים
   - האם התרגום הוא הליבה בלבד או מכסה מודולים מצורפים
5. פתח בקשת משיכה כנגד מאגר module/core הרלוונטי ב-GitHub או פרסם הודעה ב-[https://xoops.org](https://xoops.org) כדי שהקהילה תוכל למצוא אותו.

> **הערה**
>
> אם השפה שלך דורשת שינויים בליבה עבור עיצוב תאריך או לוח שנה, כלול את השינויים הללו גם בחבילה. שפות עם סקריפטים מימין לשמאל (ערבית, עברית, פרסית, אורדו) פועלות מהקופסה ב-XOOPS 2.7.0 — תמיכה ב-RTL נוספה במהדורה זו וערכות נושא בודדות קולטות זאת אוטומטית.
