---
title: "Linee Guida Segnalazione Problemi"
description: "Come segnalare bug, richieste di funzionalità e altri problemi in modo efficace"
---

> Le segnalazioni di bug e richieste di funzionalità efficaci sono cruciali per lo sviluppo di XOOPS. Questa guida ti aiuta a creare problemi di alta qualità.

---

## Prima di Segnalare

### Controlla Problemi Esistenti

**Cerca sempre prima:**

1. Vai a [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
2. Cerca per parole chiave correlate al tuo problema
3. Controlla problemi chiusi - potrebbero essere già risolti
4. Guarda pull request - potrebbero essere in corso

Usa filtri di ricerca:
- `is:issue is:open label:bug` - Bug aperti
- `is:issue is:open label:feature` - Richieste funzionalità aperte
- `is:issue sort:updated` - Problemi aggiornati di recente

### È Davvero un Problema?

Considera prima:

- **Problema configurazione?** - Controlla la documentazione
- **Domanda di utilizzo?** - Chiedi su forum o comunità Discord
- **Problema sicurezza?** - Vedi sezione #security-issues sotto
- **Specifico del modulo?** - Segnala al manutentore del modulo
- **Specifico del tema?** - Segnala all'autore del tema

---

## Tipi di Problema

### Segnalazione Bug

Un bug è un comportamento inaspettato o difetto.

**Esempi:**
- Login non funziona
- Errori database
- Validazione form mancante
- Vulnerabilità sicurezza

### Richiesta di Funzionalità

Una richiesta di funzionalità è un suggerimento per nuova funzionalità.

**Esempi:**
- Aggiungi supporto per nuova funzionalità
- Migliora funzionalità esistente
- Aggiungi documentazione mancante
- Miglioramenti performance

### Miglioramento

Un miglioramento migliora la funzionalità esistente.

**Esempi:**
- Messaggi errore migliori
- Performance migliorata
- Design API migliore
- Esperienza utente migliore

### Documentazione

I problemi di documentazione includono documentazione mancante o errata.

**Esempi:**
- Documentazione API incompleta
- Guide obsolete
- Esempi codice mancanti
- Errori di battitura in documentazione

---

## Segnalare un Bug

### Template Segnalazione Bug

```markdown
## Descrizione
Breve, chiara descrizione del bug.

## Step per Riprodurre
1. Step uno
2. Step due
3. Step tre

## Comportamento Atteso
Cosa dovrebbe accadere.

## Comportamento Effettivo
Cosa accade effettivamente.

## Ambiente
- Versione XOOPS: X.Y.Z
- Versione PHP: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Sistema Operativo: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshot
Se applicabile, aggiungi screenshot che mostrino il problema.

## Contesto Aggiuntivo
Qualsiasi altra informazione rilevante.

## Possibile Fix
Se hai suggerimenti per risolvere il problema (opzionale).
```

### Esempio Buona Segnalazione Bug

```markdown
## Descrizione
La pagina di login mostra pagina bianca quando la connessione database fallisce.

## Step per Riprodurre
1. Arresta il servizio MySQL
2. Naviga alla pagina di login
3. Osserva il comportamento

## Comportamento Atteso
Mostra un messaggio di errore user-friendly che spiega il problema di connessione database.

## Comportamento Effettivo
La pagina è completamente bianca - nessun messaggio di errore, nessuna interfaccia visibile.

## Ambiente
- Versione XOOPS: 2.7.0
- Versione PHP: 8.0.28
- Database: MySQL 5.7
- Sistema Operativo: Ubuntu 20.04
- Browser: Chrome 120

## Contesto Aggiuntivo
Questo probabilmente affetta altre pagine anche. L'errore dovrebbe essere visualizzato agli admin o registrato appropriatamente.

## Possibile Fix
Controlla connessione database in header.php prima di renderizzare il template.
```

### Esempio Cattiva Segnalazione Bug

```markdown
## Descrizione
Login non funziona

## Step per Riprodurre
Non funziona

## Comportamento Atteso
Dovrebbe funzionare

## Comportamento Effettivo
Non funziona

## Ambiente
Versione più recente
```

---

## Segnalare una Richiesta di Funzionalità

### Template Richiesta di Funzionalità

```markdown
## Descrizione
Descrizione chiara e concisa della funzionalità.

## Dichiarazione Problema
Perché è necessaria questa funzionalità? Quale problema risolve?

## Soluzione Proposta
Descrivi la tua implementazione ideale o UX.

## Alternative Considerate
Ci sono altri modi per raggiungere questo obiettivo?

## Contesto Aggiuntivo
Qualsiasi mockup, esempio, o riferimento.

## Impatto Atteso
Come beneficierebbe gli utenti? Sarebbe breaking?
```

### Esempio Buona Richiesta di Funzionalità

```markdown
## Descrizione
Aggiungi autenticazione doppio fattore (2FA) per account utente.

## Dichiarazione Problema
Con aumenti violazioni sicurezza, molte piattaforme CMS ora offrono 2FA. Gli utenti XOOPS vogliono sicurezza account più forte oltre password.

## Soluzione Proposta
Implementa 2FA basato su TOTP (compatibile con Google Authenticator, Authy, ecc.).
- Gli utenti possono abilitare 2FA nel loro profilo
- Visualizza QR code per setup
- Genera codici di backup per recupero
- Richiedi codice 2FA al login

## Alternative Considerate
- 2FA basato su SMS (richiede integrazione carrier, meno sicuro)
- Chiavi hardware (troppo complesso per utenti medi)

## Contesto Aggiuntivo
Simile a implementazioni GitHub, GitLab, e WordPress.
Riferimento: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Impatto Atteso
Aumenta sicurezza account. Potrebbe essere opzionale inizialmente, obbligatorio in future versioni.
```

---

## Problemi Sicurezza

### NON Segnalare Pubblicamente

**Mai creare un problema pubblico per vulnerabilità di sicurezza.**

### Segnala Privatamente

1. **Email il team sicurezza:** security@xoops.org
2. **Includi:**
   - Descrizione della vulnerabilità
   - Step per riprodurre
   - Impatto potenziale
   - Tue informazioni di contatto

### Responsible Disclosure

- Riconosceremo ricezione entro 48 ore
- Forniremo aggiornamenti ogni 7 giorni
- Lavoreremo su una timeline fix
- Puoi richiedere credito per la scoperta
- Coordina timing divulgazione pubblica

### Esempio Problema Sicurezza

```
Soggetto: [SECURITY] Vulnerabilità XSS in Modulo Commenti

Descrizione:
Il form commenti nel modulo Publisher non escapa correttamente l'input utente,
permettendo attacchi XSS memorizzati.

Step per Riprodurre:
1. Crea un commento con: <img src=x onerror="alert('xss')">
2. Invia il form
3. JavaScript viene eseguito quando visualizzando il commento

Impatto:
Gli attaccanti possono rubare token sessione utente, eseguire azioni come utenti,
o deturpare il sito web.

Ambiente:
- XOOPS 2.7.0
- Modulo Publisher 1.x
```

---

## Best Practice Titolo Problema

### Buoni Titoli

```
✅ La pagina login mostra errore bianco quando connessione database fallisce
✅ Aggiungi supporto autenticazione doppio fattore
✅ Validazione form non previene SQL injection nel campo nome
✅ Migliora performance della query lista utenti
✅ Aggiorna documentazione installazione per PHP 8.2
```

### Cattivi Titoli

```
❌ Bug nel sistema
❌ Aiutami!!
❌ Non funziona
❌ Domanda su XOOPS
❌ Errore
```

### Linee Guida Titolo

- **Sii specifico** - Menziona cosa e dove
- **Sii conciso** - Sotto 75 caratteri
- **Usa presente** - "mostra pagina bianca" non "ha mostrato pagina bianca"
- **Includi contesto** - "nel pannello admin", "durante installazione"
- **Evita parole generiche** - Non "fix", "aiuta", "problema"

---

## Best Practice Descrizione Problema

### Includi Informazioni Essenziali

1. **Cosa** - Descrizione chiara del problema
2. **Dove** - Quale pagina, modulo, o funzionalità
3. **Quando** - Step per riprodurre
4. **Ambiente** - Versione, OS, browser, PHP
5. **Perché** - Perché è importante

### Usa Formattazione Codice

```markdown
Messaggio errore: `Error: Cannot find user`

Snippet codice:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Includi Screenshot

Per problemi UI, includi:
- Screenshot del problema
- Screenshot del comportamento atteso
- Annota cosa è sbagliato (frecce, cerchi)

### Usa Etichette

Aggiungi etichette per categorizzare:
- `bug` - Segnalazione bug
- `enhancement` - Richiesta miglioramento
- `documentation` - Problema documentazione
- `help wanted` - Cercando aiuto
- `good first issue` - Buono per nuovi contributori

---

## Dopo la Segnalazione

### Sii Responsivo

- Controlla domande nei commenti del problema
- Fornisci informazioni aggiuntive se richieste
- Testa fix suggeriti
- Verifica bug ancora esiste con nuove versioni

### Segui Etichetta

- Sii rispettoso e professionale
- Assumi buone intenzioni
- Non esigere fix - gli sviluppatori sono volontari
- Offri di aiutare se possibile
- Ringrazia i contributori per il loro lavoro

### Mantieni Problema Focalizzato

- Resta in argomento
- Non discutere problemi non correlati
- Collega a problemi correlati invece
- Non usare problemi per votazione funzionalità

---

## Cosa Accade ai Problemi

### Processo Triage

1. **Nuovo problema creato** - GitHub notifica i manutentori
2. **Revisione iniziale** - Controllato per chiarezza e duplicati
3. **Assegnazione etichette** - Categorizzato e prioritizzato
4. **Assegnazione** - Assegnato a qualcuno se appropriato
5. **Discussione** - Informazioni aggiuntive raccolte se necessario

### Livelli Priorità

- **Critica** - Perdita dati, sicurezza, rottura completa
- **Alta** - Funzionalità principale rotta, affetta molti utenti
- **Media** - Parte di funzionalità rotta, workaround disponibile
- **Bassa** - Problema minore, cosmetico, o caso d'uso di nicchia

### Risultati Risoluzione

- **Risolto** - Problema risolto in una PR
- **Non risolveremo** - Rifiutato per ragioni tecniche o strategiche
- **Duplicato** - Stesso di un altro problema
- **Non valido** - Non è effettivamente un problema
- **Necessita più info** - In attesa di dettagli aggiuntivi

---

## Esempi Problemi

### Esempio: Buona Segnalazione Bug

```markdown
## Descrizione
Gli utenti admin non possono eliminare articoli quando usano MySQL con strict mode abilitato.

## Step per Riprodurre
1. Abilita `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Naviga al pannello admin Publisher
3. Clicca bottone elimina su qualsiasi articolo
4. L'errore è mostrato

## Comportamento Atteso
L'articolo dovrebbe essere eliminato o mostrare errore significativo.

## Comportamento Effettivo
Errore: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Ambiente
- Versione XOOPS: 2.7.0
- Versione PHP: 8.2.0
- Database: MySQL 8.0.32 con STRICT_TRANS_TABLES
- Sistema Operativo: Ubuntu 22.04
- Browser: Firefox 120

## Screenshot
[Screenshot del messaggio errore]

## Contesto Aggiuntivo
Questo accade solo con strict SQL mode. Funziona bene con impostazioni default.
La query è in class/PublisherItem.php:248

## Possibile Fix
Usa single quote attorno a 'deleted_at' o usa backtick per tutti i nomi colonna.
```

### Esempio: Buona Richiesta Funzionalità

```markdown
## Descrizione
Aggiungi endpoint API REST per accesso sola lettura al contenuto pubblico.

## Dichiarazione Problema
Gli sviluppatori vogliono costruire app mobili e servizi esterni usando dati XOOPS.
Attualmente limitato a API SOAP che è obsoleta e scarsamente documentata.

## Soluzione Proposta
Implementa API RESTful con:
- Endpoint per articoli, utenti, commenti (sola lettura)
- Autenticazione basata token
- Standard HTTP status code e errori
- Documentazione OpenAPI/Swagger
- Supporto paginazione

## Alternative Considerate
- API SOAP potenziata (legacy, non compliant standard)
- GraphQL (più complesso, forse futuro)

## Contesto Aggiuntivo
Vedi refactoring API modulo Publisher per pattern simili.
Allineerebbe con pratiche sviluppo web moderne.

## Impatto Atteso
Abilita ecosistema di strumenti terze parti e app mobili.
Migliorerebbe adozione XOOPS e ecosistema.
```

---

## Documentazione Correlata

- Codice di Condotta
- Workflow Contribuzione
- Linee Guida Pull Request
- Panoramica Contribuzione

---

#xoops #issues #bug-reporting #feature-requests #github
