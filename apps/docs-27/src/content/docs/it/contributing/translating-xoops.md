---
title: "Appendice 3: Traduzione di XOOPS in una Lingua Locale"
---

XOOPS 2.7.0 è spedito solo con file di lingua inglese. Le traduzioni in altre lingue sono mantenute dalla comunità e distribuite tramite GitHub e i vari siti di supporto locali di XOOPS.

## Dove trovare le traduzioni esistenti

- **GitHub** — le traduzioni della comunità sono sempre più pubblicate come repository separate sotto l'[organizzazione XOOPS](https://github.com/XOOPS) e su account di contributori individuali. Cerca su GitHub `xoops-language-<your-language>` o sfoglia l'organizzazione XOOPS per i pacchetti attuali.
- **Siti di supporto XOOPS locali** — molte comunità XOOPS regionali pubblicano traduzioni sui loro siti. Visita [https://xoops.org](https://xoops.org) e segui i link alle comunità locali.
- **Traduzioni moduli** — le traduzioni per i singoli moduli della comunità in genere vivono accanto al modulo stesso nell'organizzazione GitHub `XoopsModules25x` (il `25x` nel nome è storico; i moduli lì sono mantenuti sia per XOOPS 2.5.x che 2.7.x).

Se una traduzione per la tua lingua già esiste, rilascia le directory del linguaggio nella tua installazione XOOPS (vedi "Come installare una traduzione" di seguito).

## Cosa ha bisogno di essere tradotto

XOOPS 2.7.0 mantiene i file di lingua accanto al codice che li consuma. Una traduzione completa copre tutte queste posizioni:

- **Core** — `htdocs/language/english/` — costanti in tutto il sito utilizzate da ogni pagina (login, errori comuni, date, template mail, ecc.).
- **Programma di installazione** — `htdocs/install/language/english/` — stringhe mostrate dalla procedura guidata di installazione. Traduci questi *prima* di eseguire il programma di installazione se desideri un'esperienza di installazione localizzata.
- **Modulo sistema** — `htdocs/modules/system/language/english/` — di gran lunga il set più grande; copre l'intero pannello di controllo admin.
- **Moduli in bundle** — ognuno di `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` e `htdocs/modules/debugbar/language/english/`.
- **Temi** — un paio di temi spediscono i propri file di lingua; controlla `htdocs/themes/<theme>/language/` se esiste.

Una traduzione "solo core" è l'unità utile minima e corrisponde ai primi due punti sopra.

## Come tradurre

1. Copia la directory `english/` accanto ad essa e rinomina la copia nella tua lingua. Il nome della directory deve essere il nome inglese minuscolo della lingua (`spanish`, `german`, `french`, `japanese`, `arabic`, ecc.).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Apri ogni file `.php` nella nuova directory e traduci i **valori di stringa** all'interno delle chiamate `define()`. **Non** modificare i nomi delle costanti — sono referenziati dal codice PHP in tutto il core.

   ```php
   // Prima:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // Dopo (Spagnolo):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Salva ogni file come UTF-8 *senza* BOM.** XOOPS 2.7.0 utilizza `utf8mb4` end-to-end (database, sessioni, output) e rifiuta i file con un byte-order mark. In Notepad++ questa è l'opzione **"UTF-8"**, *non* "UTF-8-BOM". In VS Code è il predefinito; confermalo solo nella barra di stato della codifica.

4. Aggiorna i metadati di lingua e charset in cima a ogni file per corrispondere alla tua lingua:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` deve essere il codice [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) per la tua lingua. `_CHARSET` è sempre `UTF-8` in XOOPS 2.7.0 — non c'è più una variante ISO-8859-1.

5. Ripeti per il programma di installazione, il modulo Sistema e tutti i moduli in bundle di cui hai bisogno.

## Come installare una traduzione

Se hai ottenuto una traduzione finita come albero di directory:

1. Copia ogni directory `<language>/` nel padre corrispondente `language/english/` nella tua installazione XOOPS. Ad esempio, copia `language/spanish/` in `htdocs/language/`, `install/language/spanish/` in `htdocs/install/language/`, e così via.
2. Assicurati che la proprietà del file e i permessi siano leggibili dal server web.
3. Seleziona la nuova lingua al momento dell'installazione (la procedura guidata scansiona `htdocs/language/` per le lingue disponibili) oppure, su un sito esistente, cambia la lingua in **Admin → Sistema → Preferenze → Impostazioni Generali**.

## Condivisione della tua traduzione con la comunità

Si prega di contribuire la tua traduzione alla comunità.

1. Crea un repository GitHub (o fai un fork di un repository di lingua esistente se uno esiste per la tua lingua).
2. Usa un nome chiaro come `xoops-language-<language-code>` (ad es. `xoops-language-es`, `xoops-language-pt-br`).
3. Specchia la struttura della directory XOOPS all'interno del tuo repository in modo che i file si allineino con il punto in cui vengono copiati:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Includi un `README.md` documentando:
   - Nome lingua e codice ISO
   - Compatibilità versione XOOPS (ad es. `XOOPS 2.7.0+`)
   - Traduttore e crediti
   - Se la traduzione è solo core o copre moduli in bundle
5. Apri una pull request nel repository del modulo/core pertinente su GitHub o pubblica un annuncio su [https://xoops.org](https://xoops.org) in modo che la comunità possa trovarla.

> **Nota**
>
> Se la tua lingua richiede modifiche al core per la formattazione della data o del calendario, includi anche queste modifiche nel pacchetto. Le lingue con script da destra a sinistra (arabo, ebraico, persiano, urdu) funzionano fuori dagli schemi in XOOPS 2.7.0 — il supporto RTL è stato aggiunto in questo rilascio e i singoli temi lo scelgono automaticamente.
