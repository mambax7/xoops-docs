---
title: "Risoluzione dei problemi"
---

## Errori modello Smarty 4

La classe più comune di problemi durante l'aggiornamento da XOOPS 2.5.x a 2.7.0 è l'incompatibilità del modello Smarty 4. Se hai saltato o non hai completato il [Controllo di preflight](preflight.md), potresti vedere errori di modello nella parte anteriore o nell'area admin dopo l'aggiornamento.

Per recuperare:

1. **Ri-esegui lo scanner di preflight** su `/upgrade/preflight.php`. Applica eventuali correzioni automatiche che offre, o correggi manualmente i modelli contrassegnati.
2. **Cancella la cache del modello compilato.** Rimuovi tutto tranne `index.html` da `xoops_data/caches/smarty_compile/`. I modelli compilati di Smarty 3 non sono compatibili con Smarty 4 e i file obsoleti possono causare errori confusi.
3. **Passa temporaneamente a un tema spedito.** Dall'area admin, seleziona `xbootstrap5` o `default` come tema attivo. Questo confermerà se il problema è limitato a un tema personalizzato o è a livello di sito.
4. **Convalida i temi personalizzati e i modelli di moduli** prima di commutare il traffico di produzione di nuovo. Presta particolare attenzione ai modelli che utilizzano blocchi `{php}`, modificatori deprecati o sintassi delimitatore non standard — questi sono i problemi Smarty 4 più comuni.

Vedi anche la sezione Smarty 4 in [Argomenti speciali](../../installation/specialtopics.md).

## Problemi di autorizzazione

L'aggiornamento XOOPS potrebbe aver bisogno di scrivere su file che sono stati precedentemente resi di sola lettura. Se è il caso, vedrai un messaggio come questo:

![Errore XOOPS aggiornamento rendi scrivibile](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

La soluzione è cambiare le autorizzazioni. Puoi modificare le autorizzazioni usando FTP se non hai un accesso più diretto. Ecco un esempio usando FileZilla:

![FileZilla Modifica autorizzazione](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Output di debug

Puoi abilitare output di debug aggiuntivo nel logger aggiungendo un parametro di debug all'URL utilizzato per avviare l'aggiornamento:

```text
http://example.com/upgrade/?debug=1
```
