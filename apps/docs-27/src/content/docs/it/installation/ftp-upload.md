---
title: "Appendice 2: Caricamento di XOOPS via FTP"
---

Questo allegato illustra la distribuzione di XOOPS 2.7.0 su un host remoto utilizzando FTP o SFTP. Qualsiasi pannello di controllo (cPanel, Plesk, DirectAdmin, ecc.) esporrà gli stessi passaggi sottostanti.

## 1. Prepara il database

Attraverso il pannello di controllo del tuo host:

1. Crea un nuovo database MySQL per XOOPS.
2. Crea un utente di database con una password forte.
3. Concedi all'utente tutti i privilegi sul database appena creato.
4. Registra il nome del database, il nome utente, la password e l'host — li inserirai nel programma di installazione XOOPS.

> **Suggerimento**
>
> I pannelli di controllo moderni generano password forti per te. Poiché l'applicazione memorizza la password in `xoops_data/data/secure.php`, non è necessario digitarla spesso — preferire un valore lungo e generato casualmente.

## 2. Crea una cassetta postale amministratore

Crea una cassetta postale di posta elettronica che riceverà le notifiche di amministrazione del sito. Il programma di installazione di XOOPS chiede questo indirizzo durante la configurazione dell'account webmaster e lo convalida con `FILTER_VALIDATE_EMAIL`.

## 3. Carica i file

XOOPS 2.7.0 viene fornito con le sue dipendenze di terze parti preinstallate in `xoops_lib/vendor/` (pacchetti Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF e altro). Questo rende `xoops_lib/` significativamente più grande rispetto a 2.5.x — aspettati decine di megabyte.

**Non saltare selettivamente file all'interno di `xoops_lib/vendor/`.** Saltare file nell'albero dei fornitori di Composer interromperà il caricamento automatico e l'installazione non riuscirà.

Struttura di caricamento (supponendo che `public_html` sia la radice dei documenti):

1. Carica `xoops_data/` e `xoops_lib/` **accanto a** `public_html`, non all'interno. Posizionarli al di fuori della radice web è l'atteggiamento di sicurezza consigliato per 2.7.0.

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← carica qui
   └── xoops_lib/      ← carica qui
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Carica il resto del contenuto della directory `htdocs/` della distribuzione in `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Se il tuo host non consente directory al di fuori della radice dei documenti**
>
> Carica `xoops_data/` e `xoops_lib/` **all'interno di** `public_html/` e **rinominali in nomi non ovvi** (ad esempio `xdata_8f3k2/` e `xlib_7h2m1/`). Inserirai i percorsi rinominati nel programma di installazione quando chiede il percorso dati XOOPS e il percorso libreria XOOPS.

## 4. Rendi le directory scrivibili scrivibili

Attraverso la finestra di dialogo CHMOD del client FTP (o SSH), rendi le directory elencate nel Capitolo 2 scrivibili dal server web. Su la maggior parte degli host condivisi, `0775` su directory e `0664` su `mainfile.php` sono sufficienti. `0777` è accettabile durante l'installazione se il tuo host esegue PHP come utente diverso dall'utente FTP, ma stringere le autorizzazioni dopo il completamento dell'installazione.

## 5. Avvia il programma di installazione

Punta il tuo browser all'URL pubblico del sito. Se tutti i file sono in posizione, la procedura guidata di installazione XOOPS si avvia e puoi seguire il resto di questa guida da [Capitolo 2](chapter-2-introduction.md) in poi.
