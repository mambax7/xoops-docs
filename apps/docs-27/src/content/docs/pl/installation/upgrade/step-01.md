---
title: "Przygotowania do aktualizacji"
---

## Wyłącz witrynę

Przed rozpoczęciem procesu aktualizacji XOOPS, powinieneś ustawić element "Wyłączyć witrynę?" na _Tak_ na stronie Preferencje -&gt; Opcje systemu -&gt; Ustawienia ogólne w Menu administracji.

To chroni użytkowników przed napotkaniem uszkodzonej witryny podczas aktualizacji. Utrzymuje również konkurencję zasobów na minimum, aby zapewnić gładszą aktualizację.

Zamiast błędów i uszkodzonej witryny, Twoi odwiedzający zobaczą coś takiego:

![Site Closed on Mobile](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Kopia zapasowa

Dobrym pomysłem jest użycie sekcji _Konserwacja_ administracji XOOPS do _Czyszczenia folderu pamięci podręcznej_ dla wszystkich pamięci podręcznych przed wykonaniem pełnej kopii zapasowej plików witryny. Gdy witryna jest wyłączona, zalecane jest również użycie _Opróznienia tabeli sesji_, aby jeśli będzie potrzebne przywrócenie, stare sesje nie będą jego częścią.

### Pliki

Kopię zapasową pliku można wykonać za pośrednictwem FTP, kopiując wszystkie pliki na maszynę lokalną. Jeśli masz bezpośredni dostęp do powłoki na serwerze, może być _znacznie_ szybsze wykonanie kopii (lub archiwalna kopia) tam.

### Baza danych

Do tworzenia kopii zapasowej bazy danych możesz użyć wbudowanych funkcji w sekcji _Konserwacja_ administracji XOOPS. Możesz również użyć funkcji _Eksportuj_ w _phpMyAdmin_, jeśli jest dostępna. Jeśli masz dostęp do powłoki, możesz użyć polecenia _mysql_ do zrzucenia bazy danych.

Biegłość w tworzeniu kopii zapasowych i _przywracaniu_ bazy danych jest ważną umiejętnością webmastera. Istnieje wiele zasobów online, których możesz użyć, aby dowiedzieć się więcej o tych operacjach stosownie do Twojej instalacji, takich jak [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Skopiuj nowe pliki do witryny

Kopiowanie nowych plików do witryny jest praktycznie identyczne z krokiem [Przygotowania](../../installation/preparations/) podczas instalacji. Powinieneś skopiować katalogi _xoops_data_ i _xoops_lib_ do miejsca, gdzie zostały przeniesione podczas instalacji. Następnie skopiuj resztę zawartości katalogu _htdocs_ dystrybucji (z kilkoma wyjątkami omówionymi w następnej sekcji) na istniejące pliki i katalogi w katalogu głównym serwera WWW.

W XOOPS 2.7.0, skopiowanie nowej dystrybucji na istniejącą witrynę **nie będzie nadpisywać istniejących plików konfiguracyjnych**, takich jak `mainfile.php` lub `xoops_data/data/secure.php`. To jest mile widziana zmiana w stosunku do wcześniejszych wersji, ale powinieneś nadal wykonać pełną kopię zapasową przed rozpoczęciem.

Skopiuj cały katalog _upgrade_ z dystrybucji do katalogu głównego serwera WWW, tworząc tam katalog _upgrade_.

## Uruchom sprawdzenie preflightu Smarty 4

Przed uruchomieniem głównego przepływu `/upgrade/`, musisz uruchomić skaner preflight dostarczany w katalogu `upgrade/`. Bada on istniejące motywy i szablony modułów pod kątem problemów kompatybilności Smarty 4 i może automatycznie naprawić wiele z nich.

1. Wskaż przeglądarkę na _twój-adres-url-witryny_/upgrade/preflight.php
2. Zaloguj się za pomocą konta administratora
3. Uruchom skan i przejrzyj raport
4. Zastosuj jakiekolwiek zaproponowane automatyczne naprawy lub ręcznie napraw flagowane szablony
5. Ponownie uruchom skan aż będzie czysty
6. Dopiero wtedy kontynuuj do głównej aktualizacji

Zapoznaj się ze stroną [Sprawdzenie preflightu](preflight.md) dla pełnego instruktażu.

### Rzeczy, których możesz nie chcieć kopiować

Nie powinieneś ponownie kopiować katalogu _install_ do pracującego systemu XOOPS. Pozostawienie folderu instalacji w instalacji XOOPS narażojaako system na potencjalne problemy bezpieczeństwa. Instalator losowo zmienia jego nazwę, ale powinieneś go usunąć i upewnić się, że nie kopiujesz innego.

Są pliki, które mogłeś edytować, aby dostosować witrynę, i chcesz je zachować. Oto lista typowych dostosowań.

* _xoops_data/configs/xoopsconfig.php_ jeśli został zmieniony od czasu instalacji witryny
* wszelkie katalogi w _themes_ jeśli dostosowane do Twojej witryny. W takim przypadku możesz chcieć porównać pliki, aby zidentyfikować użyteczne aktualizacje.
* dowolny plik w _class/captcha/_ zaczynający się od "config" jeśli został zmieniony od czasu instalacji witryny
* wszelkie dostosowania w _class/textsanitizer_
* wszelkie dostosowania w _class/xoopseditor_

Jeśli po aktualizacji zdasz sobie sprawę, że coś zostało przypadkowo nadpisane, nie panikuj - dlatego zacząłeś od pełnej kopii zapasowej. _(Wykonałeś kopię zapasową, prawda?)_

## Sprawdzaj mainfile.php (aktualizacja z wcześniejszego XOOPS)

Ten krok dotyczy tylko sytuacji, gdy uaktualnisz ze starszej wersji XOOPS (2.3 lub wcześniej). Jeśli uaktualnisz z XOOPS 2.5.x, możesz pominąć tę sekcję.

Stare wersje XOOPS wymagały pewnych ręcznych zmian w `mainfile.php` w celu włączenia modułu Protector. W katalogu głównym serwera WWW powinieneś mieć plik o nazwie `mainfile.php`. Otwórz plik w edytorze i poszukaj tych linii:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

i

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Usuń te linie, jeśli je znaleźć, i zapisz plik przed kontynuowaniem.

