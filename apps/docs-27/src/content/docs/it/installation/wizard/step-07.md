---
title: "Salva configurazione"
---

Questa pagina visualizza i risultati del salvataggio delle informazioni di configurazione che hai inserito fino a questo momento.

Dopo aver rivisto e corretto eventuali problemi, seleziona il pulsante "Continua" per procedere.

## Successo

La sezione _Salvataggio della configurazione del sistema_ mostra le informazioni che sono state salvate. Le impostazioni vengono salvate in uno dei due file. Un file è _mainfile.php_ nella radice web. L'altro è _data/secure.php_ nella directory _xoops_data_.

![Salva configurazione del programma di installazione XOOPS](/xoops-docs/2.7/img/installation/installer-07.png)

Entrambi i file vengono generati da file modello spediti con XOOPS 2.7.0:

* `mainfile.php` viene generato da `mainfile.dist.php` nella radice web.
* `xoops_data/data/secure.php` viene generato da `xoops_data/data/secure.dist.php`.

Oltre ai percorsi e all'URL che hai inserito, `mainfile.php` ora include diversi costanti che sono nuovi in XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — mantenuto come alias retrocompatibile di `XOOPS_PATH`; non è necessario configurarlo separatamente.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — impostazione predefinita `true`; utilizza l'elenco di suffissi pubblici per derivare il dominio cookie corretto.
* `XOOPS_DB_LEGACY_LOG` — impostazione predefinita `false`; imposta `true` in sviluppo per registrare l'utilizzo di API di database legacy.
* `XOOPS_DEBUG` — impostazione predefinita `false`; imposta `true` in sviluppo per abilitare la segnalazione degli errori aggiuntivi.

Non è necessario modificare questi manualmente durante l'installazione — le impostazioni predefinite sono appropriate per un sito di produzione. Sono menzionati qui in modo che tu sappia cosa cercare se apri `mainfile.php` più tardi.

## Errori

Se XOOPS rileva errori nella scrittura dei file di configurazione, visualizzerà messaggi, descrivendo in dettaglio cosa non va.

![Errori di salvataggio della configurazione del programma di installazione XOOPS](/xoops-docs/2.7/img/installation/installer-07-errors.png)

In molti casi, un'installazione predefinita di un sistema derivato da Debian che utilizza mod_php in Apache è la fonte degli errori. La maggior parte dei provider di hosting non ha questi problemi.

### Problemi di autorizzazione di gruppo

Il processo PHP viene eseguito utilizzando le autorizzazioni di un utente. Anche i file sono di proprietà di un utente. Se questi due non sono lo stesso utente, le autorizzazioni di gruppo possono essere utilizzate per consentire al processo PHP di condividere file con il tuo account utente. Questo di solito significa che devi modificare il gruppo dei file e delle directory di cui XOOPS ha bisogno per scrivere.

Per la configurazione predefinita menzionata sopra, significa che il gruppo _www-data_ deve essere specificato come il gruppo per i file e le directory, e quei file e directory devono essere scrivibili per il gruppo.

Dovresti controllare attentamente la tua configurazione e scegliere attentamente come risolvere questi problemi per una scatola disponibile su Internet aperto.

Comandi di esempio potrebbero essere:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Impossibile creare mainfile.php

Nei sistemi simili a Unix, l'autorizzazione per creare un nuovo file dipende dalle autorizzazioni concesse sulla cartella padre. In alcuni casi quell'autorizzazione non è disponibile e concederla potrebbe essere una preoccupazione per la sicurezza.

Se hai una configurazione problematica, puoi trovare un dummy _mainfile.php_ nella directory _extras_ nella distribuzione XOOPS. Copia quel file nella radice web e imposta le autorizzazioni sul file:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Ambienti SELinux

I contesti di sicurezza di SELinux possono essere una fonte di problemi. Se questo potrebbe applicarsi, fai riferimento a [Argomenti speciali](../specialtopics.md) per ulteriori informazioni.
