---
title: "Revisione della compatibilità XOOPS 2.7.0 per questa documentazione"
---

Questo documento elenca i cambiamenti necessari in questo repository in modo che la documentazione di installazione corrisponda a XOOPS 2.7.0.

Base di revisione:

- Repository di guida corrente: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- Core XOOPS 2.7.0 revisionato presso: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Fonti principali 2.7.0 controllate:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Ambito

Questo repository contiene attualmente:

- File Markdown di livello radice in inglese utilizzati come documentazione principale.
- Una copia parziale `en/`.
- Completi alberi di libri `de/` e `fr/` con i loro asset.

I file di livello radice hanno bisogno del primo passaggio. Dopo ciò, i cambiamenti equivalenti devono essere specchiati in `de/book/` e `fr/book/`. L'albero `en/` ha anche bisogno di pulizia perché sembra essere solo parzialmente mantenuto.

## 1. Modifiche globali al repository

### 1.1 Versionamento e metadati

Aggiorna tutti i riferimenti di livello guida da XOOPS 2.5.x a XOOPS 2.7.0.

File interessati:

- `README.md`
- `SUMMARY.md` — TOC live principale per la guida radice; le etichette di navigazione e i titoli delle sezioni devono corrispondere ai nuovi titoli dei capitoli e alla sezione Nota di aggiornamento storica rinominata
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- `de/book/*.md` e `fr/book/*.md` localizzati

Modifiche richieste:

- Cambia `for XOOPS 2.5.7.x` a `for XOOPS 2.7.0`.
- Aggiorna l'anno del copyright da `2018` a `2026`.
- Sostituisci i vecchi riferimenti a XOOPS 2.5.x e 2.6.0 dove descrivono la versione corrente.
- Sostituisci la guida di download dell'era SourceForge con le versioni GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Aggiornamento collegamento

`about-xoops-cms.md` e i file `10aboutxoops.md` localizzati puntano ancora a vecchi percorsi GitHub 2.5.x e 2.6.0. Questi collegamenti devono essere aggiornati alle attuali posizioni del progetto 2.7.x.

### 1.3 Aggiornamento dello screenshot

Tutti gli screenshot che mostrano il programma di installazione, l'interfaccia utente di aggiornamento, il dashboard di amministrazione, il selettore di tema, il selettore di modulo e le schermate post-installazione sono obsoleti.

Alberi di risorse interessati:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Questo è un aggiornamento completo, non uno parziale. Il programma di installazione 2.7.0 utilizza un layout diverso basato su Bootstrap e una struttura visiva diversa.

## 2. Capitolo 2: Introduzione

File:

- `chapter-2-introduction.md`

### 2.1 I requisiti di sistema devono essere riscritti

Il capitolo corrente dice solo Apache, MySQL e PHP. XOOPS 2.7.0 ha espliciti minimi:

| Componente | Minimo 2.7.0 | Consigliato 2.7.0 |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Server web | Qualsiasi server che supporti PHP richiesto | Apache o Nginx consigliati |

Note da aggiungere:

- IIS è ancora elencato nel programma di installazione come possibile, ma Apache e Nginx sono gli esempi consigliati.
- Le note sulla versione chiamano anche la compatibilità con MySQL 9.0.

### 2.2 Aggiungi elenco di controllo delle estensioni PHP richieste e consigliate

Il programma di installazione 2.7.0 ora separa i requisiti rigidi dalle estensioni consigliate.

Controlli richiesti mostrati dal programma di installazione:

- MySQLi
- Session
- PCRE
- filter
- `file_uploads`
- fileinfo

Estensioni consigliate:

- mbstring
- intl
- iconv
- xml
- zlib
- gd
- exif
- curl

### 2.3 Rimuovi istruzioni checksum

L'attuale passaggio 5 descrive `checksum.php` e `checksum.mdi`. Questi file non fanno parte di XOOPS 2.7.0.

Azione:

- Rimuovi completamente la sezione di verifica del checksum.

### 2.4 Aggiorna le istruzioni di pacchetto e caricamento

Mantieni la descrizione del layout del pacchetto `docs/`, `extras/`, `htdocs/`, `upgrade/`, ma aggiorna il testo di caricamento e preparazione per riflettere le attuali aspettative di percorso scrivibile:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

La guida attualmente sottostima questo.

### 2.5 Sostituisci il linguaggio di download/traduzione SourceForge

Il testo corrente dice ancora di visitare XOOPS su SourceForge per altri pacchetti linguistici. Deve essere sostituito con la guida di download del progetto/comunità corrente.

## 3. Capitolo 3: Controllo della configurazione del server

File:

- `chapter-3-server-configuration-check.md`

Modifiche richieste:

- Riscrivi la descrizione della pagina attorno al layout a due blocchi corrente:
  - Requisiti
  - Estensioni consigliate
- Sostituisci lo screenshot vecchio.
- Documenta esplicitamente i controlli dei requisiti elencati sopra.

## 4. Capitolo 4: Scegli il percorso giusto

File:

- `chapter-4-take-the-right-path.md`

Modifiche richieste:

- Aggiungi il nuovo campo `Cookie Domain`.
- Aggiorna i nomi e le descrizioni dei campi del percorso per corrispondere a 2.7.0:
  - XOOPS Root Path
  - XOOPS Data Path
  - XOOPS Library Path
  - XOOPS URL
  - Cookie Domain
- Aggiungi una nota che il cambio del percorso della libreria richiede ora un autoloader Composer valido su `vendor/autoload.php`.

Questo è un controllo di compatibilità reale in 2.7.0 e deve essere documentato chiaramente. La guida corrente non menziona Composer affatto.

## 5. Capitolo 5: Connessioni al database

File:

- `chapter-5-database-connections.md`

Modifiche richieste:

- Mantenere l'affermazione che solo MySQL è supportato.
- Aggiorna la sezione di configurazione del database per riflettere:
  - il charset predefinito è ora `utf8mb4`
  - la selezione delle collation si aggiorna dinamicamente quando il charset cambia
- Sostituisci gli screenshot sia per la pagina di connessione al database che per la pagina di configurazione.

Il testo corrente che dice che charset e collation non hanno bisogno di attenzione è troppo debole per 2.7.0. Dovrebbe almeno menzionare il nuovo valore predefinito `utf8mb4` e il selettore di collation dinamico.

## 6. Capitolo 6: Configurazione finale del sistema

File:

- `chapter-6-final-system-configuration.md`

### 6.1 I file di configurazione generati sono cambiati

La guida attualmente dice che il programma di installazione scrive `mainfile.php` e `secure.php`.

In 2.7.0 installa anche file di configurazione in `xoops_data/configs/`, inclusi:

- `xoopsconfig.php`
- file di configurazione captcha
- file di configurazione textsanitizer

### 6.2 I file di configurazione esistenti in `xoops_data/configs/` non vengono sovrascritti

Il comportamento di non sovrascrittore è **scoped**, non globale. Due percorsi di codice distinti in `page_configsave.php` scrivono i file di configurazione:

- `writeConfigurationFile()` (chiamato alle righe 59 e 66) **sempre** rigenerato `xoops_data/data/secure.php` e `mainfile.php` dall'input della procedura guidata. Non esiste alcun controllo di esistenza; una copia esistente viene sostituita.
- `copyConfigDistFiles()` (chiamato alla riga 62, definito alla riga 317) copia solo i file `xoops_data/configs/` (`xoopsconfig.php`, i config captcha, i config textsanitizer) **se la destinazione non esiste già**.

La riscrittura del capitolo deve riflettere entrambi i comportamenti chiaramente:

- Per `mainfile.php` e `secure.php`: avvertire che le modifiche manuali a questi file verranno sovrascritti quando il programma di installazione viene nuovamente eseguito.
- Per i file `xoops_data/configs/`: spiegare che le personalizzazioni locali vengono preservate tra le esecuzioni e gli aggiornamenti, e che il ripristino dei valori predefiniti spediti richiede l'eliminazione del file e la riesecuzione (o la copia manuale del corrispondente `.dist.php`).

Non generalizzare "i file esistenti vengono preservati" in tutti i file di configurazione scritti dal programma di installazione — questo è scorretto e potrebbe fuorviare gli amministratori che modificano `mainfile.php` o `secure.php`.

### 6.3 HTTPS e la gestione del proxy inverso sono cambiate

Il `mainfile.php` generato ora supporta una rilevazione del protocollo più ampia, incluse le intestazioni del proxy inverso. La guida dovrebbe menzionare questo invece di implicare solo il rilevamento diretto `http` o `https`.

### 6.4 Il conteggio della tabella è sbagliato

Il capitolo corrente dice che un nuovo sito crea `32` tabelle.

XOOPS 2.7.0 crea `33` tabelle. La tabella mancante è:

- `tokens`

Azione:

- Aggiorna il conteggio da 32 a 33.
- Aggiungi `tokens` all'elenco della tabella.

## 7. Capitolo 7: Impostazioni di amministrazione

File:

- `chapter-7-administration-settings.md`

### 7.1 La descrizione dell'interfaccia utente della password è obsoleta

Il programma di installazione include ancora la generazione della password, ma ora include anche:

- misuratore di forza della password basato su zxcvbn
- etichette di forza visive
- flusso generatore e copia di 16 caratteri

Aggiorna il testo e gli screenshot per descrivere il pannello delle password corrente.

### 7.2 La convalida dell'email è ora applicata

L'email di amministrazione viene convalidata con `FILTER_VALIDATE_EMAIL`. Il capitolo dovrebbe menzionare che i valori email non validi vengono rifiutati.

### 7.3 La sezione Chiave di licenza è sbagliata

Questo è uno dei più importanti corretti fattuale.

La guida attuale dice:

- c'è una `License System Key`
- è archiviato in `/include/license.php`
- `/include/license.php` deve essere scrivibile durante l'installazione

Questo non è più accurato.

Quello che 2.7.0 fa effettivamente:

- l'installazione scrive i dati della licenza in `xoops_data/data/license.php`
- `htdocs/include/license.php` è ora solo un wrapper deprecato che carica il file da `XOOPS_VAR_PATH`
- l'avvertenza vecchia su reso `/include/license.php` scrivibile dovrebbe essere rimosso

Azione:

- Riscrivi questa sezione invece di eliminarla.
- Aggiorna il percorso da `/include/license.php` a `xoops_data/data/license.php`.

### 7.4 L'elenco dei temi è obsoleto

La guida attuale si riferisce ancora a Zetagenesis e al set di tema più vecchio dell'era 2.5.

Temi presenti in XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Notare anche:

- `xswatch4` è il tema predefinito corrente inserito dai dati del programma di installazione.
- Zetagenesis non fa più parte dell'elenco dei temi in pacchetto.

### 7.5 L'elenco dei moduli è obsoleto

Moduli presenti nel pacchetto 2.7.0:

- `system` — installato automaticamente durante i passaggi di inserimento/inserimento della tabella. Sempre presente, mai visibile nel selettore.
- `debugbar` — selezionabile nel passaggio del programma di installazione.
- `pm` — selezionabile nel passaggio del programma di installazione.
- `profile` — selezionabile nel passaggio del programma di installazione.
- `protector` — selezionabile nel passaggio del programma di installazione.

Importante: la pagina del programma di installazione del modulo (`htdocs/install/page_moduleinstaller.php`) costruisce il suo elenco di candidati iterando su `XoopsLists::getModulesList()` e **filtrando tutto ciò che è già nella tabella dei moduli** (le righe 95-102 raccolgono `$listed_mods`; riga 116 salta qualsiasi directory presente in quell'elenco). Perché `system` è installato prima di questo passaggio, non appare mai come una casella di controllo.

Modifiche della guida necessarie:

- Smetti di dire che ci sono solo tre moduli in bundle.
- Descrivi il passaggio del programma di installazione come che mostra **quattro moduli selezionabili** (`debugbar`, `pm`, `profile`, `protector`), non cinque.
- Documenta `system` separatamente come il modulo sempre installato che non appare nel selettore.
- Aggiungi `debugbar` alla descrizione del modulo in bundle come nuovo in 2.7.0.
- Nota che la preselezione del modulo predefinito del programma di installazione è ora vuota; i moduli sono disponibili da scegliere, ma non pre-controllati dalla configurazione del programma di installazione.

## 8. Capitolo 8: Pronto per andare

File:

- `chapter-8-ready-to-go.md`

### 8.1 Il processo di pulizia dell'installazione deve essere riscritto

La guida attuale dice che il programma di installazione rinomina la cartella di installazione in un nome univoco.

Questo è ancora vero in effetti, ma il meccanismo è cambiato:

- uno script di pulizia esterno viene creato nella radice del web
- la pagina finale attiva la pulizia tramite AJAX
- la cartella di installazione viene rinominata a `install_remove_<unique suffix>`
- il fallback a `cleanup.php` esiste ancora

Azione:

- Aggiorna la spiegazione.
- Mantieni l'istruzione rivolta all'utente semplice: elimina la directory di installazione rinominato dopo l'installazione.

### 8.2 I riferimenti all'appendice del dashboard di amministrazione sono obsoleti

Il capitolo 8 punta ancora i lettori verso l'esperienza di amministrazione dell'era Oxygen. Deve allinearsi con i temi di amministrazione correnti:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 La guida di modifica del percorso post-installazione ha bisogno di correzione

Il testo corrente dice ai lettori di aggiornare `secure.php` con le definizioni del percorso. In 2.7.0, quelle costanti di percorso sono definite in `mainfile.php`, mentre `secure.php` contiene dati sicuri. Il blocco di esempio in questo capitolo deve essere corretto di conseguenza.

### 8.4 Le impostazioni di produzione dovrebbero essere aggiunte

La guida dovrebbe esplicitamente menzionare i valori predefiniti di produzione ora presenti in `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` dovrebbe rimanere `false`
- `XOOPS_DEBUG` dovrebbe rimanere `false`

## 9. Capitolo 9: Aggiorna installazione XOOPS esistente

File:

- `chapter-9-upgrade-existing-xoops-installation.md`

Questo capitolo richiede la riscrittura più grande.

### 9.1 Aggiungi passaggio preflight Smarty 4 obbligatorio

Il flusso di aggiornamento di XOOPS 2.7.0 ora forza il processo di preflight prima del completamento dell'aggiornamento.

Nuovo flusso richiesto:

1. Copia la directory `upgrade/` nella radice del sito.
2. Esegui `/upgrade/preflight.php`.
3. Scansione `/themes/` e `/modules/` per la vecchia sintassi di Smarty.
4. Usa la modalità di riparazione opzionale dove appropriato.
5. Riesegui fino a pulito.
6. Continua in `/upgrade/`.

Il capitolo corrente non menziona questo affatto, il che lo rende incompatibile con la guida 2.7.0.

### 9.2 Sostituisci la narrativa di unione manuale dell'era 2.5.2

Il capitolo corrente descrive ancora un aggiornamento dello stile 2.5.2 manuale con fusioni di framework, note AltSys e ristrutturazione di file gestita manualmente. Deve essere sostituito con la sequenza di aggiornamento 2.7.x effettiva da `release_notes.txt` e `upgrade/README.md`.

Struttura capitolo consigliata:

1. Backup di file e database.
2. Spegni il sito.
3. Copia `htdocs/` sopra la radice dal vivo.
4. Copia `htdocs/xoops_lib` nel percorso della libreria attiva.
5. Copia `htdocs/xoops_data` nel percorso dati attivo.
6. Copia `upgrade/` nella radice web.
7. Esegui `preflight.php`.
8. Esegui `/upgrade/`.
9. Completa i prompt dell'updater.
10. Aggiorna il modulo `system`.
11. Aggiorna `pm`, `profile` e `protector` se installati.
12. Elimina `upgrade/`.
13. Riaccendi il sito.

### 9.3 Documenta i veri cambiamenti di aggiornamento 2.7.0

L'updater per 2.7.0 include almeno questi cambiamenti concreti:

- crea una tabella `tokens`
- amplia `bannerclient.passwd` per gli hash delle password moderni
- aggiungi impostazioni di preferenza dei cookie di sessione
- rimuovere directory in bundle obsolete

La guida non ha bisogno di esporre ogni dettaglio di implementazione, ma dovrebbe smettere di implicare che l'aggiornamento è solo una copia di file più un aggiornamento del modulo.

## 10. Pagine di aggiornamento storico

File:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Stato:** la decisione strutturale è già risolta — il `SUMMARY.md` radice sposta questi in una sezione dedicata **Note di aggiornamento storico**, e ogni file porta un callout di "Riferimento storico" che indica ai lettori il capitolo 9 per gli aggiornamenti 2.7.0. Non sono più una guida di aggiornamento di prima classe.

**Lavoro rimanente (solo coerenza):**

- Assicurati che `README.md` (radice) elenca questi nella stessa intestazione "Note di aggiornamento storico", non sotto un'intestazione generica "Upgrades".
- Specchia la stessa separazione in `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` e `en/SUMMARY.md`.
- Assicurati che ogni pagina di aggiornamento storico (radice e le copie localizzate `de/book/upg*.md` / `fr/book/upg*.md`) porti un callout di contenuto stantio che si collega al capitolo 9.

## 11. Appendice 1: GUI di amministrazione

File:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Questa appendice è legata alla GUI di amministrazione Oxygen e ha bisogno di una riscrittura.

Modifiche richieste:

- sostituire tutti i riferimenti a Oxygen
- sostituire i vecchi screenshot di icone/menu
- documenta i temi di amministrazione correnti:
  - default
  - dark
  - modern
  - transition
- menziona le capacità di amministrazione 2.7.0 correnti richiamate nelle note sulla versione:
  - capacità di sovraccarico del template nei temi di amministrazione del sistema
  - set di temi di amministrazione aggiornato

## 12. Appendice 2: Caricamento di XOOPS tramite FTP

File:

- `appendix-2-uploading-xoops-via-ftp.md`

Modifiche richieste:

- rimuovere presupposti specifici di HostGator e cPanel
- modernizzare la formulazione di caricamento di file
- nota che `xoops_lib` ora include le dipendenze di Composer, quindi i caricamenti sono più grandi e non dovrebbero essere selettivamente tagliati

## 13. Appendice 5: Sicurezza

File:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Modifiche richieste:

- rimuovere completamente la discussione di `register_globals`
- rimuovere il linguaggio del ticket dell'host obsoleto
- correggere il testo delle autorizzazioni da `404` a `0444` dove readonly è inteso
- aggiorna la discussione di `mainfile.php` e `secure.php` per corrispondere al layout 2.7.0
- aggiungi il nuovo contesto della costante correlata alla sicurezza del dominio dei cookie:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- aggiungi guida di produzione per:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Impatto di manutenzione multilingue

Dopo che i file inglesi a livello di radice sono corretti, gli aggiornamenti equivalenti sono necessari in:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

L'albero `en/` ha anche bisogno di revisione perché contiene un README separato e un set di asset, ma sembra avere solo un albero `book/` parziale.

## 15. Ordine di priorità

### Critico prima del rilascio

1. Aggiorna i riferimenti di repo/versione a 2.7.0.
2. Riscrivi il capitolo 9 attorno al flusso di aggiornamento 2.7.0 reale e al preflight di Smarty 4.
3. Aggiorna i requisiti di sistema a PHP 8.2+ e MySQL 5.7.8+.
4. Correggi il percorso del file della chiave di licenza del capitolo 7.
5. Correggi gli inventari di temi e moduli.
6. Correggi il conteggio della tabella del capitolo 6 da 32 a 33.

### Importante per l'accuratezza

7. Riscrivi la documentazione del percorso scrivibile.
8. Aggiungi il requisito dell'autoloader di Composer alla configurazione del percorso.
9. Aggiorna la documentazione charset del database a `utf8mb4`.
10. Correggi la documentazione di modifica del percorso del capitolo 8 in modo che le costanti siano documentate nel file giusto.
11. Rimuovere le istruzioni del checksum.
12. Rimuovere `register_globals` e altri consigli PHP obsoleti.

### Pulizia della qualità del rilascio

13. Sostituisci tutti gli screenshot del programma di installazione e dell'amministrazione.
14. Sposta le pagine di aggiornamento storico fuori dal flusso principale.
15. Sincronizza le copie tedesca e francese dopo che l'inglese è corretto.
16. Pulisci i link obsoleti e le righe README duplicate.
