---
title: "जारी रिपोर्टिंग दिशानिर्देश"
description: "बग, सुविधा अनुरोध और अन्य समस्याओं की प्रभावी ढंग से रिपोर्ट कैसे करें"
---
> XOOPS विकास के लिए प्रभावी बग रिपोर्ट और फीचर अनुरोध महत्वपूर्ण हैं। यह मार्गदर्शिका आपको उच्च-गुणवत्ता वाले मुद्दे बनाने में मदद करती है।

---

## रिपोर्टिंग से पहले

### मौजूदा मुद्दों की जाँच करें

**हमेशा पहले खोजें:**

1. [GitHub मुद्दे](https://github.com/XOOPS/XoopsCore27/issues) पर जाएं
2. अपने मुद्दे से संबंधित कीवर्ड खोजें
3. बंद मुद्दों की जाँच करें - पहले से ही हल हो सकते हैं
4. पुल अनुरोधों को देखें - प्रगति पर हो सकता है

खोज फ़िल्टर का उपयोग करें:
- `is:issue is:open label:bug` - बग खोलें
- `is:issue is:open label:feature` - सुविधा अनुरोध खोलें
- `is:issue sort:updated` - हाल ही में अपडेट किए गए मुद्दे

### क्या यह सचमुच एक मुद्दा है?

पहले विचार करें:

- **कॉन्फ़िगरेशन समस्या?** - दस्तावेज़ की जाँच करें
- **उपयोग प्रश्न?** - मंचों या डिसॉर्डर समुदाय पर पूछें
- **सुरक्षा मुद्दा?** - नीचे #सुरक्षा-मुद्दे अनुभाग देखें
- **मॉड्यूल-विशिष्ट?** - मॉड्यूल अनुरक्षक को रिपोर्ट करें
- **थीम-विशिष्ट?** - थीम लेखक को रिपोर्ट करें

---

## मुद्दे के प्रकार

### बग रिपोर्ट

बग एक अप्रत्याशित व्यवहार या दोष है.

**उदाहरण:**
- लॉगिन काम नहीं कर रहा
- डेटाबेस त्रुटियाँ
- गुम फॉर्म सत्यापन
- सुरक्षा भेद्यता

### सुविधा अनुरोध

सुविधा अनुरोध नई कार्यक्षमता के लिए एक सुझाव है।

**उदाहरण:**
- नई सुविधा के लिए समर्थन जोड़ें
- मौजूदा कार्यक्षमता में सुधार करें
- गुम दस्तावेज जोड़ें
- प्रदर्शन में सुधार

### संवर्धन

एक संवर्द्धन मौजूदा कार्यक्षमता में सुधार करता है।

**उदाहरण:**
- बेहतर त्रुटि संदेश
- बेहतर प्रदर्शन
- बेहतर API डिज़ाइन
- बेहतर उपयोगकर्ता अनुभव

### दस्तावेज़ीकरण

दस्तावेज़ीकरण संबंधी समस्याओं में गुम या गलत दस्तावेज़ शामिल हैं।

**उदाहरण:**
- अधूरा API दस्तावेज़
- पुराने गाइड
- गुम कोड उदाहरण
- दस्तावेज़ीकरण में टाइपो त्रुटियाँ

---

## एक बग की रिपोर्ट करना

### बग रिपोर्ट टेम्पलेट

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

### अच्छी बग रिपोर्ट उदाहरण

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

### ख़राब बग रिपोर्ट उदाहरण

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

## एक फीचर अनुरोध की रिपोर्ट करना

### फ़ीचर अनुरोध टेम्पलेट

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

### अच्छी सुविधा अनुरोध उदाहरण

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

## सुरक्षा मुद्दे

### सार्वजनिक रूप से रिपोर्ट न करें

**सुरक्षा कमजोरियों के लिए कभी भी सार्वजनिक मुद्दा न बनाएं।**

### निजी तौर पर रिपोर्ट करें

1. **सुरक्षा टीम को ईमेल करें:**security@xoops.org
2. **शामिल हैं:**
   - भेद्यता का विवरण
   - पुनरुत्पादन के लिए कदम
   - संभावित प्रभाव
   - आपकी संपर्क जानकारी

### जिम्मेदार खुलासा

- हम 48 घंटों के भीतर रसीद स्वीकार करेंगे
- हम हर 7 दिन में अपडेट प्रदान करेंगे
- हम एक फिक्स टाइमलाइन पर काम करेंगे
- आप खोज के लिए श्रेय का अनुरोध कर सकते हैं
- सार्वजनिक प्रकटीकरण समय का समन्वय करें

### सुरक्षा समस्या उदाहरण

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

## अंक शीर्षक सर्वोत्तम प्रथाएँ

### अच्छे शीर्षक

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### ख़राब शीर्षक

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### शीर्षक दिशानिर्देश

- **विशिष्ट रहें** - उल्लेख करें कि क्या और कहाँ
- **संक्षिप्त रहें** - 75 अक्षरों से कम
- **वर्तमान काल का प्रयोग करें** - "खाली पृष्ठ दिखाता है" न कि "खाली दिखाया जाता है"
- **संदर्भ शामिल करें** - "व्यवस्थापक पैनल में", "इंस्टॉलेशन के दौरान"
- **सामान्य शब्दों से बचें** - "ठीक करें", "मदद", "समस्या" नहीं

---

## अंक विवरण सर्वोत्तम प्रथाएँ

### आवश्यक जानकारी शामिल करें

1. **क्या** - मुद्दे का स्पष्ट विवरण
2. **कहां** - कौन सा पेज, मॉड्यूल, या फीचर
3. **कब** - पुनरुत्पादन के चरण
4. **पर्यावरण** - संस्करण, ओएस, ब्राउज़र, PHP
5. **क्यों** - यह महत्वपूर्ण क्यों है

### कोड फ़ॉर्मेटिंग का उपयोग करें

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

### उदाहरण: अच्छी सुविधा का अनुरोध

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

## संबंधित दस्तावेज़ीकरण

-आचार संहिता
- योगदान कार्यप्रवाह
- पुल अनुरोध दिशानिर्देश
- योगदान अवलोकन

---

#xoops #मुद्दे #बग-रिपोर्टिंग #फ़ीचर-अनुरोध #github