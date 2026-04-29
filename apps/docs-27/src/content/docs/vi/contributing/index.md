---
title: "Hướng dẫn đóng góp"
description: "Cách đóng góp cho sự phát triển CMS XOOPS CMS, tiêu chuẩn mã hóa và nguyên tắc cộng đồng"
---
# 🤝 Đóng góp cho XOOPS

> Tham gia cộng đồng XOOPS và giúp biến nó thành CMS tốt nhất trên thế giới.

---

## 📋 Tổng quan

XOOPS là một dự án nguồn mở phát triển nhờ sự đóng góp của cộng đồng. Cho dù bạn đang sửa lỗi, thêm tính năng, cải thiện tài liệu hay giúp đỡ người khác thì những đóng góp của bạn đều có giá trị.

---

## 🗂️ Nội dung phần

### Nguyên tắc
- Quy tắc ứng xử
- Quy trình làm việc đóng góp
- Nguyên tắc yêu cầu kéo
- Báo cáo vấn đề

### Kiểu mã
- Tiêu chuẩn mã hóa PHP
- Tiêu chuẩn JavaScript
- Hướng dẫn CSS
- Tiêu chuẩn mẫu Smarty

### Quyết định về kiến trúc
- Chỉ số ADR
- Mẫu ADR
- ADR-001: Kiến trúc mô-đun
- ADR-002: Trừu tượng hóa cơ sở dữ liệu

---

## 🚀 Bắt đầu

### 1. Thiết lập môi trường phát triển

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```

### 2. Tạo nhánh tính năng

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Thực hiện thay đổi

Tuân theo các tiêu chuẩn mã hóa và viết bài kiểm tra cho các tính năng mới.

### 4. Gửi yêu cầu kéo

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Sau đó tạo Yêu cầu kéo trên GitHub.

---

## 📝 Tiêu chuẩn mã hóa

### Tiêu chuẩn PHP

XOOPS tuân theo các tiêu chuẩn mã hóa PSR-1, PSR-4 và PSR-12.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### Các quy ước chính

| Quy tắc | Ví dụ |
|------|----------|
| Tên lớp | `PascalCase` |
| Tên phương thức | `camelCase` |
| Hằng số | `UPPER_SNAKE_CASE` |
| Biến | `$camelCase` |
| Tập tin | `ClassName.php` |
| Thụt lề | 4 chỗ |
| Độ dài dòng | Tối đa 120 ký tự |

### Mẫu Smarty

```smarty
{* File: templates/mymodule_index.tpl *}
{* Description: Index page template *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Quy trình làm việc của Git

### Đặt tên chi nhánh

| Loại | Mẫu | Ví dụ |
|------|----------|----------|
| Tính năng | `feature/description` | `feature/add-user-export` |
| Sửa lỗi | `fix/description` | `fix/login-validation` |
| Sửa lỗi nóng | `hotfix/description` | `hotfix/security-patch` |
| Phát hành | `release/version` | `release/2.7.0` |

### Tin nhắn cam kết

Thực hiện theo các cam kết thông thường:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Các loại:**
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Tài liệu
- `style`: Kiểu mã (định dạng)
- `refactor`: Tái cấu trúc mã
- `test`: Thêm bài kiểm tra
- `chore`: Bảo trì

**Ví dụ:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```

```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```

---

## 🧪 Thử nghiệm

### Đang chạy thử nghiệm

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Bài kiểm tra viết

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## 📋 Danh sách kiểm tra yêu cầu kéo

Trước khi gửi PR, hãy đảm bảo:

- [ ] Code tuân theo chuẩn mã hóa XOOPS
- [ ] Tất cả các bài kiểm tra đều vượt qua
- [] Tính năng mới có thử nghiệm
- [ ] Tài liệu được cập nhật nếu cần
- [] Không có xung đột khi hợp nhất với nhánh chính
- [] Thông báo cam kết mang tính mô tả
- [ ] Mô tả PR giải thích những thay đổi
- [] Các vấn đề liên quan được liên kết

---

## 🏗️ Hồ sơ Quyết định Kiến trúc

ADR ghi lại các quyết định kiến trúc quan trọng.

### Mẫu ADR

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue we're addressing?

## Decision
What is the change being proposed?

## Consequences
What are the positive and negative effects?

## Alternatives Considered
What other options were evaluated?
```

### ADR hiện tại

| ADR | Tiêu đề | Trạng thái |
|------|-------|--------|
| ADR-001 | Kiến trúc mô-đun | Đã chấp nhận |
| ADR-002 | Truy cập cơ sở dữ liệu hướng đối tượng | Đã chấp nhận |
| ADR-003 | Công cụ mẫu Smarty | Đã chấp nhận |
| ADR-004 | Thiết kế hệ thống an ninh | Đã chấp nhận |
| ADR-005 | Phần mềm trung gian PSR-15 (4.0.x) | Đề xuất |

---

## 🎖️ Sự công nhận

Những người đóng góp được ghi nhận thông qua:- **Danh sách người đóng góp** - Được liệt kê trong kho
- **Ghi chú phát hành** - Được ghi trong bản phát hành
- **Hall of Fame** - Những người đóng góp xuất sắc
- **Chứng nhận mô-đun** - Huy hiệu chất lượng cho modules

---

## 🔗 Tài liệu liên quan

- Lộ trình XOOPS 4.0
- Khái niệm cốt lõi
- Phát triển mô-đun

---

## 📚 Tài nguyên

- [Kho lưu trữ GitHub](https://github.com/XOOPS/XoopsCore27)
- [Trình theo dõi vấn đề](https://github.com/XOOPS/XoopsCore27/issues)
- [Diễn đàn XOOPS](https://xoops.org/modules/newbb/)
- [Cộng đồng Discord](https://discord.gg/xoops)

---

#xoops #đóng góp #nguồn mở #cộng đồng #phát triển #tiêu chuẩn mã hóa