---
title: "Hướng dẫn yêu cầu kéo"
description: "Hướng dẫn gửi yêu cầu kéo tới các dự án XOOPS"
---
Tài liệu này cung cấp hướng dẫn toàn diện để gửi yêu cầu kéo tới các dự án XOOPS. Việc tuân theo các nguyên tắc này sẽ đảm bảo quá trình đánh giá mã diễn ra suôn sẻ và thời gian hợp nhất nhanh hơn.

## Trước khi tạo yêu cầu kéo

### Bước 1: Kiểm tra các vấn đề hiện có

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### Bước 2: Phân nhánh và sao chép kho lưu trữ

```bash
# Fork the repository on GitHub
# Click "Fork" button on the repository page

# Clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verify remotes
git remote -v
# Should show: origin (your fork) and upstream (official)
```

### Bước 3: Tạo nhánh đối tượng

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### Bước 4: Thực hiện thay đổi của bạn

```bash
# Make changes to your files
# Follow code style guidelines

# Stage changes
git add .

# Commit with clear message
git commit -m "Fix database connection timeout issue"

# Create multiple commits for logical changes
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## Cam kết tiêu chuẩn tin nhắn

### Tin nhắn cam kết tốt

Sử dụng thông điệp mô tả rõ ràng theo các mẫu sau:

```
# Format
<type>: <subject>

<body>

<footer>

# Example 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Example 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### Loại cam kết

| Loại | Mô tả | Ví dụ |
|------|-------------|----------|
| `feat` | Tính năng mới | `feat: add user dashboard widget` |
| `fix` | Sửa lỗi | `fix: resolve cache invalidation bug` |
| `docs` | Tài liệu | `docs: update API reference` |
| `style` | Kiểu mã (không thay đổi logic) | `style: format imports` |
| `refactor` | Tái cấu trúc mã | `refactor: simplify service layer` |
| `perf` | Cải thiện hiệu suất | `perf: optimize database queries` |
| `test` | Kiểm tra thay đổi | `test: add integration tests` |
| `chore` | Thay đổi xây dựng/công cụ | `chore: update dependencies` |

## Mô tả yêu cầu kéo

### Mẫu PR

```markdown
## Description
Clear description of changes made and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing steps included

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Added tests for new functionality
- [ ] All tests passing
```

## Yêu cầu về chất lượng mã

### Kiểu mã

Thực hiện theo các nguyên tắc về Kiểu mã:

```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## Yêu cầu kiểm tra

### Bài kiểm tra đơn vị

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### Đang chạy thử nghiệm

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Làm việc với các Chi nhánh

### Luôn cập nhật chi nhánh

```bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```

## Tạo yêu cầu kéo

### Định dạng tiêu đề PR

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Quy trình xét duyệt mã

### Người đánh giá tìm kiếm điều gì

1. **Tính đúng**
   - Mã có giải quyết được vấn đề đã nêu không?
   - Các trường hợp cạnh có được xử lý không?
   - Xử lý lỗi có phù hợp không?

2. **Chất lượng**
   - Nó có tuân theo các tiêu chuẩn mã hóa không?
   - Có thể bảo trì được không?
   - Đã kiểm tra tốt chưa?

3. **Hiệu suất**
   - Có bất kỳ sự hồi quy hiệu suất nào không?
   - Truy vấn có được tối ưu hóa không?
   - Việc sử dụng bộ nhớ có hợp lý không?

4. **Bảo mật**
   - Xác nhận đầu vào?
   - Phòng chống tiêm SQL?
   - Xác thực/ủy quyền?

### Trả lời phản hồi

```bash
# Address feedback
# Edit files based on review comments

# Commit changes
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Push changes
git push origin bugfix/123-fix-database-connection
```

## Các vấn đề PR thường gặp và giải pháp

### Vấn đề 1: PR quá lớn

**Vấn đề:** Người đánh giá không thể đánh giá các PR lớn một cách hiệu quả

**Giải pháp:** Chia thành các PR nhỏ hơn
- PR lần đầu: Những thay đổi cốt lõi
- PR lần 2: Kiểm tra
- PR thứ ba: Tài liệu

### Vấn đề 2: Không bao gồm bài kiểm tra

**Vấn đề:** Người đánh giá không thể xác minh chức năng

**Giải pháp:** Thêm các bài kiểm tra toàn diện trước khi gửi

### Vấn đề 3: Xung đột với Main

**Vấn đề:** Nhánh của bạn không đồng bộ với nhánh chính

**Giải pháp:** Rebase trên main mới nhất

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Sau khi hợp nhất

### Dọn dẹp

```bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```

## Tóm tắt các phương pháp hay nhất

### Việc nên làm

- Tạo thông điệp cam kết mô tả
- Thực hiện PR tập trung, có mục đích duy nhất
- Bao gồm các bài kiểm tra cho chức năng mới
- Cập nhật tài liệu
- Các vấn đề liên quan đến tài liệu tham khảo
- Giữ mô tả PR rõ ràng
- Trả lời kịp thời các đánh giá

### Những điều không nên làm

- Bao gồm những thay đổi không liên quan
- Hợp nhất main vào nhánh của bạn (sử dụng rebase)
- Buộc đẩy sau khi bắt đầu xem xét
- Bỏ qua các bài kiểm tra
- Gửi công việc đang tiến hành
- Bỏ qua phản hồi đánh giá mã

## Tài liệu liên quan- ../Đóng góp - Tổng quan về đóng góp
- Code-Style - Hướng dẫn về kiểu mã
- ../../03-Module-Development/Best-Thực hành/Thử nghiệm - Thử nghiệm các phương pháp hay nhất
- ../Architecture-Decisions/ADR-Index - Hướng dẫn kiến trúc

## Tài nguyên

- [Tài liệu Git](https://git-scm.com/doc)
- [Trợ giúp yêu cầu kéo GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Cam kết thông thường](https://www.conventionalcommits.org/)
- [Tổ chức GitHub XOOPS](https://github.com/XOOPS)

---

**Cập nhật lần cuối:** 2026-01-31
**Áp dụng cho:** Tất cả các dự án XOOPS
**Kho lưu trữ:** https://github.com/XOOPS/XOOPS