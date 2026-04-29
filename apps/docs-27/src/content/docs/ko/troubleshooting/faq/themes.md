---
title: "테마 FAQ"
description: "XOOPS 테마에 대해 자주 묻는 질문"
---

# 테마 자주 묻는 질문

> XOOPS 테마, 사용자 정의 및 관리에 대한 일반적인 질문과 답변입니다.

---

## 테마 설치 및 활성화

### Q: XOOPS에 새 테마를 어떻게 설치하나요?

**답:**
1. 테마 zip 파일을 다운로드합니다.
2. XOOPS 관리 > 모양 > 테마로 이동합니다.
3. "업로드"를 클릭하고 zip 파일을 선택하세요.
4. 테마 목록에 테마가 나타납니다
5. 귀하의 사이트에 대해 활성화하려면 클릭하세요.

대안: 수동으로 `/themes/` 디렉토리로 추출하고 관리 패널을 새로 고치십시오.

---

### Q: "권한이 거부되었습니다."로 인해 테마 업로드가 실패합니다.

**A:** 테마 디렉토리 권한 수정:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### Q: 특정 사용자에 대해 다른 테마를 설정하려면 어떻게 해야 하나요?

**답:**
1. 사용자 관리자 > 사용자 편집으로 이동합니다.
2. '기타' 탭으로 이동
3. "사용자 테마" 드롭다운에서 원하는 테마를 선택하세요.
4. 저장

사용자가 선택한 테마는 기본 사이트 테마보다 우선 적용됩니다.

---

### Q: 관리자 사이트와 사용자 사이트에 서로 다른 테마를 적용할 수 있나요?

**A:** 예, XOOPS 관리 > 설정에서 설정됩니다.

1. **프런트엔드 테마** - 기본 사이트 테마
2. **관리자 테마** - 관리자 제어판 테마(일반적으로 별도)

다음과 같은 설정을 찾으세요.
- `theme_set` - 프런트엔드 테마
- `admin_theme` - 관리 테마

---

## 테마 사용자 정의

### 질문: 기존 테마를 어떻게 맞춤설정하나요?

**답:** 업데이트를 보존하려면 하위 테마를 만드세요.

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Create copy for editing *}
    ├── style.css
    ├── templates/
    └── images/
```

그런 다음 사용자 정의 테마에서 `theme.html`을 편집하세요.

---

### Q: 테마 색상을 어떻게 변경하나요?

**답:** 테마의 CSS 파일을 편집합니다.

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

XOOPS 테마의 경우:

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### 질문: 테마에 맞춤 CSS를 어떻게 추가하나요?

**답:** 몇 가지 옵션:

**옵션 1: theme.html 수정**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**옵션 2: custom.css 생성**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**옵션 3: 관리자 설정(지원되는 경우)**
XOOPS 관리 > 설정 > 테마 설정으로 이동하여 사용자 정의 CSS를 추가하세요.

---

### Q: 테마 HTML 템플릿을 어떻게 수정합니까?

**답:** 템플릿 파일을 찾으세요.

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

적절한 Smarty 구문으로 편집하세요.

```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS Theme Template *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## 테마 구조

### Q: 테마에 필요한 파일은 무엇인가요?

**A:** 최소 구조:

```
themes/mytheme/
├── theme.html              {* Main template (required) *}
├── style.css              {* Stylesheet (optional but recommended) *}
├── screenshot.png         {* Preview image for admin (optional) *}
├── images/                {* Theme images *}
│   └── logo.png
└── templates/             {* Optional: Additional templates *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

자세한 내용은 테마 구조를 참조하세요.

---

### Q: 처음부터 테마를 만들려면 어떻게 해야 하나요?

**답:** 구조를 만듭니다.

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

`theme.html` 생성:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

`style.css` 생성:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## 테마 변수

### Q: 테마 템플릿에서는 어떤 변수를 사용할 수 있나요?

**답:** 일반적인 XOOPS 테마 변수:

```smarty
{* Site Information *}
{$xoops_sitename}          {* Site name *}
{$xoops_url}               {* Site URL *}
{$xoops_theme}             {* Current theme name *}

{* Page Content *}
{$xoops_contents}          {* Main page content *}
{$xoops_pagetitle}         {* Page title *}
{$xoops_headers}           {* Meta tags, styles in head *}

{* Module Information *}
{$xoops_module_header}     {* Module-specific header *}
{$xoops_moduledesc}        {* Module description *}

{* User Information *}
{$xoops_isuser}            {* Is user logged in? *}
{$xoops_userid}            {* User ID *}
{$xoops_uname}             {* Username *}

{* Blocks *}
{$xoops_blocks}            {* All block content *}

{* Other *}
{$xoops_charset}           {* Document charset *}
{$xoops_version}           {* XOOPS version *}
```

---

### Q: 테마에 맞춤 변수를 어떻게 추가하나요?

**답:** 렌더링 전 PHP 코드에서:

```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```

테마:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## 테마 스타일링

### 질문: 반응형 테마를 만들려면 어떻게 해야 하나요?

**답:** CSS Grid 또는 Flexbox를 사용하세요.

```css
/* themes/mytheme/style.css */

/* Mobile first approach */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

또는 Bootstrap 통합을 사용하십시오.
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```

---

### 질문: 테마에 어두운 모드를 추가하려면 어떻게 해야 하나요?

**답:**
```css
/* themes/mytheme/style.css */

/* Light mode (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* Or with CSS class */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

JavaScript로 전환:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## 테마 문제

### Q: 테마에 "인식할 수 없는 템플릿 변수" 오류가 표시됩니다.

**A:** 변수가 템플릿에 전달되지 않습니다. 확인:

1. PHP에서 **변수가 할당됨**:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. 지정된 곳에 **템플릿이 존재합니다**
3. **템플릿 구문이 정확합니다**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### 질문: CSS 변경사항이 브라우저에 표시되지 않습니다.

**답:** 브라우저 캐시 지우기:

1. 강제 새로 고침: `Ctrl+Shift+R`(Mac에서는 Cmd+Shift+R)
2. 서버의 테마 캐시 지우기:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. 테마의 CSS 파일 경로를 확인하세요.
```bash
ls -la themes/mytheme/style.css
```

---

### 질문: 테마의 이미지가 로드되지 않습니다.

**답:** 이미지 경로를 확인하세요.

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### Q: 테마 템플릿이 없거나 오류가 발생합니다.

**답:** 디버깅을 위해서는 템플릿 오류를 참조하세요.

---

## 테마 배포

### Q: 배포용 테마를 어떻게 패키징하나요?

**답:** 배포 가능한 zip을 만듭니다.

```bash
# Structure
mytheme/
├── theme.html           {* Required *}
├── style.css
├── screenshot.png       {* 300x225 recommended *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optional *}
    ├── header.html
    └── footer.html

# Create zip
zip -r mytheme.zip mytheme/
```

---

### Q: XOOPS 테마를 판매할 수 있나요?

**답:** XOOPS 라이센스를 확인하세요.
- XOOPS 클래스/템플릿을 사용하는 테마는 XOOPS 라이센스를 존중해야 합니다.
- 순수 CSS/HTML 테마에는 제한이 적습니다.
- 자세한 내용은 XOOPS 기여 지침을 확인하세요.

---

## 테마 성능

### 질문: 테마 성능을 최적화하려면 어떻게 해야 합니까?

**답:**
1. **CSS/JS 최소화** - 사용하지 않는 코드 제거
2. **이미지 최적화** - 적절한 형식(WebP, AVIF)을 사용하세요.
3. 리소스에 **CDN 사용**
4. **지연 로드** 이미지:
```html
<img src="image.jpg" loading="lazy">
```

5. **캐시 무효화 버전**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

자세한 내용은 성능 FAQ를 참조하세요.

---

## 관련 문서

- 템플릿 오류
- 테마 구조
- 성능 FAQ
- Smarty 디버깅 중

---

#xoops #themes #faq #문제 해결 #사용자 정의
