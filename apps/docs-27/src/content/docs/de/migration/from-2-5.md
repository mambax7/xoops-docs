---
title: Upgrade von XOOPS 2.5 auf 2.7
description: Schritt-für-Schritt-Anleitung zum sicheren Upgrade Ihrer XOOPS-Installation von 2.5.x zu 2.7.x.
---

:::caution[Zuerst sichern]
Sichern Sie immer Ihre Datenbank und Dateien vor dem Upgrade. Keine Ausnahmen.
:::

## Was hat sich in 2.7 geändert

- **PHP 8.2+ erforderlich** — PHP 7.x wird nicht mehr unterstützt
- **Composer-verwaltete Abhängigkeiten** — Core-Bibliotheken verwaltet via `composer.json`
- **PSR-4-Autoloading** — Modulklassen können Namensräume verwenden
- **Verbessertes XoopsObject** — Neue `getVar()`-Typsicherheit, veraltete `obj2Array()`
- **Bootstrap 5 Admin** — Admin-Panel mit Bootstrap 5 umgestaltet

## Checkliste vor dem Upgrade

- [ ] PHP 8.2+ auf Ihrem Server verfügbar
- [ ] Vollständige Datenbanksicherung (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Vollständige Datensicherung Ihrer Installation
- [ ] Liste der installierten Module und deren Versionen
- [ ] Benutzerdefiniertes Design separat gesichert

## Upgrade-Schritte

### 1. Website in Wartungsmodus versetzen

```php
// mainfile.php — temporär hinzufügen
define('XOOPS_MAINTENANCE', true);
```

### 2. XOOPS 2.7 herunterladen

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Core-Dateien ersetzen

Laden Sie die neuen Dateien hoch, **ausgenommen**:
- `uploads/` — Ihre hochgeladenen Dateien
- `xoops_data/` — Ihre Konfiguration
- `modules/` — Ihre installierten Module
- `themes/` — Ihre Designs
- `mainfile.php` — Ihre Website-Konfiguration

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Upgrade-Skript ausführen

Navigieren Sie in Ihrem Browser zu `https://yourdomain.com/upgrade/`.
Der Upgrade-Assistent wendet Datenbankmigrations an.

### 5. Module aktualisieren

XOOPS 2.7-Module müssen mit PHP 8.2 kompatibel sein.
Überprüfen Sie das [Modul-Ökosystem](/xoops-docs/2.7/module-guide/introduction/) auf aktualisierte Versionen.

Klicken Sie im Admin → Module auf **Aktualisieren** für jedes installierte Modul.

### 6. Wartungsmodus entfernen und testen

Entfernen Sie die Zeile `XOOPS_MAINTENANCE` aus `mainfile.php` und
vergewissern Sie sich, dass alle Seiten korrekt geladen werden.

## Häufige Probleme

**"Class not found"-Fehler nach dem Upgrade**
- Führen Sie `composer dump-autoload` im XOOPS-Root aus
- Löschen Sie das Verzeichnis `xoops_data/caches/`

**Modul beschädigt nach der Aktualisierung**
- Überprüfen Sie die GitHub-Versionen des Moduls für eine 2.7-kompatible Version
- Das Modul benötigt möglicherweise Codeänderungen für PHP 8.2 (veraltete Funktionen, typisierte Eigenschaften)

**Admin-Panel CSS beschädigt**
- Leeren Sie Ihren Browser-Cache
- Stellen Sie sicher, dass `xoops_lib/` während des Datei-Uploads vollständig ersetzt wurde
