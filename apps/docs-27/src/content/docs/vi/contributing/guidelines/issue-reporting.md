---
title: "Hướng dẫn báo cáo vấn đề"
description: "Cách báo cáo lỗi, yêu cầu tính năng và các vấn đề khác một cách hiệu quả"
---
> Báo cáo lỗi hiệu quả và yêu cầu tính năng là rất quan trọng cho sự phát triển XOOPS. Hướng dẫn này giúp bạn tạo ra các vấn đề có chất lượng cao.

---

## Trước khi báo cáo

### Kiểm tra các vấn đề hiện có

**Luôn tìm kiếm đầu tiên:**

1. Đi tới [Sự cố GitHub](https://github.com/XOOPS/XoopsCore27/issues)
2. Tìm kiếm từ khóa liên quan đến vấn đề của bạn
3. Kiểm tra các vấn đề đã đóng - có thể đã được giải quyết
4. Xem các yêu cầu kéo - có thể đang được tiến hành

Sử dụng bộ lọc tìm kiếm:
- `is:issue is:open label:bug` - Lỗi mở
- `is:issue is:open label:feature` - Yêu cầu tính năng mở
- `is:issue sort:updated` - Các vấn đề được cập nhật gần đây

### Đây có thực sự là một vấn đề?

Hãy xem xét đầu tiên:

- **Vấn đề về cấu hình?** - Kiểm tra tài liệu
- **Câu hỏi về cách sử dụng?** - Hỏi trên diễn đàn hoặc cộng đồng Discord
- **Vấn đề bảo mật?** - Xem phần #security-issues bên dưới
- **Dành riêng cho mô-đun?** - Báo cáo cho người bảo trì mô-đun
- **Theo chủ đề cụ thể?** - Báo cáo cho tác giả chủ đề

---

## Loại vấn đề

### Báo cáo lỗi

Lỗi là một hành vi hoặc khiếm khuyết không mong muốn.

**Ví dụ:**
- Đăng nhập không hoạt động
- Lỗi cơ sở dữ liệu
- Thiếu xác thực biểu mẫu
- Lỗ hổng bảo mật

### Yêu cầu tính năng

Yêu cầu tính năng là gợi ý cho chức năng mới.

**Ví dụ:**
- Thêm hỗ trợ cho tính năng mới
- Cải thiện chức năng hiện có
- Bổ sung tài liệu còn thiếu
- Cải thiện hiệu suất

### Cải tiến

Một cải tiến cải thiện chức năng hiện có.

**Ví dụ:**
- Thông báo lỗi tốt hơn
- Cải thiện hiệu suất
- Thiết kế API tốt hơn
- Trải nghiệm người dùng tốt hơn

### Tài liệu

Vấn đề về tài liệu include thiếu tài liệu hoặc tài liệu không chính xác.

**Ví dụ:**
- Tài liệu API chưa đầy đủ
- Hướng dẫn lỗi thời
- Thiếu ví dụ về mã
- Lỗi chính tả trong tài liệu

---

## Báo cáo lỗi

### Mẫu báo cáo lỗi

```markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```

### Ví dụ về báo cáo lỗi tốt

```markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```

### Ví dụ về báo cáo lỗi kém

```markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```

---

## Báo cáo yêu cầu tính năng

### Mẫu yêu cầu tính năng

```markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```

### Ví dụ về yêu cầu tính năng tốt

```markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```

---

## Vấn đề bảo mật

### KHÔNG báo cáo công khai

**Không bao giờ tạo ra một vấn đề công khai về các lỗ hổng bảo mật.**

### Báo cáo riêng tư

1. **Gửi email cho nhóm bảo mật:** security@xoops.org
2. **Bao gồm:**
   - Mô tả lỗ hổng
   - Các bước tái hiện
   - Tác động tiềm ẩn
   - Thông tin liên lạc của bạn

### Tiết lộ có trách nhiệm

- Chúng tôi sẽ xác nhận đã nhận trong vòng 48 giờ
- Chúng tôi sẽ cung cấp thông tin cập nhật 7 ngày một lần
- Chúng tôi sẽ làm việc theo thời gian cố định
- Bạn có thể yêu cầu tín dụng cho khám phá này
- Điều phối thời gian công bố thông tin ra công chúng

### Ví dụ về vấn đề bảo mật

```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```

---

## Tiêu đề vấn đề Các phương pháp hay nhất

### Tiêu đề hay

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### Tiêu đề kém

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### Nguyên tắc Tiêu đề

- **Hãy cụ thể** - Đề cập đến cái gì và ở đâu
- **Hãy ngắn gọn** - Dưới 75 ký tự
- **Sử dụng thì hiện tại** - "hiển thị trang trống" chứ không phải "hiển thị trống"
- **Bao gồm ngữ cảnh** - "trong bảng admin", "trong khi cài đặt"
- **Tránh dùng những từ chung chung** - Không phải "sửa", "trợ giúp", "vấn đề"

---

## Mô tả vấn đề Các phương pháp hay nhất

### Bao gồm thông tin cần thiết

1. **Cái gì** - Mô tả rõ ràng về vấn đề
2. **Ở đâu** - Trang, mô-đun hoặc tính năng nào
3. **Khi** - Các bước sao chép
4. **Môi trường** - Phiên bản, hệ điều hành, trình duyệt, PHP
5. **Tại sao** - Tại sao điều này lại quan trọng

### Sử dụng định dạng mã

```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Include Screenshots

For UI issues, include:
- Screenshot of the problem
- Screenshot of expected behavior
- Annotate what's wrong (arrows, circles)

### Use Labels

Add labels to categorize:
- `bug` - Bug report
- `enhancement` - Enhancement request
- `documentation` - Documentation issue
- `help wanted` - Looking for help
- `good first issue` - Good for new contributors

---

## After Reporting

### Be Responsive

- Check for questions in the issue comments
- Provide additional information if requested
- Test suggested fixes
- Verify bug still exists with new versions

### Follow Etiquette

- Be respectful and professional
- Assume good intentions
- Don't demand fixes - developers are volunteers
- Offer to help if possible
- Thank contributors for their work

### Keep Issue Focused

- Stay on topic
- Don't discuss unrelated issues
- Link to related issues instead
- Don't use issues for feature voting

---

## What Happens to Issues

### Triage Process

1. **New issue created** - GitHub notifies maintainers
2. **Initial review** - Checked for clarity and duplicates
3. **Label assignment** - Categorized and prioritized
4. **Assignment** - Assigned to someone if appropriate
5. **Discussion** - Additional info gathered if needed

### Priority Levels

- **Critical** - Data loss, security, complete breakage
- **High** - Major feature broken, affects many users
- **Medium** - Part of feature broken, workaround available
- **Low** - Minor issue, cosmetic, or niche use case

### Resolution Outcomes

- **Fixed** - Issue resolved in a PR
- **Won't fix** - Rejected for technical or strategic reasons
- **Duplicate** - Same as another issue
- **Invalid** - Not actually an issue
- **Needs more info** - Waiting for additional details

---

## Issue Examples

### Example: Good Bug Report

```markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```### Ví dụ: Yêu cầu tính năng tốt

```markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```

---

## Tài liệu liên quan

- Quy tắc ứng xử
- Quy trình làm việc đóng góp
- Nguyên tắc yêu cầu kéo
- Đóng góp Tổng quan

---

#xoops #issues #báo cáo lỗi #yêu cầu tính năng #github