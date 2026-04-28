---
title: "Glossario XOOPS"
description: "Definizioni di termini e concetti specifici di XOOPS"
---

> Glossario completo della terminologia specifica di XOOPS e dei concetti.

---

## A

### Admin Framework
Il framework amministrativo standardizzato introdotto in XOOPS 2.3, fornendo pagine di amministrazione coerenti su tutti i moduli.

### Autoloading
Il caricamento automatico delle classi PHP quando sono necessarie, utilizzando lo standard PSR-4 in XOOPS moderno.

---

## B

### Block
Un'unità di contenuto auto-contenuta che può essere posizionata nelle regioni del tema. I blocchi possono visualizzare contenuti di moduli, HTML personalizzato o dati dinamici.

```php
// Definizione blocco
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Il processo di inizializzazione del core XOOPS prima dell'esecuzione del codice del modulo, in genere attraverso `mainfile.php` e `header.php`.

---

## C

### Criteria / CriteriaCompo
Classi per la costruzione di condizioni di query al database in modo orientato agli oggetti.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
Un attacco di sicurezza prevenuto in XOOPS utilizzando token di sicurezza tramite `XoopsFormHiddenToken`.

---

## D

### DI (Dependency Injection)
Un modello di progettazione pianificato per XOOPS 4.0 in cui le dipendenze vengono injected piuttosto che create internamente.

### Dirname
Il nome della directory di un modulo, utilizzato come identificatore univoco in tutto il sistema.

### DTYPE (Data Type)
Costanti che definiscono come le variabili XoopsObject vengono archiviate e igienizzate:
- `XOBJ_DTYPE_INT` - Integer
- `XOBJ_DTYPE_TXTBOX` - Text (single line)
- `XOBJ_DTYPE_TXTAREA` - Text (multi-line)
- `XOBJ_DTYPE_EMAIL` - Email address

---

## E

### Event
Un'occorrenza nel ciclo di vita di XOOPS che può attivare codice personalizzato tramite preload o hook.

---

## F

### Framework
Vedi XMF (XOOPS Module Framework).

### Form Element
Un componente del sistema di moduli XOOPS che rappresenta un campo del modulo HTML.

---

## G

### Group
Una raccolta di utenti con autorizzazioni condivise. I gruppi centrali includono: Webmasters, Registered Users, Anonymous.

---

## H

### Handler
Una classe che gestisce le operazioni CRUD per le istanze di XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Una classe utilitaria che fornisce facile accesso ai gestori di moduli, configurazioni e servizi.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Le classi core di XOOPS che forniscono funzionalità fondamentali: accesso al database, gestione degli utenti, sicurezza, ecc.

---

## L

### Language File
File PHP contenenti costanti per l'internazionalizzazione, archiviate nelle directory `language/[code]/`.

---

## M

### mainfile.php
Il file di configurazione primario per XOOPS contenente le credenziali del database e le definizioni dei percorsi.

### MCP (Model-Controller-Presenter)
Un modello architettonico simile a MVC, spesso utilizzato nello sviluppo di moduli XOOPS.

### Middleware
Software che si trova tra la richiesta e la risposta, pianificato per XOOPS 4.0 utilizzando PSR-15.

### Module
Un pacchetto auto-contenuto che estende la funzionalità di XOOPS, installato nella directory `modules/`.

### MOC (Map of Content)
Un concetto di Obsidian per note di panoramica che collegano il contenuto correlato.

---

## N

### Namespace
Funzione PHP per l'organizzazione delle classi, utilizzata in XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Notification
Il sistema XOOPS per avvisare gli utenti di eventi tramite email o PM.

---

## O

### Object
Vedi XoopsObject.

---

## P

### Permission
Controllo di accesso gestito attraverso gruppi e gestori di autorizzazioni.

### Preload
Una classe che aggancia gli eventi XOOPS, caricata automaticamente dalla directory `preloads/`.

### PSR (PHP Standards Recommendation)
Standard di PHP-FIG che XOOPS 4.0 implementerà completamente.

---

## R

### Renderer
Una classe che produttore elementi di modulo o altri componenti dell'interfaccia utente in formati specifici (Bootstrap, ecc.).

---

## S

### Smarty
Il motore di template utilizzato da XOOPS per separare la presentazione dalla logica.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Service
Una classe che fornisce logica aziendale riutilizzabile, in genere accessibile tramite Helper.

---

## T

### Template
Un file Smarty (`.tpl` o `.html`) che definisce il livello di presentazione per i moduli.

### Theme
Una raccolta di template e asset che definiscono l'aspetto visivo del sito.

### Token
Un meccanismo di sicurezza (protezione CSRF) che garantisce che gli invii di moduli provengono da fonti legittime.

---

## U

### uid
User ID - l'identificatore univoco per ogni utente nel sistema.

---

## V

### Variable (Var)
Un campo definito su un XoopsObject utilizzando `initVar()`.

---

## W

### Widget
Un piccolo componente dell'interfaccia utente auto-contenuto, simile ai blocchi.

---

## X

### XMF (XOOPS Module Framework)
Una raccolta di utilità e classi per lo sviluppo di moduli XOOPS moderni.

### XOBJ_DTYPE
Costanti per la definizione dei tipi di dati variabili in XoopsObject.

### XoopsDatabase
Il livello di astrazione del database che fornisce l'esecuzione delle query e l'escaping.

### XoopsForm
Il sistema di generazione dei moduli per la creazione programmatica dei moduli HTML.

### XoopsObject
La classe base per tutti gli oggetti di dati in XOOPS, che fornisce gestione e igienizzazione delle variabili.

### xoops_version.php
Il file manifesto del modulo che definisce le proprietà del modulo, le tabelle, i blocchi, i template e la configurazione.

---

## Acronimi comuni

| Acronimo | Significato |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System |
| XMF | XOOPS Module Framework |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| ORM | Object-Relational Mapping |
| PSR | PHP Standards Recommendation |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Create, Read, Update, Delete |

---

## Documentazione correlata

- Concetti core
- Riferimento API
- Risorse esterne

---

#xoops #glossario #reference #terminologia #definizioni

