---
title: "Rozwiązywanie problemów"
description: "Rozwiązania dla typowych problemów XOOPS, techniki debugowania i FAQ"
---

> Rozwiązania dla typowych problemów i techniki debugowania dla CMS XOOPS.

---

## Szybka diagnoza

Przed przejściem do konkretnych problemów, sprawdź te typowe przyczyny:

1. **Uprawnienia plików** - Katalogi potrzebują 755, pliki potrzebują 644
2. **Wersja PHP** - Upewnij się, że PHP 7.4+ (zalecana 8.x)
3. **Dzienniki błędów** - Sprawdź `xoops_data/logs/` i dzienniki błędów PHP
4. **Cache** - Wyczyść pamięć podręczną w Admin → System → Maintenance

---

## Zawartość sekcji

### Typowe problemy
- Biały ekran śmierci (WSOD)
- Błędy połączenia z bazą danych
- Błędy odmowy dostępu
- Błędy instalacji modułu
- Błędy kompilacji szablonów

### FAQ
- FAQ instalacji
- FAQ modułów
- FAQ motywów
- FAQ wydajności

### Debugowanie
- Włączanie trybu debugowania
- Używanie Ray Debugger
- Debugowanie zapytań bazodanowych
- Debugowanie szablonów Smarty

---

## Typowe problemy i rozwiązania

### Biały ekran śmierci (WSOD)

**Objawy:** Pusta biała strona, brak komunikatu błędu

**Rozwiązania:**

1. **Tymczasowo włącz wyświetlanie błędów PHP:**
   ```php
   // Dodaj do mainfile.php tymczasowo
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Sprawdź dziennik błędów PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Typowe przyczyny:**
   - Limit pamięci przekroczony
   - Błąd fatalna składni PHP
   - Brakujące wymagane rozszerzenie

4. **Napraw problemy z pamięcią:**
   ```php
   // W mainfile.php lub php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Błędy połączenia z bazą danych

**Objawy:** "Nie można połączyć się z bazą danych" lub podobne

**Rozwiązania:**

1. **Zweryfikuj poświadczenia w mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Ręczne przetestuj połączenie:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Sprawdź usługę MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Zweryfikuj uprawnienia użytkownika:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Błędy odmowy dostępu

**Objawy:** Nie można przesłać plików, nie można zapisać ustawień

**Rozwiązania:**

1. **Ustaw prawidłowe uprawnienia:**
   ```bash
   # Katalogi
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Pliki
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Katalogi do zapisu
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Ustaw prawidłową właścicielość:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Sprawdź SELinux (CentOS/RHEL):**
   ```bash
   # Sprawdź status
   sestatus

   # Zezwól httpd na zapis
   setsebool -P httpd_unified 1
   ```

---

### Błędy instalacji modułu

**Objawy:** Moduł nie instaluje się, błędy SQL

**Rozwiązania:**

1. **Sprawdź wymagania modułu:**
   - Kompatybilność wersji PHP
   - Wymagane rozszerzenia PHP
   - Kompatybilność wersji XOOPS

2. **Ręczna instalacja SQL:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **Wyczyść pamięć podręczną modułu:**
   ```php
   // W xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Sprawdź składnię xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Błędy kompilacji szablonów

**Objawy:** Błędy Smarty, szablon nie znaleziony

**Rozwiązania:**

1. **Wyczyść pamięć podręczną Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Sprawdź składnię szablonu:**
   ```smarty
   {* Poprawnie *}
   {$variable}

   {* Niepoprawnie - brak $ *}
   {variable}
   ```

3. **Zweryfikuj, że szablon istnieje:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Regeneruj szablony:**
   - Admin → System → Maintenance → Templates → Regenerate

---

## Techniki debugowania

### Włącz tryb debugowania XOOPS

```php
// W mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Poziomy:
// 0 = Wyłączony
// 1 = Debugowanie PHP
// 2 = Debugowanie PHP + SQL
// 3 = Debugowanie PHP + SQL + szablonów Smarty
```

### Używanie Ray Debugger

Ray to doskonałe narzędzie debugowania dla PHP:

```php
// Zainstaluj przez Composer
composer require spatie/ray --dev

// Użycie w kodzie
ray($variable);
ray($object)->expand();
ray()->measure();

// Zapytania bazodanowe
ray($sql)->label('Query');
```

### Konsola debugowania Smarty

```smarty
{* Włącz w szablonie *}
{debug}

{* Lub w PHP *}
$xoopsTpl->debugging = true;
```

### Logowanie zapytań bazodanowych

```php
// Włącz logowanie zapytań
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Pobierz wszystkie zapytania
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## Często zadawane pytania

### Instalacja

**P: Kreator instalacji pokazuje pustą stronę**
O: Sprawdź dzienniki błędów PHP, upewnij się, że PHP ma wystarczająco pamięci, zweryfikuj uprawnienia plików.

**P: Nie można zapisać mainfile.php podczas instalacji**
O: Ustaw uprawnienia: `chmod 666 mainfile.php` podczas instalacji, następnie `chmod 444` po.

**P: Tabele bazy danych nie zostały utworzone**
O: Sprawdź czy użytkownik MySQL ma uprawnienia CREATE TABLE, zweryfikuj czy baza danych istnieje.

### Moduły

**P: Strona administracji modułu jest pusta**
O: Wyczyść pamięć podręczną, sprawdź admin/menu.php modułu pod kątem błędów składni.

**P: Bloki modułu nie są wyświetlane**
O: Sprawdź uprawnienia bloków w Admin → Blocks, zweryfikuj czy blok jest przypisany do stron.

**P: Aktualizacja modułu nie powiedzie się**
O: Utwórz kopię zapasową bazy danych, spróbuj ręcznych aktualizacji SQL, sprawdź wymagania wersji.

### Motywy

**P: Motyw nie stosuje się prawidłowo**
O: Wyczyść pamięć podręczną Smarty, sprawdź czy theme.html istnieje, zweryfikuj uprawnienia motywu.

**P: Niestandardowy CSS nie ładuje się**
O: Sprawdź ścieżkę pliku, wyczyść pamięć podręczną przeglądarki, zweryfikuj składnię CSS.

**P: Obrazy się nie wyświetlają**
O: Sprawdź ścieżki obrazów, zweryfikuj uprawnienia folderu uploads.

### Wydajność

**P: Witryna jest bardzo powolna**
O: Włącz caching, zoptymalizuj bazę danych, sprawdź wolne zapytania, włącz OpCache.

**P: Wysokie wykorzystanie pamięci**
O: Zwiększ memory_limit, zoptymalizuj duże zapytania, implementuj paginację.

---

## Polecenia konserwacyjne

### Wyczyść wszystkie pamięci podręczne

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Optymalizacja bazy danych

```sql
-- Optymalizuj wszystkie tabele
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Powtórz dla innych tabel

-- Lub optymalizuj wszystko naraz
mysqlcheck -o -u user -p database
```

### Sprawdzenie integralności plików

```bash
# Porównaj z czystą instalacją
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## Powiązana dokumentacja

- Getting Started
- Security Best Practices
- XOOPS 4.0 Roadmap

---

## Zasoby zewnętrzne

- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Error Reference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
