---
title: "Bảo vệ CSRF"
description: "Hiểu và triển khai tính năng bảo vệ CSRF trong XOOPS bằng XoopsSecurity class"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Các cuộc tấn công giả mạo yêu cầu trên nhiều trang web (CSRF) lừa người dùng thực hiện các hành động không mong muốn trên trang web nơi họ được xác thực. XOOPS cung cấp khả năng bảo vệ CSRF tích hợp thông qua `XoopsSecurity` class.

## Tài liệu liên quan

- Bảo mật-Thực hành tốt nhất - Hướng dẫn bảo mật toàn diện
- Vệ sinh đầu vào - MyTextSanitizer và xác thực
- SQL-Injection-Prevention - Thực hành bảo mật cơ sở dữ liệu

## Tìm hiểu các cuộc tấn công CSRF

Cuộc tấn công CSRF xảy ra khi:

1. Người dùng được xác thực trên trang XOOPS của bạn
2. Người dùng truy cập trang web độc hại
3. Trang web độc hại gửi yêu cầu đến trang XOOPS của bạn bằng phiên của người dùng
4. Trang web của bạn xử lý yêu cầu như thể nó đến từ người dùng hợp pháp

## Lớp bảo mật Xoops

XOOPS cung cấp `XoopsSecurity` class để bảo vệ chống lại các cuộc tấn công CSRF. class này quản lý mã thông báo bảo mật phải là included trong biểu mẫu và được xác minh khi xử lý yêu cầu.

### Tạo mã thông báo

Bảo mật class tạo mã thông báo duy nhất được lưu trữ trong phiên của người dùng và phải là included ở dạng:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Xác minh mã thông báo

Khi xử lý việc gửi biểu mẫu, hãy xác minh rằng mã thông báo hợp lệ:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Sử dụng hệ thống mã thông báo XOOPS

### Với các lớp XoopsForm

Khi sử dụng XOOPS mẫu classes, việc bảo vệ mã thông báo rất đơn giản:

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

### Với biểu mẫu tùy chỉnh

Đối với các biểu mẫu HTML tùy chỉnh không sử dụng XoopsForm:

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

### Trong mẫu Smarty

Khi tạo biểu mẫu trong Smarty templates:

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

## Đang xử lý việc gửi biểu mẫu

### Xác minh mã thông báo cơ bản

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

### Với xử lý lỗi tùy chỉnh

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

### Đối với các yêu cầu AJAX

Khi làm việc với các yêu cầu AJAX, mã thông báo include trong yêu cầu của bạn:

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

## Kiểm tra người giới thiệu HTTP

Để tăng cường bảo vệ, đặc biệt đối với các yêu cầu AJAX, bạn cũng có thể kiểm tra tham chiếu HTTP:

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

### Kiểm tra bảo mật kết hợp

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Cấu hình mã thông báo

### Thời gian tồn tại của mã thông báo

Mã thông báo có thời gian tồn tại giới hạn để ngăn chặn các cuộc tấn công lặp lại. Bạn có thể định cấu hình điều này trong cài đặt XOOPS hoặc xử lý các mã thông báo đã hết hạn một cách duyên dáng:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Nhiều biểu mẫu trên cùng một trang

Khi bạn có nhiều biểu mẫu trên cùng một trang, mỗi biểu mẫu phải có mã thông báo riêng:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Các phương pháp hay nhất

### Luôn sử dụng mã thông báo cho các hoạt động thay đổi trạng thái

Bao gồm các mã thông báo dưới mọi hình thức:

- Tạo dữ liệu
- Cập nhật dữ liệu
- Xóa dữ liệu
- Thay đổi cài đặt người dùng
- Thực hiện mọi hành động administrative

### Đừng chỉ dựa vào việc kiểm tra người giới thiệu

Tiêu đề người giới thiệu HTTP có thể là:

- Bị tước bỏ bởi các công cụ bảo mật
- Thiếu trong một số trình duyệt
- Giả mạo trong một số trường hợp

Luôn sử dụng xác minh mã thông báo làm biện pháp bảo vệ chính của bạn.

### Tái tạo Token một cách phù hợp

Xem xét việc tạo lại mã thông báo:- Sau khi gửi form thành công
- Sau khi đăng nhập/đăng xuất
- Định kỳ trong thời gian dài

### Xử lý việc hết hạn mã thông báo một cách khéo léo

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

## Các vấn đề thường gặp và giải pháp

### Lỗi không tìm thấy mã thông báo

**Sự cố**: Kiểm tra bảo mật không thành công với "không tìm thấy mã thông báo"

**Giải pháp**: Đảm bảo trường mã thông báo là included trong biểu mẫu của bạn:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Lỗi hết hạn mã thông báo

**Sự cố**: Người dùng thấy "mã thông báo đã hết hạn" sau khi hoàn thành biểu mẫu dài

**Giải pháp**: Cân nhắc sử dụng JavaScript để làm mới mã thông báo định kỳ:

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

### Vấn đề về mã thông báo AJAX

**Sự cố**: Yêu cầu AJAX không xác thực được mã thông báo

**Giải pháp**: Đảm bảo mã thông báo được chuyển với mọi yêu cầu AJAX và xác minh phía máy chủ:

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

## Ví dụ: Triển khai biểu mẫu hoàn chỉnh

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

#bảo mật #csrf #xoops #forms #tokens #XoopsSecurity