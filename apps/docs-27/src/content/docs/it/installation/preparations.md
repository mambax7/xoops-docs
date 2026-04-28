---
title: "phpinfo"
---

Questo passaggio è opzionale, ma può facilmente farti risparmiare ore di frustrazione.

Come test pre-installazione del sistema di hosting, uno script PHP molto piccolo, ma utile viene creato localmente e caricato sul sistema di destinazione.

Lo script PHP è una sola riga:

```php
<?php phpinfo();
```

Usando un editor di testo, crea un file denominato _info.php_ con questa riga.

Successivamente, carica questo file nella tua radice web.

![Filezilla info.php Caricamento](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Accedi al tuo script aprendolo nel tuo browser, ad es. accedendo a `http://example.com/info.php`. Se tutto funziona correttamente, dovresti vedere una pagina come questa:

![phpinfo() Esempio](/xoops-docs/2.7/img/installation/php-info.png)

Nota: alcuni servizi di hosting potrebbero disabilitare la funzione _phpinfo()_ come misura di sicurezza. Di solito riceverai un messaggio a tal proposito, se è il caso.

L'output dello script potrebbe tornare utile per la risoluzione dei problemi, quindi considera di salvarne una copia.

Se il test funziona, dovresti essere pronto per l'installazione. Dovresti eliminare lo script _info.php_ e procedere con l'installazione.

Se il test non riesce, indaga il motivo! Qualsiasi problema che impedisce questo test semplice dal funzionamento **impedirà** un'installazione reale di funzionare.
