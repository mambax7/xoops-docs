---
title: "Publisher - Configurazione autorizzazioni"
description: "Guida completa alla configurazione dei permessi di gruppo e del controllo degli accessi in Publisher"
---

# Configurazione autorizzazioni Publisher

> Guida completa alla configurazione dei permessi di gruppo, al controllo degli accessi e alla gestione dell'accesso degli utenti in Publisher.

---

## Nozioni di base sulle autorizzazioni

### Cosa sono le autorizzazioni?

Le autorizzazioni controllano ciò che i diversi gruppi di utenti possono fare in Publisher:

```
Chi può:
  - Visualizzare articoli
  - Inviare articoli
  - Modificare articoli
  - Approvare articoli
  - Gestire categorie
  - Configurare impostazioni
```

### Livelli di autorizzazione

```
Anonimo
  └── Visualizza solo articoli pubblicati

Utenti registrati
  ├── Visualizza articoli
  ├── Invia articoli (in attesa di approvazione)
  └── Modifica propri articoli

Editor/Moderatori
  ├── Tutti i permessi utenti registrati
  ├── Approva articoli
  ├── Modifica tutti gli articoli
  └── Gestisci alcune categorie

Amministratori
  └── Accesso completo a tutto
```

---

## Navigazione alla gestione autorizzazioni

### Quick Access

1. Accedi come **Amministratore**
2. Vai a **Admin → Moduli**
3. Fai clic su **Publisher → Admin**
4. Fai clic su **Autorizzazioni** nel menu sinistro

---

## Autorizzazioni globali

### Autorizzazioni a livello di modulo

Controlla l'accesso al modulo Publisher e alle funzionalità:

```yaml
Configurazione visualizzazione autorizzazioni:
- Visualizza articoli: Tutti possono visualizzare
- Invia articoli: Utenti registrati
- Modifica articoli propri: Utenti registrati
- Modifica tutti gli articoli: Editor+
- Approva articoli: Editor+
- Gestisci categorie: Admin
- Accesso pannello admin: Editor+
```

### Descrizioni autorizzazioni

| Autorizzazione | Utenti | Effetto |
|------------|-------|--------|
| **Visualizza articoli** | Tutti i gruppi | Può vedere articoli pubblicati nel front-end |
| **Invia articoli** | Registrati+ | Può creare nuovi articoli (in attesa di approvazione) |
| **Modifica articoli propri** | Registrati+ | Può modificare/eliminare i propri articoli |
| **Modifica tutti gli articoli** | Editor+ | Può modificare articoli di qualsiasi utente |
| **Elimina articoli propri** | Registrati+ | Può eliminare i propri articoli non pubblicati |
| **Elimina tutti gli articoli** | Editor+ | Può eliminare qualsiasi articolo |
| **Approva articoli** | Editor+ | Può pubblicare articoli in sospeso |
| **Gestisci categorie** | Admin | Crea, modifica, elimina categorie |
| **Accesso admin** | Editor+ | Accedi all'interfaccia amministrativa |

---

## Configura autorizzazioni globali

### Passaggio 1: Accedi alle impostazioni autorizzazioni

1. Vai a **Admin → Moduli**
2. Trova **Publisher**
3. Fai clic su **Autorizzazioni** (o Admin link poi Autorizzazioni)
4. Vedi matrice di autorizzazioni

### Passaggio 2: Imposta autorizzazioni di gruppo

Per ogni gruppo, configura cosa possono fare:

#### Utenti anonimi

```yaml
Autorizzazioni gruppo anonimo:
  Visualizza articoli: ✓ SÌ
  Invia articoli: ✗ NO
  Modifica articoli: ✗ NO
  Elimina articoli: ✗ NO
  Approva articoli: ✗ NO
  Gestisci categorie: ✗ NO
  Accesso admin: ✗ NO

Risultato: Gli utenti anonimi possono solo visualizzare contenuto pubblicato
```

#### Utenti registrati

```yaml
Autorizzazioni gruppo registrato:
  Visualizza articoli: ✓ SÌ
  Invia articoli: ✓ SÌ (con approvazione richiesta)
  Modifica articoli propri: ✓ SÌ
  Modifica tutti gli articoli: ✗ NO
  Elimina articoli propri: ✓ SÌ (solo bozze)
  Elimina tutti gli articoli: ✗ NO
  Approva articoli: ✗ NO
  Gestisci categorie: ✗ NO
  Accesso admin: ✗ NO

Risultato: Gli utenti registrati possono contribuire al contenuto dopo l'approvazione
```

#### Gruppo Editor

```yaml
Autorizzazioni gruppo Editor:
  Visualizza articoli: ✓ SÌ
  Invia articoli: ✓ SÌ
  Modifica articoli propri: ✓ SÌ
  Modifica tutti gli articoli: ✓ SÌ
  Elimina articoli propri: ✓ SÌ
  Elimina tutti gli articoli: ✓ SÌ
  Approva articoli: ✓ SÌ
  Gestisci categorie: ✓ LIMITATO
  Accesso admin: ✓ SÌ
  Configura impostazioni: ✗ NO

Risultato: Gli editor gestiscono il contenuto ma non le impostazioni
```

#### Amministratori

```yaml
Autorizzazioni gruppo Admin:
  ✓ ACCESSO COMPLETO a tutte le funzionalità

  - Tutti i permessi dell'editor
  - Gestisci tutte le categorie
  - Configura tutte le impostazioni
  - Gestisci autorizzazioni
  - Installa/disinstalla
```

### Passaggio 3: Salva autorizzazioni

1. Configura autorizzazioni di ogni gruppo
2. Seleziona le caselle per azioni consentite
3. Deseleziona le caselle per azioni negate
4. Fai clic su **Salva autorizzazioni**
5. Viene visualizzato un messaggio di conferma

---

## Autorizzazioni a livello di categoria

### Imposta accesso categoria

Controlla chi può visualizzare/inviare a categorie specifiche:

```
Admin → Publisher → Categorie
→ Seleziona categoria → Autorizzazioni
```

### Matrice autorizzazioni categoria

```
                 Anonimo  Registrato  Editor  Admin
Visualizza categoria    ✓      ✓        ✓      ✓
Invia a categoria       ✗      ✓        ✓      ✓
Modifica proprio        ✗      ✓        ✓      ✓
Modifica tutto          ✗      ✗        ✓      ✓
Approva in categoria    ✗      ✗        ✓      ✓
Gestisci categoria      ✗      ✗        ✗      ✓
```

### Configura autorizzazioni categoria

1. Vai all'admin **Categorie**
2. Trova categoria
3. Fai clic sul pulsante **Autorizzazioni**
4. Per ogni gruppo, seleziona:
   - [ ] Visualizza questa categoria
   - [ ] Invia articoli
   - [ ] Modifica articoli propri
   - [ ] Modifica tutti gli articoli
   - [ ] Approva articoli
   - [ ] Gestisci categoria
5. Fai clic su **Salva**

---

## Autorizzazioni a livello di campo

### Controlla visibilità campi modulo

Limita quali campi del modulo gli utenti possono vedere/modificare:

```
Admin → Publisher → Autorizzazioni → Campi
```

### Opzioni campi

```yaml
Campi visibili per utenti registrati:
  ✓ Titolo
  ✓ Descrizione
  ✓ Contenuto (corpo)
  ✓ Immagine in primo piano
  ✓ Categoria
  ✓ Tag
  ✗ Autore (impostato automaticamente)
  ✗ Data di pubblicazione (solo editor)
  ✗ Data programmazione (solo editor)
  ✗ Flag in primo piano (solo editor)
  ✗ Autorizzazioni (solo admin)
```

---

## Configurazione gruppo utenti

### Crea gruppo personalizzato

1. Vai a **Admin → Utenti → Gruppi**
2. Fai clic su **Crea gruppo**
3. Inserisci dettagli gruppo:

```
Nome gruppo: "Blogger community"
Descrizione gruppo: "Utenti che contribuiscono al contenuto del blog"
Tipo: Gruppo regolare
```

4. Fai clic su **Salva gruppo**
5. Torna alle autorizzazioni Publisher
6. Imposta autorizzazioni per il nuovo gruppo

---

## Flusso di lavoro di approvazione

### Configura invio con approvazione

Controlla se gli articoli necessitano di approvazione:

```
Admin → Publisher → Preferenze → Flusso di lavoro
```

#### Opzioni approvazione

```yaml
Flusso di lavoro invio:
  Richiedi approvazione: Sì

  Per utenti registrati:
    - Nuovi articoli: Bozza (in attesa di approvazione)
    - Gli editor devono approvare
    - L'utente può modificare mentre in sospeso
    - Dopo l'approvazione: L'utente può ancora modificare

  Per editor:
    - Nuovi articoli: Pubblica direttamente (facoltativo)
    - Salta coda di approvazione
    - O richiedi sempre approvazione
```

#### Configura per gruppo

1. Vai a Preferenze
2. Trova "Flusso di lavoro invio"
3. Per ogni gruppo, imposta:

```
Gruppo: Utenti registrati
  Richiedi approvazione: ✓ SÌ
  Stato predefinito: Bozza
  Può modificare mentre in sospeso: ✓ SÌ

Gruppo: Editor
  Richiedi approvazione: ✗ NO
  Stato predefinito: Pubblicato
  Può modificare pubblicato: ✓ SÌ
```

4. Fai clic su **Salva**

---

## Modera articoli

### Approva articoli in sospeso

Per utenti con permesso "approva articoli":

1. Vai a **Admin → Publisher → Articoli**
2. Filtra per **Stato**: In sospeso
3. Fai clic su articolo per rivedere
4. Controlla la qualità del contenuto
5. Imposta **Stato**: Pubblicato
6. Facoltativo: Aggiungi note editoriali
7. Fai clic su **Salva**

### Rifiuta articoli

Se l'articolo non rispetta gli standard:

1. Apri articolo
2. Imposta **Stato**: Bozza
3. Aggiungi motivo di rifiuto (in commento o email)
4. Fai clic su **Salva**
5. Invia messaggio all'autore spiegando il rifiuto

### Modera commenti

Se moderando i commenti:

1. Vai a **Admin → Publisher → Commenti**
2. Filtra per **Stato**: In sospeso
3. Rivedi commento
4. Opzioni:
   - Approva: Fai clic su **Approva**
   - Rifiuta: Fai clic su **Elimina**
   - Modifica: Fai clic su **Modifica**, correggi, salva
5. Fai clic su **Salva**

---

## Gestisci accesso utente

### Visualizza gruppi utenti

Vedi quali utenti appartengono ai gruppi:

```
Admin → Utenti → Gruppi utenti

Per ogni utente:
  - Gruppo primario (uno)
  - Gruppi secondari (multipli)

Le autorizzazioni si applicano da tutti i gruppi (union)
```

### Aggiungi utente a gruppo

1. Vai a **Admin → Utenti**
2. Trova utente
3. Fai clic su **Modifica**
4. In **Gruppi**, seleziona gruppi da aggiungere
5. Fai clic su **Salva**

---

## Scenari autorizzazioni comuni

### Scenario 1: Blog aperto

Consenti a chiunque di inviare:

```
Anonimo: Visualizza
Registrato: Invia, modifica proprio, elimina proprio
Editor: Approva, modifica tutto, elimina tutto
Admin: Controllo completo

Risultato: Blog community aperto
```

### Scenario 2: Sito di notizie moderato

Processo di approvazione rigoroso:

```
Anonimo: Solo visualizzazione
Registrato: Non può inviare
Editor: Invia, approva altri
Admin: Controllo completo

Risultato: Solo professionisti approvati pubblicano
```

### Scenario 3: Blog dello staff

I dipendenti possono contribuire:

```
Crea gruppo: "Staff"
Anonimo: Visualizza
Registrato: Solo visualizzazione (non-staff)
Staff: Invia, modifica proprio, pubblica direttamente
Admin: Controllo completo

Risultato: Blog con autori staff
```

---

## Test autorizzazioni

### Verifica che le autorizzazioni funzionino

1. Crea utente test in ogni gruppo
2. Accedi come ogni utente test
3. Prova a:
   - Visualizzare articoli
   - Inviare articolo (dovrebbe creare bozza se consentito)
   - Modificare articolo (proprio e altri)
   - Eliminare articolo
   - Accedere al pannello admin
   - Accedere alle categorie

4. Verifica che i risultati corrispondano alle autorizzazioni attese

---

## Migliori pratiche

### Checklist configurazione autorizzazioni

- [ ] Decidi sui gruppi di utenti
- [ ] Assegna nomi chiari ai gruppi
- [ ] Imposta autorizzazioni di base per ogni gruppo
- [ ] Prova ogni livello di autorizzazione
- [ ] Documenta la struttura dei permessi
- [ ] Crea flusso di approvazione
- [ ] Allena gli editor sulla moderazione
- [ ] Monitora l'utilizzo dei permessi
- [ ] Rivedi i permessi trimestralmente
- [ ] Esegui il backup delle impostazioni dei permessi

---

## Risoluzione dei problemi autorizzazioni

### Problema: L'utente non può inviare articoli

**Controlla:**
```
1. Il gruppo dell'utente ha il permesso "invia articoli"
   Admin → Publisher → Autorizzazioni

2. L'utente appartiene al gruppo consentito
   Admin → Utenti → Modifica utente → Gruppi

3. La categoria consente invio dal gruppo dell'utente
   Admin → Publisher → Categorie → Autorizzazioni

4. L'utente è registrato (non anonimo)
```

### Problema: L'editor non può approvare articoli

**Controlla:**
```
1. Il gruppo editor ha il permesso "approva articoli"
2. Esistono articoli con stato "In sospeso"
3. L'editor è nel gruppo corretto
4. La categoria consente approvazione dal gruppo editor
```

---

## Passi successivi

- Configura autorizzazioni per il tuo flusso di lavoro
- Crea articoli con autorizzazioni corrette
- Configura categorie con autorizzazioni
- Allena gli utenti sulla creazione articoli

---

#publisher #permissions #groups #access-control #security #moderation #xoops
