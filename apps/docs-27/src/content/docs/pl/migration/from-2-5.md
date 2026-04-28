---
title: Aktualizacja z XOOPS 2.5 na 2.7
description: Przewodnik krok po kroku do bezpiecznej aktualizacji instalacji XOOPS z 2.5.x na 2.7.x.
---

:::caution[Najpierw wykonaj kopię zapasową]
Zawsze wykonaj kopię zapasową bazy danych i plików przed uaktualnieniem. Bez wyjątków.
:::

## Co się zmieniło w 2.7

- **PHP 8.2+ wymagane** — PHP 7.x nie jest już obsługiwany
- **Zależności zarządzane przez Composer** — biblioteki jądra zarządzane za pomocą `composer.json`
- **Automatyczne ładowanie PSR-4** — klasy modułu mogą używać przestrzeni nazw
- **Ulepszona XoopsObject** — nowa bezpieczeństwo typów `getVar()`, przestarzała `obj2Array()`
- **Bootstrap 5 administracja** — panel administracyjny przebudowany z Bootstrap 5

## Lista kontrolna przed aktualizacją

- [ ] PHP 8.2+ dostępne na Twoim serwerze
- [ ] Pełna kopia zapasowa bazy danych (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Pełna kopia zapasowa Twojej instalacji
- [ ] Lista zainstalowanych modułów i ich wersji
- [ ] Niestandardowy motyw wcopię zapasową oddzielnie

## Kroki aktualizacji

### 1. Umieść witrynę w trybie konserwacji

```php
// mainfile.php — dodaj tymczasowo
define('XOOPS_MAINTENANCE', true);
```

### 2. Pobierz XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Zastąp pliki jądra

Prześlij nowe pliki, **z wyjątkiem**:
- `uploads/` — Twoje przesłane pliki
- `xoops_data/` — Twoja konfiguracja
- `modules/` — Twoje zainstalowane moduły
- `themes/` — Twoje motywy
- `mainfile.php` — Twoja konfiguracja witryny

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Uruchom skrypt aktualizacji

Przejdź do `https://yourdomain.com/upgrade/` w przeglądarce.
Kreator aktualizacji będzie stosować migracje bazy danych.

### 5. Aktualizuj moduły

Moduły XOOPS 2.7 muszą być kompatybilne z PHP 8.2.
Sprawdzaj [Ekosystem modułów](/xoops-docs/2.7/module-guide/introduction/) dla zaktualizowanych wersji.

W Admin → Moduły kliknij **Aktualizuj** dla każdego zainstalowanego modułu.

### 6. Usuń tryb konserwacji i testuj

Usuń linię `XOOPS_MAINTENANCE` z `mainfile.php` i
weryfikuj że wszystkie strony ładują się prawidłowo.

## Typowe problemy

**Błędy "Klasa nie znaleziona" po aktualizacji**
- Uruchom `composer dump-autoload` w katalogu głównym XOOPS
- Wyczyść katalog `xoops_data/caches/`

**Moduł uszkodzony po aktualizacji**
- Sprawdzaj wydania GitHub modułu dla wersji kompatybilnej z 2.7
- Moduł może wymagać zmian kodu dla PHP 8.2 (przestarzałe funkcje, wpisane właściwości)

**CSS panelu administracyjnego uszkodzony**
- Wyczyść pamięć podręczną przeglądarki
- Upewnij się że `xoops_lib/` została w pełni zastąpiona podczas przesyłania pliku
