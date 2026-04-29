---
title: "CSRF הגנה"
description: "הבנה והטמעה של הגנה CSRF ב- XOOPS באמצעות מחלקת XoopsSecurity"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

זיוף בקשות חוצות אתרים (CSRF) מרמות משתמשים לבצע פעולות לא רצויות באתר שבו הם מאומתים. XOOPS מספקת הגנה מובנית של CSRF דרך המחלקה `XoopsSecurity`.

## תיעוד קשור

- אבטחה-שיטות עבודה מומלצות - מדריך אבטחה מקיף
- קלט-חיטוי - MyTextSanitizer ואימות
- SQL-הזרקה-מניעת - נוהלי אבטחת מסדי נתונים

## הבנת CSRF התקפות

התקפת CSRF מתרחשת כאשר:

1. משתמש מאומת באתר XOOPS שלך
2. המשתמש מבקר באתר אינטרנט זדוני
3. האתר הזדוני מגיש בקשה לאתר XOOPS שלך באמצעות הפגישה של המשתמש
4. האתר שלך מעבד את הבקשה כאילו הגיעה מהמשתמש הלגיטימי

## הכיתה XoopsSecurity

XOOPS מספקת את המחלקה `XoopsSecurity` כדי להגן מפני התקפות CSRF. מחלקה זו מנהלת אסימוני אבטחה שיש לכלול בטפסים ולאמת בעת עיבוד בקשות.

### יצירת אסימונים

מחלקת האבטחה מייצרת אסימונים ייחודיים המאוחסנים בסשן של המשתמש וחייבים להיכלל בטפסים:
```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```
### אימות אסימון

בעת עיבוד הגשת טפסים, ודא שהאסימון תקף:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```
## שימוש במערכת אסימונים XOOPS

### עם XoopsForm שיעורים

בעת שימוש בשיעורי טופס XOOPS, הגנת אסימונים היא פשוטה:
```php
// Create a form
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XoopsFormHiddenToken());

// Add submit button
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```
### עם טפסים מותאמים אישית

לטפסים מותאמים אישית HTML שאינם משתמשים ב-XoopsForm:
```php
// In your form template or PHP file
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```
### בתבניות Smarty

בעת יצירת טפסים בתבניות Smarty:
```php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```
## עיבוד הגשת טפסים

### אימות אסימון בסיסי
```php
// In your form processing script
$security = new XoopsSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```
### עם טיפול בשגיאות מותאם אישית
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Get detailed error information
    $errors = $security->getErrors();

    // Log the error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirect with error message
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```
### עבור AJAX בקשות

בעת עבודה עם בקשות AJAX, כלול את האסימון בבקשה שלך:
```javascript
// JavaScript - get token from hidden field
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Include in AJAX request
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```
## בודק HTTP מפנה

להגנה נוספת, במיוחד עבור בקשות AJAX, אתה יכול גם לבדוק את המפנה HTTP:
```php
$security = new XoopsSecurity();

// Check referer header
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Also verify the token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
### בדיקת אבטחה משולבת
```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```
## תצורת אסימון

### חיי אסימון

לאסימונים יש אורך חיים מוגבל כדי למנוע התקפות חוזרות. אתה יכול להגדיר זאת בהגדרות XOOPS או לטפל באסימונים שפג תוקפם בחן:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```
### טפסים מרובים באותו עמוד

כאשר יש לך מספר טפסים באותו דף, לכל אחד צריך להיות אסימון משלו:
```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```
## שיטות עבודה מומלצות

### השתמש תמיד באסימונים לפעולות משנות מצב

כלול אסימונים בכל צורה ש:

- יוצר נתונים
- עדכון נתונים
- מוחק נתונים
- משנה הגדרות משתמש
- מבצע כל פעולה מנהלית

### אל תסתמך רק על בדיקת מפנה

כותרת המפנה HTTP יכולה להיות:

- מופשט על ידי כלי פרטיות
- חסר בחלק מהדפדפנים
- מזוייף במקרים מסוימים

השתמש תמיד באימות אסימון כהגנה העיקרית שלך.

### צור מחדש אסימונים באופן הולם

שקול ליצור מחדש אסימונים:

- לאחר שליחת טופס מוצלחת
- לאחר login/logout
- במרווחים קבועים למפגשים ארוכים

### לטפל בתפוגת אסימון בחן
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```
## בעיות ופתרונות נפוצים

### שגיאת אסימון לא נמצא

**בעיה**: בדיקת האבטחה נכשלת עם "אסימון לא נמצא"

**פתרון**: ודא ששדה האסימון כלול בטופס שלך:
```php
$form->addElement(new XoopsFormHiddenToken());
```
### שגיאת תוקף אסימון פג

**בעיה**: משתמשים רואים "פג תוקפו של האסימון" לאחר מילוי טופס ארוך

**פתרון**: שקול להשתמש ב-JavaScript כדי לרענן את האסימון מעת לעת:
```javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```
### AJAX בעיות אסימונים

**בעיה**: AJAX בקשות נכשלות באימות האסימון

**פתרון**: ודא שהאסימון מועבר עם כל בקשה של AJAX ואמת אותו בצד השרת:
```php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
## דוגמה: השלם יישום טופס
```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Process valid submission
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... save to database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Display form
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```
---

#אבטחה #csrf #xoops #טפסים #אסימונים #XoopsSecurity