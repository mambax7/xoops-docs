---
title: "Perlindungan CSRF"
description: "Memahami dan melaksanakan perlindungan CSRF dalam XOOPS menggunakan kelas XoopsSecurity"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>Pemalsuan Permintaan Rentas Tapak (CSRF) menyerang pengguna untuk melakukan tindakan yang tidak diingini di tapak yang mereka disahkan. XOOPS menyediakan perlindungan CSRF terbina dalam melalui kelas `XoopsSecurity`.## Dokumentasi Berkaitan- Amalan Terbaik Keselamatan - Panduan keselamatan yang komprehensif
- Input-Sanitization - MyTextSanitizer dan pengesahan
- SQL-Injection-Prevention - Amalan keselamatan pangkalan data## Memahami Serangan CSRFSerangan CSRF berlaku apabila:1. Seorang pengguna disahkan pada tapak XOOPS anda
2. Pengguna melawat tapak web berniat jahat
3. Tapak berniat jahat menyerahkan permintaan ke tapak XOOPS anda menggunakan sesi pengguna
4. Tapak anda memproses permintaan seolah-olah ia datang daripada pengguna yang sah## Kelas XoopsSecurityXOOPS menyediakan kelas `XoopsSecurity` untuk melindungi daripada serangan CSRF. Kelas ini mengurus token keselamatan yang mesti disertakan dalam borang dan disahkan semasa memproses permintaan.### Penjanaan TokenKelas keselamatan menjana token unik yang disimpan dalam sesi pengguna dan mesti disertakan dalam borang:
```
php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```
### Pengesahan TokenSemasa memproses penyerahan borang, sahkan bahawa token itu sah:
```
php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```
## Menggunakan Sistem Token XOOPS### Dengan Kelas XoopsFormApabila menggunakan kelas borang XOOPS, perlindungan token adalah mudah:
```
php
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
### Dengan Borang TersuaiUntuk borang HTML tersuai yang tidak menggunakan XoopsForm:
```
php
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
### Dalam Templat SmartyApabila menjana borang dalam templat Smarty:
```
php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```
```
Smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```
## Memproses Penyerahan Borang### Pengesahan Token Asas
```
php
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
### Dengan Pengendalian Ralat Tersuai
```
php
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
### Untuk Permintaan AJAXApabila bekerja dengan permintaan AJAX, sertakan token dalam permintaan anda:
```
javascript
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
```
php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```
## Menyemak Perujuk HTTPUntuk perlindungan tambahan, terutamanya untuk permintaan AJAX, anda juga boleh menyemak perujuk HTTP:
```
php
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
### Pemeriksaan Keselamatan Gabungan
```
php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```
## Konfigurasi Token### Token Sepanjang HayatToken mempunyai jangka hayat yang terhad untuk menghalang serangan ulangan. Anda boleh mengkonfigurasi ini dalam tetapan XOOPS atau mengendalikan token tamat tempoh dengan anggun:
```
php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```
### Berbilang Borang pada Halaman Yang SamaApabila anda mempunyai berbilang borang pada halaman yang sama, setiap satu mesti mempunyai token sendiri:
```
php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```
## Amalan Terbaik### Sentiasa Gunakan Token untuk Operasi Mengubah NegeriSertakan token dalam sebarang bentuk yang:- Mencipta data
- Mengemas kini data
- Memadam data
- Menukar tetapan pengguna
- Melakukan sebarang tindakan pentadbiran### Jangan Bergantung Pada Semakan Perujuk Semata-mataPengepala perujuk HTTP boleh menjadi:- Dilucutkan oleh alatan privasi
- Tiada dalam beberapa pelayar
- Ditipu dalam beberapa kesSentiasa gunakan pengesahan token sebagai pertahanan utama anda.### Jana Semula Token Dengan SesuaiPertimbangkan untuk menjana semula token:- Selepas penyerahan borang berjaya
- Selepas login/logout
- Pada selang masa yang tetap untuk sesi yang panjang### Tangani Tamat Tempoh Token Dengan Anggun
```
php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```
## Isu dan Penyelesaian Biasa### Ralat Token Tidak Ditemui**Masalah**: Pemeriksaan keselamatan gagal dengan "token tidak ditemui"**Penyelesaian**: Pastikan medan token disertakan dalam borang anda:
```
php
$form->addElement(new XoopsFormHiddenToken());
```
### Ralat Tamat Tempoh Token**Masalah**: Pengguna melihat "token tamat tempoh" selepas melengkapkan borang yang lama**Penyelesaian**: Pertimbangkan menggunakan JavaScript untuk memuat semula token secara berkala:
```
javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```
### Isu Token AJAX**Masalah**: Permintaan AJAX gagal pengesahan token**Penyelesaian**: Pastikan token diluluskan dengan setiap permintaan AJAX dan sahkannya di bahagian pelayan:
```
php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
## Contoh: Perlaksanaan Borang Lengkap
```
php
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

#security #csrf #XOOPS #forms #token #XoopsSecurity