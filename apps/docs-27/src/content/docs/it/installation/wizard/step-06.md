---
title: "Configurazione database"
---

Questa pagina raccoglie le informazioni sul database che XOOPS utilizzerà.

Dopo aver inserito le informazioni richieste e aver corretto eventuali problemi, seleziona il pulsante "Continua" per procedere.

![Configurazione database programma di installazione XOOPS](/xoops-docs/2.7/img/installation/installer-06.png)

## Dati raccolti in questo passaggio

### Database

#### Nome database

Il nome del database sull'host che XOOPS dovrebbe usare. L'utente del database inserito nel passaggio precedente dovrebbe avere tutti i privilegi su questo database. Il programma di installazione tenterà di creare questo database se non esiste.

#### Prefisso tabella

Questo prefisso verrà aggiunto ai nomi di tutte le nuove tabelle create da XOOPS. Questo aiuta a evitare conflitti di nomi se il database è condiviso con altre applicazioni. Un prefisso unico rende anche più difficile indovinare i nomi delle tabelle, che ha vantaggi per la sicurezza. Se non sei sicuro, mantieni il valore predefinito

#### Set di caratteri database

Il programma di installazione utilizza come predefinito `utf8mb4`, che supporta l'intera gamma Unicode inclusi emoji e caratteri supplementari. Puoi selezionare un set di caratteri diverso qui, ma `utf8mb4` è consigliato per praticamente tutte le lingue e le impostazioni locali e dovrebbe essere lasciato così com'è a meno che tu non abbia un motivo specifico per modificarlo.

#### Collazione database

Il campo collazione viene lasciato vuoto per impostazione predefinita. Quando è vuoto, MySQL applica la collazione predefinita per qualunque set di caratteri sia stato selezionato sopra (per `utf8mb4` questo è tipicamente `utf8mb4_general_ci` o `utf8mb4_0900_ai_ci`, a seconda della versione di MySQL). Se hai bisogno di una collazione specifica — ad esempio per abbinare un database esistente — selezionala qui. Altrimenti, lasciarlo vuoto è la scelta consigliata.
