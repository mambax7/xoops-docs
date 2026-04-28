---
title: "Controllo di preflight"
---

XOOPS 2.7.0 ha aggiornato il suo motore di modellazione da Smarty 3 a Smarty 4. Smarty 4 è più severo riguardo alla sintassi del modello rispetto a Smarty 3 e alcuni temi personalizzati e modelli di moduli potrebbero aver bisogno di essere regolati prima che funzionino correttamente su XOOPS 2.7.0.

Per aiutare a identificare e riparare questi problemi _prima_ di eseguire l'aggiornatore principale, XOOPS 2.7.0 viene fornito con uno **scanner di preflight** nella directory `upgrade/`. Devi eseguire lo scanner di preflight almeno una volta prima che il flusso di lavoro dell'aggiornamento principale ti consenta di continuare.

## Cosa fa lo scanner

Lo scanner di preflight esamina i tuoi temi e modelli di moduli esistenti cercando incompatibilità note di Smarty 4. Può:

* **Scansionare** le tue directory `themes/` e `modules/` alla ricerca di file modello `.tpl` e `.html` che potrebbero aver bisogno di modifiche
* **Segnalare** i problemi raggruppati per file e per tipo di problema
* **Riparare automaticamente** molti problemi comuni quando glielo chiedi

Non ogni problema può essere riparato automaticamente. Alcuni modelli avranno bisogno di editing manuale, specialmente se utilizzano idiomi Smarty 3 più vecchi che non hanno equivalente diretto in Smarty 4.

## Esecuzione dello scanner

1. Copia la directory `upgrade/` della distribuzione nella radice web del tuo sito (se non lo hai già fatto come parte del passaggio [Preparazioni per l'aggiornamento](step-01.md)).
2. Punta il tuo browser all'URL di preflight:

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Accedi con un account amministratore quando richiesto.
4. Lo scanner presenta un modulo con tre controlli:
   * **Directory modello** — lascia vuoto per scansionare sia `themes/` che `modules/`. Inserisci un percorso come `/themes/mytheme/` per limitare la scansione a una singola directory.
   * **Estensione modello** — lascia vuoto per scansionare sia i file `.tpl` che `.html`. Inserisci una singola estensione per limitare la scansione.
   * **Tentativo di correzione automatica** — seleziona questa casella se vuoi che lo scanner ripari i problemi che sa come risolvere. Lasciala deselezionata per una scansione di sola lettura.
5. Premi il pulsante **Esegui**. Lo scanner esamina le directory selezionate e segnala ogni problema che trova.

## Interpretazione dei risultati

Il rapporto di scansione elenca ogni file che ha esaminato e ogni problema che ha trovato. Ogni voce del problema ti dice:

* Quale file contiene il problema
* Quale regola Smarty 4 viola
* Se lo scanner potrebbe ripararlo automaticamente

Se hai eseguito la scansione con _Tentativo di correzione automatica_ abilitato, il rapporto confermerà anche quali file sono stati riscritti.

## Correzione manuale dei problemi

Per i problemi che lo scanner non riesce a riparare automaticamente, apri il file modello segnalato in un editor e apporta le modifiche richieste. Le incompatibilità comuni di Smarty 4 includono:

* `{php} ... {/php}` blocchi (non più supportati in Smarty 4)
* Modificatori e chiamate di funzione deprecati
* Utilizzo di delimitatore sensibile agli spazi
* Assunzioni del plugin di registrazione che sono cambiate in Smarty 4

Se non sei a tuo agio con la modifica dei modelli, l'approccio più sicuro è passare a un tema spedito (`xbootstrap5`, `default`, `xswatch5`, ecc.) e affrontare il tema personalizzato separatamente dopo il completamento dell'aggiornamento.

## Ri-esecuzione fino al completamento

Dopo aver apportato correzioni — automatiche o manuali — ri-esegui lo scanner di preflight. Ripeti finché il rapporto di scansione non segnala più problemi.

Una volta che la scansione è pulita, puoi terminare la sessione di preflight premendo il pulsante **Esci da scanner** nell'interfaccia utente dello scanner. Questo segna il preflight come completato e consente all'aggiornatore principale su `/upgrade/` di procedere.

## Continuazione all'aggiornamento

Con il preflight completato, puoi avviare l'aggiornatore principale su:

```text
http://example.com/upgrade/
```

Vedi [Aggiornamento in esecuzione](step-02.md) per i passaggi successivi.

## Se salti il preflight

Saltare il preflight è fortemente sconsigliato, ma se hai aggiornato senza eseguirlo e ora stai vedendo errori di modello, vedi la sezione Errori di modello Smarty 4 di [Risoluzione dei problemi](step-03.md). Puoi eseguire il preflight dopo il fatto e cancellare `xoops_data/caches/smarty_compile/` per recuperare.
