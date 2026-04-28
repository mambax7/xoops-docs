---
title: "Co nowego w XOOPS 2.7.0"
---

XOOPS 2.7.0 to istotna aktualizacja z serii 2.5.x. Przed instalacją lub aktualizacją zapoznaj się ze zmianami na tej stronie, aby wiedzieć, czego się spodziewać. Lista poniżej skupia się na elementach wpływających na instalację i administrację witryny - pełną listę zmian zobacz w notatkach wydania zawartych w dystrybucji.

## PHP 8.2 to nowe minimum

XOOPS 2.7.0 wymaga **PHP 8.2 lub nowszego**. PHP 7.x i wcześniejsze nie są już obsługiwane. Zdecydowanie zaleca się PHP 8.4 lub wyżej.

**Działanie:** Potwierdź, że Twój host oferuje PHP 8.2+ zanim zaczniesz. Patrz [Wymagania](installation/requirements.md).

## MySQL 5.7 to nowe minimum

Nowe minimum to **MySQL 5.7** (lub kompatybilny MariaDB). Zdecydowanie zaleca się MySQL 8.4 lub wyżej. MySQL 9.0 jest również obsługiwany.

Stare ostrzeżenia dotyczące problemów ze zgodnością PHP/MySQL 8 nie mają już zastosowania, ponieważ dotkięte wersje PHP nie są już obsługiwane przez XOOPS.

## Smarty 4 zastępuje Smarty 3

To jest największa zmiana dla istniejących witryn. XOOPS 2.7.0 używa **Smarty 4** jako swój silnik szablonów. Smarty 4 jest bardziej rygorystyczna w kwestii składni szablonów niż Smarty 3, a niektóre niestandardowe motywy i szablony modułów mogą wymagać zmian zanim będą się prawidłowo renderować.

Aby pomóc w identyfikacji i naprawie tych problemów, XOOPS 2.7.0 zawiera **skaner preflight** w katalogu `upgrade/`, który bada istniejące szablony pod kątem znanych niezgodności Smarty 4 i może automatycznie naprawić wiele z nich.

**Działanie:** Jeśli aktualizujesz z 2.5.x i masz niestandardowe motywy lub starsze moduły, uruchom [Sprawdzenie preflight](upgrading/upgrade/preflight.md) _przed_ uruchomieniem głównego updatera.

## Zależności zarządzane przez Composer

XOOPS 2.7.0 używa **Composer** do zarządzania zależnościami PHP. Znajdują się one w `xoops_lib/vendor/`. Biblioteki stron trzecich, które wcześniej były pakowane w rdzeniu lub w modułach - PHPMailer, HTMLPurifier, Smarty i inne - są teraz dostarczane za pośrednictwem Composer.

**Działanie:** Większość operatorów witryn nie musi nic robić - archiwa wydań zawierają `vendor/` już wypełniony. Jeśli przenosisz lub aktualizujesz witrynę, skopiuj całe drzewo `xoops_lib/`, w tym `vendor/`. Deweloperzy klonujący repozytorium git powinni uruchomić `composer install` wewnątrz `htdocs/xoops_lib/`. Patrz [Notatki dla deweloperów](notes-for-developers/developers.md).

## Nowe wzmocnione preferencje pliku cookie sesji

Dwie nowe preferencje są dodawane podczas aktualizacji:

* **`session_cookie_samesite`** - kontroluje atrybut SameSite na plikach cookie sesji (`Lax`, `Strict` lub `None`).
* **`session_cookie_secure`** - po włączeniu, pliki cookie sesji są wysyłane tylko przez HTTPS.

**Działanie:** Po aktualizacji przejrzyj te opcje w System Options → Preferences → General Settings. Patrz [Po aktualizacji](upgrading/upgrade/ustep-04.md).

## Nowa tabela `tokens`

XOOPS 2.7.0 dodaje tabelę bazy danych `tokens` do przechowywania tokenów w zakresie. Updater tworzy tę tabelę automatycznie w ramach aktualizacji 2.5.11 → 2.7.0.

## Zmodernizowane przechowywanie haseł

Kolumna `bannerclient.passwd` została poszerzona do `VARCHAR(255)`, aby mogła przechowywać nowoczesne skróty haseł (bcrypt, argon2). Updater poszerza kolumnę automatycznie.

## Zaktualizowana linia motywów i modułów

XOOPS 2.7.0 wysyła ze zaktualizowanymi motywami frontendu:

* `default`, `xbootstrap` (legacy), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Nowy motyw administracyjny **Modern** jest dołączony obok istniejącego motywu Transition.

Nowy moduł **DebugBar** oparty na Symfony VarDumper jest wysyłany jako jeden z opcjonalnych modułów instalacyjnych. Jest przydatny do programowania i stagingu, ale zwykle nie jest instalowany na publicznych witrynach produkcyjnych.

Patrz [Wybierz motyw](installation/installation/step-12.md) i [Instalacja modułów](installation/installation/step-13.md).

## Kopiowanie nowego wydania nie powoduje już przpisania konfiguracji

Wcześniej kopiowanie nowej dystrybucji XOOPS na istniejącą witrynę wymagało ostrożności, aby uniknąć przpisania `mainfile.php` i innych plików konfiguracyjnych. W 2.7.0 proces kopiowania pozostawia istniejące pliki konfiguracyjne niezmienione, co czyni aktualizacje zauważalnie bezpieczniejszymi.

Powinieneś nadal wykonać pełną kopię zapasową przed jakąkolwiek aktualizacją.

## Możliwość przeciążenia szablonu w motywach administracyjnych systemu

Motywy administracyjne w XOOPS 2.7.0 mogą teraz przesłaniać indywidualne szablony administracyjne systemu, ułatwiając dostosowywanie interfejsu administracyjnego bez rozwidlenia całego modułu systemu.

## Co się nie zmieniło

Na uspokojenie, te części XOOPS pracują w taki sam sposób w 2.7.0, jak w 2.5.x:

* Kolejność stron instalatora i ogólny przepływ
* Podziała `mainfile.php` plus `xoops_data/data/secure.php` konfiguracja
* Zalecana praktyka relokacji `xoops_data` i `xoops_lib` poza katalog internetowy
* Model instalacji modułu i format manifestu `xoops_version.php`
* Przepływ pracy przenoszenia witryny (kopia zapasowa, edycja `mainfile.php`/`secure.php`, użycie SRDB lub podobnie)

## Gdzie iść dalej

* Zaczynasz od nowa? Przejdź do [Wymagania](installation/requirements.md).
* Aktualizujesz z 2.5.x? Zacznij od [Aktualizacji](upgrading/upgrade/README.md), a następnie uruchom [Sprawdzenie preflight](upgrading/upgrade/preflight.md).
