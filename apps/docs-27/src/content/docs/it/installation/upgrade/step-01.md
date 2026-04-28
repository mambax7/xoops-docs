---
title: "Preparazioni per l'aggiornamento"
---

## Spegni il tuo sito

Prima di avviare il processo di aggiornamento XOOPS, dovresti impostare l'elemento "Spegni il sito?" su _Sì_ nella pagina Preferenze -> Opzioni di sistema -> Impostazioni generali nel menu di amministrazione.

Questo impedisce agli utenti di incontrare un sito interrotto durante l'aggiornamento. Mantiene anche la contesa per le risorse a un minimo per garantire un aggiornamento più fluido.

Invece di errori e un sito interrotto, i tuoi visitatori vedranno qualcosa del genere:

![Sito chiuso su mobile](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Backup

È una buona idea utilizzare la sezione _Manutenzione_ dell'amministrazione di XOOPS per _Pulire la cartella della cache_ per tutte le cache prima di eseguire un backup completo dei file del sito. Con il sito spento, anche l'utilizzo di _Svuota la tabella delle sessioni_ è consigliato in modo che se è necessario un ripristino, le sessioni obsolete non faranno parte di esso.

### File

Il backup del file può essere eseguito con FTP, copiando tutti i file sulla tua macchina locale. Se hai accesso diretto alla shell al server, può essere _molto_ più veloce creare una copia (o una copia di archivio) lì.

### Database

Per fare un backup del database, puoi utilizzare le funzioni integrate nella sezione _Manutenzione_ dell'amministrazione di XOOPS. Puoi anche utilizzare le funzioni _Esporta_ in _phpMyAdmin_, se disponibile. Se hai accesso alla shell, puoi usare il comando _mysql_ per eseguire il dump del tuo database.

Essere fluenti nel backup e _ripristino_ del tuo database è un'abilità importante del webmaster. Ci sono molte risorse online che puoi usare per saperne di più su queste operazioni come appropriato per la tua installazione, come [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Copia nuovi file nel sito

La copia dei nuovi file nel tuo sito è quasi identica al passaggio [Preparazioni](../../installation/preparations/) durante l'installazione. Dovresti copiare le directory _xoops_data_ e _xoops_lib_ in qualunque luogo questi siano stati traslocati durante l'installazione. Quindi, copia il resto del contenuto della directory _htdocs_ della distribuzione (con poche eccezioni coperte nella sezione successiva) sui file e le directory esistenti nella tua radice web.

In XOOPS 2.7.0, copiare una nuova distribuzione su un sito esistente **non sovrascriverà i file di configurazione esistenti** come `mainfile.php` o `xoops_data/data/secure.php`. Questo è un cambiamento benvenuto dalle versioni precedenti, ma dovresti comunque eseguire un backup completo prima di iniziare.

Copia l'intera directory _upgrade_ dalla distribuzione alla tua radice web, creando una directory _upgrade_ lì.

## Esegui il controllo di preflight Smarty 4

Prima di avviare il flusso di lavoro principale `/upgrade/`, devi eseguire lo scanner di preflight spedito nella directory `upgrade/`. Esamina i tuoi temi e modelli di moduli esistenti per i problemi di compatibilità con Smarty 4 e può riparare automaticamente molti di essi.

1. Punta il tuo browser verso _your-site-url_/upgrade/preflight.php
2. Accedi con un account amministratore
3. Esegui la scansione e rivedi il rapporto
4. Applica eventuali correzioni automatiche offerte, o correggi manualmente i modelli contrassegnati
5. Ri-esegui la scansione finché non è pulita
6. Solo allora continua all'aggiornamento principale

Vedi la pagina [Controllo di preflight](preflight.md) per una procedura dettagliata completa.

### Cose che potresti non voler copiare

Non dovresti ricopiare la directory _install_ in un sistema XOOPS funzionante. Lasciare la cartella di installazione nella tua installazione XOOPS espone il tuo sistema a potenziali problemi di sicurezza. Il programma di installazione lo rinomina casualmente, ma dovresti eliminarlo e assicurarti di non copiarla di nuovo.

Ci sono alcuni file che potresti aver modificato per personalizzare il tuo sito e di cui desideri preservare. Ecco un elenco di personalizzazioni comuni.

* _xoops_data/configs/xoopsconfig.php_ se è stato modificato da quando il sito è stato installato
* qualsiasi directory in _themes_ se personalizzato per il tuo sito. In questo caso potresti voler confrontare i file per identificare gli aggiornamenti utili.
* qualsiasi file in _class/captcha/_ che inizia con "config" se è stato modificato da quando il sito è stato installato
* qualsiasi personalizzazione in _class/textsanitizer_
* qualsiasi personalizzazione in _class/xoopseditor_

Se realizzi dopo l'aggiornamento che qualcosa è stato accidentalmente sovrascritto, non farti prendere dal panico -- è per questo che hai iniziato con un backup completo. _(Hai fatto un backup, vero?)_

## Controlla mainfile.php (Aggiornamento da XOOPS pre-2.5)

Questo passaggio si applica solo se stai aggiornando da una versione XOOPS precedente (2.3 o precedente). Se stai aggiornando da XOOPS 2.5.x puoi saltare questa sezione.

Le versioni precedenti di XOOPS richiedevano alcune modifiche manuali da apportare in `mainfile.php` per abilitare il modulo Protector. Nella tua radice web dovresti avere un file denominato `mainfile.php`. Apri quel file nel tuo editor e cerca queste righe:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

e

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Rimuovi queste righe se le trovi e salva il file prima di continuare.
