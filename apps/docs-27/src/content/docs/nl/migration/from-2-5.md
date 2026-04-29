---
title: Upgraden van XOOPS 2.5 naar 2.7
description: Stapsgewijze handleiding om uw XOOPS-installatie veilig te upgraden van 2.5.x naar 2.7.x.
---
:::let op[Maak eerst een back-up]
Maak altijd een back-up van uw database en bestanden voordat u een upgrade uitvoert. Geen uitzonderingen.
:::

## Wat is er veranderd in 2.7

- **PHP 8.2+ vereist** — PHP 7.x wordt niet langer ondersteund
- **Door de componist beheerde afhankelijkheden** — Kernbibliotheken beheerd via `composer.json`
- **PSR-4 automatisch laden** — Moduleklassen kunnen naamruimten gebruiken
- **Verbeterd XoopsObject** — Nieuwe veiligheid van het type `getVar()`, verouderd `obj2Array()`
- **Bootstrap 5 admin** — Beheerderspaneel opnieuw opgebouwd met Bootstrap 5

## Controlelijst vóór de upgrade

- [ ] PHP 8.2+ beschikbaar op uw server
- [ ] Volledige databaseback-up (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Volledige bestandsback-up van uw installatie
- [ ] Lijst met geïnstalleerde modules en hun versies
- [ ] Aangepast thema, afzonderlijk geback-upt

## Upgradestappen

### 1. Zet de site in onderhoudsmodus

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Download XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Vervang kernbestanden

Upload de nieuwe bestanden, **exclusief**:
- `uploads/` — uw geüploade bestanden
- `xoops_data/` — uw configuratie
- `modules/` — uw geïnstalleerde modules
- `themes/` — uw thema's
- `mainfile.php` — uw siteconfiguratie

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Voer het upgradescript uit

Navigeer naar `https://yourdomain.com/upgrade/` in uw browser.
De upgradewizard zal databasemigraties toepassen.

### 5. Update modules

XOOPS 2.7-modules moeten compatibel zijn met PHP 8.2.
Controleer het [Module Ecosystem](/xoops-docs/2.7/module-guide/introduction/) voor bijgewerkte versies.

In Beheer → Modules klikt u op **Update** voor elke geïnstalleerde module.

### 6. Onderhoudsmodus verwijderen en testen

Verwijder de `XOOPS_MAINTENANCE`-regel uit `mainfile.php` en
controleer of alle pagina's correct worden geladen.

## Veelvoorkomende problemen

**'Klasse niet gevonden'-fouten na upgrade**
- Voer `composer dump-autoload` uit in de XOOPS-root
- Wis de map `xoops_data/caches/`

**Module kapot na update**
- Controleer de GitHub-releases van de module voor een 2.7-compatibele versie
- De module heeft mogelijk codewijzigingen nodig voor PHP 8.2 (verouderde functies, getypte eigenschappen)

**Beheerderspaneel CSS defect**
- Wis uw browsercache
- Zorg ervoor dat `xoops_lib/` volledig is vervangen tijdens het uploaden van het bestand