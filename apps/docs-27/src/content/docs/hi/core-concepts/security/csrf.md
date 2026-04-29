---
title: "CSRF सुरक्षा"
description: "XoopsSecurity वर्ग का उपयोग करके XOOPS में CSRF सुरक्षा को समझना और लागू करना"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

क्रॉस-साइट अनुरोध जालसाजी (CSRF) हमले उपयोगकर्ताओं को उस साइट पर अवांछित कार्य करने के लिए प्रेरित करते हैं जहां वे प्रमाणित हैं। XOOPS `XoopsSecurity` वर्ग के माध्यम से अंतर्निहित CSRF सुरक्षा प्रदान करता है।

## संबंधित दस्तावेज़ीकरण

- सुरक्षा-सर्वोत्तम अभ्यास - व्यापक सुरक्षा मार्गदर्शिका
- इनपुट-स्वच्छता - MyTextSanitizer और सत्यापन
- SQL-इंजेक्शन-रोकथाम - डेटाबेस सुरक्षा प्रथाएँ

## CSRF हमलों को समझना

CSRF हमला तब होता है जब:

1. आपकी XOOPS साइट पर एक उपयोगकर्ता प्रमाणित है
2. उपयोगकर्ता किसी दुर्भावनापूर्ण वेबसाइट पर जाता है
3. दुर्भावनापूर्ण साइट उपयोगकर्ता के सत्र का उपयोग करके आपकी XOOPS साइट पर एक अनुरोध सबमिट करती है
4. आपकी साइट अनुरोध को ऐसे संसाधित करती है जैसे कि यह वैध उपयोगकर्ता से आया हो

## XoopsSecurity कक्षा

XOOPS CSRF हमलों से सुरक्षा के लिए `XoopsSecurity` वर्ग प्रदान करता है। यह वर्ग सुरक्षा टोकन का प्रबंधन करता है जिन्हें फ़ॉर्म में शामिल किया जाना चाहिए और अनुरोध संसाधित करते समय सत्यापित किया जाना चाहिए।

### टोकन जनरेशन

सुरक्षा वर्ग अद्वितीय टोकन उत्पन्न करता है जो उपयोगकर्ता के सत्र में संग्रहीत होते हैं और उन्हें फॉर्म में शामिल किया जाना चाहिए:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### टोकन सत्यापन

फॉर्म सबमिशन संसाधित करते समय, सत्यापित करें कि टोकन वैध है:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## XOOPS टोकन सिस्टम का उपयोग करना

### XoopsForm कक्षाओं के साथ

XOOPS फॉर्म क्लास का उपयोग करते समय, टोकन सुरक्षा सीधी होती है:

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

### कस्टम फॉर्म के साथ

कस्टम HTML फॉर्म के लिए जो XoopsForm का उपयोग नहीं करते हैं:

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

### Smarty टेम्प्लेट में

Smarty टेम्प्लेट में फॉर्म बनाते समय:

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

## प्रोसेसिंग फॉर्म सबमिशन

### बुनियादी टोकन सत्यापन

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

### कस्टम त्रुटि प्रबंधन के साथ

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

### AJAX अनुरोधों के लिए

AJAX अनुरोधों के साथ काम करते समय, अपने अनुरोध में टोकन शामिल करें:

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

## HTTP रेफरर की जाँच हो रही है

अतिरिक्त सुरक्षा के लिए, विशेष रूप से AJAX अनुरोधों के लिए, आप HTTP रेफरर की भी जांच कर सकते हैं:

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

### संयुक्त सुरक्षा जांच

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## टोकन कॉन्फ़िगरेशन

### टोकन लाइफटाइम

रीप्ले हमलों को रोकने के लिए टोकन का जीवनकाल सीमित होता है। आप इसे XOOPS सेटिंग्स में कॉन्फ़िगर कर सकते हैं या समाप्त हो चुके टोकन को शान से संभाल सकते हैं:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### एक ही पेज पर अनेक फॉर्म

जब आपके पास एक ही पृष्ठ पर एकाधिक फॉर्म हों, तो प्रत्येक का अपना टोकन होना चाहिए:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## सर्वोत्तम प्रथाएँ

### राज्य बदलने वाले कार्यों के लिए हमेशा टोकन का उपयोग करें

किसी भी रूप में टोकन शामिल करें:

- डेटा बनाता है
- डेटा अपडेट करता है
- डेटा हटाता है
- उपयोगकर्ता सेटिंग्स बदलता है
- कोई भी प्रशासनिक कार्रवाई करता है

### केवल रेफरर चेकिंग पर भरोसा न करें

HTTP रेफरर हेडर हो सकता है:

- गोपनीयता उपकरण द्वारा छीन लिया गया
- कुछ ब्राउज़रों में गायब है
- कुछ मामलों में धोखा दिया गया

हमेशा अपने प्राथमिक बचाव के रूप में टोकन सत्यापन का उपयोग करें।

### उचित रूप से टोकन पुन: उत्पन्न करें

टोकन पुनर्जीवित करने पर विचार करें:

- सफलतापूर्वक फॉर्म जमा होने के बाद
- लॉगइन/लॉगआउट के बाद
- लंबे सत्रों के लिए नियमित अंतराल पर

### टोकन समाप्ति को शालीनता से संभालें

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

## सामान्य मुद्दे और समाधान

### टोकन नहीं मिला त्रुटि

**समस्या**: "टोकन नहीं मिला" के साथ सुरक्षा जांच विफल हो गई

**समाधान**: सुनिश्चित करें कि टोकन फ़ील्ड आपके फॉर्म में शामिल है:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### टोकन समाप्त होने में त्रुटि

**समस्या**: उपयोगकर्ताओं को लंबे समय तक फॉर्म भरने के बाद "टोकन समाप्त हो गया" दिखाई देता है

**समाधान**: टोकन को समय-समय पर ताज़ा करने के लिए JavaScript का उपयोग करने पर विचार करें:

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

### AJAX टोकन मुद्दे

**समस्या**: AJAX अनुरोध टोकन सत्यापन विफल हो जाता है**समाधान**: सुनिश्चित करें कि टोकन प्रत्येक AJAX अनुरोध के साथ पारित हो गया है और इसे सर्वर-साइड सत्यापित करें:

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

## उदाहरण: पूर्ण प्रपत्र कार्यान्वयन

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

#सुरक्षा #CSRF #XOOPS #फॉर्म #टोकन #XoopsSecurity