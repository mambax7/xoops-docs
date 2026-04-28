---
title: "Configura Email"
---

![XOOPS Email Configuration](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS si affida all'email per molte interazioni critiche degli utenti, come la validazione di una registrazione o il ripristino di una password. È quindi importante che sia configurata correttamente.

Configurare l'email del sito può essere molto facile in alcuni casi e frustrante in altri.

Ecco alcuni suggerimenti per aiutare a far riuscire la tua configurazione.

## Metodo di Consegna Email

Questa sezione della configurazione ha 4 valori possibili

* **PHP Mail()** - il modo più facile, se disponibile. Dipende dal programma _sendmail_ del sistema.
* **sendmail** - Un'opzione robusta, ma spesso bersaglio di SPAM sfruttando le debolezze di altri software.
* **SMTP** - Simple Mail Transfer Protocol di solito non è disponibile nei nuovi account di hosting a causa di preoccupazioni di sicurezza e potenziale abuso. È stato in gran parte sostituito da SMTP Auth.
* **SMTP Auth** - SMTP con Autorizzazione è di solito preferito al plain SMTP. In questo caso XOOPS si connette direttamente al server di posta in modo più sicuro.

## Host SMTP

Se devi usare SMTP, con o senza "Auth", dovrai specificare un nome di server qui. Questo nome può essere un semplice hostname o indirizzo IP, oppure può includere informazioni aggiuntive su porta e protocollo. Il caso più semplice sarebbe `localhost` per un server SMTP (senza auth) in esecuzione sulla stessa macchina con il server web.

SMTP username e SMTP password sono sempre richiesti quando si usa SMTP Auth. È possibile specificare TLS o SSL, così come una porta nel campo di configurazione XOOPS SMTP Hosts.

Questo potrebbe essere usato per connettersi a Gmail SMTP: `tls://smtp.gmail.com:587`

Un altro esempio che usa SSL: `ssl://mail.example.com:465`

## Suggerimenti per la Risoluzione dei Problemi

A volte, le cose non vanno così lisce come speriamo. Ecco alcuni suggerimenti e risorse che potrebbero aiutare.

### Controlla la documentazione del tuo provider di hosting

Quando stabilisci il servizio di hosting con un provider, dovrebbe fornirti informazioni su come accedere ai server di posta. Vuoi avere questo disponibile quando configuri l'email per il tuo sistema XOOPS.

### XOOPS Usa PHPMailer

XOOPS usa la libreria [PHPMailer](https://github.com/PHPMailer/PHPMailer). La sezione di [risoluzione dei problemi](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) nel wiki offre alcuni spunti.
