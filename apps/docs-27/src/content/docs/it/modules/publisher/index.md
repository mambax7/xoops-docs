---
title: "Modulo Publisher"
description: "Documentazione completa per il modulo di news e blog Publisher per XOOPS"
---

> Il principale modulo di editoria di news e blog per XOOPS CMS.

---

## Panoramica

Publisher è il modulo definitivo di gestione dei contenuti per XOOPS, evoluto da SmartSection per diventare la soluzione di blog e news più ricca di funzionalità. Fornisce strumenti completi per creare, organizzare e pubblicare contenuti con supporto completo per il flusso di lavoro editoriale.

**Requisiti:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x consigliato)

---

## Funzionalità principali

### Gestione dei contenuti
- **Categorie e sottocategorie** - Organizzazione gerarchica dei contenuti
- **Editor Rich Text** - Supporto per più editor WYSIWYG
- **Allegati di file** - Allega file agli articoli
- **Gestione immagini** - Immagini di pagina e categoria
- **Wrapping di file** - Avvolgi file come articoli

### Flusso di lavoro di pubblicazione
- **Pubblicazione programmata** - Imposta date di pubblicazione future
- **Date di scadenza** - Contenuto a scadenza automatica
- **Moderazione** - Flusso di lavoro di approvazione editoriale
- **Gestione bozze** - Salva il lavoro in corso

### Visualizzazione e modelli
- **Quattro modelli di base** - Layout di visualizzazione multipli
- **Modelli personalizzati** - Crea i tuoi design
- **Ottimizzazione SEO** - URL facili da trovare
- **Design reattivo** - Output mobile-ready

### Interazione dell'utente
- **Valutazioni** - Sistema di valutazione degli articoli
- **Commenti** - Discussioni dei lettori
- **Condivisione sociale** - Condividi sui social network

### Autorizzazioni
- **Controllo di invio** - Chi può inviare articoli
- **Autorizzazioni a livello di campo** - Controlla i campi del modulo per gruppo
- **Autorizzazioni di categoria** - Controllo accesso per categoria
- **Diritti di moderazione** - Impostazioni di moderazione globale

---

## Contenuti della sezione

### Guida dell'utente
- Guida all'installazione
- Configurazione di base
- Creazione di articoli
- Gestione delle categorie
- Configurazione dei permessi

### Guida per sviluppatori
- Estensione di Publisher
- Creazione di modelli personalizzati
- Riferimento API
- Hook e eventi

---

## Avvio rapido

### 1. Installazione

```bash
# Scarica da GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copia nella directory moduli
cp -r publisher /path/to/xoops/htdocs/modules/
```

Quindi installa tramite XOOPS Admin → Moduli → Installa.

### 2. Crea la tua prima categoria

1. Vai a **Admin → Publisher → Categorie**
2. Fai clic su **Aggiungi categoria**
3. Compila:
   - **Nome**: News
   - **Descrizione**: Ultimi news e aggiornamenti
   - **Immagine**: Carica immagine categoria
4. Salva

### 3. Crea il tuo primo articolo

1. Vai a **Admin → Publisher → Articoli**
2. Fai clic su **Aggiungi articolo**
3. Compila:
   - **Titolo**: Benvenuto nel nostro sito
   - **Categoria**: News
   - **Contenuto**: Il contenuto del tuo articolo
4. Imposta **Stato**: Pubblicato
5. Salva

---

## Opzioni di configurazione

### Impostazioni generali

| Impostazione | Descrizione | Valore predefinito |
|---------|-------------|---------|
| Editor | Editor WYSIWYG da utilizzare | XOOPS predefinito |
| Articoli per pagina | Articoli mostrati per pagina | 10 |
| Mostra breadcrumb | Visualizza percorso di navigazione | Sì |
| Consenti valutazioni | Abilita valutazioni articoli | Sì |
| Consenti commenti | Abilita commenti articoli | Sì |

### Impostazioni SEO

| Impostazione | Descrizione | Valore predefinito |
|---------|-------------|---------|
| URL SEO | Abilita URL amichevoli | No |
| Riscrittura URL | Riscrittura Apache mod_rewrite | Nessuno |
| Parole chiave meta | Genera parole chiave automaticamente | Sì |

### Matrice di autorizzazioni

| Autorizzazione | Anonimo | Registrato | Editor | Admin |
|------------|-----------|------------|--------|-------|
| Visualizza articoli | ✓ | ✓ | ✓ | ✓ |
| Invia articoli | ✗ | ✓ | ✓ | ✓ |
| Modifica i tuoi articoli | ✗ | ✓ | ✓ | ✓ |
| Modifica tutti gli articoli | ✗ | ✗ | ✓ | ✓ |
| Approva articoli | ✗ | ✗ | ✓ | ✓ |
| Gestisci categorie | ✗ | ✗ | ✗ | ✓ |

---

## Struttura del modulo

```
modules/publisher/
├── admin/                  # Interfaccia amministrativa
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # Classi PHP
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # File di inclusione
│   ├── common.php
│   └── functions.php
├── templates/              # Modelli Smarty
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Traduzioni
│   └── english/
├── sql/                    # Schema database
│   └── mysql.sql
├── xoops_version.php       # Info modulo
└── index.php               # Entry point modulo
```

---

## Migrazione

### Da SmartSection

Publisher include uno strumento di migrazione integrato:

1. Vai a **Admin → Publisher → Importa**
2. Seleziona **SmartSection** come sorgente
3. Scegli opzioni di importazione:
   - Categorie
   - Articoli
   - Commenti
4. Fai clic su **Importa**

### Dal modulo News

1. Vai a **Admin → Publisher → Importa**
2. Seleziona **News** come sorgente
3. Mappa categorie
4. Fai clic su **Importa**

---

## Documentazione correlata

- Guida allo sviluppo dei moduli
- Templating Smarty
- Framework XMF

---

## Risorse

- [Repository GitHub](https://github.com/XoopsModules25x/publisher)
- [Tracker problemi](https://github.com/XoopsModules25x/publisher/issues)
- [Esercitazione originale](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
