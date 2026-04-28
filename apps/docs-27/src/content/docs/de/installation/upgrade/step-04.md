---
title: "Nach dem Upgrade"
---

## System-Modul aktualisieren

Nachdem alle erforderlichen Patches angewendet wurden, wird das Auswählen von _Weiter_ alles einrichten, um das **system**-Modul zu aktualisieren. Dies ist ein sehr wichtiger Schritt und ist erforderlich, um das Upgrade ordnungsgemäß abzuschließen.

![XOOPS System-Modul aktualisieren](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Wählen Sie _Aktualisieren_, um die Aktualisierung des System-Moduls durchzuführen.

## Aktualisieren Sie andere von XOOPS bereitgestellte Module

XOOPS wird mit drei optionalen Modulen ausgeliefert - pm (Private Messaging), profile (Benutzerprofil) und protector (Protector). Sie sollten eine Aktualisierung auf alle diese Module durchführen, die installiert sind.

![XOOPS Andere Module aktualisieren](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Aktualisieren Sie andere Module

Es ist wahrscheinlich, dass es Updates für andere Module gibt, die es den Modulen ermöglichen, besser unter Ihrem jetzt aktualisierten XOOPS zu funktionieren. Sie sollten untersuchen und alle geeigneten Modul-Updates anwenden.

## Überprüfen Sie neue Cookie-Härtungseinstellungen

Das XOOPS 2.7.0-Upgrade fügt zwei neue Einstellungen hinzu, die kontrollieren, wie Session-Cookies ausgestellt werden:

* **`session_cookie_samesite`** — kontrolliert das SameSite-Cookie-Attribut. `Lax` ist für die meisten Websites eine sichere Standardeinstellung. Verwenden Sie `Strict` für maximalen Schutz, wenn Ihre Website nicht auf Cross-Origin-Navigation angewiesen ist. `None` ist nur geeignet, wenn Sie wissen, dass Sie dies benötigen.
* **`session_cookie_secure`** — wenn aktiviert, wird das Session-Cookie nur über HTTPS-Verbindungen gesendet. Schalten Sie dies ein, wenn Ihre Website über HTTPS läuft.

Sie können diese Einstellungen unter System-Optionen → Einstellungen → Allgemeine Einstellungen überprüfen.

## Überprüfen Sie benutzerdefinierte Designs

Wenn Ihre Website ein benutzerdefiniertes Design verwendet, gehen Sie die Vorderseite und den Admin-Bereich durch, um zu bestätigen, dass Seiten korrekt gerendert werden. Das Upgrade auf Smarty 4 kann benutzerdefinierte Templates beeinflussen, auch wenn der Preflight-Scan bestanden hat. Wenn Sie Rendering-Probleme sehen, überprüfen Sie erneut [Troubleshooting](ustep-03.md).

## Bereinigen Sie Installations- und Upgrade-Dateien

Aus Sicherheitsgründen entfernen Sie diese Verzeichnisse aus Ihrem Web-Root, sobald das Upgrade bestätigt wurde, dass es funktioniert:

* `upgrade/` — das Upgrade-Workflow-Verzeichnis
* `install/` — falls vorhanden, entweder als `install/` oder als umbenanntes `installremove*`-Verzeichnis

Das Belassen dieser Dateien setzt die Upgrade- und Installationsskripte jedem aus, der Ihre Website erreichen kann.

## Öffnen Sie Ihre Website

Wenn Sie den Rat befolgten, _Ihre Website auszuschalten_, sollten Sie sie wieder einschalten, sobald Sie festgestellt haben, dass sie korrekt funktioniert.

