---
title: "Narzędzia zawodu"
---

Istnieje wiele rzeczy potrzebnych do dostosowania i utrzymania witryny XOOPS, które muszą się odbyć poza XOOPS lub są tam łatwiej wykonywane.

Jest to lista typów narzędzi, które możesz chcieć mieć dostępne, wraz z sugestiami dotyczącymi konkretnych narzędzi, które administratorzy XOOPS uważali za przydatne.

## Edytory

Edytory są bardzo osobistym wyborem i ludzie mogą być całkiem pasjonujący na temat ich ulubionego. Przedstawimy tylko kilka z wielu możliwości.

Do użytku XOOPS będziesz potrzebować edytora, aby dostosować niektóre opcje konfiguracji, a także dostosować motyw dla swojej witryny. Do tego celu może być bardzo pomocne posiadanie edytora, który potrafi pracować z wieloma plikami jednocześnie, być w stanie wyszukiwać i zamieniać w wielu plikach oraz zapewniać podświetlanie składni. Możesz użyć bardzo prostego edytora bez ozdób, ale będziesz pracować znacznie ciężej, aby wykonać niektóre zadania.

**PhpStorm** od _JetBrains_ to IDE (zintegrowane środowisko programistyczne) specjalnie dostosowane do tworzenia aplikacji internetowych PHP. _JetBrains_ był bardzo pomocny w sponsorowaniu XOOPS i jego produkty są ulubione przez wielu deweloperów. Jest to produkt komercyjny i może być zbyt drogi dla niektórych nowych administratorów, ale czas, który może zaoszczędzić, czyni go atrakcyjnym dla doświadczonych deweloperów.

**Visual Studio Code** to bezpłatny edytor kodu źródłowego dla wielu platform firmy Microsoft. Posiada wsparcie, wbudowane lub za pośrednictwem rozszerzeń, dla podstawowych technologii internetowych, takich jak HTML, JavaScript i PHP, co czyni go dobrym rozwiązaniem do użytku XOOPS.

**Notepad++** to bezpłatny, sprawdzony konkurent w tej kategorii dla Windows z lojalnymi użytkownikami.

**Meld** nie jest edytorem, ale porównuje pliki tekstowe, pokazując różnice i pozwala na selektywne scalanie zmian i dokonywanie drobnych edycji. Jest bardzo przydatny podczas porównywania plików konfiguracji, szablonów motywu i oczywiście kodu PHP.

| Nazwa | Link | Licencja | Platforma |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Komercyjny | Każdy |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Każdy |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Każdy |

## Klient FTP

File Transfer Protocol (FTP) lub jego wariant jest używany do przenoszenia plików z jednego komputera na inny. Większość instalacji XOOPS będzie potrzebować klienta FTP, aby przenieść pliki pochodzące z dystrybucji XOOPS na system hosta, na którym witryna będzie wdrażana.

**FileZilla** to bezpłatny i potężny klient FTP dostępny dla większości platform. Konsystencja międzyplatformowa uczyniła go wyborem dla przykładów FTP w tej książce.

**PuTTY** to bezpłatny klient SSH, przydatny do dostępu powłoki do serwera, a także zapewniający możliwości transferu plików za pomocą SCP

**WinSCP** to klient FTP/SFTP/SCP dla systemów Windows.

| Nazwa | Link | Licencja | Platforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Każdy |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

Baza danych zawiera całą zawartość Twojej witryny, konfiguracje dostosowujące Twoją witrynę, informacje o użytkownikach witryny i wiele więcej. Ochronę i utrzymanie tych informacji może być łatwiej z dodatkowymi narzędziami zajmującymi się specjalnie bazą danych.

**phpMyAdmin** to najpopularniejsze narzędzie internetowe do pracy z bazami danych MySQL, w tym do wykonywania jednorazowych kopii zapasowych.

**BigDump** to zbawienie dla ograniczonych kont hostingowych, gdzie pomaga przywrócić duże zrzuty kopii zapasowych bazy danych, unikając limitów czasu i rozmiaru.

**srdb**, Search Replace DB dla XOOPS jest adaptacją XOOPS dla [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) od interconnect/it. Jest szczególnie przydatny do zmiany adresów URL i odnośników systemu plików w danych MySQL podczas przenoszenia witryny.

| Nazwa | Link | Licencja | Platforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Każdy |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Każdy |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Każdy |

## Stosy dla deweloperów

Niektóre platformy, takie jak Ubuntu, mają cały stos potrzebny do uruchomienia XOOPS wbudowany, podczas gdy inne wymagają dodatkowych.

**WAMP** i **Uniform Server Zero** to wszystko-w-jednym stosy dla Windows.

**XAMPP**, all-in-one stos od Apache Friends, jest dostępny dla wielu platform.

**bitnami** oferuje szeroką gamę wstępnie zbudowanych stosów aplikacji, w tym obrazy maszyn wirtualnych i kontenerów. Ich oferty mogą być cennym zasobem do szybkiego wypróbowania aplikacji (w tym XOOPS) lub różnych technologii internetowych. Mogą być odpowiednie zarówno do użytku produkcyjnego, jak i programistycznego.

**Docker** to platforma kontenerów aplikacji używana do tworzenia i uruchamiania kontenerów do implementacji niestandardowych środowisk.

**Devilbox** to łatwo konfigurowany stos programistyczny oparty na Docker. Oferuje szeroką gamę wersji dla wszystkich komponentów stosu i pozwala deweloperom testować w powtarzalnym i wspólnym środowisku.

| Nazwa | Link | Licencja | Platforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Wielorakie | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Wielorakie | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Wielorakie | Każdy |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Wielorakie | Każdy |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Wielorakie | Każdy |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Każdy |
