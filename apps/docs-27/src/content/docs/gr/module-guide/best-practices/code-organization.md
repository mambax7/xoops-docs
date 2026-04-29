---
title: "Βέλτιστες πρακτικές οργάνωσης κώδικα"
description: "Δομή μονάδας, συμβάσεις ονομασίας και αυτόματη φόρτωση PSR-4"
---

# Βέλτιστες πρακτικές οργάνωσης κώδικα στο XOOPS

Η σωστή οργάνωση κώδικα είναι απαραίτητη για τη συντηρησιμότητα, την επεκτασιμότητα και τη συνεργασία της ομάδας.

## Δομή καταλόγου ενότητας

Μια καλά οργανωμένη ενότητα XOOPS θα πρέπει να ακολουθεί αυτή τη δομή:

```
mymodule/
├── xoops_version.php           # Module metadata
├── index.php                    # Frontend entry point
├── admin.php                    # Admin entry point
├── class/
│   ├── Controller/             # Request handlers
│   ├── Handler/                # Data handlers
│   ├── Repository/             # Data access
│   ├── Entity/                 # Domain objects
│   ├── Service/                # Business logic
│   ├── DTO/                    # Data transfer objects
│   └── Exception/              # Custom exceptions
├── templates/                  # Smarty templates
│   ├── admin/                  # Admin templates
│   └── blocks/                 # Block templates
├── assets/
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript
│   └── images/                 # Images
├── sql/                        # Database schemas
├── tests/                      # Unit and integration tests
├── docs/                       # Documentation
└── composer.json              # Composer configuration
```

## Συμβάσεις ονομασίας

## # PHP Πρότυπα ονομασίας (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

## # Οργάνωση αρχείων και καταλόγου

- Μία τάξη ανά αρχείο
- Το όνομα αρχείου ταιριάζει με το όνομα της τάξης
- Η δομή καταλόγου ταιριάζει με την ιεραρχία του χώρου ονομάτων
- Κρατήστε τις σχετικές τάξεις μαζί
- Χρησιμοποιήστε συνεπή ονομασία σε όλη την ενότητα

## PSR-4 Αυτόματη φόρτωση

## # Composer Configuration

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

## # Χειροκίνητο Autoloader

```php
<?php
class Autoloader
{
    public static function register()
    {
        spl_autoload_register([self::class, 'autoload']);
    }
    
    public static function autoload($class)
    {
        $prefix = 'Xoops\\Module\\Mymodule\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . 
                str_replace('\\', '/', $relative) . '.php';
        
        if (file_exists($file)) {
            require $file;
        }
    }
}
?>
```

## Βέλτιστες πρακτικές

## # 1. Ενιαία Ευθύνη
- Κάθε τάξη πρέπει να έχει έναν λόγο να αλλάξει
- Διαχωρίστε τις ανησυχίες σε διαφορετικές κατηγορίες
- Διατηρήστε τα μαθήματα εστιασμένα και συνεκτικά

## # 2. Συνεπής Ονομασία
- Χρησιμοποιήστε ουσιαστικά, περιγραφικά ονόματα
- Ακολουθήστε τα PSR-12 πρότυπα κωδικοποίησης
- Αποφύγετε τις συντομογραφίες εκτός αν είναι εμφανείς
- Χρησιμοποιήστε σταθερά μοτίβα

## # 3. Οργάνωση καταλόγου
- Ομαδοποιήστε τις σχετικές τάξεις μαζί
- Διαχωρίστε τις ανησυχίες σε υποκαταλόγους
- Διατηρήστε τα πρότυπα και τα στοιχεία οργανωμένα
- Χρησιμοποιήστε συνεπή ονομασία αρχείων

## # 4. Χρήση χώρου ονομάτων
- Χρησιμοποιήστε κατάλληλους χώρους ονομάτων για όλες τις κλάσεις
- Ακολουθήστε την αυτόματη φόρτωση PSR-4
- Ο χώρος ονομάτων ταιριάζει με τη δομή καταλόγου

## # 5. Διαχείριση διαμόρφωσης
- Συγκεντρώστε τη διαμόρφωση στον κατάλογο ρυθμίσεων
- Χρήση διαμόρφωσης που βασίζεται σε περιβάλλον
- Μην κάνετε σκληρό κώδικα ρυθμίσεις

## Module Bootstrap

```php
<?php
class Bootstrap
{
    private static $serviceContainer;
    private static $initialized = false;
    
    public static function initialize()
    {
        if (self::$initialized) {
            return;
        }
        
        global $xoopsDB;
        self::$serviceContainer = new ServiceContainer($xoopsDB);
        self::$initialized = true;
    }
    
    public static function getServiceContainer()
    {
        if (!self::$initialized) {
            self::initialize();
        }
        return self::$serviceContainer;
    }
}
?>
```

## Σχετική τεκμηρίωση

Δείτε επίσης:
- Χειρισμός σφαλμάτων για διαχείριση εξαιρέσεων
- Δοκιμές για οργάνωση δοκιμών
- ../Patterns/MVC-Μοτίβο για τη δομή ελεγκτή

---

Ετικέτες: #best-practices #code-organization #psr-4 #module-development
