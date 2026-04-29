---
title: "Βασική Διαμόρφωση"
description: "Αρχική ρύθμιση XOOPS συμπεριλαμβανομένου του κύριου αρχείου.php settings, site name, email, and timezone configuration"
---

# Βασική XOOPS Διαμόρφωση

Αυτός ο οδηγός καλύπτει τις βασικές ρυθμίσεις διαμόρφωσης για τη σωστή λειτουργία του ιστότοπού σας XOOPS μετά την εγκατάσταση.

## κύριο αρχείο.php Configuration

Το αρχείο `mainfile.php` περιέχει κρίσιμες ρυθμίσεις παραμέτρων για την εγκατάσταση XOOPS. Δημιουργήθηκε κατά την εγκατάσταση, αλλά ίσως χρειαστεί να το επεξεργαστείτε με μη αυτόματο τρόπο.

## # Τοποθεσία

```
/var/www/html/xoops/mainfile.php
```

## # Δομή αρχείου

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

## # Επεξήγηση των κρίσιμων ρυθμίσεων

| Ρύθμιση | Σκοπός | Παράδειγμα |
|---|---|---|
| `XOOPS_DB_TYPE ` | Σύστημα βάσης δεδομένων | ` mysqli `, ` mysql `, ` pdo` |
| `XOOPS_DB_HOST ` | Τοποθεσία διακομιστή βάσης δεδομένων | ` localhost `, ` 192.168.1.1` |
| `XOOPS_DB_USER ` | Όνομα χρήστη βάσης δεδομένων | ` xoops_user` |
| `XOOPS_DB_PASS` | Κωδικός πρόσβασης βάσης δεδομένων | [secure_password] |
| `XOOPS_DB_NAME ` | Όνομα βάσης δεδομένων | ` xoops_db` |
| `XOOPS_DB_PREFIX ` | Πρόθεμα ονόματος πίνακα | ` xoops_` (επιτρέπει πολλαπλά XOOPS σε ένα DB) |
| `XOOPS_ROOT_PATH ` | Διαδρομή συστήματος φυσικών αρχείων | `/var/www/html/XOOPS` |
| `XOOPS_URL ` | Προσβάσιμο στον Ιστό URL | ` http://your-domain.com` |
| `XOOPS_TRUST_PATH ` | Αξιόπιστη διαδρομή (εκτός ρίζας ιστού) | `/var/www/xoops_var` |

## # Επεξεργασία κύριου αρχείου.php

Open mainfile.php in a text editor:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

## # Κοινό κύριο αρχείο.php Changes

**Αλλαγή τοποθεσίας URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Ενεργοποίηση λειτουργίας εντοπισμού σφαλμάτων (μόνο για ανάπτυξη):**
```php
define('XOOPS_DEBUG', 1);
```

**Αλλαγή προθέματος πίνακα (αν χρειάζεται):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Μετακίνηση διαδρομής εμπιστοσύνης εκτός της ρίζας ιστού (για προχωρημένους):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Διαμόρφωση πίνακα διαχειριστή

Διαμορφώστε τις βασικές ρυθμίσεις μέσω του πίνακα διαχείρισης XOOPS.

## # Πρόσβαση στις ρυθμίσεις συστήματος

1. Συνδεθείτε στον πίνακα διαχείρισης: `http://your-domain.com/XOOPS/admin/`
2. Μεταβείτε στο: **Σύστημα > Προτιμήσεις > Γενικές ρυθμίσεις**
3. Τροποποιήστε τις ρυθμίσεις (δείτε παρακάτω)
4. Κάντε κλικ στο "Αποθήκευση" στο κάτω μέρος

## # Όνομα και περιγραφή τοποθεσίας

Διαμορφώστε τον τρόπο εμφάνισης του ιστότοπού σας:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

## # Στοιχεία επικοινωνίας

Ορισμός στοιχείων επικοινωνίας ιστότοπου:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

## # Γλώσσα και περιοχή

Ορισμός προεπιλεγμένης γλώσσας και περιοχής:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## Διαμόρφωση email

Διαμορφώστε τις ρυθμίσεις email για ειδοποιήσεις και επικοινωνίες χρηστών.

## # Ρυθμίσεις email Τοποθεσία

**Πίνακας διαχειριστή:** Σύστημα > Προτιμήσεις > Ρυθμίσεις email

## # SMTP Διαμόρφωση

Για αξιόπιστη παράδοση email, χρησιμοποιήστε το SMTP αντί για το PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

## # Παράδειγμα διαμόρφωσης Gmail

Ρυθμίστε το XOOPS για αποστολή email μέσω Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Σημείωση:** Το Gmail απαιτεί έναν κωδικό εφαρμογής και όχι τον κωδικό πρόσβασής σας στο Gmail:
1. Μεταβείτε στο https://myaccount.google.com/apppasswords
2. Δημιουργήστε κωδικό πρόσβασης εφαρμογής για "Mail" και "Windows Computer"
3. Χρησιμοποιήστε τον κωδικό πρόσβασης που δημιουργήθηκε στο XOOPS

## # PHP mail() Διαμόρφωση (Πιο απλή αλλά λιγότερο αξιόπιστη)

Εάν το SMTP δεν είναι διαθέσιμο, χρησιμοποιήστε το PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Βεβαιωθείτε ότι ο διακομιστής σας έχει διαμορφώσει το sendmail ή το postfix:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

## # Ρυθμίσεις λειτουργίας email

Διαμορφώστε τι ενεργοποιεί τα μηνύματα ηλεκτρονικού ταχυδρομείου:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Διαμόρφωση ζώνης ώρας

Ορίστε τη σωστή ζώνη ώρας για σωστές χρονικές σημάνσεις και προγραμματισμό.

## # Ρύθμιση ζώνης ώρας στον πίνακα διαχείρισης

**Διαδρομή:** Σύστημα > Προτιμήσεις > Γενικές ρυθμίσεις

```
Default Timezone: [Select your timezone]
```

**Κοινές ζώνες ώρας:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

## # Επαλήθευση ζώνης ώρας

Ελέγξτε τη ζώνη ώρας του τρέχοντος διακομιστή:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

## # Ορισμός ζώνης ώρας συστήματος (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL Διαμόρφωση

## # Ενεργοποίηση καθαρών διευθύνσεων URL (Φιλικές διευθύνσεις URL)

Για διευθύνσεις URL όπως `/page/about ` αντί για `/index.php?page=about`

**Απαιτήσεις:**
- Apache με ενεργοποιημένο το mod_rewrite
- `.htaccess` αρχείο στη ρίζα XOOPS

**Ενεργοποίηση στον Πίνακα Διαχειριστή:**

1. Μεταβείτε στο: **Σύστημα > Προτιμήσεις > URL Ρυθμίσεις**
2. Επιλέξτε: "Ενεργοποίηση φιλικών διευθύνσεων URL"
3. Επιλέξτε: "URL Τύπος" (Πληροφορίες διαδρομής ή Ερώτημα)
4. Αποθήκευση

**Επαληθεύστε ότι το .htaccess υπάρχει:**

```bash
cat /var/www/html/xoops/.htaccess
```

Δείγμα περιεχομένου .htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Αντιμετώπιση προβλημάτων Καθαρές διευθύνσεις URL:**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

## # Διαμόρφωση τοποθεσίας URL

**Πίνακας διαχειριστή:** Σύστημα > Προτιμήσεις > Γενικές ρυθμίσεις

Ορίστε το σωστό URL για τον τομέα σας:

```
Site URL: http://your-domain.com/xoops/
```

Ή αν το XOOPS είναι στη ρίζα:

```
Site URL: http://your-domain.com/
```

## Βελτιστοποίηση μηχανών αναζήτησης (SEO)

Διαμορφώστε τις ρυθμίσεις SEO για καλύτερη ορατότητα στις μηχανές αναζήτησης.

## # Meta Tags

Ορίστε καθολικές μετα-ετικέτες:

**Πίνακας διαχειριστή:** Σύστημα > Προτιμήσεις > SEO Ρυθμίσεις

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Αυτά εμφανίζονται στη σελίδα `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

## # Χάρτης ιστότοπου

Ενεργοποίηση χάρτη ιστοτόπου XML για μηχανές αναζήτησης:

1. Μεταβείτε στο: **Σύστημα > Ενότητες**
2. Βρείτε την ενότητα "Χάρτης ιστότοπου".
3. Κάντε κλικ για εγκατάσταση και ενεργοποίηση
4. Πρόσβαση στον χάρτη ιστότοπου στη διεύθυνση: `/XOOPS/sitemap.xml`

## # Robots.txt

Έλεγχος ανίχνευσης μηχανών αναζήτησης:

Δημιουργία `/var/www/html/XOOPS/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Ρυθμίσεις χρήστη

Διαμορφώστε τις προεπιλεγμένες ρυθμίσεις που σχετίζονται με το χρήστη.

## # Εγγραφή χρήστη

**Πίνακας διαχειριστή:** Σύστημα > Προτιμήσεις > Ρυθμίσεις χρήστη

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

## # Προφίλ χρήστη

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

## # Εμφάνιση email χρήστη

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Διαμόρφωση προσωρινής μνήμης

Βελτιώστε την απόδοση με σωστή αποθήκευση στην κρυφή μνήμη.

## # Ρυθμίσεις προσωρινής μνήμης

**Πίνακας διαχειριστή:** Σύστημα > Προτιμήσεις > Ρυθμίσεις προσωρινής μνήμης

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

## # Εκκαθάριση προσωρινής μνήμης

Διαγραφή παλαιών αρχείων προσωρινής μνήμης:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Λίστα ελέγχου αρχικών ρυθμίσεων

Μετά την εγκατάσταση, διαμορφώστε:

- [ ] Το όνομα και η περιγραφή τοποθεσίας έχουν οριστεί σωστά
- [ ] Διαμορφώθηκε η διεύθυνση ηλεκτρονικού ταχυδρομείου διαχειριστή
- [ ] SMTP ρυθμίσεις email διαμορφώθηκαν και δοκιμάστηκαν
- [ ] Η ζώνη ώρας έχει οριστεί στην περιοχή σας
- [ ] URL έχει ρυθμιστεί σωστά
- [ ] Ο καθαρισμός διευθύνσεων URL (φιλικές διευθύνσεις URL) ενεργοποιήθηκε εάν θέλετε
- [ ] Διαμορφώθηκαν οι ρυθμίσεις εγγραφής χρήστη
- [ ] Μετα-ετικέτες για SEO έχουν διαμορφωθεί
- [ ] Επιλέχθηκε η προεπιλεγμένη γλώσσα
- [ ] Οι ρυθμίσεις προσωρινής μνήμης είναι ενεργοποιημένες
- [ ] Ο κωδικός πρόσβασης διαχειριστή είναι ισχυρός (16+ χαρακτήρες)
- [ ] Δοκιμή εγγραφής χρήστη
- [ ] Δοκιμή λειτουργικότητας email
- [ ] Δοκιμαστική μεταφόρτωση αρχείου
- [ ] Επισκεφτείτε την αρχική σελίδα και επαληθεύστε την εμφάνιση

## Διαμόρφωση δοκιμής

## # Δοκιμαστικό email

Στείλτε ένα δοκιμαστικό email:

**Πίνακας διαχειριστή:** Σύστημα > Δοκιμή ηλεκτρονικού ταχυδρομείου

Ή χειροκίνητα:

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

## # Δοκιμή σύνδεσης βάσης δεδομένων

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**Σημαντικό:** Διαγράψτε τα αρχεία δοκιμής μετά τη δοκιμή!

```bash
rm /var/www/html/xoops/test-*.php
```

## Σύνοψη αρχείων διαμόρφωσης

| Αρχείο | Σκοπός | Μέθοδος επεξεργασίας |
|---|---|---|
| κύριο αρχείο.php | Database and core settings | Text editor |
| Πίνακας Διαχειριστή | Οι περισσότερες ρυθμίσεις | Διασύνδεση Ιστού |
| .htaccess | URL επανεγγραφή | Επεξεργαστής κειμένου |
| robots.txt | Ανίχνευση μηχανής αναζήτησης | Επεξεργαστής κειμένου |

## Επόμενα βήματα

Μετά τη βασική διαμόρφωση:

1. Διαμορφώστε τις ρυθμίσεις συστήματος λεπτομερώς
2. Σκληρύνετε την ασφάλεια
3. Εξερευνήστε τον πίνακα διαχείρισης
4. Δημιουργήστε το πρώτο σας περιεχόμενο
5. Ρυθμίστε λογαριασμούς χρηστών

---

**Ετικέτες:** #configuration #setup #email #timezone #seo

**Σχετικά άρθρα:**
- ../Installation/Installation
- Ρυθμίσεις συστήματος
- Ασφάλεια-Διαμόρφωση
- Απόδοση-Βελτιστοποίηση
