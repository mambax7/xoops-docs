---
title: "Argomenti speciali"
---

Alcune combinazioni specifiche di software di sistema potrebbero richiedere configurazioni aggiuntive per funzionare con XOOPS. Ecco alcuni dettagli dei problemi noti e delle indicazioni per affrontarli.

## Ambienti SELinux

Alcuni file e directory devono essere scrivibili durante l'installazione, l'aggiornamento e il funzionamento normale di XOOPS. In un ambiente Linux tradizionale, questo viene realizzato assicurando che l'utente di sistema che il server web esegue abbia autorizzazioni sulle directory XOOPS, solitamente impostando il gruppo appropriato per quelle directory.

I sistemi abilitati per SELinux (come CentOS e RHEL) hanno un contesto di sicurezza aggiuntivo che può limitare la capacità di un processo di cambiare il file system. Questi sistemi potrebbero richiedere modifiche al contesto di sicurezza per XOOPS per funzionare correttamente.

XOOPS si aspetta di poter scrivere liberamente in determinate directory durante il funzionamento normale. Inoltre, durante gli aggiornamenti e gli aggiornamenti di XOOPS, determinati file devono essere scrivibili pure.

Durante il funzionamento normale, XOOPS si aspetta di poter scrivere file e creare subdirectory in queste directory:

- `uploads` nella radice web principale XOOPS
- `xoops_data` ovunque sia traslocato durante l'installazione

Durante un processo di installazione o aggiornamento XOOPS avrà bisogno di scrivere su questo file:

- `mainfile.php` nella radice web principale XOOPS

Per un tipico sistema Apache basato su CentOS, le modifiche al contesto di sicurezza potrebbero essere realizzate con questi comandi:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Puoi rendere mainfile.php scrivibile con:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Nota: quando installi, puoi copiare un mainfile.php vuoto dalla directory *extras*.

Dovresti anche consentire a httpd di inviare posta:

```
setsebool -P httpd_can_sendmail=1
```

Altre impostazioni di cui potresti aver bisogno includono:

Consenti a httpd di effettuare connessioni di rete, ad es. recuperare feed rss o effettuare una chiamata API:

```
setsebool -P httpd_can_network_connect 1
```

Abilita la connessione di rete a un database con:

```
setsebool -P httpd_can_network_connect_db=1
```

Per ulteriori informazioni, consulta la documentazione del tuo sistema e/o l'amministratore di sistema.

## Smarty 4 e temi personalizzati

XOOPS 2.7.0 ha aggiornato il suo motore di modellazione da Smarty 3 a **Smarty 4**. Smarty 4 è più severo riguardo alla sintassi del modello rispetto a Smarty 3 e pochi modelli che erano tollerati nei modelli più vecchi ora causeranno errori. Se stai installando una copia aggiornata di XOOPS 2.7.0 utilizzando solo i temi e i moduli spediti con il rilascio, non c'è nulla di cui preoccuparsi — ogni modello spedito è stato aggiornato per la compatibilità con Smarty 4.

Il problema si applica quando tu sei:

- aggiornamento di un sito XOOPS 2.5.x esistente che ha temi personalizzati, o
- installazione di temi personalizzati o moduli di terze parti più vecchi in XOOPS 2.7.0.

Prima di commutare il traffico dal vivo su un sito aggiornato, esegui lo scanner di preflight spedito nella directory `/upgrade/`. Scansiona `/themes/` e `/modules/` cercando incompatibilità di Smarty 4 e può riparare automaticamente molte di esse. Vedi la pagina [Controllo di preflight](../upgrading/upgrade/preflight.md) per i dettagli.

Se riscontri errori di modello dopo un'installazione o un aggiornamento:

1. Esegui di nuovo `/upgrade/preflight.php` e risolvi i problemi segnalati.
2. Cancella la cache del modello compilato rimuovendo tutto tranne `index.html` da `xoops_data/caches/smarty_compile/`.
3. Passa temporaneamente a un tema spedito come `xbootstrap5`, `default`, `xswatch5` per confermare che il problema è specifico del tema piuttosto che a livello di sito.
4. Convalida qualsiasi tema personalizzato personalizzato o modifiche modello prima di restituire il sito alla produzione.
