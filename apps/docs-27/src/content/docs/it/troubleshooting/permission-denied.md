---
title: "Errori accesso negato"
description: "Troubleshooting problemi autorizzazioni file e directory in XOOPS"
---

I problemi di autorizzazioni file e directory sono comuni nelle installazioni XOOPS, soprattutto dopo caricamento o migrazione server. Questa guida aiuta a diagnosticare e risolvere i problemi di autorizzazioni.

## Comprensione autorizzazioni file

### Concetti di base autorizzazioni Linux/Unix

Le autorizzazioni file sono rappresentate come codici a tre cifre:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Altri (world)
||| +------ Gruppo
+--------- Proprietario

r = lettura (4)
w = scrittura (2)
x = esecuzione (1)

755 = rwxr-xr-x (proprietario completo, gruppo lettura/esecuzione, altri lettura/esecuzione)
644 = rw-r--r-- (proprietario lettura/scrittura, gruppo lettura, altri lettura)
777 = rwxrwxrwx (accesso completo per tutti - NON CONSIGLIATO)
```

## Errori di autorizzazioni comuni

### "Permission denied" in caricamento

```
Avviso: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Unable to write file"

```
Errore: Impossibile scrivere file in /var/www/html/xoops/cache/
```

### "Cannot create directory"

```
Errore: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Directory XOOPS critiche

### Directory che richiedono autorizzazioni di scrittura

| Directory | Minimo | Scopo |
|-----------|---------|---------|
| `/uploads` | 755 | Caricamenti utente |
| `/cache` | 755 | File cache |
| `/templates_c` | 755 | Template compilati |
| `/var` | 755 | Dati variabili |
| `mainfile.php` | 644 | Configurazione (leggibile) |

## Troubleshooting Linux/Unix

### Passo 1: Controlla autorizzazioni attuali

```bash
# Controlla autorizzazioni file
ls -l /var/www/html/xoops/

# Controlla file specifico
ls -l /var/www/html/xoops/mainfile.php

# Controlla autorizzazioni directory
ls -ld /var/www/html/xoops/uploads/
```

### Passo 2: Identifica utente server web

```bash
# Controlla utente Apache
ps aux | grep -E '[a]pache|[h]ttpd'
# Solitamente: www-data (Debian/Ubuntu) o apache (RedHat/CentOS)

# Controlla utente Nginx
ps aux | grep -E '[n]ginx'
# Solitamente: www-data o nginx
```

### Passo 3: Correggi proprietà

```bash
# Imposta proprietà corretta (presupponendo utente www-data)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Correggi solo directory scrivibili web
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Passo 4: Correggi autorizzazioni

#### Opzione A: Autorizzazioni restrittive (consigliato)

```bash
# Tutte le directory: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# Tutti i file: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Tranne directory scrivibili
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### Opzione B: Script tutto in una volta

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Correzione autorizzazioni XOOPS..."

# Imposta proprietà
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Imposta autorizzazioni directory
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Imposta autorizzazioni file
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Assicura directory scrivibili
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Fatto! Autorizzazioni corrette."
```

## Problemi autorizzazioni per directory

### Directory uploads

**Problema:** Impossibile caricare file

```bash
# Soluzione
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Directory cache

**Problema:** File cache non scritti

```bash
# Soluzione
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Cache template

**Problema:** Template non compilano

```bash
# Soluzione
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Troubleshooting Windows

### Passo 1: Controlla proprietà file

1. Clicca destro file → Proprietà
2. Clicca scheda "Sicurezza"
3. Clicca pulsante "Modifica"
4. Seleziona utente e verifica autorizzazioni

### Passo 2: Concedi autorizzazioni di scrittura

#### Via GUI:

```
1. Clicca destro cartella → Proprietà
2. Seleziona scheda "Sicurezza"
3. Clicca "Modifica"
4. Seleziona "IIS_IUSRS" o "NETWORK SERVICE"
5. Spunta "Modifica" e "Scrittura"
6. Clicca "Applica" e "OK"
```

#### Via riga di comando (PowerShell):

```powershell
# Esegui PowerShell come amministratore

# Concedi autorizzazioni pool app IIS
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

## PHP Script to Check Permissions

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

## Migliori pratiche

### 1. Principio del minimo privilegio

```bash
# Concedi solo autorizzazioni necessarie
# Non usare 777 o 666

# Cattivo
chmod 777 /var/www/html/xoops/uploads/  # Pericoloso!

# Buono
chmod 755 /var/www/html/xoops/uploads/  # Sicuro
```

### 2. Backup prima dei cambiamenti

```bash
# Backup stato attuale
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Riferimento rapido

```bash
# Correzione rapida (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Documentazione correlata

- White-Screen-of-Death - Altri errori comuni
- Database-Connection-Errors - Problemi database
- ../../01-Getting-Started/Configuration/System-Settings - Configurazione XOOPS

---

**Ultimo aggiornamento:** 2026-01-31
**Si applica a:** XOOPS 2.5.7+
**SO:** Linux, Windows, macOS
