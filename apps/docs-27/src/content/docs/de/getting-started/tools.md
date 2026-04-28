---
title: "Werkzeuge des Handwerks"
---

Es gibt viele Dinge, die notwendig sind, um eine XOOPS-Website anzupassen und zu warten, die außerhalb von XOOPS stattfinden müssen oder dort leichter durchgeführt werden können.

Dies ist eine Liste von Tooltypen, die verfügbar sein könnten, zusammen mit Vorschlägen für spezifische Tools, die XOOPS-Webmaster für nützlich befunden haben.

## Editoren

Editoren sind eine sehr persönliche Wahl, und Menschen können sich recht leidenschaftlich für ihren Favoriten einsetzen. Wir werden nur wenige der vielen Möglichkeiten darstellen.

Für die XOOPS-Verwendung benötigen Sie einen Editor, um einige Konfigurationsoptionen anzupassen und ein Design für Ihre Website anzupassen. Für diese Zwecke kann es sehr hilfreich sein, einen Editor zu verwenden, der gleichzeitig mit mehreren Dateien arbeitet, über mehrere Dateien hinweg suchen und ersetzen kann und Syntaxhervorhebung bietet. Sie können einen sehr einfachen, funktionslosen Editor verwenden, werden aber viel schwerer arbeiten müssen, um einige Aufgaben zu erledigen.

**PhpStorm** von _JetBrains_ ist eine IDE (integrierte Entwicklungsumgebung), die speziell auf PHP-Webentwicklung zugeschnitten ist. _JetBrains_ hat XOOPS sehr hilfreich gesponsert, und seine Produkte sind Favoriten vieler Entwickler. Es ist ein kommerzielles Produkt und könnte für einige neue Webmaster kostspielig sein, aber die Zeit, die es sparen kann, macht es für erfahrene Entwickler attraktiv.

**Visual Studio Code** ist ein kostenloser, plattformübergreifender Quellcode-Editor von Microsoft. Es hat Unterstützung, entweder integriert oder durch Erweiterungen, für grundlegende Webtechnologien wie HTML, JavaScript und PHP, was es zu einer guten Wahl für die XOOPS-Verwendung macht.

**Notepad++** ist ein kostenloser, bewährter Kandidat in dieser Kategorie für Windows mit loyalen Benutzern.

**Meld** ist kein Editor, sondern vergleicht Textdateien und zeigt Unterschiede an, und ermöglicht selektives Zusammenführen von Änderungen und kleine Bearbeitungen. Es ist sehr nützlich beim Vergleich von Konfigurationsdateien, Design-Vorlagen und natürlich PHP-Code.

| Name | Link | License | Platform |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Commercial | Any |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Any |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Any |

## FTP-Client

File Transfer Protocol (FTP) oder eine Variation davon wird verwendet, um Dateien von einem Computer zu einem anderen zu verschieben. Die meisten XOOPS-Installationen benötigen einen FTP-Client, um Dateien von der XOOPS-Verteilung auf ein Host-System zu verschieben, auf dem die Site bereitgestellt wird.

**FileZilla** ist ein kostenloser und leistungsstarker FTP-Client, der auf den meisten Plattformen verfügbar ist. Die plattformübergreifende Konsistenz machte es zur Wahl für die FTP-Beispiele in diesem Buch.

**PuTTY** ist ein kostenloser SSH-Client, nützlich für Shell-Zugriff auf einen Server sowie für Dateiübertragungsfunktionen mit SCP

**WinSCP** ist ein FTP/SFTP/SCP-Client für Windows-Systeme.

| Name | Link | License | Platform |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Any |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

Die Datenbank enthält alle Inhalte Ihrer Website, die Konfigurationen, die Ihre Website anpassen, die Informationen über die Benutzer Ihrer Website und vieles mehr. Der Schutz und die Verwaltung dieser Informationen können mit einigen zusätzlichen Tools, die speziell mit der Datenbank umgehen, einfacher sein.

**phpMyAdmin** ist das beliebteste webbasierte Tool für die Arbeit mit MySQL-Datenbanken, einschließlich einmalige Sicherungen.

**BigDump** ist ein Segen für begrenzte Hosting-Konten, wo es bei der Wiederherstellung großer Datenbank-Sicherungsdumps hilft und dabei Timeout- und Größenbeschränkungen vermeidet.

**srdb**, Search Replace DB for XOOPS ist eine XOOPS-Anpassung von [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) von interconnect/it. Es ist besonders nützlich, um URLs und Dateisystemreferenzen in MySQL-Daten zu ändern, wenn Sie eine Website verschieben.

| Name | Link | License | Platform |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Any |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Any |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Any |

## Entwickler-Stacks

Einige Plattformen wie Ubuntu haben den gesamten Stack, der zum Ausführen von XOOPS erforderlich ist, bereits integriert, während andere einige Ergänzungen benötigen.

**WAMP** und **Uniform Server Zero** sind All-in-One-Stacks für Windows.

**XAMPP**, ein All-in-One-Stack von Apache Friends, ist für mehrere Plattformen verfügbar.

**bitnami** bietet eine große Auswahl an vordefinierten Application Stacks, einschließlich Virtual-Machine- und Container-Images. Ihre Angebote können eine wertvolle Ressource sein, um schnell Anwendungen (einschließlich XOOPS) oder verschiedene Web-Technologien auszuprobieren. Sie können sowohl für Produktions- als auch für Entwicklungszwecke geeignet sein.

**Docker** ist eine Application Container Plattform, die zum Erstellen und Ausführen von Containern verwendet wird, um benutzerdefinierte Umgebungen zu implementieren. 

**Devilbox** ist ein leicht zu konfigurierender Docker-basierter Entwicklungs-Stack. Es bietet eine große Auswahl an Versionen für alle Stack-Komponenten und ermöglicht es Entwicklern, in einer reproduzierbaren und gemeinsamen Umgebung zu testen. 

| Name | Link | License | Platform |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Multiple | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Multiple | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Multiple | Any |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Multiple | Any |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Multiple | Any |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Any |
