---
title: "Spostamento di un sito"
---

Può essere una tecnica molto utile prototipare un nuovo sito XOOPS su un sistema locale o su un server di sviluppo. Può anche essere molto prudente testare un aggiornamento XOOPS su una copia del tuo sito di produzione prima, nel caso qualcosa vada storto. Per realizzare questi obiettivi, devi essere in grado di spostare il tuo sito XOOPS da un sito all'altro. Ecco cosa devi sapere per spostare con successo il tuo sito XOOPS.

Il primo passaggio è stabilire il tuo nuovo ambiente sito. Gli stessi elementi trattati nella sezione [Preparazioni anticipate](../installation/preparations/) si applicano qui pure.

Riepilogo, questi passaggi sono:

* ottenere hosting, inclusi eventuali requisiti di nome di dominio o email
* ottenere un account utente MySQL e password
* ottenere un database MySQL su cui l'utente precedente ha tutti i privilegi

Il resto del processo è abbastanza simile a un'installazione normale, ma:

* invece di copiare i file dalla distribuzione XOOPS, li copierai dal sito esistente
* invece di eseguire il programma di installazione, importerai un database già popolato
* invece di inserire le risposte nel programma di installazione, modificherai le risposte precedenti nei file e nel database

## Copia i file sito esistenti

Fai una copia completa dei file del tuo sito esistente sulla tua macchina locale dove puoi modificarli. Se lavori con un host remoto, puoi usare FTP per copiare i file. Hai bisogno di una copia per lavorarci anche se il sito è in esecuzione sulla tua macchina locale, basta fare un'altra copia della directory del sito in quel caso.

È importante ricordare di includere le directory _xoops_data_ e _xoops_lib_ anche se sono state rinominate e/o riposizionate.

Per rendere le cose più fluide, dovresti eliminare la cache e i file di modello compilati Smarty dalla tua copia. Questi file verranno ricreati nel tuo nuovo ambiente e potrebbero causare problemi se informazioni precedenti scorrette non vengono cancellate. Per farlo, elimina tutti i file, ad eccezione di _index.html_, in tutti e tre questi directory:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Nota:** Cancellare `smarty_compile` è particolarmente importante quando si sposta un sito da o verso XOOPS 2.7.0. XOOPS 2.7.0 utilizza Smarty 4 e i modelli compilati di Smarty 4 non sono intercambiabili con i modelli compilati di Smarty 3. Lasciare file compilati stantii in posizione causerà errori di modello al primo caricamento pagina sul nuovo sito.

### `xoops_lib` e dipendenze del compositore

XOOPS 2.7.0 gestisce le sue dipendenze PHP attraverso Composer, all'interno di `xoops_lib/`. La directory `xoops_lib/vendor/` contiene le librerie di terze parti di cui XOOPS ha bisogno al runtime (Smarty 4, PHPMailer, HTMLPurifier, ecc.). Quando sposti un sito, devi copiare l'intero albero `xoops_lib/` — incluso `vendor/` — sul nuovo host. Non tentare di rigenerare `vendor/` sull'host di destinazione a meno che tu non sia uno sviluppatore che ha personalizzato `composer.json` e ha Composer disponibile sulla destinazione.

## Imposta il nuovo ambiente

Gli stessi elementi trattati nella sezione [Preparazioni anticipate](../installation/preparations/) si applicano qui pure. Assumeremo qui che tu abbia qualunque hosting di cui avrai bisogno per il sito che stai spostando.

### Informazioni chiave (mainfile.php e secure.php)

Lo spostamento riuscito di un sito implica la modifica di eventuali riferimenti a nomi di file assoluti e nomi di percorso, URL, parametri di database e credenziali di accesso.

Due file, `mainfile.php` nella radice web del tuo sito e `data/secure.php` nella directory _xoops_data_ del tuo sito (rinominata e/o riposizionata) definiscono i parametri di base del tuo sito, come l'URL, dove si trova nel file system dell'host e come si connette al database.

Dovrai sapere sia quali sono i valori nel sistema precedente che quali saranno nel sistema nuovo.

#### mainfile.php

| Nome | Valore vecchio in mainfile.php | Valore nuovo in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Apri _mainfile.php_ nel tuo editor. Modifica i valori dei define mostrati nella tabella precedente dai valori precedenti ai valori appropriati per il nuovo sito.

Tieni note dei valori vecchi e nuovi, poiché ne avremo bisogno di simili in altri punti nei passaggi successivi.

Ad esempio, se stai spostando un sito dal tuo PC locale a un servizio di hosting commerciale, i tuoi valori potrebbero assomigliare a questo:

| Nome | Valore vecchio in mainfile.php | Valore nuovo in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Dopo aver modificato _mainfile.php_, salvalo.

È possibile che alcuni altri file possano contenere riferimenti hardcoded al tuo URL o anche ai percorsi. Questo è più probabile in temi personalizzati e menu, ma con il tuo editor, puoi cercare in tutti i file, giusto per essere sicuro.

Nel tuo editor, esegui una ricerca in tutti i file nella tua copia, cercando il vecchio valore XOOPS_URL e sostituiscilo con il nuovo valore.

Fai lo stesso per il vecchio valore XOOPS_ROOT_PATH, sostituendo tutte le occorrenze con il nuovo valore.

Tieni le tue note, perché dovremo usarle di nuovo in seguito come sposteremo il database.

#### data/secure.php

| Nome | Valore vecchio in data/secure.php | Valore nuovo in data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Apri il _data/secure.php_ nella directory _xoops_data_ rinominata e/o riposizionata nel tuo editor. Modifica i valori dei define mostrati nella tabella precedente dai valori precedenti ai valori appropriati per il nuovo sito.

#### Altri file

Potrebbero esserci altri file che potrebbero aver bisogno di attenzione quando il tuo sito si sposta. Alcuni esempi comuni sono chiavi API per vari servizi che potrebbero essere legati al dominio, come:

* Google Maps
* Recaptch2
* Pulsanti simili
* Condivisione collegamento e/o pubblicità come Shareaholic o AddThis

La modifica di questi tipi di associazioni non può essere facilmente automatizzata, poiché le connessioni al dominio precedente sono generalmente parte della registrazione sul lato del servizio. In alcuni casi, questo potrebbe semplicemente aggiungere o cambiare il dominio associato al servizio.

### Copia i file nel nuovo sito

Copia i file ora modificati nel tuo nuovo sito. Le tecniche sono le stesse utilizzate durante [Installazione](../installation/installation/), ovvero utilizzando FTP.

## Copia il database del sito esistente

### Esegui il backup del database dal vecchio server

Per questo passaggio, l'utilizzo di _phpMyAdmin_ è altamente consigliato. Accedi a _phpMyAdmin_ per il tuo sito esistente, seleziona il tuo database e scegli _Esporta_.

Le impostazioni predefinite vanno bene di solito, quindi seleziona il "metodo di esportazione" di _Rapido_ e "Formato" di _SQL_.

Usa il pulsante _Vai_ per scaricare il backup del database.

![Esportazione di un database con phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Se hai tabelle nel tuo database che non provengono da XOOPS o dai suoi moduli e NON dovrebbero essere spostate, dovresti selezionare il "metodo di esportazione" di _Personalizzato_ e scegliere solo le tabelle relative a XOOPS nel tuo database. (Questi iniziano con il "prefisso" che hai specificato durante l'installazione. Puoi cercare il tuo prefisso di database nel file `xoops_data/data/secure.php`.)

### Ripristina il database al nuovo server

Sul tuo nuovo host, utilizzando il tuo nuovo database, ripristina il database utilizzando [strumenti](../tools/tools.md) come la scheda _Importa_ in _phpMyAdmin_ (o _bigdump_ se necessario.)

### Aggiorna URL e percorsi nel database

Aggiorna tutti i collegamenti http alle risorse sul tuo sito nel tuo database. Questo può essere uno sforzo enorme, e c'è uno [strumento](../tools/tools.md) per renderlo più facile.

Interconnect/it ha un prodotto chiamato Search-Replace-DB che può aiutare con questo. Viene fornito con la consapevolezza degli ambienti Wordpress e Drupal integrati. Come è, questo strumento può essere molto utile, ma è ancora migliore quando è consapevole del tuo XOOPS. Puoi trovare una versione consapevole di XOOPS su [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Segui le istruzioni nel file README.md per scaricare e installare temporaneamente questa utilità sul tuo sito. In precedenza, abbiamo modificato il define XOOPS_URL. Quando esegui questo strumento, vuoi sostituire la definizione originale XOOPS_URL con la nuova definizione, ovvero sostituire [http://localhost/xoops](http://localhost/xoops) con [https://example.com](https://example.com)

![Usando Seach e Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Inserisci i tuoi vecchi e nuovi URL e scegli l'opzione di esecuzione a secco. Rivedi le modifiche e, se tutto sembra a posto, vai per l'opzione di esecuzione dal vivo. Questo passaggio catturerà elementi di configurazione e collegamenti all'interno del tuo contenuto che si riferiscono all'URL del tuo sito.

![Revisione delle modifiche in SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Ripeti il processo utilizzando i tuoi vecchi e nuovi valori per XOOPS_ROOT_PATH.

#### Approccio alternativo senza SRDB

Un altro modo per realizzare questo passaggio senza lo strumento srdb sarebbe eseguire il dump del tuo database, modificare il dump in un editor di testo cambiando gli URL e i percorsi, e quindi ricaricare il database dal tuo dump modificato. Sì, quel processo è abbastanza coinvolto e comporta abbastanza rischi che le persone siano state motivate a creare strumenti specializzati come Search-Replace-DB.

## Prova il tuo sito traslocato

A questo punto, il tuo sito dovrebbe essere pronto per funzionare nel suo nuovo ambiente!

Naturalmente, possono sempre essere problemi. Non abbiate paura di postare eventuali domande sul [Forum di xoops.org](https://xoops.org/modules/newbb/index.php).
