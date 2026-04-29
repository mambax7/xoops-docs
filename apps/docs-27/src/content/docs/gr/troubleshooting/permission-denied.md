---
title: "Σφάλματα άρνησης άδειας"
description: "Αντιμετώπιση προβλημάτων δικαιωμάτων αρχείων και καταλόγου στο XOOPS"
---

Ζητήματα δικαιωμάτων αρχείων και καταλόγου είναι κοινά στις εγκαταστάσεις XOOPS, ειδικά μετά τη μεταφόρτωση ή τη μετεγκατάσταση διακομιστή. Αυτός ο οδηγός βοηθά στη διάγνωση και επίλυση προβλημάτων αδειών.

## Κατανόηση των δικαιωμάτων αρχείων

## # Linux/Unix Βασικά δικαιώματα

Τα δικαιώματα αρχείων αντιπροσωπεύονται ως τριψήφιοι κωδικοί:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
```

## Συνήθη σφάλματα αδειών

## # "Δεν επιτρέπεται η άδεια" στη μεταφόρτωση

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

## # "Δεν είναι δυνατή η εγγραφή αρχείου"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

## # "Δεν είναι δυνατή η δημιουργία καταλόγου"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Κρίσιμοι κατάλογοι XOOPS

## # Κατάλογοι που απαιτούν δικαιώματα εγγραφής

| Κατάλογος | Ελάχιστο | Σκοπός |
|-----------|---------|---------|
| `/uploads` | 755 | Μεταφορτώσεις χρηστών |
| `/cache` | 755 | Αρχεία προσωρινής μνήμης |
| `/templates_c` | 755 | Μεταγλωττισμένα πρότυπα |
| `/var` | 755 | Μεταβλητά δεδομένα |
| `mainfile.php` | 644 | Διαμόρφωση (αναγνώσιμη) |

## Linux/Unix Αντιμετώπιση προβλημάτων

## # Βήμα 1: Ελέγξτε τα τρέχοντα δικαιώματα

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

## # Βήμα 2: Προσδιορισμός χρήστη διακομιστή Web

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

## # Βήμα 3: Διορθώστε την ιδιοκτησία

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

## # Βήμα 4: Διορθώστε τα δικαιώματα

### # Επιλογή Α: Περιοριστικά δικαιώματα (Συνιστάται)

```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

### # Επιλογή Β: Σενάριο All-at-once

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## Θέματα άδειας ανά Κατάλογο

## # Κατάλογος μεταφορτώσεων

**Πρόβλημα:** Δεν είναι δυνατή η μεταφόρτωση αρχείων

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

## # Κατάλογος προσωρινής μνήμης

**Πρόβλημα:** Δεν γράφονται τα αρχεία προσωρινής μνήμης

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

## # Πρότυπα cache

**Πρόβλημα:** Δεν γίνεται μεταγλώττιση προτύπων

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Αντιμετώπιση προβλημάτων των Windows

## # Βήμα 1: Ελέγξτε τις ιδιότητες αρχείου

1. Κάντε δεξί κλικ στο αρχείο → Ιδιότητες
2. Κάντε κλικ στην καρτέλα "Ασφάλεια".
3. Κάντε κλικ στο κουμπί "Επεξεργασία".
4. Επιλέξτε χρήστη και επαληθεύστε τα δικαιώματα

## # Βήμα 2: Παραχωρήστε δικαιώματα εγγραφής

### # Μέσω GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

### # Μέσω γραμμής εντολών (PowerShell):

```powershell
# Run PowerShell as Administrator

# Grant IIS app pool permissions
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## PHP Σενάριο για έλεγχο των δικαιωμάτων

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## Βέλτιστες πρακτικές

## # 1. Αρχή του ελάχιστου προνομίου

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

## # 2. Δημιουργία αντιγράφων ασφαλείας πριν από τις αλλαγές

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Γρήγορη αναφορά

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Σχετική τεκμηρίωση

- White-Screen-of-Death - Άλλα κοινά σφάλματα
- Βάση δεδομένων-Σύνδεση-Σφάλματα - Ζητήματα βάσης δεδομένων
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS διαμόρφωση

---

**Τελευταία ενημέρωση: ** 31-01-2026
**Ισχύει για:** XOOPS 2.5.7+
** OS: ** Linux, Windows, macOS
