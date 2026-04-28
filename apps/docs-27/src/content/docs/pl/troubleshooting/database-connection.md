---
title: "Błędy połączenia z bazą danych"
description: "Przewodnik rozwiązywania problemów z połączeniami bazy danych XOOPS"
---

Błędy połączenia z bazą danych to jedne z najczęstszych problemów w instalacjach XOOPS. Ten przewodnik zapewnia systematyczne kroki rozwiązywania problemów w celu identyfikacji i rozwiązania problemów z połączeniami.

## Typowe komunikaty błędów

### "Can't connect to MySQL server"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Ten błąd zazwyczaj wskazuje, że serwer MySQL nie jest uruchomiony lub jest niedostępny.

### "Access denied for user"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

To wskazuje nieprawidłowe poświadczenia bazy danych w konfiguracji.

### "Unknown database"

```
Error: Unknown database 'xoops_db'
```

Określona baza danych nie istnieje na serwerze MySQL.

## Pliki konfiguracyjne

### Lokalizacja konfiguracji XOOPS

Główny plik konfiguracyjny znajduje się w:

```
/mainfile.php
```

Kluczowe ustawienia bazy danych:

```php
// Konfiguracja bazy danych
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## Kroki rozwiązywania problemów

### Krok 1: Zweryfikuj, że usługa MySQL jest uruchomiona

#### Na Linux/Unix

```bash
# Sprawdź czy MySQL jest uruchomiony
sudo systemctl status mysql

# Uruchom MySQL jeśli nie jest uruchomiony
sudo systemctl start mysql

# Uruchom ponownie MySQL
sudo systemctl restart mysql
```

### Krok 2: Test łączności MySQL

#### Używając linii poleceń

```bash
# Przetestuj połączenie z poświadczeniami
mysql -h localhost -u xoops_user -p xoops_db

# Jeśli zostaniesz poproszony o hasło, wpisz je
# Sukces pokazuje: mysql>

# Wyjdź z MySQL
mysql> EXIT;
```

### Krok 3: Zweryfikuj poświadczenia bazy danych

#### Sprawdź konfigurację XOOPS

```php
// W mainfile.php, zweryfikuj te stałe:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Krok 4: Zweryfikuj, że baza danych istnieje

```bash
# Połącz się z MySQL
mysql -u root -p

# Lista wszystkich baz danych
SHOW DATABASES;

# Sprawdź swoją bazę danych
SHOW DATABASES LIKE 'xoops_db';

# Jeśli nie znaleziono, utwórz ją
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Wyjdź
EXIT;
```

### Krok 5: Sprawdź uprawnienia użytkownika

```bash
# Połącz się jako root
mysql -u root -p

# Sprawdź uprawnienia użytkownika
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Przyznaj wszystkie uprawnienia jeśli potrzeba
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Przeładuj uprawnienia
FLUSH PRIVILEGES;
```

## Typowe problemy i rozwiązania

### Problem 1: MySQL nie jest uruchomiony

**Objawy:**
- Błąd odmowy połączenia
- Nie można się połączyć z localhost

**Rozwiązania:**

```bash
# Linux: Sprawdź i uruchom MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problem 2: Nieprawidłowe poświadczenia

**Objawy:**
- Błąd "Access denied"
- "using password: YES" lub "using password: NO"

**Rozwiązania:**

```bash
# Resetuj hasło (jako root)
mysql -u root -p

# Zmień hasło użytkownika
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Zaktualizuj mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problem 3: Baza danych nie została utworzona

**Objawy:**
- Błąd "Unknown database"
- Instalacja nie powiodła się podczas tworzenia bazy danych

**Rozwiązania:**

```bash
# Sprawdź czy baza danych istnieje
mysql -u root -p -e "SHOW DATABASES;"

# Utwórz bazę danych jeśli brakuje
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Skrypt diagnostyczny

Utwórz kompleksowy skrypt diagnostyczny:

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Sprawdź zdefiniowane stałe
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Sprawdź rozszerzenie PHP MySQL
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test połączenia
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

## Powiązana dokumentacja

- White-Screen-of-Death - Typowe rozwiązywanie WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Tuning wydajności bazy danych
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Początkowa konfiguracja XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Dokumentacja API bazy danych

---

**Ostatnia aktualizacja:** 2026-01-31
**Dotyczy:** XOOPS 2.5.7+
**Wersje PHP:** 7.4+
