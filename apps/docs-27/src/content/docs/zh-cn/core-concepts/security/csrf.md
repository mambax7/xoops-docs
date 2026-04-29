---
title：“CSRF保护”
description：“使用 XOOPSSecurity 类理解和实现 XOOPS 中的 CSRF 保护”
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

交叉-Site请求伪造（CSRF）攻击诱骗用户在经过身份验证的网站上执行不需要的操作。 XOOPS 通过`XOOPSSecurity` 类提供内置-in CSRF 保护。

## 相关文档

- 安全-Best-Practices - 全面的安全指南
- 输入-Sanitization - MyTextSanitizer 和验证
- SQL-Injection-Prevention - 数据库安全实践

## 了解CSRF攻击

CSRF 攻击发生在以下情况：

1. 用户在您的 XOOPS 网站上经过身份验证
2、用户访问恶意网站
3. 恶意网站使用用户会话向您的XOOPS网站提交请求
4. 您的网站处理该请求，就像它来自合法用户一样

## XOOPSSecurity 类

XOOPS 提供 `XOOPSSecurity` 类来防止 CSRF 攻击。此类管理必须包含在表单中并在处理请求时进行验证的安全令牌。

### 代币生成

安全类生成存储在用户会话中的唯一令牌，并且必须包含在表单中：

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### 令牌验证

处理表单提交时，验证令牌是否有效：

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## 使用XOOPS令牌系统

### 使用 XOOPSForm 类

当使用XOOPS表单类时，令牌保护很简单：

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

### 使用自定义表单

对于不使用 XOOPSForm 的自定义 HTML 表单：

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

### 在 Smarty 模板中

在 Smarty 模板中生成表单时：

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

## 处理表单提交

### 基本令牌验证

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

### 使用自定义错误处理

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

### 对于 AJAX 请求

处理 AJAX 请求时，请在请求中包含令牌：

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

## 检查 HTTP 推荐人

如需额外保护，尤其是针对 AJAX 请求，您还可以检查 HTTP 引荐来源网址：

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

### 联合安全检查

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## 令牌配置

### 令牌生命周期

令牌的生命周期有限，以防止重放攻击。您可以在 XOOPS 设置中进行配置或优雅地处理过期的令牌：

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### 同一页面上有多个表单

当同一页面上有多个表单时，每个表单都应该有自己的令牌：

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## 最佳实践

### 始终使用代币进行状态-Changing操作

包括任何形式的令牌：

- 创建数据
- 更新数据
- 删除数据
- 更改用户设置
- 执行任何行政行动

### 不要仅仅依赖引用检查

HTTP引用标头可以是：

- 被隐私工具剥夺
- 某些浏览器中缺失
- 在某些情况下被欺骗

始终使用令牌验证作为主要防御措施。

### 适当地重新生成令牌

考虑重新生成令牌：

- 成功提交表单后
- login/logout之后
- 定期进行长时间训练

### 优雅地处理令牌过期

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

## 常见问题及解决方案

### 未找到令牌错误

**问题**：安全检查失败并显示“未找到令牌”

**解决方案**：确保令牌字段包含在您的表单中：

```php
$form->addElement(new XoopsFormHiddenToken());
```

### 令牌过期错误

**问题**：用户在完成长表单后看到“令牌已过期”

**解决方案**：考虑使用JavaScript定期刷新令牌：

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

### AJAX 代币问题

**问题**：AJAX请求未通过令牌验证

**解决方案**：确保每个 AJAX 请求都传递令牌，并验证服务器-side：

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

## 示例：完整的表单实施

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

---#security #csrf #XOOPS #forms #tokens #XOOPSSecurity