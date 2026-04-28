---
title: Schnelleinstieg
description: XOOPS 2.7 in unter 5 Minuten zum Laufen bringen.
---

## Anforderungen

| Komponente  | Minimum                 | Empfohlen         |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| Webserver | Apache 2.4 / Nginx 1.20 | Aktuellste Stable |

## Download

Laden Sie die neueste Version von [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases) herunter.

```bash
# Oder klonen Sie direkt
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Installationsschritte

1. **Dateien hochladen** zu Ihrem Webserver-Dokumentverzeichnis (z.B. `public_html/`).
2. **Eine MySQL-Datenbank erstellen** und einen Benutzer mit vollständigen Berechtigungen.
3. **Öffnen Sie Ihren Browser** und navigieren Sie zu Ihrer Domain — das XOOPS-Installationsprogramm startet automatisch.
4. **Folgen Sie dem 5-Schritte-Assistenten** — er konfiguriert Pfade, erstellt Tabellen und richtet Ihr Admin-Konto ein.
5. **Löschen Sie den Ordner `install/`** wenn dazu aufgefordert. Dies ist obligatorisch für die Sicherheit.

## Installation überprüfen

Nach der Einrichtung besuchen Sie:

- **Startseite:** `https://yourdomain.com/`
- **Admin-Panel:** `https://yourdomain.com/xoops_data/` *(Pfad, den Sie während der Installation gewählt haben)*

## Nächste Schritte

- [Vollständiger Installationsleitfaden](./installation/) — Serverkonfiguration, Berechtigungen, Fehlerbehebung
- [Modulleitfaden](./module-guide/introduction/) — erstellen Sie Ihr erstes Modul
- [Design-Leitfaden](./theme-guide/introduction/) — erstellen oder passen Sie ein Design an
