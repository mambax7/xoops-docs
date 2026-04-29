---
title: "CSRF Προστασία"
description: "Κατανόηση και εφαρμογή προστασίας CSRF στο XOOPS χρησιμοποιώντας την κλάση XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Οι επιθέσεις πλαστογράφησης αιτημάτων μεταξύ ιστότοπων (CSRF) εξαπατούν τους χρήστες να εκτελέσουν ανεπιθύμητες ενέργειες σε έναν ιστότοπο όπου έχουν γίνει έλεγχος ταυτότητας. Το XOOPS παρέχει ενσωματωμένη προστασία CSRF μέσω της κατηγορίας `XoopsSecurity`.

## Σχετική τεκμηρίωση

- Security-Best-Practices - Περιεκτικός οδηγός ασφαλείας
- Input-Sanitization - MyTextSanitizer και επικύρωση
- SQL-Injection-Prevention - Πρακτικές ασφαλείας βάσης δεδομένων

## Κατανόηση CSRF επιθέσεων

Μια επίθεση CSRF συμβαίνει όταν:

1. Έγινε έλεγχος ταυτότητας χρήστη στον ιστότοπό σας XOOPS
2. Ο χρήστης επισκέπτεται έναν κακόβουλο ιστότοπο
3. Ο κακόβουλος ιστότοπος υποβάλλει ένα αίτημα στον ιστότοπό σας XOOPS χρησιμοποιώντας τη συνεδρία του χρήστη
4. Ο ιστότοπός σας επεξεργάζεται το αίτημα σαν να προήλθε από τον νόμιμο χρήστη

## Η τάξη XoopsSecurity

Το XOOPS παρέχει την κλάση `XoopsSecurity` για προστασία από επιθέσεις CSRF. Αυτή η κλάση διαχειρίζεται διακριτικά ασφαλείας που πρέπει να περιλαμβάνονται σε φόρμες και να επαληθεύονται κατά την επεξεργασία αιτημάτων.

## # Δημιουργία διακριτικών

Η κλάση ασφαλείας δημιουργεί μοναδικά διακριτικά που αποθηκεύονται στη συνεδρία του χρήστη και πρέπει να περιλαμβάνονται σε φόρμες:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

## # Επαλήθευση διακριτικού

Κατά την επεξεργασία των υποβολών φόρμας, βεβαιωθείτε ότι το διακριτικό είναι έγκυρο:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Χρήση XOOPS Token System

## # Με τάξεις XoopsForm

Όταν χρησιμοποιείτε κλάσεις φόρμας XOOPS, η προστασία διακριτικών είναι απλή:

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

## # Με προσαρμοσμένες φόρμες

Για προσαρμοσμένες φόρμες HTML που δεν χρησιμοποιούν XoopsForm:

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

## # Σε Smarty Templates

Κατά τη δημιουργία φορμών σε πρότυπα Smarty:

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

## Επεξεργασία Υποβολών Φόρμας

## # Βασική επαλήθευση διακριτικού

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

## # Με προσαρμοσμένο χειρισμό σφαλμάτων

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

## # Για AJAX αιτήματα

Όταν εργάζεστε με αιτήματα AJAX, συμπεριλάβετε το διακριτικό στο αίτημά σας:

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

## Έλεγχος HTTP Παραπομπή

Για πρόσθετη προστασία, ειδικά για αιτήματα AJAX, μπορείτε επίσης να ελέγξετε την παραπομπή HTTP:

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

## # Συνδυασμένος Έλεγχος Ασφαλείας

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Διαμόρφωση διακριτικού

## # Token Lifetime

Τα διακριτικά έχουν περιορισμένη διάρκεια ζωής για την αποτροπή επιθέσεων επανάληψης. Μπορείτε να το διαμορφώσετε στις ρυθμίσεις XOOPS ή να χειριστείτε με χάρη τα ληγμένα διακριτικά:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

## # Πολλαπλές φόρμες στην ίδια σελίδα

Όταν έχετε πολλές φόρμες στην ίδια σελίδα, η καθεμία πρέπει να έχει το δικό της διακριτικό:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Βέλτιστες πρακτικές

## # Να χρησιμοποιείτε πάντα διακριτικά για λειτουργίες που αλλάζουν κατάσταση

Συμπεριλάβετε διακριτικά σε οποιαδήποτε μορφή:

- Δημιουργεί δεδομένα
- Ενημερώνει δεδομένα
- Διαγράφει δεδομένα
- Αλλάζει τις ρυθμίσεις χρήστη
- Εκτελεί κάθε διοικητική ενέργεια

## # Μην βασίζεστε αποκλειστικά στον έλεγχο παραπομπών

Η κεφαλίδα αναφοράς HTTP μπορεί να είναι:

- Απογυμνωμένο από εργαλεία απορρήτου
- Λείπει σε ορισμένα προγράμματα περιήγησης
- Παραπλανήθηκε σε ορισμένες περιπτώσεις

Χρησιμοποιείτε πάντα την επαλήθευση διακριτικών ως κύρια άμυνά σας.

## # Αναδημιουργήστε τα Token κατάλληλα

Εξετάστε το ενδεχόμενο αναγέννησης διακριτικών:

- Μετά την επιτυχή υποβολή της φόρμας
- Μετά το login/logout
- Σε τακτά χρονικά διαστήματα για μεγάλες συνεδρίες

## # Χειριστείτε τη λήξη του διακριτικού με χάρη

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

## Κοινά ζητήματα και λύσεις

## # Σφάλμα Token Not Found

**Πρόβλημα**: Ο έλεγχος ασφαλείας αποτυγχάνει με το "token not found"

**Λύση**: Βεβαιωθείτε ότι το πεδίο διακριτικού περιλαμβάνεται στη φόρμα σας:

```php
$form->addElement(new XoopsFormHiddenToken());
```

## # Σφάλμα λήξεως διακριτικού

**Πρόβλημα**: Οι χρήστες βλέπουν ότι το "token έληξε" μετά τη μακροχρόνια συμπλήρωση της φόρμας

**Λύση**: Εξετάστε το ενδεχόμενο να χρησιμοποιήσετε JavaScript για να ανανεώνετε περιοδικά το διακριτικό:

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

## # AJAX Ζητήματα διακριτικού

**Πρόβλημα**: AJAX αποτυχία αιτημάτων επικύρωσης διακριτικού

**Λύση**: Βεβαιωθείτε ότι το διακριτικό μεταβιβάζεται με κάθε αίτημα AJAX και επαληθεύστε το από την πλευρά του διακομιστή:

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

## Παράδειγμα: Συμπλήρωση Εφαρμογής Φόρμας

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

# ασφάλεια #csrf #XOOPS #forms #tokens #XoopsSecurity
