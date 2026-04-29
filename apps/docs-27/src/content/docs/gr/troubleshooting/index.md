---
title: "Αντιμετώπιση προβλημάτων"
description: "Λύσεις για κοινά ζητήματα XOOPS, τεχνικές εντοπισμού σφαλμάτων και FAQ"
---

> Λύσεις σε κοινά προβλήματα και τεχνικές εντοπισμού σφαλμάτων για το XOOPS CMS.

---

## 📋 Γρήγορη διάγνωση

Πριν ασχοληθείτε με συγκεκριμένα ζητήματα, ελέγξτε αυτές τις κοινές αιτίες:

1. **Δικαιώματα αρχείου** - Οι κατάλογοι χρειάζονται 755, τα αρχεία χρειάζονται 644
2. **PHP Έκδοση** - Βεβαιωθείτε ότι PHP 7.4+ (8,x συνιστάται)
3. **Αρχεία καταγραφής σφαλμάτων** - Ελέγξτε τα αρχεία καταγραφής σφαλμάτων `xoops_data/logs/` και PHP
4. **Cache** - Εκκαθάριση προσωρινής μνήμης στο Admin → System → Maintenance

---

## 🗂️ Περιεχόμενα ενότητας

## # Κοινά Θέματα
- Λευκή οθόνη θανάτου (WSOD)
- Σφάλματα σύνδεσης βάσης δεδομένων
- Σφάλματα άρνησης άδειας
- Βλάβες εγκατάστασης μονάδας
- Σφάλματα συλλογής προτύπων

## # FAQ
- Εγκατάσταση FAQ
- Ενότητα FAQ
- Θέμα FAQ
- Απόδοση FAQ

## # Εντοπισμός σφαλμάτων
- Ενεργοποίηση λειτουργίας εντοπισμού σφαλμάτων
- Χρήση Ray Debugger
- Εντοπισμός σφαλμάτων ερωτημάτων βάσης δεδομένων
- Έξυπνος εντοπισμός σφαλμάτων προτύπων

---

## 🚨 Κοινά Θέματα & Λύσεις

## # Λευκή οθόνη θανάτου (WSOD)

**Συμπτώματα:** Κενή λευκή σελίδα, χωρίς μήνυμα σφάλματος

**Λύσεις:**

1. **Ενεργοποιήστε προσωρινά την εμφάνιση σφαλμάτων PHP:**
   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```

2. **Ελέγξτε το αρχείο καταγραφής σφαλμάτων PHP:**
   
```bash
   tail -f /var/log/php/error.log
   
```

3. **Συνήθεις αιτίες:**
   - Υπέρβαση του ορίου μνήμης
   - Θανατηφόρο συντακτικό σφάλμα PHP
   - Λείπει η απαιτούμενη επέκταση

4. **Διόρθωση προβλημάτων μνήμης:**
   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```

---

## # Σφάλματα σύνδεσης βάσης δεδομένων

**Συμπτώματα:** "Δεν είναι δυνατή η σύνδεση στη βάση δεδομένων" ή παρόμοιο

**Λύσεις:**

1. **Επαληθεύστε τα διαπιστευτήρια στο mainfile.php:**
   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```

2. **Δοκιμή σύνδεσης με μη αυτόματο τρόπο:**
   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```

3. **Ελέγξτε MySQL service:**
   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```

4. **Επαληθεύστε τα δικαιώματα χρήστη:**
   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```

---

## # Σφάλματα άρνησης άδειας

**Συμπτώματα:** Δεν είναι δυνατή η αποστολή αρχείων, δεν είναι δυνατή η αποθήκευση ρυθμίσεων

**Λύσεις:**

1. **Ορίστε τα σωστά δικαιώματα:**
   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```

2. **Ορισμός σωστής ιδιοκτησίας:**
   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```

3. **Ελέγξτε το SELinux (CentOS/RHEL):**
   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```

---

## # Αποτυχίες εγκατάστασης μονάδας

**Συμπτώματα:** Η μονάδα δεν θα εγκατασταθεί, SQL σφάλματα

**Λύσεις:**

1. **Ελέγξτε τις απαιτήσεις της μονάδας:**
   - Συμβατότητα έκδοσης PHP
   - Απαιτούμενες επεκτάσεις PHP
   - Συμβατότητα έκδοσης XOOPS

2. **Χειροκίνητη εγκατάσταση SQL:**
   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```

3. **Εκκαθάριση προσωρινής μνήμης μονάδας:**
   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```

4. **Ελέγξτε xoops_version.php syntax:**
   
```bash
   php -l modules/mymodule/xoops_version.php
   
```

---

## # Σφάλματα συλλογής προτύπων

**Συμπτώματα:** Έξυπνα σφάλματα, το πρότυπο δεν βρέθηκε

**Λύσεις:**

1. **Εκκαθάριση κρυφής μνήμης Smarty:**
   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```

2. **Ελέγξτε τη σύνταξη προτύπου:**
   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```

3. **Επαλήθευση ύπαρξης προτύπου:**
   
```bash
   ls modules/mymodule/templates/
   
```

4. **Αναγέννηση προτύπων:**
   - Διαχειριστής → Σύστημα → Συντήρηση → Πρότυπα → Αναγέννηση

---

## 🐛 Τεχνικές εντοπισμού σφαλμάτων

## # Ενεργοποίηση XOOPS Λειτουργία εντοπισμού σφαλμάτων

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

## # Χρήση Ray Debugger

Το Ray είναι ένα εξαιρετικό εργαλείο εντοπισμού σφαλμάτων για το PHP:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

## # Smarty Debug Console

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

## # Καταγραφή ερωτημάτων βάσης δεδομένων

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ Συχνές Ερωτήσεις

## # Εγκατάσταση

**Ε: Ο οδηγός εγκατάστασης εμφανίζει κενή σελίδα**
Α: Ελέγξτε PHP αρχεία καταγραφής σφαλμάτων, βεβαιωθείτε ότι το PHP έχει αρκετή μνήμη, επαληθεύστε τα δικαιώματα αρχείων.

**Ε: Δεν είναι δυνατή η εγγραφή στο κύριο αρχείο.php during installation**
A: Ορίστε δικαιώματα: `chmod 666 mainfile.php ` κατά την εγκατάσταση και μετά ` chmod 444` μετά.

**Ε: Δεν δημιουργήθηκαν πίνακες βάσεων δεδομένων**
Α: Ελέγξτε MySQL user has CREATE TABLE privileges, verify database exists.

## # Ενότητες

**Ε: Η σελίδα διαχειριστή της μονάδας είναι κενή**
Α: Εκκαθαρίστε την προσωρινή μνήμη, ελέγξτε το admin/menu.php της μονάδας για συντακτικά σφάλματα.

**Ε: Τα μπλοκ λειτουργιών δεν εμφανίζονται**
Α: Ελέγξτε τα δικαιώματα αποκλεισμού στο Διαχειριστής → Αποκλεισμοί, επαληθεύστε ότι ο αποκλεισμός έχει εκχωρηθεί σε σελίδες.

**Ε: Η ενημέρωση της μονάδας αποτυγχάνει**
Α: Δημιουργήστε αντίγραφα ασφαλείας της βάσης δεδομένων, δοκιμάστε τις μη αυτόματες ενημερώσεις SQL, ελέγξτε τις απαιτήσεις έκδοσης.

## # Θέματα

**Ε: Το θέμα δεν εφαρμόζεται σωστά**
Α: Διαγράψτε την προσωρινή μνήμη Smarty, ελέγξτε ότι το theme.html υπάρχει, επαληθεύστε τα δικαιώματα του θέματος.

**Ε: Προσαρμοσμένο CSS δεν φορτώνεται**
Α: Ελέγξτε τη διαδρομή αρχείου, διαγράψτε την προσωρινή μνήμη του προγράμματος περιήγησης, επαληθεύστε τη σύνταξη CSS.

**Ε: Οι εικόνες δεν εμφανίζονται**
Α: Ελέγξτε τις διαδρομές εικόνων, επαληθεύστε τα δικαιώματα των φακέλων μεταφορτώσεων.

## # Απόδοση

**Ε: Ο ιστότοπος είναι πολύ αργός**
Α: Ενεργοποίηση προσωρινής αποθήκευσης, βελτιστοποίηση βάσης δεδομένων, έλεγχος για αργά ερωτήματα, ενεργοποίηση OpCache.

**Ε: Υψηλή χρήση μνήμης**
Α: Αυξήστε το memory_limit, βελτιστοποιήστε μεγάλα ερωτήματα, εφαρμόστε σελιδοποίηση.

---

## 🔧 Εντολές Συντήρησης

## # Εκκαθάριση όλων των κρυφών μνήμων

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

## # Βελτιστοποίηση βάσης δεδομένων

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

## # Ελέγξτε την ακεραιότητα του αρχείου

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Σχετική τεκμηρίωση

- Ξεκινώντας
- Βέλτιστες πρακτικές ασφάλειας
- XOOPS 4.0 Οδικός χάρτης

---

## 📚 Εξωτερικοί πόροι

- [XOOPS Φόρουμ](https://xoops.org/modules/newbb/)
- [Ζητήματα GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Αναφορά σφάλματος](https://www.php.net/manual/en/errorfunc.constants.php)

---

# XOOPS #αντιμετώπιση προβλημάτων #debugging #faq #errors #solutions
