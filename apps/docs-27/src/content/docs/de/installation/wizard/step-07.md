---
title: "Konfiguration speichern"
---

Diese Seite zeigt die Ergebnisse des Speicherns der Konfigurationsinformationen an, die Sie bis zu diesem Punkt eingegeben haben.

Wählen Sie nach der Überprüfung und Korrektur etwaiger Probleme die Schaltfläche "Weiter", um fortzufahren.

## Bei Erfolg

Der Bereich _Systemkonfiguration speichern_ zeigt die gespeicherten Informationen an. Die Einstellungen werden in einer von zwei Dateien gespeichert. Eine Datei ist _mainfile.php_ im Web-Root-Verzeichnis. Die andere ist _data/secure.php_ im Verzeichnis _xoops_data_.

![XOOPS Installer Konfiguration speichern](/xoops-docs/2.7/img/installation/installer-07.png)

Beide Dateien werden aus Vorlagendateien erzeugt, die mit XOOPS 2.7.0 ausgeliefert werden:

* `mainfile.php` wird aus `mainfile.dist.php` im Web-Root-Verzeichnis erzeugt.
* `xoops_data/data/secure.php` wird aus `xoops_data/data/secure.dist.php` erzeugt.

Zusätzlich zu den Pfaden und URLs, die Sie eingegeben haben, enthält `mainfile.php` jetzt mehrere Konstanten, die in XOOPS 2.7.0 neu sind:

* `XOOPS_TRUST_PATH` — wird als abwärtskompatibles Alias von `XOOPS_PATH` beibehalten; Sie müssen es nicht separat konfigurieren.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — standardmäßig auf `true` gesetzt; verwendet die Public Suffix List zur Bestimmung der richtigen Cookie-Domain.
* `XOOPS_DB_LEGACY_LOG` — standardmäßig auf `false` gesetzt; setzen Sie es auf `true` in der Entwicklung, um die Nutzung veralteter Datenbank-APIs zu protokollieren.
* `XOOPS_DEBUG` — standardmäßig auf `false` gesetzt; setzen Sie es auf `true` in der Entwicklung, um zusätzliche Fehlerberichte zu aktivieren.

Sie müssen diese während der Installation nicht manuell bearbeiten — die Standardwerte sind für eine Produktionswebsite geeignet. Sie werden hier erwähnt, damit Sie wissen, worauf Sie achten müssen, wenn Sie `mainfile.php` später öffnen.

## Fehler

Wenn XOOPS beim Schreiben der Konfigurationsdateien Fehler erkennt, werden Meldungen angezeigt, die anzeigen, was nicht stimmt.

![XOOPS Installer Konfiguration speichern Fehler](/xoops-docs/2.7/img/installation/installer-07-errors.png)

In vielen Fällen ist die Quelle von Fehlern eine Standardinstallation eines Debian-basierten Systems, das mod_php in Apache verwendet. Die meisten Hosting-Provider haben Konfigurationen, die diese Probleme nicht haben.

### Probleme mit Gruppenberechtigung

Der PHP-Prozess wird mit den Berechtigungen eines bestimmten Benutzers ausgeführt. Dateien sind auch Eigentum eines bestimmten Benutzers. Wenn diese zwei nicht der gleiche Benutzer sind, können Gruppenberechtigung verwendet werden, um dem PHP-Prozess die Freigabe von Dateien mit Ihrem Benutzerkonto zu ermöglichen. Dies bedeutet normalerweise, dass Sie die Gruppe der Dateien und Verzeichnisse ändern müssen, in die XOOPS schreiben muss.

Für die oben erwähnte Standardkonfiguration bedeutet dies, dass die Gruppe _www-data_ für die Dateien und Verzeichnisse angegeben werden muss und diese Dateien und Verzeichnisse gruppenschreibbar sein müssen.

Sie sollten Ihre Konfiguration sorgfältig überprüfen und sorgfältig wählen, wie Sie diese Probleme für eine im offenen Internet verfügbare Box lösen können.

Beispielbefehle könnten sein:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Kann mainfile.php nicht erstellen

Bei Unix-ähnlichen Systemen hängt die Berechtigung zum Erstellen einer neuen Datei von den Berechtigungen des übergeordneten Ordners ab. In einigen Fällen ist diese Berechtigung nicht verfügbar, und deren Vergabe kann ein Sicherheitsrisiko darstellen.

Wenn Sie ein Problem mit der Konfiguration haben, finden Sie eine Dummy-Datei _mainfile.php_ im Verzeichnis _extras_ in der XOOPS-Verteilung. Kopieren Sie diese Datei in den Web-Root-Verzeichnis und setzen Sie die Berechtigungen für die Datei:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux-Umgebungen

SELinux-Sicherheitskontexte können eine Quelle für Probleme sein. Falls dies relevant ist, lesen Sie bitte [Spezielle Themen](../specialtopics.md) für weitere Informationen.
