---
title: "Procedura guidata di installazione"
description: "Procedura dettagliata della procedura guidata di installazione XOOPS — 15 schermate spiegate."
---

La procedura guidata di installazione di XOOPS ti guida attraverso un processo di 15 passaggi che configura il tuo database, crea l'account admin e prepara il tuo sito per il primo utilizzo.

## Prima di iniziare

- Hai [caricato XOOPS sul tuo server](/xoops-docs/2.7/installation/ftp-upload/) o configurato un ambiente locale
- Hai [verificato i requisiti](/xoops-docs/2.7/installation/requirements/)
- Hai le tue credenziali di database pronte

## Passaggi della procedura guidata

| Passaggio | Schermata | Cosa accade |
|------|--------|--------------|
| 1 | [Selezione lingua](./step-01/) | Scegli lingua di installazione |
| 2 | [Benvenuto](./step-02/) | Accordo di licenza |
| 3 | [Verifica configurazione](./step-03/) | Verifica ambiente PHP/server |
| 4 | [Impostazione percorso](./step-04/) | Imposta percorso root e URL |
| 5 | [Connessione database](./step-05/) | Inserisci host database, utente, password |
| 6 | [Configurazione database](./step-06/) | Imposta nome database e prefisso tabella |
| 7 | [Salva configurazione](./step-07/) | Scrivi mainfile.php |
| 8 | [Creazione tabelle](./step-08/) | Crea lo schema del database |
| 9 | [Impostazioni iniziali](./step-09/) | Nome sito, email admin |
| 10 | [Inserimento dati](./step-10/) | Popola dati predefiniti |
| 11 | [Configurazione sito](./step-11/) | URL, fuso orario, lingua |
| 12 | [Seleziona tema](./step-12/) | Scegli un tema predefinito |
| 13 | [Installazione moduli](./step-13/) | Installa moduli in bundle |
| 14 | [Benvenuto](./step-14/) | Messaggio di installazione completata |
| 15 | [Pulizia](./step-15/) | Rimuovi cartella di installazione |

:::caution[Sicurezza]
Dopo aver completato la procedura guidata, **elimina o rinomina la cartella `install/`** — il passaggio 15 ti guida attraverso questo. Lasciarlo accessibile è un rischio di sicurezza.
:::
