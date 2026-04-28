---
title: "Classe XoopsObjectHandler"
description: "Classe handler base per operazioni CRUD su istanze XoopsObject con persistenza database"
---

La classe `XoopsObjectHandler` e la sua estensione `XoopsPersistableObjectHandler` forniscono un'interfaccia standardizzata per eseguire operazioni CRUD (Create, Read, Update, Delete) su istanze `XoopsObject`. Questo implementa il pattern Data Mapper, separando la logica di dominio dall'accesso al database.

## Panoramica Classe

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## Gerarchia Classi

```
XoopsObjectHandler (Base Astratto)
└── XoopsPersistableObjectHandler (Implementazione Estesa)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Handler Moduli Personalizzati]
```

## XoopsObjectHandler

### Costruttore

```php
public function __construct(XoopsDatabase $db)
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Istanza di connessione database |

**Esempio:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Crea una nuova istanza di oggetto.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$isNew` | bool | Se l'oggetto è nuovo (default: true) |

**Restituisce:** `XoopsObject|null` - Nuova istanza di oggetto

**Esempio:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Recupera un oggetto dalla sua chiave primaria.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$id` | int | Valore della chiave primaria |

**Restituisce:** `XoopsObject|null` - Istanza di oggetto o null se non trovato

**Esempio:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Salva un oggetto nel database (insert o update).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$obj` | XoopsObject | Oggetto da salvare |
| `$force` | bool | Forza l'operazione anche se l'oggetto non è cambiato |

**Restituisce:** `bool` - True se successo

**Esempio:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "Utente salvato con ID: " . $user->getVar('uid');
} else {
    echo "Salvataggio fallito: " . implode(', ', $user->getErrors());
}
```

---

### delete

Elimina un oggetto dal database.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$obj` | XoopsObject | Oggetto da eliminare |
| `$force` | bool | Forza l'eliminazione |

**Restituisce:** `bool` - True se successo

**Esempio:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "Utente eliminato";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` estende `XoopsObjectHandler` con metodi aggiuntivi per query e operazioni in massa.

### Costruttore

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Connessione database |
| `$table` | string | Nome tabella (senza prefisso) |
| `$className` | string | Nome classe completo dell'oggetto |
| `$keyName` | string | Nome campo chiave primaria |
| `$identifierName` | string | Campo identificatore leggibile |

**Esempio:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Nome tabella
            'Article',               // Nome classe
            'article_id',            // Chiave primaria
            'title'                  // Campo identificatore
        );
    }
}
```

---

### getObjects

Recupera più oggetti che corrispondono ai criteri.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criteri di query (opzionale) |
| `$idAsKey` | bool | Usa chiave primaria come chiave array |
| `$asObject` | bool | Restituisci oggetti (true) o array (false) |

**Restituisce:** `array` - Array di oggetti o array associativi

**Esempio:**
```php
$handler = xoops_getHandler('user');

// Ottieni tutti gli utenti attivi
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Ottieni utenti con ID come chiave
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Accedi per ID

// Ottieni come array invece di oggetti
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Conta gli oggetti che corrispondono ai criteri.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criteri di query (opzionale) |

**Restituisce:** `int` - Numero di oggetti corrispondenti

**Esempio:**
```php
$handler = xoops_getHandler('user');

// Conta tutti gli utenti
$totalUsers = $handler->getCount();

// Conta utenti attivi
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Totale: $totalUsers, Attivi: $activeUsers";
```

---

### getAll

Recupera tutti gli oggetti (alias per getObjects senza criteri).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criteri di query |
| `$fields` | array | Campi specifici da recuperare |
| `$asObject` | bool | Restituisci come oggetti |
| `$idAsKey` | bool | Usa ID come chiave array |

**Esempio:**
```php
$handler = xoops_getHandler('module');

// Ottieni tutti i moduli
$modules = $handler->getAll();

// Ottieni solo campi specifici
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Recupera solo le chiavi primarie degli oggetti corrispondenti.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criteri di query |

**Restituisce:** `array` - Array di valori chiave primaria

**Esempio:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array di ID utenti admin
```

---

### getList

Recupera una lista chiave-valore per dropdown.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Restituisce:** `array` - Array associativo [id => identificatore]

**Esempio:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// Per un select dropdown
$form->addElement(new XoopsFormSelect('Gruppo', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Elimina tutti gli oggetti che corrispondono ai criteri.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criteri per gli oggetti da eliminare |
| `$force` | bool | Forza eliminazione |
| `$asObject` | bool | Carica oggetti prima di eliminare (attiva eventi) |

**Restituisce:** `bool` - True se successo

**Esempio:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Elimina tutti i commenti per un articolo specifico
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Elimina con caricamento oggetto (attiva eventi delete)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Aggiorna un valore campo per tutti gli oggetti corrispondenti.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$fieldname` | string | Campo da aggiornare |
| `$fieldvalue` | mixed | Nuovo valore |
| `$criteria` | CriteriaElement | Criteri per gli oggetti da aggiornare |
| `$force` | bool | Forza aggiornamento |

**Restituisce:** `bool` - True se successo

**Esempio:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Segna tutti gli articoli di un autore come bozza
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Aggiorna conteggio visualizzazioni
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Esteso)

Il metodo insert esteso con funzionalità aggiuntive.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Comportamento:**
- Se l'oggetto è nuovo (`isNew() === true`): INSERT
- Se l'oggetto esiste (`isNew() === false`): UPDATE
- Chiama `cleanVars()` automaticamente
- Imposta ID auto-incremento su nuovi oggetti

**Esempio:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Crea nuovo articolo
$article = $handler->create();
$article->setVar('title', 'Nuovo Articolo');
$article->setVar('content', 'Contenuto qui');
$handler->insert($article);
echo "Creato con ID: " . $article->getVar('article_id');

// Aggiorna articolo esistente
$article = $handler->get(5);
$article->setVar('title', 'Titolo Aggiornato');
$handler->insert($article);
```

---

## Funzioni Helper

### xoops_getHandler

Funzione globale per recuperare un handler core.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$name` | string | Nome handler (user, module, group, etc.) |
| `$optional` | bool | Restituisci null invece di attivare errore |

**Esempio:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Recupera un handler specifico del modulo.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$name` | string | Nome handler |
| `$dirname` | string | Nome directory modulo |
| `$optional` | bool | Restituisci null se fallisce |

**Esempio:**
```php
// Ottieni handler dal modulo corrente
$articleHandler = xoops_getModuleHandler('article');

// Ottieni handler da modulo specifico
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Creazione di Handler Personalizzati

### Implementazione Handler Base

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler per oggetti Article
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Costruttore
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Ottieni articoli pubblicati
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Ottieni articoli per autore
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Ottieni articoli per categoria
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Cerca articoli
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Ottieni articoli popolari per conteggio visualizzazioni
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Incrementa conteggio visualizzazioni
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Sovrascrivi insert per comportamento personalizzato
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Imposta timestamp aggiornamento
        $obj->setVar('updated', time());

        // Se nuovo, imposta timestamp creazione
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Sovrascrivi delete per operazioni cascade
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Elimina commenti associati
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Uso dell'Handler Personalizzato

```php
// Ottieni l'handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Crea un nuovo articolo
$article = $articleHandler->create();
$article->setVars([
    'title' => 'Mio Nuovo Articolo',
    'content' => 'Contenuto articolo qui...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Articolo creato');
}

// Ottieni articoli pubblicati
$articles = $articleHandler->getPublished(10);

// Cerca articoli
$results = $articleHandler->search('xoops');

// Ottieni articoli popolari
$popular = $articleHandler->getPopular(5);

// Aggiorna conteggio visualizzazioni
$articleHandler->incrementViews($articleId);
```

## Migliori Pratiche

1. **Usa Criteria per Query**: Usa sempre oggetti Criteria per query type-safe

2. **Estendi per Metodi Personalizzati**: Aggiungi metodi di query specifici del dominio agli handler

3. **Sovrascrivi insert/delete**: Aggiungi operazioni cascade e timestamp nelle sovrascritte

4. **Usa Transazioni Se Necessario**: Racchiudi operazioni complesse in transazioni

5. **Sfrutta getList**: Usa `getList()` per select dropdown per ridurre query

6. **Indicizza Chiavi**: Assicurati che i campi usati nei criteri siano indicizzati

7. **Limita Risultati**: Usa sempre `setLimit()` per potenziali result set grandi

## Documentazione Correlata

- XoopsObject - Classe oggetto base
- ../Database/Criteria - Costruzione criteri di query
- ../Database/XoopsDatabase - Operazioni database

---

*Vedi anche: [Codice Sorgente XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
