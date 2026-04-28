---
title: "Zapisz konfigurację"
---

Ta strona wyświetla wyniki zapisania informacji o konfiguracji, którą wpisałeś do tej pory.

Po przejrzeniu i poprawieniu wszelkich problemów kliknij przycisk "Kontynuuj", aby przejść dalej.

## W przypadku powodzenia

Sekcja _Zapisywanie konfiguracji systemu_ pokazuje informacje, które zostały zapisane. Ustawienia są zapisywane w jednym z dwóch plików. Jeden plik to _mainfile.php_ w głównym katalogu WWW. Drugi to _data/secure.php_ w katalogu _xoops_data_.

![XOOPS Installer Save Configuration](/xoops-docs/2.7/img/installation/installer-07.png)

Oba pliki są generowane z plików szablonów dostarczonych z XOOPS 2.7.0:

* `mainfile.php` jest generowany z `mainfile.dist.php` w głównym katalogu WWW.
* `xoops_data/data/secure.php` jest generowany z `xoops_data/data/secure.dist.php`.

Oprócz ścieżek i adresu URL, które wpisałeś, `mainfile.php` teraz zawiera kilka stałych, które są nowe w XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — utrzymywane jako alias wstecz kompatybilny `XOOPS_PATH`; nie musisz go konfigurować osobno.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — domyślnie `true`; wykorzystuje Public Suffix List do określenia poprawnej domeny ciasteczka.
* `XOOPS_DB_LEGACY_LOG` — domyślnie `false`; ustaw na `true` w rozwoju, aby zalogować użycie starszych interfejsów API bazy danych.
* `XOOPS_DEBUG` — domyślnie `false`; ustaw na `true` w rozwoju, aby włączyć dodatkowe raportowanie błędów.

Nie musisz edytować ich ręcznie podczas instalacji — domyślne ustawienia są odpowiednie dla witryny produkcyjnej. Są tutaj wymienione, abyś wiedział, czego szukać, jeśli otworzysz `mainfile.php` później.

## Błędy

Jeśli XOOPS wykryje błędy w zapisywaniu plików konfiguracyjnych, wyświetli komunikaty szczegółowo opisujące, co jest nie tak.

![XOOPS Installer Save Configuration Errors](/xoops-docs/2.7/img/installation/installer-07-errors.png)

W wielu przypadkach domyślna instalacja systemu pochodzącego z Debiana używającego mod_php w Apache jest źródłem błędów. Większość dostawców hostingowych ma konfiguracje, które nie mają tych problemów.

### Problemy z uprawnieniami grupy

Proces PHP jest uruchamiany z uprawnieniami pewnego użytkownika. Pliki są również własnością pewnego użytkownika. Jeśli te dwa nie są tym samym użytkownikiem, uprawnienia grupy mogą być użyte, aby umożliwić procesowi PHP udostępnianie plików Twojemu kontu użytkownika. Zwykle oznacza to, że musisz zmienić grupę plików i katalogów, do których XOOPS musi pisać.

W przypadku wspomnianej domyślnej konfiguracji oznacza to, że grupa _www-data_ musi być określona jako grupa dla plików i katalogów, a te pliki i katalogi muszą być zapisywalne dla grupy.

Powinieneś dokładnie przejrzeć swoją konfigurację i ostrożnie wybrać, jak rozwiązać te problemy dla serwera dostępnego w otwartym internecie.

Przykładowe polecenia mogą być:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Nie można utworzyć mainfile.php

W systemach podobnych do Unix, uprawnienie do utworzenia nowego pliku zależy od uprawnień przyznanych w folderze nadrzędnym. W niektórych przypadkach to uprawnienie nie jest dostępne, a jego przyznanie może być problemem bezpieczeństwa.

Jeśli masz konfigurację problemową, możesz znaleźć dummy _mainfile.php_ w katalogu _extras_ w dystrybucji XOOPS. Skopiuj ten plik do głównego katalogu WWW i ustaw uprawnienia na pliku:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Środowiska SELinux

Konteksty bezpieczeństwa SELinux mogą być źródłem problemów. Jeśli może to mieć zastosowanie, zapoznaj się z [Specjalnym tematami](../specialtopics.md), aby uzyskać więcej informacji.
