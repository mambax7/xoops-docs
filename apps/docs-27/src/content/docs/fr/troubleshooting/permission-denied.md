---
title: "Erreurs de permission refusée"
description: "Dépannage des problèmes de permissions de fichiers et de répertoires dans XOOPS"
---

Les problèmes de permissions de fichiers et de répertoires sont courants dans les installations XOOPS, en particulier après un téléchargement ou une migration de serveur. Ce guide vous aide à diagnostiquer et à résoudre les problèmes de permissions.

## Comprendre les permissions des fichiers

### Bases des permissions Linux/Unix

Les permissions des fichiers sont représentées par des codes à trois chiffres:

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

## Erreurs de permissions courantes

### "Permission denied" dans le téléchargement

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Unable to write file"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Cannot create directory"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Répertoires XOOPS critiques

### Répertoires nécessitant des permissions d'écriture

| Répertoire | Minimum | Objectif |
|-----------|---------|---------|
| `/uploads` | 755 | Téléchargements de l'utilisateur |
| `/cache` | 755 | Fichiers de cache |
| `/templates_c` | 755 | Modèles compilés |
| `/var` | 755 | Données variables |
| `mainfile.php` | 644 | Configuration (readable) |

## Dépannage Linux/Unix

### Étape 1: Vérifier les permissions actuelles

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Étape 2: Identifier l'utilisateur du serveur web

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Étape 3: Corriger la propriété

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Étape 4: Corriger les permissions

#### Option A: Permissions restrictives (recommandées)

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

#### Option B: Script tout-en-un

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

## Problèmes de permissions par répertoire

### Répertoire des téléchargements

**Problème:** Impossible de télécharger des fichiers

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Répertoire de cache

**Problème:** Les fichiers de cache ne sont pas écrits

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Cache des modèles

**Problème:** Les modèles ne se compilent pas

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Dépannage Windows

### Étape 1: Vérifier les propriétés du fichier

1. Clic droit sur fichier > Propriétés
2. Cliquez sur l'onglet "Sécurité"
3. Cliquez sur le bouton "Modifier"
4. Sélectionnez l'utilisateur et vérifiez les permissions

### Étape 2: Accorder les permissions d'écriture

#### Via interface graphique:

```
1. Clic droit sur le dossier > Propriétés
2. Sélectionnez l'onglet "Sécurité"
3. Cliquez sur "Modifier"
4. Sélectionnez "IIS_IUSRS" ou "NETWORK SERVICE"
5. Cochez "Modifier" et "Écrire"
6. Cliquez sur "Appliquer" et "OK"
```

#### Via ligne de commande (PowerShell):

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

## Script PHP pour vérifier les permissions

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

## Meilleures pratiques

### 1. Principe du privilège minimal

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Sauvegarder avant les modifications

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Référence rapide

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Documentation connexe

- White-Screen-of-Death - Autres erreurs courantes
- Database-Connection-Errors - Problèmes de base de données
- ../../01-Getting-Started/Configuration/System-Settings - Configuration XOOPS

---

**Dernière mise à jour:** 2026-01-31
**S'applique à:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS
