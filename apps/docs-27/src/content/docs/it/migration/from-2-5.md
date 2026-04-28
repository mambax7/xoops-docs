---
title: Aggiornamento da XOOPS 2.5 a 2.7
description: Guida passo dopo passo per aggiornare in sicurezza la tua installazione di XOOPS da 2.5.x a 2.7.x.
---

:::caution[Esegui il backup per primo]
Esegui sempre il backup del tuo database e dei tuoi file prima di aggiornare. Nessuna eccezione.
:::

## Cosa è Cambiato in 2.7

- **PHP 8.2+ richiesto** — PHP 7.x non è più supportato
- **Dipendenze gestite da Composer** — Le librerie principali sono gestite tramite `composer.json`
- **Autoloading PSR-4** — Le classi dei moduli possono usare i namespace
- **XoopsObject migliorato** — Nuovo type safety `getVar()`, deprecato `obj2Array()`
- **Admin Bootstrap 5** — Pannello admin ricostruito con Bootstrap 5

## Lista di Controllo Pre-Aggiornamento

- [ ] PHP 8.2+ disponibile sul tuo server
- [ ] Backup completo del database (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Backup completo della tua installazione
- [ ] Elenco dei moduli installati e delle loro versioni
- [ ] Tema personalizzato sottoposto a backup separatamente

## Passaggi di Aggiornamento

### 1. Metti il sito in modalità di manutenzione

```php
// mainfile.php — aggiungi temporaneamente
define('XOOPS_MAINTENANCE', true);
```

### 2. Scarica XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Sostituisci i file principali

Carica i nuovi file, **escludendo**:
- `uploads/` — i tuoi file caricati
- `xoops_data/` — la tua configurazione
- `modules/` — i tuoi moduli installati
- `themes/` — i tuoi temi
- `mainfile.php` — la configurazione del tuo sito

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Esegui lo script di aggiornamento

Naviga verso `https://yourdomain.com/upgrade/` nel tuo browser.
La procedura guidata di aggiornamento applicherà le migrazioni del database.

### 5. Aggiorna i moduli

I moduli XOOPS 2.7 devono essere compatibili con PHP 8.2.
Controlla l'[Ecosistema di Moduli](/xoops-docs/2.7/module-guide/introduction/) per le versioni aggiornate.

In Admin → Modules, clicca **Update** per ogni modulo installato.

### 6. Rimuovi la modalità di manutenzione e test

Rimuovi la riga `XOOPS_MAINTENANCE` da `mainfile.php` e
verifica che tutte le pagine si carichino correttamente.

## Problemi Comuni

**Errori "Class not found" dopo l'aggiornamento**
- Esegui `composer dump-autoload` nella root di XOOPS
- Svuota la directory `xoops_data/caches/`

**Modulo rotto dopo l'aggiornamento**
- Controlla le versioni di GitHub del modulo per una versione compatibile con 2.7
- Il modulo potrebbe aver bisogno di modifiche al codice per PHP 8.2 (funzioni deprecate, proprietà tipizzate)

**CSS del pannello admin rotto**
- Svuota la cache del tuo browser
- Assicurati che `xoops_lib/` sia stato completamente sostituito durante il caricamento dei file
