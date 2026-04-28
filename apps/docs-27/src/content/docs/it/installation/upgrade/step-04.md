---
title: "Dopo l'aggiornamento"
---

## Aggiorna il modulo di sistema

Dopo che tutte le patch necessarie sono state applicate, selezionando _Continua_ imposterà tutto per aggiornare il modulo **sistema**. Questo è un passaggio molto importante ed è necessario per completare correttamente l'aggiornamento.

![Aggiornamento modulo di sistema XOOPS](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Seleziona _Aggiorna_ per eseguire l'aggiornamento del modulo di sistema.

## Aggiorna altri moduli forniti da XOOPS

XOOPS viene fornito con tre moduli facoltativi - pm (Messaggistica privata,) profilo (Profilo utente) e protector (Protector). Dovresti fare un aggiornamento su uno di questi moduli che sono installati.

![Aggiornamento altri moduli XOOPS](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Aggiorna altri moduli

È probabile che ci siano aggiornamenti ad altri moduli che potrebbero consentire ai moduli di funzionare meglio nel tuo XOOPS ora aggiornato. Dovresti indagare e applicare eventuali aggiornamenti di moduli appropriati.

## Rivedi le nuove preferenze di rafforzamento dei cookie

L'aggiornamento XOOPS 2.7.0 aggiunge due nuove preferenze che controllano come vengono emessi i cookie di sessione:

* **`session_cookie_samesite`** — controlla l'attributo del cookie SameSite. `Lax` è un'impostazione predefinita sicura per la maggior parte dei siti. Usa `Strict` per la massima protezione se il tuo sito non si basa su navigazione cross-origin. `None` è appropriato solo se sai che ne hai bisogno.
* **`session_cookie_secure`** — quando abilitato, il cookie di sessione viene inviato solo su connessioni HTTPS. Attiva questo se il tuo sito viene eseguito su HTTPS.

Puoi rivedere queste impostazioni in Opzioni di sistema → Preferenze → Impostazioni generali.

## Convalida temi personalizzati

Se il tuo sito utilizza un tema personalizzato, procedi attraverso la parte anteriore e l'area admin per confermare che le pagine vengono visualizzate correttamente. L'aggiornamento a Smarty 4 potrebbe influire sui modelli personalizzati anche se la scansione di preflight è passata. Se vedi problemi di rendering, rivisita [Risoluzione dei problemi](step-03.md).

## Pulisci file di installazione e aggiornamento

Per motivi di sicurezza, rimuovi queste directory dalla tua radice web una volta che l'aggiornamento è confermato funzionante:

* `upgrade/` — directory del flusso di lavoro di aggiornamento
* `install/` — se presente, come `install/` o come directory rinominata `installremove*`

Lasciare questi in posizione espone gli script di aggiornamento e installazione a chiunque possa raggiungere il tuo sito.

## Apri il tuo sito

Se hai seguito il consiglio di _Spegni il sito_, dovresti accenderlo una volta che hai determinato che funziona correttamente.
