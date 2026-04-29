---
title: "योगदान दिशानिर्देश"
description: "XOOPS सीएमएस विकास, कोडिंग मानकों और सामुदायिक दिशानिर्देशों में कैसे योगदान करें"
---
# 🤝 XOOPS में योगदान

> XOOPS समुदाय में शामिल हों और इसे दुनिया का सर्वश्रेष्ठ सीएमएस बनाने में मदद करें।

---

## 📋अवलोकन

XOOPS एक ओपन-सोर्स प्रोजेक्ट है जो सामुदायिक योगदान पर फलता-फूलता है। चाहे आप बग ठीक कर रहे हों, सुविधाएँ जोड़ रहे हों, दस्तावेज़ीकरण में सुधार कर रहे हों, या दूसरों की मदद कर रहे हों, आपका योगदान मूल्यवान है।

---

## 🗂️ अनुभाग सामग्री

### दिशानिर्देश
-आचार संहिता
- योगदान कार्यप्रवाह
- पुल अनुरोध दिशानिर्देश
- मुद्दे की रिपोर्टिंग

### कोड शैली
- PHP कोडिंग मानक
- JavaScript मानक
- CSS दिशानिर्देश
- Smarty टेम्पलेट मानक

### वास्तु निर्णय
- एडीआर सूचकांक
- एडीआर टेम्पलेट
- ADR-001: मॉड्यूलर आर्किटेक्चर
- ADR-002: डेटाबेस एब्स्ट्रैक्शन

---

## 🚀 आरंभ करना

### 1. विकास वातावरण स्थापित करें

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

### 2. फ़ीचर शाखा बनाएँ

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. परिवर्तन करें

कोडिंग मानकों का पालन करें और नई सुविधाओं के लिए परीक्षण लिखें।

### 4. पुल अनुरोध सबमिट करें

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

फिर GitHub पर एक पुल अनुरोध बनाएं।

---

## 📝 कोडिंग मानक

### PHP मानक

XOOPS PSR-1, PSR-4, और PSR-12 कोडिंग मानकों का पालन करता है।

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

### प्रमुख सम्मेलन

| नियम | उदाहरण |
|------|---------|
| कक्षा के नाम | `PascalCase` |
| विधि के नाम | `camelCase` |
| स्थिरांक | `UPPER_SNAKE_CASE` |
| चर | `$camelCase` |
| फ़ाइलें | `ClassName.php` |
| इंडेंटेशन | 4 स्थान |
| लाइन की लंबाई | अधिकतम 120 अक्षर |

### Smarty टेम्पलेट्स

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

## 🔀 गिट वर्कफ़्लो

### शाखा नामकरण

| प्रकार | पैटर्न | उदाहरण |
|------|------|---------|
| फ़ीचर | `feature/description` | `feature/add-user-export` |
| बगफिक्स | `fix/description` | `fix/login-validation` |
| हॉटफ़िक्स | `hotfix/description` | `hotfix/security-patch` |
| रिलीज | `release/version` | `release/2.7.0` |

### संदेश भेजें

पारंपरिक प्रतिबद्धताओं का पालन करें:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**प्रकार:**
- `feat`: नई सुविधा
- `fix`: बग फिक्स
- `docs`: दस्तावेज़ीकरण
- `style`: कोड शैली (स्वरूपण)
- `refactor`: कोड रीफैक्टरिंग
- `test`: परीक्षण जोड़ना
- `chore`: रखरखाव

**उदाहरण:**
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

## 🧪 परीक्षण

### रनिंग टेस्ट

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### लेखन परीक्षण

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

## 📋 अनुरोध चेकलिस्ट खींचें

पीआर सबमिट करने से पहले, सुनिश्चित करें:

- [ ] कोड XOOPS कोडिंग मानकों का पालन करता है
- [ ] सभी परीक्षण उत्तीर्ण होते हैं
- [ ] नई सुविधाओं के परीक्षण हैं
- [ ] यदि आवश्यक हो तो दस्तावेज़ीकरण अद्यतन किया गया
- [ ] मुख्य शाखा के साथ कोई विलय विवाद नहीं
- [ ] प्रतिबद्ध संदेश वर्णनात्मक हैं
- [ ] पीआर विवरण परिवर्तनों की व्याख्या करता है
- [ ] संबंधित मुद्दे जुड़े हुए हैं

---

## 🏗️ वास्तुकला निर्णय अभिलेख

एडीआर महत्वपूर्ण वास्तुशिल्प निर्णयों का दस्तावेजीकरण करते हैं।

### एडीआर टेम्पलेट

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

### वर्तमान एडीआर

| एडीआर | शीर्षक | स्थिति |
|----|-------|--------|
| एडीआर-001 | मॉड्यूलर आर्किटेक्चर | स्वीकृत |
| एडीआर-002 | ऑब्जेक्ट-ओरिएंटेड डेटाबेस एक्सेस | स्वीकृत |
| एडीआर-003 | Smarty टेम्पलेट इंजन | स्वीकृत |
| एडीआर-004 | सुरक्षा प्रणाली डिज़ाइन | स्वीकृत |
| एडीआर-005 | पीएसआर-15 मिडलवेयर (4.0.x) | प्रस्तावित |

---

## 🎖️पहचान

योगदानकर्ताओं को इसके माध्यम से पहचाना जाता है:

- **योगदानकर्ताओं की सूची** - भंडार में सूचीबद्ध
- **रिलीज़ नोट्स** - रिलीज़ में श्रेय दिया गया
- **हॉल ऑफ फ़ेम** - उत्कृष्ट योगदानकर्ता
- **मॉड्यूल प्रमाणन** - मॉड्यूल के लिए गुणवत्ता बैज

---

## 🔗संबंधित दस्तावेज

- XOOPS 4.0 रोडमैप
- मूल अवधारणाएँ
- मॉड्यूल विकास

---

## 📚 संसाधन

- [GitHub रिपॉजिटरी](https://github.com/XOOPS/XoopsCore27)
- [इश्यू ट्रैकर](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS फोरम](https://xoops.org/modules/newbb/)
- [कलह समुदाय](https://discord.gg/xoops)

---

#xoops #ओपन-सोर्स #समुदाय #विकास #कोडिंग-मानकों में #योगदान दे रहा है