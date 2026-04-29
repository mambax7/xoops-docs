---
title: Opgradering fra XOOPS 2.5 til 2.7
description: Trin-for-trin guide til sikker opgradering af din XOOPS installation fra 2.5.x til 2.7.x.
---

:::forsigtig[Sikkerhedskopier først]
Sikkerhedskopier altid din database og dine filer, før du opgraderer. Ingen undtagelser.
:::

## Hvad er ændret i 2.7

- **PHP 8.2+ påkrævet** — PHP 7.x understøttes ikke længere
- **Komponiststyrede afhængigheder** — Kernebiblioteker administreret via `composer.json`
- **PSR-4 autoloading** — Modulklasser kan bruge navnerum
- **Forbedret XoopsObject** — Ny `getVar()` type sikkerhed, forældet `obj2Array()`
- **Bootstrap 5 admin** — Admin panel genopbygget med Bootstrap 5

## Tjekliste til forudgående opgradering

- [ ] PHP 8.2+ tilgængelig på din server
- [ ] Fuld database backup (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Fuld sikkerhedskopi af din installation
- [ ] Liste over installerede moduler og deres versioner
- [ ] Brugerdefineret tema sikkerhedskopieret separat

## Opgraderingstrin

### 1. Sæt webstedet i vedligeholdelsestilstand

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Download XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Erstat kernefiler

Upload de nye filer, **eksklusive**:
- `uploads/` — dine uploadede filer
- `xoops_data/` — din konfiguration
- `modules/` — dine installerede moduler
- `themes/` — dine temaer
- `mainfile.php` — din webstedskonfiguration

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Kør opgraderingsscriptet

Naviger til `https://yourdomain.com/upgrade/` i din browser.
Opgraderingsguiden vil anvende databasemigreringer.

### 5. Opdater moduler

XOOPS 2.7-moduler skal være PHP 8.2-kompatible.
Tjek [Module Ecosystem](/xoops-docs/2.7/module-guide/introduction/) for opdaterede versioner.

I Admin → Moduler skal du klikke på **Opdater** for hvert installeret modul.

### 6. Fjern vedligeholdelsestilstand og test

Fjern `XOOPS_MAINTENANCE`-linjen fra `mainfile.php` og
kontrollere, at alle sider indlæses korrekt.

## Almindelige problemer

**"Klasse ikke fundet" fejl efter opgradering**
- Kør `composer dump-autoload` i XOOPS-roden
- Ryd `xoops_data/caches/`-biblioteket

**Modul ødelagt efter opdatering**
- Tjek modulets GitHub-udgivelser for en 2.7-kompatibel version
- Modulet kan have brug for kodeændringer for PHP 8.2 (forældede funktioner, indtastede egenskaber)

**Admin panel CSS brudt**
- Ryd din browsers cache
- Sørg for, at `xoops_lib/` blev fuldstændig udskiftet under filoverførslen
