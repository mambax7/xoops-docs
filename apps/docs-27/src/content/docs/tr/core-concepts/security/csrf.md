---
title: "CSRF Koruma"
description: "XoopsSecurity sınıfını kullanarak XOOPS'de CSRF korumasını anlama ve uygulama"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Siteler Arası İstek Sahteciliği (CSRF) saldırıları, kullanıcıları kimlik doğrulaması yapılan bir sitede istenmeyen eylemler gerçekleştirmeleri için kandırır. XOOPS, `XoopsSecurity` sınıfı aracılığıyla yerleşik CSRF koruması sağlar.

## İlgili Belgeler

- En İyi Güvenlik Uygulamaları - Kapsamlı güvenlik kılavuzu
- Giriş Temizleme - MyTextSanitizer ve doğrulama
- SQL-Enjeksiyon-Önleme - database güvenliği uygulamaları

## CSRF Saldırılarını Anlamak

Bir CSRF saldırısı şu durumlarda meydana gelir:

1. XOOPS sitenizde bir kullanıcının kimliği doğrulanır
2. user kötü amaçlı bir web sitesini ziyaret eder
3. Kötü amaçlı site, kullanıcının oturumunu kullanarak XOOPS sitenize bir istek gönderir
4. Siteniz, isteği meşru kullanıcıdan gelmiş gibi işler

## XoopsSecurity Sınıfı

XOOPS, CSRF saldırılarına karşı koruma sağlamak için `XoopsSecurity` sınıfını sağlar. Bu sınıf, formlara dahil edilmesi ve istekleri işlerken doğrulanması gereken güvenlik belirteçlerini yönetir.

### Token Üretimi

Güvenlik sınıfı, kullanıcının oturumunda saklanan ve formlara dahil edilmesi gereken benzersiz belirteçler oluşturur:
```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```
### Jeton Doğrulaması

Form gönderimlerini işlerken belirtecin geçerli olduğunu doğrulayın:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```
## XOOPS Token Sistemini Kullanma

### XoopsForm Sınıfları ile

XOOPS form sınıflarını kullanırken jeton koruması basittir:
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
### Özel Formlarla

XoopsForm kullanmayan özel HTML formları için:
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
### Smarty Şablonlarında

Smarty şablonlarında formlar oluştururken:
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
## Form Gönderimlerinin İşlenmesi

### Temel Token Doğrulaması
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
### Özel Hata İşleme ile
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
### AJAX Talepleri için

AJAX istekleriyle çalışırken belirteci isteğinize ekleyin:
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
## Kontrol ediliyor HTTP Yönlendiren

Özellikle AJAX isteklerine yönelik ek koruma için HTTP yönlendirenini de kontrol edebilirsiniz:
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
### Birleşik Güvenlik Kontrolü
```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```
## Belirteç Yapılandırması

### Token Ömrü

Tekrar saldırılarını önlemek için jetonların sınırlı bir ömrü vardır. Bunu XOOPS ayarlarında yapılandırabilir veya süresi dolmuş jetonları zarif bir şekilde yönetebilirsiniz:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```
### Aynı Sayfada Birden Fazla Form

Aynı sayfada birden fazla formunuz olduğunda her birinin kendi belirteci olmalıdır:
```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```
## En İyi Uygulamalar

### Durum Değiştiren İşlemler İçin Her Zaman Tokenları Kullanın

Aşağıdaki özelliklere sahip herhangi bir biçimde belirteçler ekleyin:

- Veri oluşturur
- Verileri günceller
- Verileri siler
- user ayarlarını değiştirir
- Her türlü idari işlemi gerçekleştirir

### Yalnızca Yönlendiren Kontrolüne Güvenmeyin

HTTP yönlendiren başlığı şu şekilde olabilir:

- Gizlilik araçları tarafından soyuldu
- Bazı tarayıcılarda eksik
- Bazı durumlarda sahte

Her zaman birincil savunmanız olarak jeton doğrulamayı kullanın.

### Tokenları Uygun Şekilde Yeniden Oluşturun

Belirteçleri yeniden oluşturmayı düşünün:

- Başarılı form gönderiminden sonra
- login/logout'den sonra
- Uzun seanslar için düzenli aralıklarla

### Token Sona Erme Tarihini İncelikle Yönetin
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
## Yaygın Sorunlar ve Çözümler

### Belirteç Bulunamadı Hatası

**Sorun**: Güvenlik kontrolü "belirteç bulunamadı" nedeniyle başarısız oluyor

**Çözüm**: Belirteç alanının formunuza dahil edildiğinden emin olun:
```php
$form->addElement(new XoopsFormHiddenToken());
```
### Belirtecin Süresi Doldu Hatası

**Sorun**: users formu uzun süre tamamladıktan sonra "belirtecin süresi doldu" ifadesini görüyor

**Çözüm**: Belirteci düzenli aralıklarla yenilemek için JavaScript kullanmayı düşünün:
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
### AJAX Token Sorunları

**Sorun**: AJAX istekleri jeton doğrulamasında başarısız oluyor

**Çözüm**: Belirtecin her AJAX isteğinde iletildiğinden emin olun ve bunu sunucu tarafında doğrulayın:
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
## Örnek: Formu Tamamlama Uygulaması
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

#security #csrf #xoops #forms #tokens #XoopsSecurity