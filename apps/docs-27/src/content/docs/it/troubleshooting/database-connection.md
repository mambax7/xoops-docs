---
title: "Errori di connessione database"
description: "Guida risoluzione problemi di connessione database XOOPS"
---

Gli errori di connessione database sono tra i problemi più comuni nelle installazioni XOOPS. Questa guida fornisce procedure sistematiche di troubleshooting per identificare e risolvere i problemi di connessione.

## Messaggi di errore comuni

### "Can't connect to MySQL server"

```
Errore: Can't connect to MySQL server on 'localhost' (111)
```

Questo errore di solito indica che il server MySQL non è in esecuzione o non è accessibile.

### "Access denied for user"

```
Errore: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Questo indica credenziali database errate nella tua configurazione.

### "Unknown database"

```
Errore: Unknown database 'xoops_db'
```

Il database specificato non esiste sul server MySQL.

## File di configurazione

### Posizione configurazione XOOPS

Il file di configurazione principale si trova in:

```
/mainfile.php
```

Impostazioni database chiave:

```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## Procedure troubleshooting

### Passo 1: Verifica che il servizio MySQL sia in esecuzione

#### Su Linux/Unix

```bash
# Controlla se MySQL è in esecuzione
sudo systemctl status mysql

# Avvia MySQL se non in esecuzione
sudo systemctl start mysql

# Riavvia MySQL
sudo systemctl restart mysql
```

### Passo 2: Test connettività MySQL

#### Usando la riga di comando

```bash
# Test connessione con credenziali
mysql -h localhost -u xoops_user -p xoops_db

# Se richiesto password, inseriscila
# Successo mostra: mysql>

# Esci da MySQL
mysql> EXIT;
```

### Passo 3: Verifica credenziali database

#### Controlla configurazione XOOPS

```php
// In mainfile.php, verifica questi costanti:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Passo 4: Verifica esistenza database

```bash
# Connettiti a MySQL
mysql -u root -p

# Elenca tutti i database
SHOW DATABASES;

# Controlla il tuo database
SHOW DATABASES LIKE 'xoops_db';

# Se non trovato, crealo
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Esci
EXIT;
```

### Passo 5: Controlla autorizzazioni utente

```bash
# Connettiti come root
mysql -u root -p

# Controlla privilegi utente
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Concedi tutti i privilegi se necessario
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Ricarica privilegi
FLUSH PRIVILEGES;
```

## Problemi comuni e soluzioni

### Problema 1: MySQL non in esecuzione

**Sintomi:**
- Errore di connessione rifiutata
- Impossibile connettersi a localhost

**Soluzioni:**

```bash
# Linux: Controlla e avvia MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problema 2: Credenziali errate

**Sintomi:**
- Errore "Access denied"
- "using password: YES" o "using password: NO"

**Soluzioni:**

```bash
# Ripristina password (come root)
mysql -u root -p

# Cambia password utente
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Aggiorna mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problema 3: Database non creato

**Sintomi:**
- Errore "Unknown database"
- Installazione fallita alla creazione database

**Soluzioni:**

```bash
# Controlla se database esiste
mysql -u root -p -e "SHOW DATABASES;"

# Crea database se mancante
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Script diagnostico

Crea uno script diagnostico completo:

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```

## Documentazione correlata

- White-Screen-of-Death - Troubleshooting WSOD comune
- ../../01-Getting-Started/Configuration/Performance-Optimization - Ottimizzazione prestazioni database
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Configurazione iniziale XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Riferimento API database

---

**Ultimo aggiornamento:** 2026-01-31
**Si applica a:** XOOPS 2.5.7+
**Versioni PHP:** 7.4+
