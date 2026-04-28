---
title: "Installations-Assistent"
description: "Schritt-für-Schritt-Anleitung zum XOOPS-Installations-Assistent - 15 Bildschirme erläutert."
---

Der XOOPS-Installations-Assistent führt Sie durch einen 15-Schritt-Prozess, der Ihre Datenbank konfiguriert, das Admin-Konto erstellt und Ihre Website für die erste Verwendung vorbereitet.

## Bevor Sie beginnen

- Sie haben [XOOPS auf Ihren Server hochgeladen](/xoops-docs/2.7/installation/ftp-upload/) oder eine lokale Umgebung eingerichtet
- Sie haben [die Anforderungen überprüft](/xoops-docs/2.7/installation/requirements/)
- Sie haben Ihre Datenbank-Anmeldeinformationen bereit

## Assistent-Schritte

| Schritt | Bildschirm | Was passiert |
|------|--------|--------------|
| 1 | [Sprachauswahl](./step-01/) | Wählen Sie die Installationssprache |
| 2 | [Willkommen](./step-02/) | Lizenzvereinbarung |
| 3 | [Konfigurationsüberprüfung](./step-03/) | PHP/Server-Umgebungsüberprüfung |
| 4 | [Pfadeinstellung](./step-04/) | Legen Sie Stammpfad und URL fest |
| 5 | [Datenbankverbindung](./step-05/) | Geben Sie Datenbankhost, Benutzer, Passwort ein |
| 6 | [Datenbankkonfiguration](./step-06/) | Legen Sie Datenbanknamen und Tabellenpräfix fest |
| 7 | [Konfiguration speichern](./step-07/) | Schreiben Sie mainfile.php |
| 8 | [Tabellenerstellung](./step-08/) | Erstellen Sie das Datenbankschema |
| 9 | [Anfängliche Einstellungen](./step-09/) | Website-Name, Admin-E-Mail |
| 10 | [Dateneinfügung](./step-10/) | Standard-Daten auffüllen |
| 11 | [Website-Konfiguration](./step-11/) | URL, Zeitzone, Sprache |
| 12 | [Design auswählen](./step-12/) | Wählen Sie ein Standard-Design |
| 13 | [Modul-Installation](./step-13/) | Installieren Sie gebündelte Module |
| 14 | [Willkommen](./step-14/) | Nachricht zur Installationsvervollständigung |
| 15 | [Bereinigung](./step-15/) | Entfernen Sie den Install-Ordner |

:::caution[Sicherheit]
Nach Abschluss des Assistenten **löschen oder benennen Sie den `install/`-Ordner um** - Schritt 15 führt Sie durch diesen Prozess. Wenn Sie ihn zugänglich lassen, ist dies ein Sicherheitsrisiko.
:::
