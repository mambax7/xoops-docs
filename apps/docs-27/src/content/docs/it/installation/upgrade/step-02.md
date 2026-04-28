---
title: "Esecuzione aggiornamento"
---

Prima di eseguire l'aggiornatore principale, assicurati di aver completato il [Controllo di preflight](preflight.md). L'interfaccia utente di aggiornamento richiede che il preflight sia eseguito almeno una volta e ti guiderà lì se non l'hai fatto.

Avvia l'aggiornamento puntando il tuo browser alla directory _upgrade_ del tuo sito:

```text
http://example.com/upgrade/
```

Dovrebbe mostrare una pagina come questa:

![Avvio aggiornamento XOOPS](/xoops-docs/2.7/img/installation/upgrade-01.png)

Seleziona il pulsante "Continua" per procedere.

Ogni "Continua" avanza attraverso un'altra patch. Continua fino a quando tutte le patch non vengono applicate e viene presentata la pagina di aggiornamento del modulo di sistema.

![Patch aggiornamento XOOPS applicato](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Cosa applica l'aggiornamento 2.5.11 → 2.7.0

Quando si esegue l'aggiornamento da XOOPS 2.5.11 a 2.7.0, l'aggiornatore applica le seguenti patch. Ognuno viene presentato come un passaggio separato nella procedura guidata in modo da poter confermare cosa viene modificato:

1. **Rimuovi obsoleto PHPMailer in bundle.** La copia in bundle di PHPMailer all'interno del modulo Protector viene eliminata. PHPMailer ora viene fornito tramite Composer in `xoops_lib/vendor/`.
2. **Rimuovi cartella HTMLPurifier obsoleta.** Allo stesso modo, la vecchia cartella HTMLPurifier all'interno del modulo Protector viene eliminata. HTMLPurifier ora viene fornito tramite Composer.
3. **Crea la tabella `tokens`.** Una nuova tabella `tokens` viene aggiunta per l'archiviazione di token con ambito generico. La tabella ha colonne per ID token, ID utente, ambito, hash e timestamp emessi/scaduti/utilizzati ed è utilizzata dalle funzionalità basate su token in XOOPS 2.7.0.
4. **Amplia `bannerclient.passwd`.** La colonna `bannerclient.passwd` viene ampliata a `VARCHAR(255)` in modo da poter archiviare hash di password moderni (bcrypt, argon2) invece della colonna stretta legacy.
5. **Aggiungi preferenze cookie di sessione.** Due nuove preferenze vengono inserite: `session_cookie_samesite` (per l'attributo del cookie SameSite) e `session_cookie_secure` (per forzare i cookie solo HTTPS). Vedi [Dopo l'aggiornamento](step-04.md) per come rivedere queste dopo il completamento dell'aggiornamento.

Nessuno di questi passaggi tocca i dati del tuo contenuto. I tuoi utenti, post, immagini e dati dei moduli rimangono invariati.

## Scelta di una lingua

La distribuzione principale di XOOPS viene fornita con supporto in inglese. Il supporto per impostazioni locali aggiuntive è fornito dai [siti di supporto locale XOOPS](https://xoops.org/modules/xoopspartners/). Questo supporto può venire in forma di una distribuzione personalizzata o file aggiuntivi da aggiungere alla distribuzione principale.

Le traduzioni di XOOPS sono mantenute su [transifex](https://www.transifex.com/xoops/public/)

Se il tuo aggiornamento XOOPS ha supporto per lingue aggiuntive, puoi cambiare la lingua selezionando l'icona della lingua nei menu in alto e scegliendo una lingua diversa.

![Lingua aggiornamento XOOPS](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
