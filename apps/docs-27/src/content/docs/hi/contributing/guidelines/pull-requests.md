---
title: "पुल अनुरोध दिशानिर्देश"
description: "XOOPS परियोजनाओं के लिए पुल अनुरोध सबमिट करने के लिए दिशानिर्देश"
---
यह दस्तावेज़ XOOPS परियोजनाओं के लिए पुल अनुरोध सबमिट करने के लिए व्यापक दिशानिर्देश प्रदान करता है। इन दिशानिर्देशों का पालन करने से सुचारू कोड समीक्षा और तेज़ मर्ज समय सुनिश्चित होता है।

## पुल अनुरोध बनाने से पहले

### चरण 1: मौजूदा मुद्दों की जाँच करें

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### चरण 2: रिपॉजिटरी को फोर्क और क्लोन करें

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

### चरण 3: एक फ़ीचर शाखा बनाएँ

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

### चरण 4: अपना परिवर्तन करें

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

## संदेश मानक प्रतिबद्ध करें

### अच्छे प्रतिबद्ध संदेश

इन पैटर्न का पालन करते हुए स्पष्ट, वर्णनात्मक संदेशों का उपयोग करें:

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

### प्रतिबद्ध प्रकार श्रेणियाँ

| प्रकार | विवरण | उदाहरण |
|------|----|------|
| `feat` | नई सुविधा | `feat: add user dashboard widget` |
| `fix` | बग फिक्स | `fix: resolve cache invalidation bug` |
| `docs` | दस्तावेज़ीकरण | `docs: update API reference` |
| `style` | कोड शैली (कोई तर्क परिवर्तन नहीं) | `style: format imports` |
| `refactor` | कोड रीफैक्टरिंग | `refactor: simplify service layer` |
| `perf` | प्रदर्शन में सुधार | `perf: optimize database queries` |
| `test` | परीक्षण परिवर्तन | `test: add integration tests` |
| `chore` | निर्माण/टूलींग परिवर्तन | `chore: update dependencies` |

## पुल अनुरोध विवरण

### पीआर टेम्पलेट

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

## कोड गुणवत्ता आवश्यकताएँ

### कोड शैली

कोड-शैली दिशानिर्देशों का पालन करें:

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

## परीक्षण आवश्यकताएँ

### यूनिट परीक्षण

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

### रनिंग टेस्ट

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## शाखाओं के साथ काम करना

### शाखा को अद्यतन रखें

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

## पुल अनुरोध बनाना

### पीआर शीर्षक प्रारूप

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## कोड समीक्षा प्रक्रिया

### समीक्षक क्या तलाशते हैं

1. **शुद्धता**
   - क्या कोड बताई गई समस्या का समाधान करता है?
   - क्या किनारे के मामले संभाले जाते हैं?
   - क्या त्रुटि प्रबंधन उचित है?

2. **गुणवत्ता**
   - क्या यह कोडिंग मानकों का पालन करता है?
   - क्या यह रखरखाव योग्य है?
   - क्या इसका अच्छे से परीक्षण किया गया है?

3. **प्रदर्शन**
   - कोई प्रदर्शन प्रतिगमन?
   - क्या प्रश्न अनुकूलित हैं?
   - क्या मेमोरी का उपयोग उचित है?

4. **सुरक्षा**
   - इनपुट सत्यापन?
   - SQL इंजेक्शन रोकथाम?
   - प्रमाणीकरण/प्राधिकरण?

### फीडबैक का जवाब देना

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

## सामान्य पीआर मुद्दे और समाधान

### अंक 1: पीआर बहुत बड़ा है

**समस्या:** समीक्षक बड़े पैमाने पर पीआर की प्रभावी ढंग से समीक्षा नहीं कर सकते

**समाधान:** छोटे पीआर में विभाजित करें
- पहला पीआर: मुख्य परिवर्तन
- दूसरा पीआर: टेस्ट
- तीसरा पीआर: दस्तावेज़ीकरण

### अंक 2: कोई परीक्षण शामिल नहीं है

**समस्या:** समीक्षक कार्यक्षमता को सत्यापित नहीं कर सकते

**समाधान:** सबमिट करने से पहले व्यापक परीक्षण जोड़ें

### अंक 3: मुख्य के साथ संघर्ष

**समस्या:** आपकी शाखा मुख्य के साथ समन्वयित नहीं है

**समाधान:** नवीनतम मुख्य पर रिबेस करें

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## विलय के बाद

### सफ़ाई

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

## सर्वोत्तम प्रथाओं का सारांश

### क्या करें

- वर्णनात्मक प्रतिबद्ध संदेश बनाएं
- केंद्रित, एकल-उद्देश्यीय पीआर बनाएं
- नई कार्यक्षमता के लिए परीक्षण शामिल करें
- दस्तावेज़ अद्यतन करें
- संदर्भ संबंधी मुद्दे
- पीआर विवरण स्पष्ट रखें
- समीक्षाओं का तुरंत जवाब दें

### क्या न करें

- असंबंधित परिवर्तन शामिल करें
- मुख्य को अपनी शाखा में मर्ज करें (रिबेस का उपयोग करें)
- समीक्षा शुरू होने के बाद बलपूर्वक धक्का दें
- परीक्षण छोड़ें
- कार्य प्रगति पर सबमिट करें
- कोड समीक्षा प्रतिक्रिया पर ध्यान न दें

## संबंधित दस्तावेज़ीकरण

- ../योगदान - योगदान का सिंहावलोकन
- कोड-शैली - कोड शैली दिशानिर्देश
- ../../03-मॉड्यूल-विकास/सर्वोत्तम अभ्यास/परीक्षण - सर्वोत्तम अभ्यासों का परीक्षण
- ../वास्तुकला-निर्णय/एडीआर-सूचकांक - वास्तुशिल्प दिशानिर्देश

## संसाधन

- [गिट दस्तावेज़ीकरण](https://git-scm.com/doc)
- [GitHub पुल अनुरोध सहायता](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [परंपरागत प्रतिबद्धताएं](https://www.conventionalcommits.org/)
- [XOOPS GitHub संगठन](@000019@@)

---

**अंतिम अद्यतन:** 2026-01-31
**इस पर लागू होता है:** सभी XOOPS परियोजनाएं
**भंडार:** https://github.com/XOOPS/XOOPS