---
title: "Wymagania"
---

## Środowisko oprogramowania (stos)

Większość produkcyjnych witryn XOOPS działa na stosie _LAMP_ (system **L**inux z **A**pache, **M**ySQL i **P**HP), ale istnieje wiele różnych możliwych stosów.

Najłatwiej jest prototypować nową witrynę na komputerze lokalnym. W takim przypadku wielu użytkowników XOOPS wybiera stos _WAMP_ (używając **W**indows jako systemu operacyjnego), podczas gdy inni uruchamiają stosy _LAMP_ lub _MAMP_ (**M**AC).

### PHP

Każda wersja PHP >= 8.2.0 (PHP 8.4 lub nowsza jest zdecydowanie zalecana)

> **Ważne:** XOOPS 2.7.0 wymaga **PHP 8.2 lub nowszego**. PHP 7.x i wcześniejsze są już nie obsługiwane. Jeśli uaktualnisz starszą witrynę, potwierdź że host oferuje PHP 8.2+ przed rozpoczęciem.

### MySQL

Serwer MySQL 5.7 lub nowszy (Serwer MySQL 8.4 lub nowszy jest zdecydowanie zalecany). MySQL 9.0 jest również obsługiwany. MariaDB jest kompatybilną wstecznie, binarną zamiennikiem MySQL i również dobrze działa z XOOPS.

### Serwer WWW

Serwer WWW obsługujący uruchamianie skryptów PHP, taki jak Apache, NGINX, LiteSpeed, itp.

### Wymagane rozszerzenia PHP

Instalator XOOPS weryfikuje czy następujące rozszerzenia są załadowane przed zezwoleniem na kontynuację instalacji:

* `mysqli` — sterownik bazy danych MySQL
* `session` — obsługa sesji
* `pcre` — wyrażenia regularne zgodne z Perl
* `filter` — filtrowanie i walidacja wejścia
* `fileinfo` — detekcja typu MIME dla przesyłań

### Wymagane ustawienia PHP

Oprócz powyższych rozszerzeń, instalator weryfikuje następujące ustawienie `php.ini`:

* `file_uploads` musi być **On** — bez tego XOOPS nie może akceptować przesyłanych plików

### Zalecane rozszerzenia PHP

Instalator również sprawdza te rozszerzenia. Nie są one ściśle wymagane, ale XOOPS i większość modułów polegają na nich dla pełnej funkcjonalności. Włącz tyle ile pozwala host:

* `mbstring` — obsługa wielobajtowych ciągów znaków
* `intl` — internacjonalizacja
* `iconv` — konwersja zestawu znaków
* `xml` — parsowanie XML
* `zlib` — kompresja
* `gd` — przetwarzanie obrazów
* `exif` — metadane obrazów
* `curl` — klient HTTP do kanałów informacyjnych i wywołań API

## Usługi

### Dostęp do systemu plików (dostęp webmastera)

Będziesz potrzebować jakiejś metody (FTP, SFTP, itp.) do transferu plików dystrybucji XOOPS na serwer WWW.

### Dostęp do systemu plików (proces serwera WWW)

Aby uruchomić XOOPS, potrzebna jest możliwość tworzenia, odczytywania i usuwania plików i katalogów. Następujące ścieżki muszą być zapisywalne dla procesu serwera WWW dla normalnej instalacji i normalnej codziennej operacji:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (zapisywalny podczas instalacji i aktualizacji)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Baza danych

XOOPS będzie musiał tworzyć, modyfikować i wysyłać zapytania do tabel w MySQL. W tym celu będziesz potrzebował:

* konto użytkownika MySQL i hasło
* baza danych MySQL, na której ten użytkownik ma wszystkie uprawnienia (lub alternatywnie, użytkownik może mieć uprawnienia do tworzenia takiej bazy danych)

### Email

Dla witryny na żywo, będziesz potrzebować działającego adresu email, który XOOPS może używać do komunikacji użytkowników, takiej jak aktywacja konta i resetowanie hasła. Chociaż nie jest to ściśle wymagane, zaleca się jeśli to możliwe używanie adresu email pasującego do domeny, na której działa XOOPS. Pomaga to uniknąć odrzucenia lub oznaczenia komunikacji jako spam.

## Narzędzia

Do konfiguracji i dostosowania instalacji XOOPS może być potrzebne kilka dodatkowych narzędzi. Mogą one obejmować:

* Oprogramowanie klienta FTP
* Edytor tekstu
* Oprogramowanie archiwizujące do pracy z plikami wydania XOOPS (_.zip_ lub _.tar.gz_).

Zapoznaj się z sekcją [Narzędzia zawodu](../tools/tools.md) w celu uzyskania kilku sugestii dla odpowiednich narzędzi i stosów serwerów WWW jeśli będzie to potrzebne.

## Tematy specjalne

Niektóre określone kombinacje oprogramowania systemowego mogą wymagać dodatkowych konfiguracji do pracy z XOOPS. Jeśli używasz środowiska SELinux lub uaktualnisz starszą witrynę z niestandardowymi motywami, prosimy zapoznaj się z [Tematami specjalnymi](specialtopics.md) dla więcej informacji.
