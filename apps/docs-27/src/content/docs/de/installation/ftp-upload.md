---
title: "Anhang 2: XOOPS via FTP hochladen"
---

Dieser Anhang führt Sie durch die Bereitstellung von XOOPS 2.7.0 auf einem Remote-Host mit FTP oder SFTP. Jedes Kontrollpanel (cPanel, Plesk, DirectAdmin usw.) stellt die gleichen zugrunde liegenden Schritte dar.

## 1. Datenbank vorbereiten

Über das Kontrollpanel Ihres Hosters:

1. Erstellen Sie eine neue MySQL-Datenbank für XOOPS.
2. Erstellen Sie einen Datenbankbenutzer mit einem starken Passwort.
3. Erteilen Sie dem Benutzer vollständige Berechtigungen für die neu erstellte Datenbank.
4. Notieren Sie sich den Datenbanknamen, den Benutzernamen, das Passwort und den Host — Sie werden diese in das XOOPS-Installationsprogramm eingeben.

> **Tipp**
>
> Moderne Kontrollpanels generieren für Sie starke Passwörter. Da die Anwendung das Passwort in `xoops_data/data/secure.php` speichert, müssen Sie es nicht häufig eingeben — bevorzugen Sie einen langen, zufällig generierten Wert.

## 2. Admin-Postfach erstellen

Erstellen Sie ein E-Mail-Postfach, das Website-Verwaltungsbenachrichtigungen erhält. Das XOOPS-Installationsprogramm fragt während der Webmaster-Kontoeinrichtung nach dieser Adresse und validiert sie mit `FILTER_VALIDATE_EMAIL`.

## 3. Dateien hochladen

XOOPS 2.7.0 wird mit seinen Abhängigkeiten von Drittanbietern, die in `xoops_lib/vendor/` vorinstalliert sind (Composer-Pakete, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF und mehr). Dies macht `xoops_lib/` erheblich größer als in 2.5.x — erwarten Sie Dutzende von Megabytes.

**Überspringen Sie selektiv keine Dateien in `xoops_lib/vendor/`.** Das Überspringen von Dateien in der Composer-Vendor-Struktur bricht das automatische Laden und die Installation fehlschlagen.

Upload-Struktur (angenommen `public_html` ist das Document Root):

1. Laden Sie `xoops_data/` und `xoops_lib/` **neben** `public_html` hoch, nicht darin. Das Platzieren außerhalb des Web-Root ist die empfohlene Sicherheitsmethode für 2.7.0.

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Laden Sie die verbleibenden Inhalte des Verbreitungsverzeichnisses `htdocs/` in `public_html/` hoch.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Falls Ihr Host keine Verzeichnisse außerhalb des Document Root zulässt**
>
> Laden Sie `xoops_data/` und `xoops_lib/` **in** `public_html/` hoch und **benennen Sie sie in nicht offensichtliche Namen um** (zum Beispiel `xdata_8f3k2/` und `xlib_7h2m1/`). Sie werden die umbenannten Pfade in das Installationsprogramm eingeben, wenn es nach dem XOOPS Data Path und XOOPS Library Path fragt.

## 4. Beschreibbare Verzeichnisse schreibbar machen

Machen Sie über das CHMOD-Dialogfeld des FTP-Clients (oder SSH) die in Kapitel 2 aufgeführten Verzeichnisse durch den Webserver schreibbar. Bei den meisten gemeinsamen Hosts sind `0775` in Verzeichnissen und `0664` in `mainfile.php` ausreichend. `0777` ist während der Installation akzeptabel, wenn Ihr Host PHP unter einem anderen Benutzer als dem FTP-Benutzer ausführt, aber reduzieren Sie die Berechtigungen nach Abschluss der Installation.

## 5. Installer starten

Weisen Sie Ihren Browser auf die öffentliche URL der Website hin. Wenn alle Dateien vorhanden sind, startet der XOOPS-Installationsassistent und Sie können den Rest dieser Anleitung ab [Kapitel 2](chapter-2-introduction.md) befolgen.
