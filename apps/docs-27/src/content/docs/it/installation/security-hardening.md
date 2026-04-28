---
title: "Appendice 5: Aumenta la sicurezza della tua installazione XOOPS"
---

Dopo aver installato XOOPS 2.7.0, seguire i passaggi seguenti per rafforzare il sito. Ogni passaggio è facoltativo individualmente, ma insieme aumentano significativamente la linea di base della sicurezza dell'installazione.

## 1. Installa e configura il modulo Protector

Il modulo `protector` in bundle è il firewall XOOPS. Se non l'hai installato durante la procedura guidata iniziale, installalo dalla schermata Admin → Moduli ora.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Apri il pannello di amministrazione di Protector e rivedi gli avvisi che visualizza. Le direttive PHP legacy come `register_globals` non esistono più (PHP 8.2+ le ha rimosse), quindi non vedrai più questi avvisi. Gli avvisi attuali di solito riguardano autorizzazioni directory, impostazioni di sessione e configurazione del percorso di fiducia.

## 2. Blocca `mainfile.php` e `secure.php`

Quando il programma di installazione termina, tenta di contrassegnare entrambi i file come di sola lettura, ma alcuni host ripristinano le autorizzazioni. Verifica e riapplica se necessario:

- `mainfile.php` → `0444` (proprietario, gruppo, altri sola lettura)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` definisce i costanti di percorso (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) e i flag di produzione. `secure.php` contiene le credenziali del database:

- In 2.5.x, le credenziali del database vivevano in `mainfile.php`. Ora sono memorizzate in `xoops_data/data/secure.php`, che viene caricato da `mainfile.php` al runtime. Mantenere `secure.php` all'interno di `xoops_data/` — una directory che sei incoraggiato a traslocare al di fuori della radice del documento — rende molto più difficile per un utente malintenzionato raggiungere le credenziali su HTTP.

## 3. Sposta `xoops_lib/` e `xoops_data/` al di fuori della radice del documento

Se non lo hai già fatto, sposta queste due directory un livello sopra la tua radice web e rinominale. Quindi aggiorna i costanti corrispondenti in `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Posizionare queste directory al di fuori della radice del documento impedisce l'accesso diretto all'albero `vendor/` di Composer, ai modelli in cache, ai file di sessione, ai dati caricati e alle credenziali del database in `secure.php`.

## 4. Configurazione dominio cookie

XOOPS 2.7.0 introduce due costanti del dominio cookie in `mainfile.php`:

```php
// Usa l'elenco di suffissi pubblici (PSL) per derivare il dominio registrabile.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Dominio cookie esplicito; potrebbe essere vuoto, l'host completo o il dominio registrabile.
define('XOOPS_COOKIE_DOMAIN', '');
```

Linee guida:

- Lascia `XOOPS_COOKIE_DOMAIN` vuoto se servi XOOPS da un singolo nome host o da un IP.
- Usa l'host completo (ad es. `www.example.com`) per limitare i cookie solo a quel nome host.
- Usa il dominio registrabile (ad es. `example.com`) quando desideri condividere i cookie su `www.example.com`, `blog.example.com`, ecc.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` consente a XOOPS di dividere correttamente i TLD composti (`co.uk`, `com.au`, …) invece di impostare accidentalmente un cookie sul TLD effettivo.

## 5. Flag di produzione in `mainfile.php`

`mainfile.dist.php` viene fornito con questi due flag impostati su `false` per la produzione:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disabilita la registrazione dell'uso SQL legacy
define('XOOPS_DEBUG',         false); // disabilita gli avvisi di debug
```

Lasciali spenti in produzione. Abilitali temporaneamente in un ambiente di sviluppo o staging quando vuoi:

- cacciare i rimanenti legacy database calls (`XOOPS_DB_LEGACY_LOG = true`);
- avanzare avvisi `E_USER_DEPRECATED` e altri output di debug (`XOOPS_DEBUG = true`).

## 6. Elimina il programma di installazione

Dopo il completamento dell'installazione:

1. Elimina qualsiasi directory `install_remove_*` rinominata dalla radice web.
2. Elimina qualsiasi script `install_cleanup_*.php` creato dal wizard durante la pulizia.
3. Conferma che la directory `install/` non è più raggiungibile su HTTP.

Lasciare un programma di installazione disabilitato ma presente è un rischio di bassa gravità ma evitabile.

## 7. Mantieni XOOPS e i moduli aggiornati

XOOPS segue un cadenza di patch regolare. Sottoscrivi il repository GitHub di XoopsCore27 per le notifiche di rilascio e aggiorna il tuo sito e tutti i moduli di terze parti ogni volta che viene spedito un nuovo rilascio. Gli aggiornamenti di sicurezza per 2.7.x vengono pubblicati tramite la pagina Versioni del repository.
