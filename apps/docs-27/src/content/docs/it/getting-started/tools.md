---
title: "Strumenti del Mestiere"
---

Ci sono molte cose che sono necessarie per personalizzare e mantenere un sito web XOOPS che hanno bisogno di accadere al di fuori di XOOPS, o sono più facili da fare lì.

Questo è un elenco dei tipi di strumenti che potresti voler avere disponibili, insieme ad alcuni suggerimenti per strumenti specifici che gli amministratori web XOOPS hanno trovato utili.

## Editor

Gli editor sono una scelta molto personale, e le persone possono diventare abbastanza appassionate riguardo al loro preferito. Presenteremo solo alcune delle molte possibilità.

Per l'uso di XOOPS, avrai bisogno di un editor per modificare alcune opzioni di configurazione e personalizzare un tema per il tuo sito. Per questi usi, può essere molto utile avere un editor che possa lavorare con più file contemporaneamente, essere in grado di cercare e sostituire su molti file, e fornire evidenziazione della sintassi. Puoi usare un editor molto semplice, ma starai lavorando molto più duramente per accomplire alcuni compiti.

**PhpStorm** di _JetBrains_ è un IDE (integrated development environment) appositamente studato per lo sviluppo web PHP. _JetBrains_ è stato molto utile nel sponsorizzare XOOPS, e i suoi prodotti sono preferiti da molti sviluppatori. È un prodotto commerciale, e potrebbe essere proibitivo in termini di costi per alcuni webmaster nuovi, ma il tempo che può risparmiare lo rende attraente per gli sviluppatori esperti.

**Visual Studio Code** è un editor di codice sorgente gratuito e multipiattaforma di Microsoft. Ha il supporto, sia integrato che tramite estensioni, per le tecnologie web principali come HTML, JavaScript e PHP, il che lo rende una buona scelta per l'uso di XOOPS.

**Notepad++** è un contendente gratuito e di lunga data in questa categoria per Windows, con utenti fedeli.

**Meld** non è un editor, ma compara i file di testo mostrando le differenze, e consente di unire i cambiamenti selettivamente, e fare piccole modifiche. È molto utile quando si comparano file di configurazione, template di tema, e naturalmente codice PHP.

| Nome | Link | Licenza | Piattaforma |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Commercial | Any |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Any |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Any |

## Client FTP

File Transfer Protocol (FTP) o una variazione di esso, viene utilizzato per spostare i file da un computer a un altro. La maggior parte delle installazioni di XOOPS avrà bisogno di un client FTP per spostare i file che provengono dalla distribuzione XOOPS a un sistema host in cui il sito verrà distribuito.

**FileZilla** è un client FTP gratuito e potente che è disponibile per la maggior parte delle piattaforme. La coerenza multipiattaforma l'ha resa la scelta per gli esempi FTP in questo libro.

**PuTTY** è un client SSH gratuito, utile per l'accesso Shell a un server, oltre a fornire capacità di trasferimento di file con SCP

**WinSCP** è un client FTP/SFTP/SCP per sistemi Windows.

| Nome | Link | Licenza | Piattaforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Any |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

Il database contiene tutto il contenuto del tuo sito, le configurazioni che personalizzano il tuo sito, le informazioni su gli utenti del tuo sito, e altro. Proteggere e mantenere queste informazioni potrebbe essere più facile con alcuni strumenti extra che si occupano specificamente del database.

**phpMyAdmin** è lo strumento più popolare basato su web per lavorare con i database MySQL, incluso il fare backup una tantum.

**BigDump** è una benedizione per gli account di hosting limitato, dove aiuta nel ripristino di grandi dump di backup del database evitando timeout e limitazioni di dimensioni.

**srdb**, Search Replace DB per XOOPS è un adattamento XOOPS di [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) da interconnect/it. È particolarmente utile per cambiare URL e riferimenti del filesystem nei dati MySQL quando stai spostando un sito.

| Nome | Link | Licenza | Piattaforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Any |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Any |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Any |

## Stack per Sviluppatori

Alcune piattaforme, come Ubuntu, hanno l'intero stack necessario per eseguire XOOPS integrato, mentre altre hanno bisogno di alcuni add-on.

**WAMP** e **Uniform Server Zero** sono stack all-in-one per Windows.

**XAMPP**, uno stack all-in-one da Apache Friends, è disponibile per più piattaforme.

**bitnami** offre una vasta gamma di stack di applicazioni precostruite, incluse immagini di macchine virtuali e container. Le loro offerte possono essere una risorsa preziosa per provare rapidamente le applicazioni (incluso XOOPS) o varie tecnologie web. Possono essere adatte sia all'uso di sviluppo che di produzione.

**Docker** è una piattaforma di container di applicazioni, utilizzata per creare ed eseguire container per implementare ambienti personalizzati.

**Devilbox** è uno stack di sviluppo basato su Docker facilmente configurabile. Offre una vasta gamma di versioni per tutti i componenti dello stack, e consente agli sviluppatori di test in un ambiente riproducibile e condivisibile.

| Nome | Link | Licenza | Piattaforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Multiple | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Multiple | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Multiple | Any |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Multiple | Any |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Multiple | Any |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Any |
