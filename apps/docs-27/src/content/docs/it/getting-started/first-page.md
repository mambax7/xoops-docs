---
title: "Crea la Tua Prima Pagina"
description: "Guida passo dopo passo per creare e pubblicare contenuti in XOOPS, inclusi formattazione, incorporamento di media e opzioni di pubblicazione"
---

# Creare la Tua Prima Pagina in XOOPS

Impara come creare, formattare e pubblicare il tuo primo contenuto in XOOPS.

## Comprensione del Contenuto XOOPS

### Cos'è una Pagina/Post?

In XOOPS, il contenuto è gestito tramite moduli. I tipi di contenuto più comuni sono:

| Tipo | Descrizione | Caso d'Uso |
|---|---|---|
| **Pagina** | Contenuto statico | Chi Siamo, Contatti, Servizi |
| **Post/Articolo** | Contenuto con timestamp | Notizie, Post di blog |
| **Categoria** | Organizzazione contenuto | Raggruppa contenuto correlato |
| **Commento** | Feedback utenti | Consenti interazione visitatori |

Questa guida riguarda la creazione di una pagina/articolo di base usando il modulo di contenuto predefinito di XOOPS.

## Accesso all'Editor di Contenuto

### Dal Pannello Admin

1. Accedi al pannello admin: `http://your-domain.com/xoops/admin/`
2. Naviga verso **Content > Pages** (o il tuo modulo di contenuto)
3. Clicca "Add New Page" o "New Post"

### Frontend (se Abilitato)

Se il tuo XOOPS è configurato per consentire la creazione di contenuti frontend:

1. Accedi come utente registrato
2. Vai al tuo profilo
3. Cerca l'opzione "Submit Content"
4. Segui gli stessi passaggi seguenti

## Interfaccia dell'Editor di Contenuto

L'editor di contenuto include:

```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```

## Guida Passo dopo Passo: Crea la Tua Prima Pagina

### Passo 1: Accedi Editor di Contenuto

1. Nel pannello admin, clicca **Content > Pages**
2. Clicca **"Add New Page"** o **"Create"**
3. Vedrai l'editor di contenuto

### Passo 2: Inserisci Titolo Pagina

Nel campo "Title", inserisci il nome della tua pagina:

```
Title: Welcome to Our Website
```

Migliori pratiche per i titoli:
- Chiari e descrittivi
- Includi parole chiave se possibile
- 50-60 caratteri ideali
- Evita TUTTE MAIUSCOLE (difficile da leggere)
- Sii specifico (non "Pagina 1")

### Passo 3: Seleziona Categoria

Scegli dove organizzare questo contenuto:

```
Category: [Dropdown ▼]
```

Le opzioni potrebbero includere:
- Generale
- Notizie
- Blog
- Annunci
- Servizi

Se le categorie non esistono, chiedi all'amministratore di crearle.

### Passo 4: Scrivi il Tuo Contenuto

Clicca nell'area dell'editor di contenuto e digita il tuo testo.

#### Formattazione di Testo di Base

Usa la barra degli strumenti dell'editor:

| Pulsante | Azione | Risultato |
|---|---|---|
| **B** | Grassetto | **Testo in grassetto** |
| *I* | Corsivo | *Testo in corsivo* |
| <u>U</u> | Sottolineato | <u>Testo sottolineato</u> |

#### Uso HTML

XOOPS consente tag HTML sicuri. Esempi comuni:

```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```

#### Esempi HTML Sicuri

**Tag Consigliati:**
- Paragrafi: `<p>`, `<br>`
- Intestazioni: `<h1>` a `<h6>`
- Testo: `<strong>`, `<em>`, `<u>`
- Elenchi: `<ul>`, `<ol>`, `<li>`
- Link: `<a href="">`
- Citazioni: `<blockquote>`
- Tabelle: `<table>`, `<tr>`, `<td>`

**Evita questi tag** (potrebbero essere disabilitati per sicurezza):
- Script: `<script>`
- Stili: `<style>`
- Iframe: `<iframe>` (se non configurato)
- Moduli: `<form>`, `<input>`

### Passo 5: Aggiungi Immagini

#### Opzione 1: Inserisci URL Immagine

Usando l'editor:

1. Clicca pulsante **Insert Image** (icona immagine)
2. Inserisci URL immagine: `https://example.com/image.jpg`
3. Inserisci testo alternativo: "Description of image"
4. Clicca "Insert"

Equivalente HTML:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Opzione 2: Carica Immagine

1. Carica immagine in XOOPS prima:
   - Vai a **Content > Media Manager**
   - Carica la tua immagine
   - Copia l'URL dell'immagine

2. Nell'editor di contenuto, inserisci usando URL (passaggi precedenti)

#### Migliori Pratiche per Immagini

- Usa dimensioni di file appropriate (ottimizza immagini)
- Usa nomi di file descrittivi
- Includi sempre testo alternativo (accessibilità)
- Formati supportati: JPG, PNG, GIF, WebP
- Larghezza consigliata: 600-800 pixel per contenuto

### Passo 6: Incorpora Media

#### Incorpora Video da YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Sostituisci `VIDEO_ID` con l'ID video di YouTube.

**Per trovare l'ID video di YouTube:**
1. Apri il video su YouTube
2. L'URL è: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Copia l'ID (caratteri dopo `v=`)

#### Incorpora Video da Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Passo 7: Aggiungi Meta Descrizione

Nel campo "Description", aggiungi un breve riassunto:

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Migliori pratiche per meta description:**
- 150-160 caratteri
- Includi parole chiave principali
- Deve riassumere accuratamente il contenuto
- Usato nei risultati dei motori di ricerca
- Rendilo accattivante (gli utenti lo vedono)

### Passo 8: Configura Opzioni di Pubblicazione

#### Stato di Pubblicazione

Scegli lo stato di pubblicazione:

```
Status: ☑ Published
```

Opzioni:
- **Published:** Visibile al pubblico
- **Draft:** Visibile solo agli admin
- **Pending Review:** In attesa di approvazione
- **Archived:** Nascosto ma mantenuto

#### Visibilità

Imposta chi può vedere questo contenuto:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Data di Pubblicazione

Imposta quando il contenuto diventa visibile:

```
Publish Date: [Date Picker] [Time]
```

Lascia come "Now" per pubblicare immediatamente.

#### Consenti Commenti

Abilita o disabilita i commenti dei visitatori:

```
Allow Comments: ☑ Yes
```

Se abilitato, i visitatori possono aggiungere feedback.

### Passo 9: Salva il Tuo Contenuto

Opzioni di salvataggio multiple:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Publish Now:** Rendi visibile immediatamente
- **Save as Draft:** Mantieni privato per ora
- **Schedule:** Pubblica in data/ora futura
- **Preview:** Vedi come apparirà prima di salvare

Clicca la tua scelta:

```
Click [Publish Now]
```

### Passo 10: Verifica la Tua Pagina

Dopo la pubblicazione, verifica il tuo contenuto:

1. Vai alla homepage del tuo sito web
2. Naviga verso la tua area di contenuto
3. Cerca la tua pagina appena creata
4. Clicca per visualizzarla
5. Controlla:
   - [ ] Il contenuto viene visualizzato correttamente
   - [ ] Le immagini appaiono
   - [ ] La formattazione sembra buona
   - [ ] I link funzionano
   - [ ] Titolo e descrizione corretti

## Esempio: Pagina Completa

### Titolo
```
Getting Started with XOOPS
```

### Contenuto
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```

### Meta Description
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Funzioni Avanzate di Contenuto

### Uso Editor WYSIWYG

Se un editor rich text è installato:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Clicca i pulsanti per formattare il testo senza HTML.

### Inserimento Blocchi di Codice

Visualizza esempi di codice:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Creazione di Tabelle

Organizza i dati in tabelle:

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```

### Citazioni Inline

Evidenzia testo importante:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## Migliori Pratiche SEO per Contenuto

Ottimizza il tuo contenuto per i motori di ricerca:

### Titolo
- Includi la parola chiave principale
- 50-60 caratteri
- Unico per pagina

### Meta Descrizione
- Includi la parola chiave naturalmente
- 150-160 caratteri
- Affascinante e accurata

### Contenuto
- Scrivi naturalmente, evita il keyword stuffing
- Usa intestazioni (h2, h3) appropriatamente
- Includi link interni ad altre pagine
- Usa testo alternativo per tutte le immagini
- Punta per 300+ parole per articoli

### Struttura URL
- Mantieni gli URL corti e descrittivi
- Usa trattini per separare le parole
- Evita caratteri speciali
- Esempio: `/about-our-company`

## Gestione del Tuo Contenuto

### Modifica Pagina Esistente

1. Vai a **Content > Pages**
2. Trova la tua pagina nell'elenco
3. Clicca **Edit** o il titolo della pagina
4. Apporta modifiche
5. Clicca **Update**

### Elimina Pagina

1. Vai a **Content > Pages**
2. Trova la tua pagina
3. Clicca **Delete**
4. Conferma l'eliminazione

### Cambia Stato di Pubblicazione

1. Vai a **Content > Pages**
2. Trova la pagina, clicca **Edit**
3. Cambia stato nel dropdown
4. Clicca **Update**

## Risoluzione Problemi Creazione Contenuto

### Contenuto Non Appare

**Sintomo:** La pagina pubblicata non appare sul sito web

**Soluzione:**
1. Controlla lo stato di pubblicazione: Dovrebbe essere "Published"
2. Controlla la data di pubblicazione: Dovrebbe essere attuale o passata
3. Controlla la visibilità: Dovrebbe essere "Public"
4. Svuota la cache: Admin > Tools > Clear Cache
5. Controlla i permessi: Il gruppo utente deve avere accesso

### Formattazione Non Funziona

**Sintomo:** I tag HTML o la formattazione appaiono come testo

**Soluzione:**
1. Verifica che HTML sia abilitato nelle impostazioni del modulo
2. Usa la corretta sintassi HTML
3. Chiudi tutti i tag: `<p>Text</p>`
4. Usa solo tag consentiti
5. Usa entità HTML: `&lt;` per `<`, `&amp;` per `&`

### Immagini Non Visualizzate

**Sintomo:** Le immagini mostrano icona rotta

**Soluzione:**
1. Verifica che l'URL dell'immagine sia corretto
2. Controlla che il file immagine esista
3. Verifica i permessi appropriati sull'immagine
4. Prova a caricare l'immagine in XOOPS invece
5. Controlla il blocco esterno (potrebbe aver bisogno di CORS)

### Problemi di Codifica Caratteri

**Sintomo:** I caratteri speciali appaiono come gibberish

**Soluzione:**
1. Salva il file come codifica UTF-8
2. Assicurati che il charset della pagina sia UTF-8
3. Aggiungi al head HTML: `<meta charset="UTF-8">`
4. Evita di copiare e incollare da Word (usa testo semplice)

## Migliori Pratiche del Flusso di Lavoro dei Contenuti

### Processo Consigliato

1. **Scrivi nell'Editor Prima:** Usa l'editor di contenuto admin
2. **Anteprima Prima di Pubblicare:** Clicca il pulsante Preview
3. **Aggiungi Metadati:** Completa titolo, descrizione, tag
4. **Salva come Draft Prima:** Salva come draft per evitare di perdere lavoro
5. **Revisione Finale:** Rileggi prima di pubblicare
6. **Pubblica:** Clicca Publish quando pronto
7. **Verifica:** Controlla sul sito live
8. **Modifica se Necessario:** Fai correzioni rapidamente

### Controllo Versione

Mantieni sempre backup:

1. **Prima di Cambiamenti Importanti:** Salva come nuova versione o backup
2. **Archivia Contenuto Vecchio:** Mantieni versioni non pubblicate
3. **Data i Tuoi Draft:** Usa nomina chiara: "Page-Draft-2025-01-28"

## Pubblicazione di Più Pagine

Crea una strategia di contenuto:

```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

Crea pagine per seguire questa struttura.

## Prossimi Passi

Dopo aver creato la tua prima pagina:

1. Configura account utente
2. Installa moduli aggiuntivi
3. Esplora funzioni admin
4. Configura impostazioni
5. Ottimizza con impostazioni di prestazioni

---

**Tag:** #content-creation #pages #publishing #editor

**Articoli Correlati:**
- Admin-Panel-Overview
- Managing-Users
- Installing-Modules
- ../Configuration/Basic-Configuration
