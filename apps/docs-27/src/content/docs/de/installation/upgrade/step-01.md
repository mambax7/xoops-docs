---
title: "Vorbereitung zum Upgrade"
---

## Seite ausschalten

Bevor Sie mit dem XOOPS-Upgrade-Prozess beginnen, sollten Sie das Element "Ihre Website ausschalten?" in den Einstellungen -&gt; Systemoptionen -&gt; Allgemeine Einstellungen im Verwaltungsmenü auf _Ja_ setzen.

Dies verhindert, dass Benutzer während des Upgrades auf eine fehlerhafte Website stoßen. Es minimiert auch den Ressourcenmangel, um ein reibungsloseres Upgrade zu gewährleisten.

Anstelle von Fehlern und einer fehlerhaften Website sehen Ihre Besucher etwa folgendes:

![Website auf Mobilgeräten geschlossen](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Sicherung

Es ist eine gute Idee, den XOOPS-Verwaltungsbereich _Wartung_ zu verwenden, um _Cache-Ordner löschen_ für alle Caches vor der Vollsicherung Ihrer Website-Dateien durchzuführen. Mit der Website offline wird auch das Verwenden von _Sessions-Tabelle leeren_ empfohlen, damit veraltete Sessions bei Bedarf einer Wiederherstellung nicht Teil davon sind.

### Dateien

Die Datei-Sicherung kann mit FTP erfolgen, indem alle Dateien auf Ihren lokalen Computer kopiert werden. Wenn Sie direkten Shell-Zugriff auf den Server haben, kann es _viel_ schneller sein, dort eine Kopie (oder eine Archivkopie) zu erstellen.

### Datenbank

Zur Sicherung einer Datenbank können Sie die integrierten Funktionen im XOOPS-Verwaltungsbereich _Wartung_ verwenden. Sie können auch die _Export_-Funktionen in _phpMyAdmin_ verwenden, falls verfügbar. Wenn Sie Shell-Zugriff haben, können Sie den _mysql_-Befehl verwenden, um Ihre Datenbank zu dumpen.

Die Fähigkeit, Ihre Datenbank zu sichern und _wiederherzustellen_, ist eine wichtige Webmaster-Fähigkeit. Es gibt viele Online-Ressourcen, die Sie zum Erlernen dieser Operationen verwenden können, wie z.B. [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Neue Dateien auf die Website kopieren

Das Kopieren der neuen Dateien auf Ihre Website ist praktisch identisch mit dem [Vorbereitung](../../installation/preparations/) Schritt während der Installation. Sie sollten die Verzeichnisse _xoops_data_ und _xoops_lib_ dorthin kopieren, wo diese während der Installation verlegt wurden. Kopieren Sie dann den Rest des Inhalts des _htdocs_-Verzeichnisses der Distribution (mit einigen Ausnahmen, die im nächsten Abschnitt behandelt werden) über die bestehenden Dateien und Verzeichnisse in Ihrem Web-Root.

In XOOPS 2.7.0 werden beim Kopieren einer neuen Distribution auf eine bestehende Website **bestehende Konfigurationsdateien nicht überschrieben**, wie `mainfile.php` oder `xoops_data/data/secure.php`. Dies ist eine willkommene Änderung gegenüber früheren Versionen, aber Sie sollten trotzdem eine vollständige Sicherung erstellen, bevor Sie beginnen.

Kopieren Sie das gesamte _upgrade_-Verzeichnis aus der Distribution in Ihr Web-Root, und erstellen Sie dort ein _upgrade_-Verzeichnis.

## Führen Sie den Smarty 4 Preflight-Check durch

Bevor Sie den Haupt-`/upgrade/`-Workflow starten, müssen Sie den Preflight-Scanner ausführen, der im `upgrade/`-Verzeichnis ausgeliefert wird. Er überprüft Ihre bestehenden Designs und Modulvorlagen auf Smarty 4-Kompatibilitätsprobleme und kann viele davon automatisch reparieren.

1. Zeigen Sie Ihren Browser auf _your-site-url_/upgrade/preflight.php
2. Melden Sie sich mit einem Administrator-Konto an
3. Führen Sie den Scan durch und überprüfen Sie den Bericht
4. Wenden Sie alle angebotenen automatischen Reparaturen an oder beheben Sie gekennzeichnete Templates manuell
5. Führen Sie den Scan erneut aus, bis er sauber ist
6. Nur dann zum Hauptupgrade weitergehen

Siehe die [Preflight-Check](preflight.md) Seite für eine vollständige Anleitung.

### Dinge, die Sie möglicherweise nicht kopieren möchten

Sie sollten das _install_-Verzeichnis nicht erneut in ein funktionierendes XOOPS-System kopieren. Das Belassen des Install-Ordners in Ihrer XOOPS-Installation setzt Ihr System potenziellen Sicherheitsrisiken aus. Das Installationsprogramm benennt es zufällig um, aber Sie sollten es löschen und sicherstellen, dass Sie kein anderes kopieren.

Es gibt einige Dateien, die Sie möglicherweise bearbeitet haben, um Ihre Website anzupassen, und diese möchten Sie bewahren. Hier ist eine Liste häufiger Anpassungen.

* _xoops_data/configs/xoopsconfig.php_, falls diese seit der Installation der Website geändert wurde
* alle Verzeichnisse in _themes_, wenn diese für Ihre Website angepasst wurden. In diesem Fall möchten Sie möglicherweise Dateien vergleichen, um nützliche Updates zu identifizieren.
* alle Dateien in _class/captcha/_, die mit "config" beginnen, falls diese seit der Installation der Website geändert wurden
* alle Anpassungen in _class/textsanitizer_
* alle Anpassungen in _class/xoopseditor_

Wenn Sie nach dem Upgrade feststellen, dass etwas versehentlich überschrieben wurde, geraten Sie nicht in Panik - deshalb haben Sie mit einer vollständigen Sicherung begonnen. _(Sie haben doch eine Sicherung erstellt, nicht wahr?)_

## Überprüfen Sie mainfile.php (Upgrade von Pre-2.5 XOOPS)

Dieser Schritt gilt nur, wenn Sie ein Upgrade von einer alten XOOPS-Version (2.3 oder älter) durchführen. Wenn Sie ein Upgrade von XOOPS 2.5.x durchführen, können Sie diesen Abschnitt überspringen.

Ältere Versionen von XOOPS erforderten einige manuelle Änderungen in `mainfile.php`, um das Protector-Modul zu aktivieren. In Ihrem Web-Root sollte eine Datei namens `mainfile.php` vorhanden sein. Öffnen Sie diese Datei in Ihrem Editor und suchen Sie nach diesen Zeilen:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

und

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Entfernen Sie diese Zeilen, wenn Sie sie finden, und speichern Sie die Datei, bevor Sie fortfahren.

