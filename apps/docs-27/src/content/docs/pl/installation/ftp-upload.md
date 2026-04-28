---
title: "Załącznik 2: Przesyłanie XOOPS przez FTP"
---

Ten załącznik zawiera instrukcje wdrażania XOOPS 2.7.0 na zdalny host przy użyciu FTP lub SFTP. Każdy panel sterowania (cPanel, Plesk, DirectAdmin, itp.) wyeksponuje te same kroki.

## 1. Przygotowanie bazy danych

Przez panel sterowania hosta:

1. Utwórz nową bazę danych MySQL dla XOOPS.
2. Utwórz użytkownika bazy danych z silnym hasłem.
3. Przyznaj użytkownikowi pełne uprawnienia do nowo utworzonej bazy danych.
4. Zapisz nazwę bazy danych, nazwę użytkownika, hasło i host — wpiszesz je do instalatora XOOPS.

> **Wskazówka**
>
> Nowoczesne panele sterowania generują dla ciebie silne hasła. Ponieważ aplikacja przechowuje hasło w `xoops_data/data/secure.php`, nie będziesz musiał go wpisywać często — wolisz długą, losowo wygenerowaną wartość.

## 2. Utwórz skrzynkę pocztową administratora

Utwórz skrzynkę pocztową e-mail, która będzie odbierać powiadomienia administracyjne witryny. Instalator XOOPS prosi o ten adres podczas konfiguracji konta webmastera i sprawdza go przy użyciu `FILTER_VALIDATE_EMAIL`.

## 3. Przesyłanie plików

XOOPS 2.7.0 jest dostarczany z wstępnie zainstalowanymi zależnościami stron trzecich w `xoops_lib/vendor/` (pakiety Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF i inne). Czyni to `xoops_lib/` znacznie większym niż w 2.5.x — spodziewaj się dziesiątek megabajtów.

**Nie pomijaj selektywnie pliki wewnątrz `xoops_lib/vendor/`.** Pomijanie plików w drzewie dostawcy Composer spowoduje złamanie autoloadingu i instalacja się nie powiedzie.

Struktura przesyłania (zakładając że `public_html` jest katalogiem głównym):

1. Prześlij `xoops_data/` i `xoops_lib/` **obok** `public_html`, a nie wewnątrz. Umieszczenie ich poza katalogiem głównym serwera WWW jest zalecanym podejściem do bezpieczeństwa dla 2.7.0.

   ```
   /home/twój-użytkownik/
   ├── public_html/
   ├── xoops_data/     ← prześlij tutaj
   └── xoops_lib/      ← prześlij tutaj
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Prześlij pozostałą zawartość katalogu `htdocs/` dystrybucji do `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Jeśli host nie pozwala na katalogi poza katalogiem głównym**
>
> Prześlij `xoops_data/` i `xoops_lib/` **wewnątrz** `public_html/` i **zmień ich nazwy na nieoczywiste** (na przykład `xdata_8f3k2/` i `xlib_7h2m1/`). Wpiszesz zmienione ścieżki do instalatora, gdy zapyta o ścieżkę danych XOOPS i ścieżkę biblioteki XOOPS.

## 4. Uczyń katalogi zapisywalne

Przez dialog CHMOD klienta FTP (lub SSH), uczyń katalogi wymienione w rozdziale 2 zapisywalnymi dla serwera WWW. Na większości hostów współdzielonych `0775` na katalogach i `0664` na `mainfile.php` jest wystarczające. `0777` jest akceptowalny podczas instalacji, jeśli host uruchamia PHP na innym użytkowniku niż użytkownik FTP, ale zaostrzysz uprawnienia po ukończeniu instalacji.

## 5. Uruchom instalator

Wskaż przeglądarkę na publiczny adres URL witryny. Jeśli wszystkie pliki są na miejscu, Kreator instalacji XOOPS się uruchamia i możesz kontynuować ten przewodnik z [Rozdziału 2](chapter-2-introduction.md) dalej.
