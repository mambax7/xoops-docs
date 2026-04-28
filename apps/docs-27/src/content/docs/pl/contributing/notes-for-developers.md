---
title: "Uwagi dla programistów"
---

Choć faktyczna instalacja XOOPS do celów programistycznych jest podobna do już opisanej normalnej instalacji, istnieją kluczowe różnice podczas tworzenia systemu gotowego do programowania.

Jedną z dużych różnic w instalacji dewelopera jest to, że zamiast skupiania się na zawartości katalogu _htdocs_, instalacja dewelopera zachowuje wszystkie pliki i utrzymuje je pod kontrolą kodu źródłowego za pomocą git.

Kolejną różnicą jest to, że katalogi _xoops_data_ i _xoops_lib_ mogą zwykle pozostać na miejscu bez zmiany nazwy, o ile system programistyczny nie jest bezpośrednio dostępny w Internecie (tj. w sieci prywatnej, takiej jak za routerem.)

Większość programistów pracuje na systemie _localhost_, który zawiera kod źródłowy, stos serwera WWW i wszelkie narzędzia potrzebne do pracy z kodem i bazą danych.

Więcej informacji można znaleźć w rozdziale [Narzędzia zawodu](../tools/tools.md).

## Git i wirtualne hosty

Większość programistów chce być w stanie być na bieżąco z bieżącymi źródłami i wnieść zmiany z powrotem do [repozytorium XOOPS/XoopsCore27 na GitHub](https://github.com/XOOPS/XoopsCore27). Oznacza to, że zamiast pobierać archiwum wersji, będziesz chciał [fork](https://help.github.com/articles/fork-a-repo/) kopię XOOPS i użyć **git** do [sklonowania](https://help.github.com/categories/bootcamp/) tego repozytorium na swój dev box.

Ponieważ repozytorium ma określoną strukturę, zamiast _kopiowania_ plików z katalogu _htdocs_ na serwer internetowy, lepiej jest wskazać serwer internetowy w folderze htdocs wewnątrz lokalnie sklonowanego repozytorium. Aby to zrobić, zwykle tworzymy nowy _Virtual Host_, lub _vhost_, który wskazuje na kod źródłowy kontrolowany przez git.

W środowisku [WAMP](http://www.wampserver.com/), domyślna strona [localhost](http://localhost/) ma w sekcji _Tools_ link do _Add a Virtual Host_, który prowadzi tutaj:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Korzystając z tego, możesz skonfigurować wpis VirtualHost, który będzie bezpośrednio w twoim (nadal) kontrolowanym przez git repozytorium.

Oto przykładowy wpis w `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Może być również konieczne dodanie wpisu w `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Teraz możesz zainstalować na `http://xoops.localhost/` do testowania, zachowując jednocześnie integrację repozytorium i utrzymując serwer internetowy wewnątrz katalogu htdocs za pomocą prostego adresu URL. Ponadto możesz aktualizować lokalną kopię XOOPS do najnowszego mastera w dowolnym momencie bez konieczności ponownej instalacji lub kopiowania plików. A możesz wnosić ulepszenia i poprawki do kodu, aby przyczynić się do XOOPS za pośrednictwem GitHub.

## Zależności Composer

XOOPS 2.7.0 używa [Composer](https://getcomposer.org/) do zarządzania swoimi zależnościami PHP. Drzewo zależności znajduje się w `htdocs/xoops_lib/` wewnątrz repozytorium źródłowego:

* `composer.dist.json` to główna lista zależności dostarczonych z wydaniem.
* `composer.json` to lokalna kopia, którą możesz dostosować do swojego środowiska programistycznego w razie potrzeby.
* `composer.lock` przyczepia dokładne wersje, aby instalacje były powtarzalne.
* `vendor/` zawiera zainstalowane biblioteki (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom i inne).

W przypadku świeżego klonu git XOOPS 2.7.0, począwszy od katalogu głównego repozytorium, uruchom:

```text
cd htdocs/xoops_lib
composer install
```

Pamiętaj, że w głównym katalogu repozytorium nie ma `composer.json` — projekt znajduje się w `htdocs/xoops_lib/`, więc przed uruchomieniem Composer'a musisz `cd` do tego katalogu.

Wydane tarballs zawierają wstępnie wypełniony `vendor/`, ale klony git mogą go nie zawierać. Zachowaj `vendor/` w instalacjach programistycznych — XOOPS będzie ładować swoje zależności stamtąd w czasie wykonywania.

Biblioteka [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) jest dostarczana jako zależność Composer w wersji 2.7.0, więc możesz używać `Xmf\Request`, `Xmf\Database\TableLoad` i powiązanych klas w kodzie modułu bez dodatkowej instalacji.

## Moduł DebugBar

XOOPS 2.7.0 zawiera moduł **DebugBar** oparty na Symfony VarDumper. Dodaje pasek narzędzi debugowania do renderowanych stron, który ujawnia informacje o żądaniach, bazach danych i szablonach. Zainstaluj go z obszaru administracyjnego modułów w serwisach programistycznych i przejściowych. Nie pozostawiaj go zainstalowanego na publicznej stronie produkcyjnej, chyba że wiesz, że tego chcesz.


