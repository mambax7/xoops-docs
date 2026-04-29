---
title: "Perlindungan CSRF"
description: "Memahami dan menerapkan perlindungan CSRF di XOOPS menggunakan kelas XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Serangan Pemalsuan Permintaan Lintas Situs (CSRF) menipu pengguna agar melakukan tindakan yang tidak diinginkan di situs tempat mereka diautentikasi. XOOPS memberikan perlindungan CSRF bawaan melalui kelas `XoopsSecurity`.

## Dokumentasi Terkait

- Keamanan-Praktik Terbaik - Panduan keamanan komprehensif
- Sanitasi Masukan - MyTextSanitizer dan validasi
- SQL-Pencegahan Injeksi - Praktik keamanan basis data

## Memahami Serangan CSRF

Serangan CSRF terjadi ketika:

1. Seorang pengguna diautentikasi di situs XOOPS Anda
2. Pengguna mengunjungi situs web berbahaya
3. Situs jahat mengirimkan permintaan ke situs XOOPS Anda menggunakan sesi pengguna
4. Situs Anda memproses permintaan seolah-olah permintaan tersebut berasal dari pengguna yang sah

## Kelas Keamanan Xoops

XOOPS menyediakan kelas `XoopsSecurity` untuk melindungi terhadap serangan CSRF. Kelas ini mengelola token keamanan yang harus disertakan dalam formulir dan diverifikasi saat memproses permintaan.

### Pembuatan Token

Kelas keamanan menghasilkan token unik yang disimpan dalam sesi pengguna dan harus disertakan dalam formulir:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Verifikasi Token

Saat memproses pengiriman formulir, verifikasi bahwa token tersebut valid:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Menggunakan Sistem Token XOOPS

### Dengan Kelas XoopsForm

Saat menggunakan kelas formulir XOOPS, perlindungan token sangatlah mudah:

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

### Dengan Formulir Khusus

Untuk formulir kustom HTML yang tidak menggunakan XoopsForm:

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

### Dalam template Smarty

Saat membuat formulir di template Smarty:

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

## Memproses Pengiriman Formulir

### Verifikasi Token Dasar

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

### Dengan Penanganan Kesalahan Khusus

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

### Untuk Permintaan AJAX

Saat bekerja dengan permintaan AJAX, sertakan token dalam permintaan Anda:

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

## Memeriksa Referensi HTTP

Untuk perlindungan tambahan, khususnya untuk permintaan AJAX, Anda juga dapat memeriksa referensi HTTP:

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

### Pemeriksaan Keamanan Gabungan

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Konfigurasi Token

### Token Seumur Hidup

Token memiliki masa hidup terbatas untuk mencegah serangan replay. Anda dapat mengonfigurasi ini di pengaturan XOOPS atau menangani token yang kedaluwarsa dengan baik:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Beberapa Formulir di Halaman yang Sama

Jika Anda memiliki beberapa formulir di halaman yang sama, masing-masing formulir harus memiliki tokennya sendiri:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Praktik Terbaik

### Selalu Gunakan Token untuk Operasi Perubahan Status

Sertakan token dalam bentuk apa pun yang:

- Membuat data
- Memperbarui data
- Menghapus data
- Mengubah pengaturan pengguna
- Melakukan tindakan administratif apa pun

### Jangan Hanya Mengandalkan Pemeriksaan Referer

Header perujuk HTTP dapat berupa:

- Dilucuti oleh alat privasi
- Hilang di beberapa browser
- Dipalsukan dalam beberapa kasus

Selalu gunakan verifikasi token sebagai pertahanan utama Anda.

### Regenerasi Token dengan Tepat

Pertimbangkan untuk membuat ulang token:

- Setelah pengiriman formulir berhasil
- Setelah login/logout
- Secara berkala untuk sesi yang panjang

### Tangani Kedaluwarsa Token dengan Baik

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

## Masalah Umum dan Solusinya

### Kesalahan Token Tidak Ditemukan

**Masalah**: Pemeriksaan keamanan gagal dengan "token tidak ditemukan"

**Solusi**: Pastikan bidang token disertakan dalam formulir Anda:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Kesalahan Token Kedaluwarsa

**Masalah**: Pengguna melihat "token kedaluwarsa" setelah pengisian formulir yang lama

**Solusi**: Pertimbangkan untuk menggunakan JavaScript untuk menyegarkan token secara berkala:

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

### Masalah Token AJAX

**Masalah**: Permintaan AJAX gagal dalam validasi token

**Solusi**: Pastikan token diteruskan dengan setiap permintaan AJAX dan verifikasi di sisi server:

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

## Contoh: Implementasi Formulir Lengkap

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

#keamanan #csrf #xoops #forms #tokens #XoopsSecurity
