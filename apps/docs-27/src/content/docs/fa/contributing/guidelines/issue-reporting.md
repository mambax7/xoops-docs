---
title: "دستورالعمل های گزارش گیری مسائل"
description: "چگونه اشکالات، درخواست های ویژگی و سایر مسائل را به طور موثر گزارش کنیم"
---
> گزارش‌های اشکال مؤثر و درخواست‌های ویژگی برای توسعه XOOPS بسیار مهم هستند. این راهنما به شما کمک می کند تا مسائل با کیفیت بالا ایجاد کنید.

---

## قبل از گزارش

### مشکلات موجود را بررسی کنید

**همیشه ابتدا جستجو کنید:**

1. به [مشکلات GitHub](https://github.com/XOOPS/XoopsCore27/issues) بروید
2. کلمات کلیدی مرتبط با مشکل خود را جستجو کنید
3. بررسی مسائل بسته - ممکن است قبلا حل شده است
4. به درخواست های کشش نگاه کنید - ممکن است در حال انجام باشد

از فیلترهای جستجو استفاده کنید:
- `is:issue is:open label:bug` - اشکالات را باز کنید
- `is:issue is:open label:feature` - درخواست های ویژگی را باز کنید
- `is:issue sort:updated` - مسائل اخیر به روز شده

### آیا واقعاً یک مشکل است؟

ابتدا در نظر بگیرید:

- ** مشکل پیکربندی؟ ** - اسناد را بررسی کنید
- **سوال استفاده؟** - در انجمن ها یا انجمن Discord بپرسید
- **مشکل امنیتی؟** - بخش #مسائل امنیتی را در زیر ببینید
- ** ماژول خاص؟ ** - گزارش به نگهدار ماژول
- ** موضوع خاص؟ ** - گزارش به نویسنده موضوع

---

## انواع مسئله

### گزارش اشکال

اشکال یک رفتار یا نقص غیرمنتظره است.

**مثال:**
- ورود کار نمی کند
- خطاهای پایگاه داده
- اعتبار سنجی فرم وجود ندارد
- آسیب پذیری امنیتی

### درخواست ویژگی

درخواست ویژگی پیشنهادی برای عملکرد جدید است.

**مثال:**
- اضافه کردن پشتیبانی برای ویژگی های جدید
- بهبود عملکرد موجود
- اسناد گم شده را اضافه کنید
- بهبود عملکرد

### افزایش

یک بهبود عملکرد موجود را بهبود می بخشد.

**مثال:**
- پیام های خطای بهتر
- بهبود عملکرد
- طراحی API بهتر
- تجربه کاربری بهتر

### مستندات

مسائل مربوط به مستندات شامل اسناد مفقود یا نادرست است.

**مثال:**
- اسناد API ناقص
- راهنماهای قدیمی
- نمونه های کد از دست رفته
- غلط املایی در اسناد

---

## گزارش یک اشکال

### الگوی گزارش اشکال

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

### مثال گزارش اشکال خوب

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

### مثال گزارش اشکال ضعیف

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

## گزارش یک درخواست ویژگی

### الگوی درخواست ویژگی

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

### مثال درخواست ویژگی خوب

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

## مسائل امنیتی

### به صورت عمومی گزارش ندهید

**هرگز یک موضوع عمومی برای آسیب پذیری های امنیتی ایجاد نکنید.**

### گزارش خصوصی

1. **به تیم امنیتی ایمیل بزنید:** security@xoops.org
2. **شامل:**
   - شرح آسیب پذیری
   - مراحل تکثیر
   - تاثیر بالقوه
   - اطلاعات تماس شما

### افشای مسئولانه

- ما ظرف 48 ساعت دریافت را تایید می کنیم
- ما هر 7 روز به روز رسانی را ارائه خواهیم داد
- ما روی یک جدول زمانی ثابت کار خواهیم کرد
- می توانید برای کشف درخواست اعتبار کنید
- زمان بندی افشای عمومی را هماهنگ کنید

### مثال مشکل امنیتی

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

## عنوان شماره بهترین شیوه ها

### عناوین خوب

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### عناوین ضعیف

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### راهنمای عنوان

- **مشخص باشید** - ذکر چه چیزی و کجا
- ** مختصر باشد ** - زیر 75 کاراکتر
- **از زمان حال استفاده کنید** - "صفحه خالی را نشان می دهد" نه "خالی نشان داده شده"
- ** شامل زمینه ** - "در پنل مدیریت"، "در حین نصب"
- **از کلمات عمومی اجتناب کنید** - نه "رفع"، "کمک"، "مشکل"

---

## شرح شماره بهترین شیوه ها

### شامل اطلاعات ضروری است

1. **چه ** - توضیح واضح موضوع
2. ** کجا ** - کدام صفحه، ماژول یا ویژگی
3. **وقتی** - مراحل تکثیر
4. **محیط زیست** - نسخه، سیستم عامل، مرورگر، PHP
5. **چرا ** - چرا این مهم است

### از قالب بندی کد استفاده کنید

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
```

### مثال: درخواست ویژگی خوب

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

## مستندات مرتبط

- کد رفتار
- گردش کار مشارکت
- دستورالعمل های درخواست را بکشید
- مشارکت در بررسی اجمالی

---

#xoops #مسائل #گزارش اشکال #ویژگی_درخواست #github