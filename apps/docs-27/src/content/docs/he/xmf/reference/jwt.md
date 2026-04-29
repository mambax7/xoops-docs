---
title: "JWT - JSON אסימוני אינטרנט"
description: "יישום XMF JWT לאימות מאובטח מבוסס אסימון והגנה על AJAX"
---

מרחב השמות `Xmf\Jwt` מספק תמיכה ב-JSON Web Token (JWT) עבור מודולי XOOPS. JWTs מאפשרים אימות מאובטח וחסר מצב והם שימושיים במיוחד להגנה על בקשות AJAX.

## מה הם JSON אסימוני אינטרנט?

JSON אסימוני אינטרנט הם דרך סטנדרטית לפרסם קבוצה של *תביעות* (נתונים) כמחרוזת טקסט, עם אימות קריפטוגרפי שהטענות לא טופלו. למפרטים מפורטים, ראה:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### מאפייני מפתח

- **חתום**: אסימונים חתומים בחתימה קריפטוגרפית כדי לזהות חבלה
- **עצמאי**: כל המידע הדרוש נמצא באסימון עצמו
- **חסר מדינה**: אין צורך באחסון הפעלה בצד השרת
- **ניתן לתפוגה**: אסימונים יכולים לכלול זמני תפוגה

> **הערה:** JWTs חתומים, לא מוצפנים. הנתונים מקודדים ב-Base64 וגלויים. השתמש ב-JWTs לאימות תקינות, לא להסתרת נתונים רגישים.

## מדוע להשתמש ב-JWT ב-XOOPS?

### בעיית האסימון AJAX

טפסי XOOPS משתמשים באסימוני nonce להגנה על CSRF. עם זאת, איסורים עובדים בצורה גרועה עם AJAX מכיוון:

1. **שימוש חד פעמי**: הערות תקפות בדרך כלל להגשה אחת
2. **בעיות אסינכרוניות**: בקשות AJAX מרובות עשויות להגיע ללא תקינות
3. **מורכבות רענון**: אין דרך אמינה לרענן אסימונים באופן אסינכרוני
4. **כריכת הקשר**: אסימונים סטנדרטיים אינם מאמתים איזה סקריפט הוציא אותם

### JWT יתרונות

JWTs לפתור את הבעיות האלה על ידי:

- כולל זמן תפוגה (תביעה `exp`) לתוקף מוגבל בזמן
- תמיכה בטענות מותאמות אישית לקשירת אסימונים לסקריפטים ספציפיים
- הפעלת בקשות מרובות בתקופת התוקף
- מתן אימות קריפטוגרפי של מקור האסימון

## שיעורי ליבה

### JsonWebToken

מחלקת `Xmf\Jwt\JsonWebToken` מטפלת ביצירת ופענוח אסימונים.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Create a key
$key = KeyFactory::build('my_application_key');

// Create a JsonWebToken instance
$jwt = new JsonWebToken($key, 'HS256');

// Create a token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expires in 300 seconds

// Decode and verify a token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### שיטות

**`new JsonWebToken($key, $algorithm)`**

יוצר מטפל JWT חדש.
- `$key`: אובייקט `Xmf\Key\KeyAbstract`
- `$algorithm`: אלגוריתם חתימה (ברירת מחדל: 'HS256')

**`create($payload, $expirationOffset)`**

יוצר מחרוזת אסימון חתום.
- `$payload`: מערך תביעות
- `$expirationOffset`: שניות עד התפוגה (אופציונלי)

**`decode($jwtString, $assertClaims)`**

מפענח ומאמת אסימון.
- `$jwtString`: האסימון לפענוח
- `$assertClaims`: תביעות לאימות (מערך ריק על אף אחד)
- מחזירה: מטען stdClass או false אם לא חוקי

**`setAlgorithm($algorithm)`**

משנה את האלגוריתם signing/verification.

### TokenFactory

`Xmf\Jwt\TokenFactory` מספק דרך נוחה ליצור אסימונים.

```php
use Xmf\Jwt\TokenFactory;

// Create a token with automatic key handling
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token expires in 120 seconds
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: מחרוזת שם מפתח או אובייקט KeyAbstract
- `$payload`: מערך תביעות
- `$expirationOffset`: תפוגה בשניות

זורק חריגים בכשל: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

מחלקה `Xmf\Jwt\TokenReader` מפשטת קריאת אסימונים ממקורות שונים.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// From a string
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// From a cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// From a request parameter
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// From Authorization header (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

כל השיטות מחזירות את המטען כ-`stdClass` או `false` אם לא חוקי.

### KeyFactory

ה-`Xmf\Jwt\KeyFactory` יוצר ומנהל מפתחות קריפטוגרפיים.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

המפתחות מאוחסנים באופן קבוע. אחסון ברירת המחדל משתמש במערכת הקבצים.

## AJAX דוגמה להגנה

הנה דוגמה מלאה המדגימה JWT מוגן AJAX.

### סקריפט דף (יוצר אסימון)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Claims to include and verify
$assertClaims = ['aud' => basename(__FILE__)];

// Check if this is an AJAX request
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Handle AJAX request
    $GLOBALS['xoopsLogger']->activated = false;

    // Verify the token from the Authorization header
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Token is valid - process the request
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Your AJAX logic here
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Regular page request - generate token and display page
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Create token with claims
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token valid for 2 minutes
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript for AJAX calls
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Update UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## שיטות עבודה מומלצות

### תפוגת אסימון

הגדר זמני תפוגה מתאימים על סמך מקרה השימוש:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### אימות תביעה

אמת תמיד את טענת `aud` (קהל) כדי להבטיח שימוש באסימונים עם הסקריפט המיועד:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### שם מפתח

השתמש בשמות מפתח תיאוריים למטרות שונות:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### טיפול בשגיאות

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Invalid algorithm
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Invalid argument
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Unexpected value
    error_log('JWT Error: ' . $e->getMessage());
}

// Reading tokens returns false on failure (no exception)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token invalid, expired, or tampered
}
```

## שיטות העברת אסימונים

### כותרת הרשאה (מומלץ)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### עוגיה

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### פרמטר בקשה

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## שיקולי אבטחה

1. **השתמש ב-HTTPS**: השתמש תמיד ב-HTTPS כדי למנוע יירוט אסימון
2. **תפוגה קצרה**: השתמש בזמן התפוגה המעשי הקצר ביותר
3. **טענות ספציפיות**: כלול טענות הקושרות אסימונים להקשרים ספציפיים
4. **אימות בצד השרת**: אמת תמיד אסימונים בצד השרת
5. **אל תשמור נתונים רגישים**: זכור שאסימונים ניתנים לקריאה (לא מוצפנים)

## API הפניה

### Xmf\Jwt\JsonWebToken

| שיטה | תיאור |
|--------|----------------|
| `__construct($key, $algorithm)` | צור מטפל JWT |
| `setAlgorithm($algorithm)` | הגדר אלגוריתם חתימה |
| `create($payload, $expiration)` | צור אסימון חתום |
| `decode($token, $assertClaims)` | פענוח ואימות אסימון |

### Xmf\Jwt\TokenFactory

| שיטה | תיאור |
|--------|----------------|
| `build($key, $payload, $expiration)` | צור מחרוזת אסימון |

### Xmf\Jwt\TokenReader

| שיטה | תיאור |
|--------|----------------|
| `fromString($key, $token, $claims)` | פענוח ממחרוזת |
| `fromCookie($key, $name, $claims)` | פענוח מעוגייה |
| `fromRequest($key, $name, $claims)` | פענוח מהבקשה |
| `fromHeader($key, $claims, $header)` | פענוח מהכותרת |

### Xmf\Jwt\KeyFactory

| שיטה | תיאור |
|--------|----------------|
| `build($name, $storage)` | קבל או צור מפתח |

## ראה גם

- ../Basics/XMF-Request - טיפול בבקשות
- ../XMF-Framework - סקירת מסגרת
- מסד נתונים - כלי עזר למסד נתונים

---

#xmf #jwt #security #ajax #אימות #אסימונים
