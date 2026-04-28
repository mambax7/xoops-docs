---
title: "Novità in XOOPS 2.7.0"
---

XOOPS 2.7.0 è un aggiornamento significativo dalla serie 2.5.x. Prima di installare o aggiornare, esamina le modifiche su questa pagina in modo da sapere cosa aspettarti. L'elenco seguente è focalizzato su elementi che influiscono sull'installazione e sull'amministrazione del sito — per un elenco completo dei cambiamenti, vedi le note sulla versione spedite con la distribuzione.

## PHP 8.2 è il nuovo minimo

XOOPS 2.7.0 richiede **PHP 8.2 o versioni successive**. PHP 7.x e versioni precedenti non sono più supportati. PHP 8.4 o superiore è fortemente consigliato.

**Azione:** Conferma che il tuo host offre PHP 8.2+ prima di iniziare. Vedi [Requisiti](installation/requirements.md).

## MySQL 5.7 è il nuovo minimo

Il nuovo minimo è **MySQL 5.7** (o un MariaDB compatibile). MySQL 8.4 o superiore è fortemente consigliato. MySQL 9.0 è supportato anche.

I vecchi avvisi sui problemi di compatibilità di PHP/MySQL 8 non si applicano più, perché le versioni PHP interessate non sono più supportate da XOOPS.

## Smarty 4 sostituisce Smarty 3

Questo è il singolo cambiamento più grande per i siti esistenti. XOOPS 2.7.0 utilizza **Smarty 4** come motore di template. Smarty 4 è più rigoroso sulla sintassi dei template rispetto a Smarty 3, e alcuni temi personalizzati e template di moduli precedenti potranno richiedere modifiche prima di eseguire il rendering correttamente.

Per aiutarti a identificare e riparare questi problemi, XOOPS 2.7.0 dispone di uno **scanner di preflight** nella directory `upgrade/` che esamina i template esistenti per le incompatibilità note di Smarty 4 e può riparare automaticamente molti di essi.

**Azione:** Se stai effettuando l'upgrade da 2.5.x e hai temi personalizzati o moduli precedenti, esegui il [Controllo di preflight](upgrading/upgrade/preflight.md) _prima_ di eseguire il programma di aggiornamento principale.

## Dipendenze gestite da Composer

XOOPS 2.7.0 utilizza **Composer** per gestire le sue dipendenze PHP. Questi si trovano in `xoops_lib/vendor/`. Le librerie di terze parti che erano precedentemente bundle nel core o nei moduli — PHPMailer, HTMLPurifier, Smarty e altri — sono ora forniti tramite Composer.

**Azione:** La maggior parte degli operatori di siti non ha bisogno di fare nulla — i tarball di rilascio sono spediti con `vendor/` già popolato. Se stai spostando o aggiornando un sito, copia l'intero albero `xoops_lib/`, incluso `vendor/`. Gli sviluppatori che clonano il repository git dovrebbero eseguire `composer install` all'interno di `htdocs/xoops_lib/`. Vedi [Note per sviluppatori](notes-for-developers/developers.md).

## Preferenze di cookie di sessione induriti nuove

Due nuove preferenze vengono aggiunte durante l'aggiornamento:

* **`session_cookie_samesite`** — controlla l'attributo SameSite sui cookie di sessione (`Lax`, `Strict`, o `None`).
* **`session_cookie_secure`** — quando abilitato, i cookie di sessione vengono inviati solo su HTTPS.

**Azione:** Dopo l'aggiornamento, rivedi questi in Opzioni di sistema → Preferenze → Impostazioni generali. Vedi [Dopo l'aggiornamento](upgrading/upgrade/ustep-04.md).

## Nuova tabella `tokens`

XOOPS 2.7.0 aggiunge una tabella `tokens` del database per l'archiviazione di token scoped generico. L'updater crea questa tabella automaticamente come parte dell'aggiornamento 2.5.11 → 2.7.0.

## Archiviazione password modernizzata

La colonna `bannerclient.passwd` è stata ampliata a `VARCHAR(255)` in modo da poter contenere gli hash delle password moderni (bcrypt, argon2). L'updater amplia automaticamente la colonna.

## Elenco di temi e moduli aggiornato

XOOPS 2.7.0 viene spedito con temi di front-end aggiornati:

* `default`, `xbootstrap` (legacy), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Un nuovo tema di amministrazione **Modern** è incluso insieme al tema Transition esistente.

Un nuovo modulo **DebugBar** basato su Symfony VarDumper viene spedito come uno dei moduli installabili facoltativi. È utile per lo sviluppo e la messa in scena, ma in genere non viene installato su siti di produzione pubblici.

Vedi [Seleziona tema](installation/installation/step-12.md) e [Installazione moduli](installation/installation/step-13.md).

## La copia di una nuova versione non sovrascriye più la configurazione

In precedenza, la copia di una nuova distribuzione XOOPS su un sito esistente richiedeva attenzione per evitare di sovrascrivere `mainfile.php` e altri file di configurazione. In 2.7.0, il processo di copia lascia intatti i file di configurazione esistenti, il che rende gli aggiornamenti notevolmente più sicuri.

Dovresti comunque fare un backup completo prima di qualsiasi aggiornamento.

## Capacità di sovraccarico dei template nei temi di amministrazione del sistema

I temi di amministrazione in XOOPS 2.7.0 possono ora sovrascrivere i template di amministrazione del sistema individuale, rendendo più facile personalizzare l'interfaccia utente di amministrazione senza fare il fork dell'intero modulo di sistema.

## Cosa non è cambiato

Per rassicurazione, queste parti di XOOPS funzionano nello stesso modo in 2.7.0 come in 2.5.x:

* L'ordine della pagina del programma di installazione e il flusso generale
* La divisione `mainfile.php` più `xoops_data/data/secure.php`
* La pratica consigliata di trasferimento di `xoops_data` e `xoops_lib` al di fuori della radice web
* Il modello di installazione del modulo e il formato manifesto `xoops_version.php`
* Il flusso di lavoro di spostamento del sito (backup, modifica `mainfile.php`/`secure.php`, usa SRDB o simile)

## Dove andare dopo

* Iniziando da zero? Continua a [Requisiti](installation/requirements.md).
* Aggiornamento da 2.5.x? Inizia con [Aggiornamento](upgrading/upgrade/README.md), quindi esegui il [Controllo di preflight](upgrading/upgrade/preflight.md).

