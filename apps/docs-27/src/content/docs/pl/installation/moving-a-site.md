---
title: "Przenoszenie witryny"
---

Może to być bardzo przydatna technika do prototypowania nowej witryny XOOPS na lokalnym systemie lub serwerze programistycznym. Może to również być bardzo rozsądne testowanie aktualizacji XOOPS na kopii produkcyjnej witryny, na wypadek gdyby coś poszło nie tak. Aby to osiągnąć, musisz mieć możliwość przeniesienia witryny XOOPS z jednej witryny na drugą. Oto to, co powinieneś wiedzieć, aby pomyślnie przenieść witrynę XOOPS.

Pierwszym krokiem jest ustanowienie nowego środowiska witryny. Te same elementy, które są omówione w sekcji [Zaawansowane przygotowania](../installation/preparations/) mają tu również zastosowanie.

W przeglądzie, te kroki to:

* uzyskanie hostingu, w tym wszelkich wymagań dotyczących nazwy domeny lub poczty e-mail
* uzyskanie konta użytkownika MySQL i hasła
* uzyskanie bazy danych MySQL, którą powyższy użytkownik ma pełne uprawnienia

Pozostała część procesu jest dość podobna do normalnej instalacji, ale:

* zamiast kopiować pliki z dystrybucji XOOPS, będziesz je kopiować z istniejącej witryny
* zamiast uruchamiać instalator, zaimportujesz już wypełnioną bazę danych
* zamiast wpisywać odpowiedzi w instalatorze, zmienisz poprzednie odpowiedzi w plikach i bazie danych

## Kopiowanie istniejących plików witryny

Utwórz pełną kopię plików istniejącej witryny na maszynie lokalnej, gdzie możesz je edytować. Jeśli pracujesz ze zdalnym hostem, możesz użyć FTP do skopiowania plików. Potrzebujesz kopii do pracy, nawet jeśli witryna działa na maszynie lokalnej, po prostu zrób inną kopię katalogów witryny w takim przypadku.

Ważne jest pamiętanie o dołączeniu katalogów _xoops_data_ i _xoops_lib_, nawet jeśli zostały zmienione nazwy i/lub przeniesione.

Aby ułatwić sobie, powinieneś wyeliminować pliki pamięci podręcznej i skompilowanych szablonów Smarty z kopii. Te pliki będą ponownie tworzone w nowym środowisku i mogą spowodować problemy ze starymi nieprawidłowymi informacjami zatrzymywanymi, jeśli nie zostaną wyczyszczone. Aby to zrobić, usuń wszystkie pliki, z wyjątkiem _index.html_, we wszystkich trzech tych katalogach:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Uwaga:** Czyszczenie `smarty_compile` jest szczególnie ważne podczas przenoszenia witryny do lub z XOOPS 2.7.0. XOOPS 2.7.0 używa Smarty 4, a skompilowane szablony Smarty 4 nie są zamienne ze skompilowanymi szablonami Smarty 3. Pozostawienie starych skompilowanych plików spowoduje błędy szablonów przy pierwszym załadowaniu strony na nowej witrynie.

### `xoops_lib` i zależności Composer

XOOPS 2.7.0 zarządza zależnościami PHP za pomocą Composer, wewnątrz `xoops_lib/`. Katalog `xoops_lib/vendor/` zawiera biblioteki stron trzecich, których XOOPS potrzebuje podczas runtime'u (Smarty 4, PHPMailer, HTMLPurifier, itp.). Podczas przenoszenia witryny musisz skopiować całe drzewo `xoops_lib/` — w tym `vendor/` — na nowy host. Nie próbuj ponownie generować `vendor/` na hoście docelowym, chyba że jesteś deweloperem, który dostosował `composer.json` i ma dostęp Composer na celu.

## Konfiguracja nowego środowiska

Te same elementy, które są omówione w sekcji [Zaawansowane przygotowania](../installation/preparations/) mają tu również zastosowanie. Załóżmy tutaj, że masz taki hosting, jaki będziesz potrzebować dla przenoszonej witryny.

### Informacje kluczowe (mainfile.php i secure.php)

Pomyślne przeniesienie witryny polega na zmianie wszelkich odniesień do bezwzględnych nazw plików i ścieżek, adresów URL, parametrów bazy danych i poświadczeń dostępu.

Dwa pliki, `mainfile.php` w katalogu głównym serwera WWW witryny oraz `data/secure.php` w katalogu _xoops_data_ witryny (zmieniony i/lub przeniesiony) definiują parametry podstawowe witryny, takie jak jej adres URL, gdzie znajduje się w systemie plików hosta i jak się łączy z bazą danych.

Musisz wiedzieć zarówno jakie wartości są w starym systemie, i jakie będą w nowym systemie.

#### mainfile.php

| Name | Old Value in mainfile.php | New Value in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Otwórz _mainfile.php_ w edytorze. Zmień wartości dla defines pokazane na wykresie powyżej ze starej wartości, na odpowiednie wartości dla nowej witryny.

Prowadź notatki ze starej i nowych wartości, ponieważ będziemy musieli dokonać podobnych zmian w innych miejscach w niektórych późniejszych krokach.

Na przykład, jeśli przenosisz witrynę z lokalnego komputera PC do komercyjnej usługi hostingu, twoje wartości mogą wyglądać tak:

| Name | Old Value in mainfile.php | New Value in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Po zmianie _mainfile.php_, zapisz go.

Jest możliwe, że niektóre inne pliki mogą zawierać zakodowane odwołania do twojego adresu URL lub nawet ścieżek. Jest to bardziej prawdopodobne w dostosowanych motywach i menu, ale za pomocą edytora możesz wyszukać we wszystkich plikach, aby być pewnym.

W edytorze, wyszukaj we wszystkich plikach w kopii, szukając starej wartości XOOPS_URL i zastępując ją nową wartością.

Zrób to samo dla starej wartości XOOPS_ROOT_PATH, zastępując wszystkie wystąpienia nową wartością.

Prowadź notatki, ponieważ będziemy musieli używać ich ponownie później, gdy będziemy przenosić bazę danych.

#### data/secure.php

| Name | Old Value in data/secure.php | New Value in data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Otwórz _data/secure.php_ w zmienionej i/lub przeniesionej _xoops_data_ w edytorze. Zmień wartości dla defines pokazane na wykresie powyżej ze starej wartości, na odpowiednie wartości dla nowej witryny.

#### Inne pliki

Mogą być inne pliki, które mogą wymagać uwagi podczas przenoszenia witryny. Niektóre typowe przykłady to klucze API dla różnych usług, które mogą być powiązane z domeną, takie jak:

* Google Maps
* Recaptch2
* Przyciski "Lubię to"
* Udostępnianie linków i/lub reklamy, takie jak Shareaholic lub AddThis

Zmiana tego rodzaju skojarzeń nie może być łatwo zautomatyzowana, ponieważ połączenia ze starą domeną są zazwyczaj częścią rejestracji po stronie usługi. W niektórych przypadkach może to po prostu dodać lub zmienić domenę skojarzoną z usługą.

### Kopiowanie plików na nową witrynę

Skopiuj teraz zmodyfikowane pliki na nową witrynę. Techniki są takie same jak były używane podczas [Instalacji](../installation/installation/), tzn. przy użyciu FTP.

## Kopiowanie istniejącej bazy danych witryny

### Kopia zapasowa bazy danych ze starego serwera

Do tego kroku, używanie _phpMyAdmin_ jest zdecydowanie rekomendowane. Zaloguj się do _phpMyAdmin_ na istniejącą witrynę, wybierz bazę danych i wybierz _Export_.

Domyślne ustawienia są zwykle w porządku, po prostu wybierz "Metoda exportu" _Quick_ i "Format" _SQL_.

Użyj przycisku _Go_ aby pobrać kopię zapasową bazy danych.

![Exporting a Database with phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Jeśli masz tabele w bazie danych, które nie pochodzą z XOOPS lub jego modułów i NIE mają być przenoszone, powinieneś wybrać "Metoda exportu" _Custom_ i wybrać tylko tabele związane z XOOPS w bazie danych. (Zaczynają się od "prefiksu", którym kierowałeś się podczas instalacji. Możesz wyszukać prefiks bazy danych w pliku `xoops_data/data/secure.php`.)

### Przywracanie bazy danych na nowym serwerze

Na nowym hoście, używając nowej bazy danych, przywróć bazę danych korzystając z [narzędzi](../tools/tools.md) takich jak karta _Import_ w _phpMyAdmin_ (lub _bigdump_ jeśli będzie to potrzebne.)

### Aktualizacja adresów URL i ścieżek w bazie danych

Zaktualizuj wszelkie linki http do zasobów na witrynie w bazie danych. To może być ogromny wysiłek i istnieje [narzędzie](../tools/tools.md) aby ułatwić to.

Interconnect/it ma produkt o nazwie Search-Replace-DB, który może w tym pomóc. Wysyła się z wbudowaną świadomością środowisk Wordpress i Drupal. Jak jest, to narzędzie może być bardzo pomocne, ale jest jeszcze lepsze, gdy jest świadome twojego XOOPS. Możesz znaleźć wersję świadomą XOOPS na [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Postępuj zgodnie z instrukcjami w pliku README.md, aby pobrać i tymczasowo zainstalować to narzędzie na witrynie. Wcześniej zmieniliśmy definicję XOOPS_URL. Gdy uruchomisz to narzędzie, chcesz zastąpić oryginalną definicję XOOPS_URL nową definicją, tj. zastąpić [http://localhost/xoops](http://localhost/xoops) z [https://example.com](https://example.com)

![Using Seach and Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Wpisz stare i nowe adresy URL, i wybierz opcję suchego przebiegu. Przejrzyj zmiany, i jeśli wszystko wygląda dobrze, przejdź do opcji przebiegu na żywo. Ten krok złapie elementy konfiguracji i linki w treści, które odnoszą się do adresu URL witryny.

![Reviewing Changes in SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Powtórz proces, używając starych i nowych wartości dla XOOPS_ROOT_PATH.

#### Alternatywne podejście bez SRDB

Innym sposobem na zrobienie tego kroku bez narzędzia srdb byłoby zrzucenie bazy danych, edytowanie zrzutu w edytorze tekstu, zmieniając adresy URL i ścieżki, a następnie ponowne załadowanie bazy danych ze zmienionego zrzutu. Tak, ten proces jest wystarczająco zaangażowany i nosi wystarczająco dużo ryzyka, że ludzie byli zmotywowani do tworzenia specjalistycznych narzędzi, takich jak Search-Replace-DB.

## Wypróbowanie przeniesionej witryny

W tym momencie twoja witryna powinna być gotowa do uruchomienia w nowym środowisku!

Oczywiście zawsze mogą być problemy. Nie bój się zapostować żadnych pytań na [xoops.org Forums](https://xoops.org/modules/newbb/index.php).

