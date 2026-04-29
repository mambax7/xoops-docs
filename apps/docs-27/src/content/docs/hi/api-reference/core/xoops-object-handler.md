---
title: "XoopsObjectHandler कक्षा"
description: "डेटाबेस दृढ़ता के साथ XoopsObject उदाहरणों पर CRUD संचालन के लिए बेस हैंडलर क्लास"
---
`XoopsObjectHandler` वर्ग और इसका एक्सटेंशन `XoopsPersistableObjectHandler` `XoopsObject` उदाहरणों पर CRUD (बनाएं, पढ़ें, अपडेट करें, हटाएं) संचालन करने के लिए एक मानकीकृत इंटरफ़ेस प्रदान करते हैं। यह डेटा मैपर पैटर्न को लागू करता है, डोमेन लॉजिक को डेटाबेस एक्सेस से अलग करता है।

## कक्षा अवलोकन

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## वर्ग पदानुक्रम

```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```

## XoopsObjectHandler

### कंस्ट्रक्टर

```php
public function __construct(XoopsDatabase $db)
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$db` | XoopsDatabase | डेटाबेस कनेक्शन उदाहरण |

**उदाहरण:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### बनाएं

एक नया ऑब्जेक्ट इंस्टेंस बनाता है।

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$isNew` | बूल | क्या वस्तु नई है (डिफ़ॉल्ट: सत्य) |

**रिटर्न:** `XoopsObject|null` - नया ऑब्जेक्ट इंस्टेंस

**उदाहरण:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### प्राप्त करें

किसी ऑब्जेक्ट को उसकी प्राथमिक कुंजी द्वारा पुनर्प्राप्त करता है।

```php
abstract public function get(int $id): ?XoopsObject
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$id` | int | प्राथमिक कुंजी मान |

**रिटर्न:** `XoopsObject|null` - ऑब्जेक्ट इंस्टेंस या न मिलने पर शून्य

**उदाहरण:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### डालें

किसी ऑब्जेक्ट को डेटाबेस में सहेजता है (सम्मिलित करें या अपडेट करें)।

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$obj` | XoopsObject | सहेजने के लिए वस्तु |
| `$force` | बूल | वस्तु अपरिवर्तित रहने पर भी बल संचालन |

**रिटर्न:** `bool` - सफलता पर सच

**उदाहरण:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### हटाएं

डेटाबेस से किसी ऑब्जेक्ट को हटा देता है।

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$obj` | XoopsObject | हटाने योग्य वस्तु |
| `$force` | बूल | बलपूर्वक विलोपन |

**रिटर्न:** `bool` - सफलता पर सच

**उदाहरण:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` क्वेरी और बल्क संचालन के लिए अतिरिक्त तरीकों के साथ `XoopsObjectHandler` का विस्तार करता है।

### कंस्ट्रक्टर

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$db` | XoopsDatabase | डेटाबेस कनेक्शन |
| `$table` | स्ट्रिंग | तालिका का नाम (उपसर्ग के बिना) |
| `$className` | स्ट्रिंग | वस्तु का पूर्ण वर्ग नाम |
| `$keyName` | स्ट्रिंग | प्राथमिक कुंजी फ़ील्ड का नाम |
| `$identifierName` | स्ट्रिंग | मानव-पठनीय पहचानकर्ता फ़ील्ड |

**उदाहरण:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```

---

### ऑब्जेक्ट प्राप्त करें

मानदंड से मेल खाते अनेक ऑब्जेक्ट पुनर्प्राप्त करता है।

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$criteria` | CriteriaElement | क्वेरी मानदंड (वैकल्पिक) |
| `$idAsKey` | बूल | प्राथमिक कुंजी को सरणी कुंजी के रूप में उपयोग करें |
| `$asObject` | बूल | वस्तुएँ लौटाएँ (सही) या सरणियाँ (गलत) |

**रिटर्न:** `array` - वस्तुओं या सहयोगी सरणी की सरणी

**उदाहरण:**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### गिनती प्राप्त करें

मानदंडों से मेल खाने वाली वस्तुओं की गणना करता है।

```php
public function getCount(CriteriaElement $criteria = null): int
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$criteria` | CriteriaElement | क्वेरी मानदंड (वैकल्पिक) |

**रिटर्न:** `int` - मेल खाने वाली वस्तुओं की संख्या

**उदाहरण:**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### सभी प्राप्त करें

सभी वस्तुओं को पुनः प्राप्त करता है (बिना किसी मानदंड के getObjects के लिए उपनाम)।

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$criteria` | CriteriaElement | क्वेरी मानदंड |
| `$fields` | सारणी | पुनर्प्राप्त करने के लिए विशिष्ट फ़ील्ड |
| `$asObject` | बूल | वस्तुओं के रूप में लौटें |
| `$idAsKey` | बूल | सरणी कुंजी के रूप में आईडी का उपयोग करें |

**उदाहरण:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### प्राप्त आईडी

मेल खाने वाली वस्तुओं की केवल प्राथमिक कुंजी पुनर्प्राप्त करता है।

```php
public function getIds(CriteriaElement $criteria = null): array
```

**पैरामीटर:**| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$criteria` | CriteriaElement | क्वेरी मानदंड |

**रिटर्न:** `array` - प्राथमिक कुंजी मानों की श्रृंखला

**उदाहरण:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### सूची प्राप्त करें

ड्रॉपडाउन के लिए कुंजी-मूल्य सूची पुनर्प्राप्त करता है।

```php
public function getList(CriteriaElement $criteria = null): array
```

**रिटर्न:** `array` - सहयोगी सरणी [आईडी => पहचानकर्ता]

**उदाहरण:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### सभी हटाएं

मानदंड से मेल खाने वाली सभी वस्तुओं को हटा देता है।

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$criteria` | CriteriaElement | Criteria वस्तुओं को हटाने के लिए |
| `$force` | बूल | बलपूर्वक विलोपन |
| `$asObject` | बूल | हटाने से पहले ऑब्जेक्ट लोड करें (घटनाओं को ट्रिगर करता है) |

**रिटर्न:** `bool` - सफलता पर सच

**उदाहरण:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### सभी अपडेट करें

सभी मेल खाने वाली वस्तुओं के लिए फ़ील्ड मान अपडेट करता है।

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$fieldname` | स्ट्रिंग | अद्यतन करने के लिए फ़ील्ड |
| `$fieldvalue` | मिश्रित | नया मान |
| `$criteria` | CriteriaElement | अद्यतन करने के लिए ऑब्जेक्ट के लिए Criteria |
| `$force` | बूल | बल अद्यतन |

**रिटर्न:** `bool` - सफलता पर सच

**उदाहरण:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### सम्मिलित करें (विस्तारित)

अतिरिक्त कार्यक्षमता के साथ विस्तारित सम्मिलन विधि।

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**व्यवहार:**
- यदि वस्तु नई है (`isNew() === true`): INSERT
- यदि वस्तु मौजूद है (`isNew() === false`): UPDATE
- स्वचालित रूप से `cleanVars()` पर कॉल करता है
- नई वस्तुओं पर ऑटो-इंक्रीमेंट आईडी सेट करता है

**उदाहरण:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## सहायक कार्य

### xoops_getHandler

कोर हैंडलर को पुनः प्राप्त करने के लिए वैश्विक फ़ंक्शन।

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$name` | स्ट्रिंग | हैंडलर का नाम (उपयोगकर्ता, मॉड्यूल, समूह, आदि) |
| `$optional` | बूल | त्रुटि ट्रिगर करने के बजाय शून्य लौटें |

**उदाहरण:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

एक मॉड्यूल-विशिष्ट हैंडलर पुनर्प्राप्त करता है।

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$name` | स्ट्रिंग | हैंडलर का नाम |
| `$dirname` | स्ट्रिंग | मॉड्यूल निर्देशिका नाम |
| `$optional` | बूल | विफलता पर शून्य वापसी |

**उदाहरण:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## कस्टम हैंडलर बनाना

### बुनियादी हैंडलर कार्यान्वयन

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Search articles
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get popular articles by view count
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### कस्टम हैंडलर का उपयोग करना

```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```

## सर्वोत्तम प्रथाएँ

1. **प्रश्नों के लिए Criteria का उपयोग करें**: प्रकार-सुरक्षित प्रश्नों के लिए हमेशा Criteria ऑब्जेक्ट का उपयोग करें

2. **कस्टम विधियों के लिए विस्तार**: हैंडलर में डोमेन-विशिष्ट क्वेरी विधियाँ जोड़ें

3. **ओवरराइड इन्सर्ट/डिलीट**: ओवरराइड्स में कैस्केड ऑपरेशन और टाइमस्टैम्प जोड़ें

4. **जहाँ आवश्यक हो, लेनदेन का उपयोग करें**: लेनदेन में जटिल संचालन को लपेटें

5. **गेटलिस्ट का लाभ उठाएं**: प्रश्नों को कम करने के लिए चुनिंदा ड्रॉपडाउन के लिए `getList()` का उपयोग करें

6. **सूचकांक कुंजी**: सुनिश्चित करें कि मानदंड में उपयोग किए गए डेटाबेस फ़ील्ड अनुक्रमित हैं

7. **परिणाम सीमित करें**: संभावित बड़े परिणाम सेट के लिए हमेशा `setLimit()` का उपयोग करें

## संबंधित दस्तावेज़ीकरण

- XoopsObject - बेस ऑब्जेक्ट क्लास
- ../डेटाबेस/Criteria - क्वेरी मानदंड बनाना
- ../डेटाबेस/XoopsDatabase - डेटाबेस संचालन

---

*यह भी देखें: [XOOPS सोर्स कोड](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*