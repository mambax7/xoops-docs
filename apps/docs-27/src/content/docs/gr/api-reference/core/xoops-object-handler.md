---
title: "Τάξη XoopsObjectHandler"
description: "Βασική κατηγορία χειριστή γιαCRUDλειτουργίες σε παρουσίες XoopsObject με εμμονή στη βάση δεδομένων"
---

Ο `XoopsObjectHandler ` τάξη και η επέκτασή της ` XoopsPersistableObjectHandler ` παρέχει μια τυποποιημένη διεπαφή για εκτέλεσηCRUD(Δημιουργία, Ανάγνωση, Ενημέρωση, Διαγραφή) ενεργειών ` XoopsObject` περιπτώσεις. Αυτό υλοποιεί το μοτίβο χαρτογράφησης δεδομένων, διαχωρίζοντας τη λογική τομέα από την πρόσβαση στη βάση δεδομένων.

## Επισκόπηση τάξης

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

## Ιεραρχία τάξης

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

## XoopsObject Handler

## # Κατασκευαστής

```php
public function __construct(XoopsDatabase $db)
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$db`| Βάση δεδομένων XOOPS | Περίπτωση σύνδεσης βάσης δεδομένων |

**Παράδειγμα:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

## # δημιουργία

Δημιουργεί ένα νέο παράδειγμα αντικειμένου.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$isNew`| bool | Εάν το αντικείμενο είναι νέο (προεπιλογή: αληθές) |

**Επιστροφές:**`XoopsObject|null`- Νέο παράδειγμα αντικειμένου

**Παράδειγμα:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

## # πάρτε

Ανακτά ένα αντικείμενο από το πρωτεύον κλειδί του.

```php
abstract public function get(int $id): ?XoopsObject
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$id`| int | Τιμή πρωτεύοντος κλειδιού |

**Επιστροφές:**`XoopsObject|null`- Παράδειγμα αντικειμένου ή μηδενικό εάν δεν βρεθεί

**Παράδειγμα:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

## # ένθετο

Αποθηκεύει ένα αντικείμενο στη βάση δεδομένων (εισαγωγή ή ενημέρωση).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$obj`| XoopsObject | Αντικείμενο για αποθήκευση |
|`$force`| bool | Αναγκαστική λειτουργία ακόμη και αν το αντικείμενο παραμένει αμετάβλητο |

**Επιστροφές:**`bool`- Σωστό στην επιτυχία

**Παράδειγμα:**
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

## # διαγραφή

Διαγράφει ένα αντικείμενο από τη βάση δεδομένων.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$obj`| XoopsObject | Αντικείμενο για διαγραφή |
|`$force`| bool | Αναγκαστική διαγραφή |

**Επιστροφές:**`bool`- Σωστό στην επιτυχία

**Παράδειγμα:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

Το `XoopsPersistableObjectHandler ` εκτείνεται ` XoopsObjectHandler` με πρόσθετες μεθόδους για ερωτήματα και μαζικές λειτουργίες.

## # Κατασκευαστής

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$db`| Βάση δεδομένων XOOPS | Σύνδεση βάσης δεδομένων |
|`$table`| χορδή | Όνομα πίνακα (χωρίς πρόθεμα) |
|`$className`| χορδή | Όνομα πλήρους κλάσης του αντικειμένου |
|`$keyName`| χορδή | Όνομα πεδίου πρωτεύοντος κλειδιού |
|`$identifierName`| χορδή | Αναγνώσιμο από τον άνθρωπο πεδίο αναγνωριστικού |

**Παράδειγμα:**
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

## # get Objects

Ανακτά πολλαπλά αντικείμενα που ταιριάζουν με κριτήρια.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$criteria`| CriteriaElement | Κριτήρια ερωτήματος (προαιρετικά) |
|`$idAsKey`| bool | Χρησιμοποιήστε το πρωτεύον κλειδί ως κλειδί πίνακα |
|`$asObject`| bool | Επιστροφή αντικειμένων (true) ή πινάκων (false) |

**Επιστροφές:**`array`- Συστοιχία αντικειμένων ή συσχετιστικοί πίνακες

**Παράδειγμα:**
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

## # getCount

Μετρά αντικείμενα που ταιριάζουν με κριτήρια.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$criteria`| CriteriaElement | Κριτήρια ερωτήματος (προαιρετικά) |

**Επιστροφές:**`int`- Πλήθος αντικειμένων που ταιριάζουν

**Παράδειγμα:**
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

## # πάρτε όλα

Ανακτά όλα τα αντικείμενα (ψευδώνυμο για getObjects χωρίς κριτήρια).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$criteria`| CriteriaElement | Κριτήρια ερωτήματος |
|`$fields`| συστοιχία | Συγκεκριμένα πεδία για ανάκτηση |
|`$asObject`| bool | Επιστροφή ως αντικείμενα |
|`$idAsKey`| bool | Χρησιμοποιήστε το ID ως κλειδί πίνακα |

**Παράδειγμα:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

## # getIds

Ανακτά μόνο τα πρωτεύοντα κλειδιά αντικειμένων που ταιριάζουν.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$criteria`| CriteriaElement | Κριτήρια ερωτήματος |

**Επιστροφές:**`array`- Πίνακας τιμών πρωτεύοντος κλειδιού

**Παράδειγμα:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

## # getList

Ανακτά μια λίστα κλειδιών-τιμών για αναπτυσσόμενα μενού.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Επιστροφές:**`array`- Συσχετικός πίνακας [id => αναγνωριστικό]

**Παράδειγμα:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

## # διαγραφή όλων

Διαγράφει όλα τα αντικείμενα που ταιριάζουν με κριτήρια.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$criteria`| CriteriaElement | Κριτήρια για τα αντικείμενα προς διαγραφή |
|`$force`| bool | Αναγκαστική διαγραφή |
|`$asObject`| bool | Φόρτωση αντικειμένων πριν από τη διαγραφή (ενεργοποιεί συμβάντα) |

**Επιστροφές:**`bool`- Σωστό στην επιτυχία

**Παράδειγμα:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

## # ενημέρωσηΌλα

Ενημερώνει μια τιμή πεδίου για όλα τα αντικείμενα που ταιριάζουν.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$fieldname`| χορδή | Πεδίο για ενημέρωση |
|`$fieldvalue`| μικτή | Νέα τιμή |
|`$criteria`| CriteriaElement | Κριτήρια για τα αντικείμενα προς ενημέρωση |
|`$force`| bool | Αναγκαστική ενημέρωση |

**Επιστροφές:**`bool`- Σωστό στην επιτυχία

**Παράδειγμα:**
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

## # εισαγωγή (Εκτεταμένο)

Η μέθοδος εκτεταμένης εισαγωγής με πρόσθετη λειτουργικότητα.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Συμπεριφορά:**
- Εάν το αντικείμενο είναι νέο (`isNew() === true `): INSERT- Εάν υπάρχει αντικείμενο (` isNew() === false `): UPDATE- Κλήσεις ` cleanVars()` αυτόματα
- Ορίζει το αναγνωριστικό αυτόματης αύξησης σε νέα αντικείμενα

**Παράδειγμα:**
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

## Λειτουργίες βοηθού

## # xoops_getHandler

Καθολική λειτουργία για την ανάκτηση ενός βασικού χειριστή.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$name`| χορδή | Όνομα χειριστή (χρήστης, λειτουργική μονάδα, ομάδα, κ.λπ.) |
|`$optional`| bool | Επιστρέψτε μηδενικό αντί να ενεργοποιήσετε το σφάλμα |

**Παράδειγμα:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

## # xoops_getModuleHandler

Ανακτά έναν χειριστή για συγκεκριμένη μονάδα.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
|`$name`| χορδή | Όνομα χειριστή |
|`$dirname`| χορδή | Όνομα καταλόγου μονάδας |
|`$optional`| bool | Επιστροφή μηδέν σε περίπτωση αποτυχίας |

**Παράδειγμα:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Δημιουργία προσαρμοσμένων χειριστών

## # Βασική εφαρμογή χειριστή

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

## # Χρήση του Custom Handler

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

## Βέλτιστες πρακτικές

1. **Χρήση κριτηρίων για ερωτήματα**: Να χρησιμοποιείτε πάντα αντικείμενα Criteria για ερωτήματα με ασφάλεια τύπου

2. **Επέκταση για προσαρμοσμένες μεθόδους**: Προσθήκη μεθόδων ερωτήματος για συγκεκριμένο τομέα σε χειριστές

3. **Παράκαμψηinsert/delete**: Προσθήκη διαδοχικών λειτουργιών και χρονικών σημάνσεων σε παρακάμψεις

4. **Χρησιμοποιήστε τη συναλλαγή όπου χρειάζεται**: Αναδιπλώστε σύνθετες λειτουργίες σε συναλλαγές

5. **Μόχλευση getList**: Χρήση `getList()` για επιλεγμένα αναπτυσσόμενα μενού για μείωση των ερωτημάτων

6. **Κλειδιά ευρετηρίου**: Βεβαιωθείτε ότι τα πεδία βάσης δεδομένων που χρησιμοποιούνται στα κριτήρια έχουν ευρετηριαστεί

7. **Περιορισμός αποτελεσμάτων**: Να χρησιμοποιείται πάντα `setLimit()` για δυνητικά μεγάλα σετ αποτελεσμάτων

## Σχετική τεκμηρίωση

- XoopsObject - Βασική κλάση αντικειμένου
- ../Database/Criteria- Δόμηση κριτηρίων ερωτήματος
- ../Database/XoopsDatabase- Λειτουργίες βάσης δεδομένων

---

*Δείτε επίσης: [XOOPSΠηγαίος κώδικας](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
