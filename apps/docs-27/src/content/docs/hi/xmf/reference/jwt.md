---
title: "JWT - JSON वेब टोकन"
description: "सुरक्षित टोकन-आधारित प्रमाणीकरण और AJAX सुरक्षा के लिए XMF जेडब्ल्यूटी कार्यान्वयन"
---
`Xmf\Jwt` नेमस्पेस XOOPS मॉड्यूल के लिए JSON वेब टोकन (JWT) समर्थन प्रदान करता है। JWTs सुरक्षित, स्टेटलेस प्रमाणीकरण सक्षम करते हैं और AJAX अनुरोधों की सुरक्षा के लिए विशेष रूप से उपयोगी हैं।

## JSON वेब टोकन क्या हैं?

JSON वेब टोकन *दावों* (डेटा) के एक सेट को टेक्स्ट स्ट्रिंग के रूप में प्रकाशित करने का एक मानक तरीका है, क्रिप्टोग्राफ़िक सत्यापन के साथ कि दावों के साथ छेड़छाड़ नहीं की गई है। विस्तृत विशिष्टताओं के लिए, देखें:

- [jwt.io](https://jwt.io/)
- [आरएफसी 7519](@@00017@@)

### प्रमुख विशेषताएँ

- **हस्ताक्षरित**: छेड़छाड़ का पता लगाने के लिए टोकन को क्रिप्टोग्राफ़िक रूप से हस्ताक्षरित किया जाता है
- **स्वयं निहित**: सभी आवश्यक जानकारी टोकन में ही है
- **स्टेटलेस**: सर्वर-साइड सेशन स्टोरेज की आवश्यकता नहीं है
- **समाप्ति योग्य**: टोकन में समाप्ति समय शामिल हो सकता है

> **ध्यान दें:** JWT हस्ताक्षरित हैं, एन्क्रिप्टेड नहीं। डेटा बेस64 एन्कोडेड और दृश्यमान है। JWTs का उपयोग अखंडता सत्यापन के लिए करें, संवेदनशील डेटा छिपाने के लिए नहीं।

## XOOPS में JWT का उपयोग क्यों करें?

### AJAX टोकन समस्या

XOOPS फॉर्म CSRF सुरक्षा के लिए नॉन्स टोकन का उपयोग करते हैं। हालाँकि, नॉन्स AJAX के साथ खराब काम करते हैं क्योंकि:

1. **एकल उपयोग**: नॉन्स आम तौर पर एक सबमिशन के लिए मान्य होते हैं
2. **अतुल्यकालिक मुद्दे**: एकाधिक AJAX अनुरोध क्रम से बाहर आ सकते हैं
3. **ताज़ा जटिलता**: टोकन को अतुल्यकालिक रूप से ताज़ा करने का कोई विश्वसनीय तरीका नहीं
4. **संदर्भ बाइंडिंग**: मानक टोकन यह सत्यापित नहीं करते कि उन्हें किस स्क्रिप्ट ने जारी किया है

### जेडब्ल्यूटी लाभ

JWTs इन समस्याओं का समाधान इस प्रकार करते हैं:

- समय-सीमित वैधता के लिए समाप्ति समय (`exp` दावा) शामिल है
- टोकन को विशिष्ट स्क्रिप्ट से बांधने के कस्टम दावों का समर्थन करना
- वैधता अवधि के भीतर एकाधिक अनुरोधों को सक्षम करना
- टोकन मूल का क्रिप्टोग्राफ़िक सत्यापन प्रदान करना

## कोर क्लासेस

### JsonWebToken

`Xmf\Jwt\JsonWebToken` वर्ग टोकन निर्माण और डिकोडिंग को संभालता है।

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

#### तरीके

**`new JsonWebToken($key, $algorithm)`**

एक नया JWT हैंडलर बनाता है।
- `$key`: एक `Xmf\Key\KeyAbstract` वस्तु
- `$algorithm`: हस्ताक्षर एल्गोरिथ्म (डिफ़ॉल्ट: 'HS256')

**`create($payload, $expirationOffset)`**

एक हस्ताक्षरित टोकन स्ट्रिंग बनाता है।
- `$payload`: दावों की श्रृंखला
- `$expirationOffset`: समाप्ति तक सेकंड (वैकल्पिक)

**`decode($jwtString, $assertClaims)`**

किसी टोकन को डिकोड और मान्य करता है।
- `$jwtString`: डिकोड करने के लिए टोकन
- `$assertClaims`: सत्यापित करने का दावा (किसी के लिए भी खाली सरणी नहीं)
- रिटर्न: अमान्य होने पर stdClass पेलोड या गलत

**`setAlgorithm($algorithm)`**

हस्ताक्षर/सत्यापन एल्गोरिदम बदलता है।

### TokenFactory

`Xmf\Jwt\TokenFactory` टोकन बनाने का एक सुविधाजनक तरीका प्रदान करता है।

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

- `$key`: कुंजी नाम स्ट्रिंग या KeyAbstract ऑब्जेक्ट
- `$payload`: दावों की श्रृंखला
- `$expirationOffset`: समाप्ति सेकंड में

विफलता पर अपवाद फेंकता है: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

`Xmf\Jwt\TokenReader` वर्ग विभिन्न स्रोतों से टोकन पढ़ना सरल बनाता है।

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

अमान्य होने पर सभी विधियाँ पेलोड को `stdClass` या `false` के रूप में लौटाती हैं।

### KeyFactory

`Xmf\Jwt\KeyFactory` क्रिप्टोग्राफ़िक कुंजियाँ बनाता और प्रबंधित करता है।

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

चाबियाँ लगातार संग्रहीत की जाती हैं। डिफ़ॉल्ट संग्रहण फ़ाइल सिस्टम का उपयोग करता है।

## AJAX सुरक्षा उदाहरण

यहां JWT-संरक्षित AJAX को प्रदर्शित करने वाला एक संपूर्ण उदाहरण दिया गया है।

### पेज स्क्रिप्ट (टोकन उत्पन्न करता है)

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

## सर्वोत्तम प्रथाएँ

### टोकन समाप्ति

उपयोग के मामले के आधार पर उचित समाप्ति समय निर्धारित करें:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### दावा सत्यापन

यह सुनिश्चित करने के लिए कि टोकन का उपयोग इच्छित स्क्रिप्ट के साथ किया गया है, हमेशा `aud` (दर्शक) दावे को सत्यापित करें:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### कुंजी नामकरण

विभिन्न उद्देश्यों के लिए वर्णनात्मक कुंजी नामों का उपयोग करें:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### त्रुटि प्रबंधन

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

## सांकेतिक परिवहन विधियाँ### प्राधिकरण शीर्षलेख (अनुशंसित)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### कुकी

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### अनुरोध पैरामीटर

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## सुरक्षा संबंधी विचार

1. **HTTPS** का उपयोग करें: टोकन अवरोधन को रोकने के लिए हमेशा HTTPS का उपयोग करें
2. **अल्प समाप्ति**: सबसे कम व्यावहारिक समाप्ति समय का उपयोग करें
3. **विशिष्ट दावे**: ऐसे दावे शामिल करें जो टोकन को विशिष्ट संदर्भों से जोड़ते हैं
4. **सर्वर-साइड सत्यापन**: हमेशा टोकन को सर्वर-साइड पर मान्य करें
5. **संवेदनशील डेटा संग्रहित न करें**: याद रखें टोकन पढ़ने योग्य हैं (एन्क्रिप्टेड नहीं)

## API संदर्भ

### Xmf\Jwt\JsonWebToken

| विधि | विवरण |
|-------|----|
| `__construct($key, $algorithm)` | JWT हैंडलर बनाएं |
| `setAlgorithm($algorithm)` | हस्ताक्षर एल्गोरिथ्म सेट करें |
| `create($payload, $expiration)` | हस्ताक्षरित टोकन बनाएं |
| `decode($token, $assertClaims)` | टोकन को डिकोड और सत्यापित करें |

### Xmf\Jwt\TokenFactory

| विधि | विवरण |
|-------|----|
| `build($key, $payload, $expiration)` | टोकन स्ट्रिंग बनाएं |

### Xmf\Jwt\TokenReader

| विधि | विवरण |
|-------|----|
| `fromString($key, $token, $claims)` | स्ट्रिंग से डिकोड करें |
| `fromCookie($key, $name, $claims)` | कुकी से डिकोड करें |
| `fromRequest($key, $name, $claims)` | अनुरोध से डिकोड करें |
| `fromHeader($key, $claims, $header)` | हेडर से डिकोड करें |

### Xmf\Jwt\KeyFactory

| विधि | विवरण |
|-------|----|
| `build($name, $storage)` | कुंजी प्राप्त करें या बनाएं |

## यह भी देखें

- ../बेसिक्स/XMF-अनुरोध - अनुरोध प्रबंधन
- ../XMF-फ्रेमवर्क - फ्रेमवर्क सिंहावलोकन
- डेटाबेस - डेटाबेस उपयोगिताएँ

---

#xmf #jwt #सुरक्षा #ajax #प्रमाणीकरण #टोकन