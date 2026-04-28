---
title: "Note per gli Sviluppatori"
---

Sebbene l'installazione effettiva di XOOPS per lo sviluppo sia simile all'installazione normale già descritta, ci sono differenze fondamentali quando si costruisce un sistema pronto per lo sviluppo.

Una grande differenza in un'installazione per sviluppatori è che invece di concentrarsi solo sul contenuto della directory _htdocs_, un'installazione per sviluppatori mantiene tutti i file e li mantiene sotto il controllo del codice sorgente utilizzando git.

Un'altra differenza è che le directory _xoops_data_ e _xoops_lib_ possono solitamente rimanere in posizione senza rinominare, a patto che il tuo sistema di sviluppo non sia direttamente accessibile su internet aperto (cioè su una rete privata, ad esempio dietro un router).

La maggior parte degli sviluppatori lavora su un sistema _localhost_ che ha il codice sorgente, uno stack di server web e tutti gli strumenti necessari per lavorare con il codice e il database.

Puoi trovare ulteriori informazioni nel capitolo [Tools of the Trade](../tools/tools.md).

## Git e Virtual Host

La maggior parte degli sviluppatori vuole stare al passo con le fonti attuali e contribuire i cambiamenti al repository [XOOPS/XoopsCore27 su GitHub](https://github.com/XOOPS/XoopsCore27). Ciò significa che invece di scaricare un archivio di rilascio, vorrai [fare un fork](https://help.github.com/articles/fork-a-repo/) di una copia di XOOPS e usare **git** per [clonare](https://help.github.com/categories/bootcamp/) quel repository sulla tua scatola di sviluppo.

Poiché il repository ha una struttura specifica, invece di _copiare_ file dalla directory _htdocs_ al tuo web server, è meglio puntare il tuo web server alla cartella htdocs all'interno del tuo repository clonato localmente. Per farlo, in genere creiamo un nuovo _Virtual Host_, o _vhost_, che punta al nostro codice sorgente controllato da git.

In un ambiente [WAMP](http://www.wampserver.com/), la pagina predefinita [localhost](http://localhost/) ha nella sezione _Tools_ un collegamento a _Add a Virtual Host_ che porta qui:

![WAMP Aggiungi Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Usando questo puoi impostare una voce VirtualHost che cadrà direttamente nel tuo repository (ancora) controllato da git.

Ecco una voce di esempio in `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Potresti anche aver bisogno di aggiungere una voce in `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Ora puoi installare su `http://xoops.localhost/` per il test, mantenendo il tuo repository intatto e mantenendo il webserver all'interno della directory htdocs con un URL semplice. Inoltre, puoi aggiornare la tua copia locale di XOOPS al master più recente in qualsiasi momento senza dover reinstallare o copiare file. E puoi apportare miglioramenti e correzioni al codice per contribuire a XOOPS tramite GitHub.

## Dipendenze Composer

XOOPS 2.7.0 utilizza [Composer](https://getcomposer.org/) per gestire le sue dipendenze PHP. L'albero delle dipendenze vive in `htdocs/xoops_lib/` all'interno del repository di origine:

* `composer.dist.json` è l'elenco principale delle dipendenze spedite con il rilascio.
* `composer.json` è la copia locale, che puoi personalizzare per il tuo ambiente di sviluppo se necessario.
* `composer.lock` fissa le versioni esatte in modo che gli install siano riproducibili.
* `vendor/` contiene le librerie installate (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom e altri).

Per un clone git fresco di XOOPS 2.7.0, a partire dalla radice del repo, esegui:

```text
cd htdocs/xoops_lib
composer install
```

Nota che non c'è `composer.json` nella radice del repo — il progetto vive sotto `htdocs/xoops_lib/`, quindi devi `cd` in quella directory prima di eseguire Composer.

Gli archivi di rilascio spediscono con `vendor/` pre-compilato, ma i cloni git potrebbero non farlo. Mantieni `vendor/` intatto su install di sviluppo — XOOPS caricherà le sue dipendenze da lì in fase di runtime.

La libreria [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) è spedita come dipendenza Composer in 2.7.0, quindi puoi usare `Xmf\Request`, `Xmf\Database\TableLoad` e classi correlate nel tuo codice del modulo senza nessuna installazione aggiuntiva.

## Modulo DebugBar

XOOPS 2.7.0 spedisce un modulo **DebugBar** basato su Symfony VarDumper. Aggiunge una barra degli strumenti di debug alle pagine renderizzate che espone le informazioni di richiesta, database e template. Installalo dall'area admin Moduli su siti di sviluppo e staging. Non lasciarlo installato su un sito di produzione pubblico a meno che tu non sappia che lo vuoi.
