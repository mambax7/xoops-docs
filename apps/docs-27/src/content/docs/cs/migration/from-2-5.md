---
title: Upgrade ze XOOPS 2.5 na 2.7
description: Podrobný průvodce bezpečným upgradem vaší instalace XOOPS z 2.5.x na 2.7.x.
---

:::pozor[Nejdříve zálohujte]
Před upgradem vždy zálohujte databázi a soubory. Žádné výjimky.
:::

## Co se změnilo v 2.7

- **Vyžadován PHP 8.2+** — PHP 7.x již není podporován
- **Závislosti spravované Composer** — Základní knihovny spravované prostřednictvím `composer.json`
- **Automatické načítání PSR-4** — Třídy modulů mohou používat jmenné prostory
- **Vylepšený XOOPSObject** — Nová bezpečnost typu `getVar()`, zastaralá `obj2Array()`
- **Bootstrap 5 admin** – Administrační panel byl přestavěn pomocí Bootstrap 5

## Kontrolní seznam před upgradem

- [ ] PHP 8.2+ k dispozici na vašem serveru
- [ ] Úplná záloha databáze (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Úplná záloha souboru vaší instalace
- [ ] Seznam nainstalovaných modulů a jejich verzí
- [ ] Vlastní motiv zálohovaný samostatně

## Kroky upgradu

### 1. Přepněte web do režimu údržby

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Stáhněte si XOOPS 2.7

```bash
wget https://github.com/XOOPS/XOOPSCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Nahraďte základní soubory

Nahrajte nové soubory, **kromě**:
- `uploads/` — vaše nahrané soubory
- `xoops_data/` — vaše konfigurace
- `modules/` — vaše nainstalované moduly
- `themes/` — vaše témata
- `mainfile.php` — konfigurace vašeho webu

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Spusťte skript aktualizace

V prohlížeči přejděte na `https://yourdomain.com/upgrade/`.
Průvodce upgradem použije migraci databáze.

### 5. Aktualizace modulů

Moduly XOOPS 2.7 musí být kompatibilní se PHP 8.2.
Aktualizované verze vyhledejte v [Module Ecosystem](/xoops-docs/2.7/module-guide/introduction/).

V Admin → Modules klikněte na **Update** pro každý nainstalovaný modul.

### 6. Odstraňte režim údržby a otestujte

Odstraňte vedení `XOOPS_MAINTENANCE` z `mainfile.php` a
ověřte správné načtení všech stránek.

## Běžné problémy

**Chyby „Třída nenalezena“ po upgradu**
- Spusťte `composer dump-autoload` v kořenovém adresáři XOOPS
- Vymažte adresář `xoops_data/caches/`

**Modul se po aktualizaci rozbil**
- Zkontrolujte vydání modulu GitHub pro verzi kompatibilní s 2.7
- Modul může vyžadovat změny kódu pro PHP 8.2 (zastaralé funkce, typované vlastnosti)

**Administrátorský panel CSS nefunkční**
- Vymažte mezipaměť prohlížeče
- Ujistěte se, že `xoops_lib/` byl během nahrávání souboru zcela vyměněn