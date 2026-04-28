---
title: "Requisiti"
---

## Ambiente software (lo stack)

La maggior parte dei siti XOOPS di produzione vengono eseguiti su uno stack _LAMP_ (un sistema **L**inux che esegue **A**pache, **M**ySQL e **P**HP) ma ci sono molti possibili stack diversi.

Spesso è più facile prototipare un nuovo sito su una macchina locale. Per questo caso, molti utenti XOOPS scelgono uno stack _WAMP_ (usando **W**indows come sistema operativo), mentre altri eseguono stack _LAMP_ o _MAMP_ (**M**AC).

### PHP

Qualsiasi versione di PHP >= 8.2.0 (PHP 8.4 o superiore è fortemente consigliato)

> **Importante:** XOOPS 2.7.0 richiede **PHP 8.2 o più recente**. PHP 7.x e versioni precedenti non sono più supportate. Se stai aggiornando un sito più vecchio, conferma che il tuo host offre PHP 8.2+ prima di iniziare.

### MySQL

Server MySQL 5.7 o versione successiva (MySQL Server 8.4 o versione successiva è fortemente consigliato.) MySQL 9.0 è anche supportato. MariaDB è una sostituzione binaria compatibile con le versioni precedenti di MySQL e funziona bene anche con XOOPS.

### Server web

Un server web che supporta l'esecuzione di script PHP, come Apache, NGINX, LiteSpeed, ecc.

### Estensioni PHP richieste

Il programma di installazione XOOPS verifica che le seguenti estensioni siano caricate prima di consentire l'installazione di procedere:

* `mysqli` — driver di database MySQL
* `session` — gestione della sessione
* `pcre` — espressioni regolari compatibili Perl
* `filter` — filtro e convalida dell'input
* `fileinfo` — rilevamento tipo MIME per caricamenti

### Impostazioni PHP richieste

Oltre alle estensioni precedenti, il programma di installazione verifica la seguente impostazione `php.ini`:

* `file_uploads` deve essere **On** — senza di essa, XOOPS non può accettare file caricati

### Estensioni PHP consigliate

Il programma di installazione verifica anche queste estensioni. Non sono strettamente necessari, ma XOOPS e la maggior parte dei moduli si basano su di essi per la piena funzionalità. Abilita il maggior numero possibile che il tuo host consente:

* `mbstring` — gestione di stringhe multibyte
* `intl` — internazionalizzazione
* `iconv` — conversione set di caratteri
* `xml` — analisi XML
* `zlib` — compressione
* `gd` — elaborazione delle immagini
* `exif` — metadati delle immagini
* `curl` — client HTTP per feed e chiamate API

## Servizi

### Accesso al file system (per accesso webmaster)

Avrai bisogno di un metodo (FTP, SFTP, ecc.) per trasferire i file di distribuzione XOOPS al server web.

### Accesso al file system (per processo server web)

Per eseguire XOOPS, è necessaria la possibilità di creare, leggere ed eliminare file e directory. I seguenti percorsi devono essere scrivibili dal processo del server web per un'installazione normale e per il funzionamento giornaliero normale:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (scrivibile durante installazione e aggiornamento)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Database

XOOPS avrà bisogno di creare, modificare e interrogare tabelle in MySQL. Per questo avrai bisogno di:

* un account utente e una password MySQL
* un database MySQL che l'utente ha tutti i privilegi su (oppure, in alternativa, l'utente può avere il privilegio di creare un tale database)

### Email

Per un sito dal vivo, avrai bisogno di un indirizzo email funzionante che XOOPS possa utilizzare per la comunicazione dell'utente, come attivazioni dell'account e ripristini della password. Sebbene non strettamente richiesto, è consigliato se possibile usare un indirizzo email che corrisponda al dominio su cui viene eseguito XOOPS. Questo aiuta a evitare che le tue comunicazioni vengano respinte o contrassegnate come spam.

## Strumenti

Potresti aver bisogno di alcuni strumenti aggiuntivi per configurare e personalizzare la tua installazione XOOPS. Questi potrebbero includere:

* Software client FTP
* Editor di testo
* Software di archivio per lavorare con file di rilascio XOOPS (_.zip_ o _.tar.gz_).

Vedi la sezione [Strumenti del mestiere](../tools/tools.md) per alcuni suggerimenti su strumenti e stack di server web appropriati se necessario.

## Argomenti speciali

Alcune combinazioni specifiche di software di sistema potrebbero richiedere configurazioni aggiuntive per funzionare con XOOPS. Se stai utilizzando un ambiente SELinux o aggiornando un sito precedente con temi personalizzati, fai riferimento a [Argomenti speciali](specialtopics.md) per ulteriori informazioni.
