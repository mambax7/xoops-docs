---
title: "Prevenzione dell'Iniezione SQL"
description: "Pratiche di sicurezza del database e prevenzione dell'iniezione SQL in XOOPS"
---

L'iniezione SQL è una delle vulnerabilità web più pericolose e comuni. Questa guida copre come proteggere i tuoi moduli XOOPS dagli attacchi di iniezione SQL.

## Documentazione Correlata

- Security-Best-Practices - Guida completa alla sicurezza
- CSRF-Protection - Sistema di token e classe XoopsSecurity
- Input-Sanitization - MyTextSanitizer e validazione

## Comprensione dell'Iniezione SQL

L'iniezione SQL si verifica quando l'input dell'utente viene incluso direttamente nelle query SQL senza una corretta sanitizzazione o parametrizzazione.

### Esempio di Codice Vulnerabile

```php
// PERICOLOSO - NON USARE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Se un utente passa `1 OR 1=1` come ID, la query diventa:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Questo restituisce tutti i record invece di uno solo.

## Utilizzo di Query Parametrizzate

La difesa più efficace contro l'iniezione SQL è l'utilizzo di query parametrizzate (prepared statements).

### Query Parametrizzata Basica

```php
// Ottieni la connessione al database
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SICURO - Usa query parametrizzata
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Parametri Multipli

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Parametri Nominati

Alcune astrazioni di database supportano parametri nominati:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Utilizzo di XoopsObject e XoopsObjectHandler

XOOPS fornisce accesso al database orientato agli oggetti che aiuta a prevenire l'iniezione SQL attraverso il sistema Criteria.

### Utilizzo Basico di Criteria

```php
// Ottieni il gestore
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Crea criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Ottieni oggetti - automaticamente sicuri dall'iniezione SQL
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo per Condizioni Multiple

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Opzionale: Aggiungi ordinamento e limiti
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Operatori Criteria

```php
// Uguale (predefinito)
$criteria->add(new Criteria('status', 'active'));

// Non uguale
$criteria->add(new Criteria('status', 'deleted', '!='));

// Maggiore di
$criteria->add(new Criteria('count', 100, '>'));

// Minore o uguale a
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (per corrispondenza parziale)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (valori multipli)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### Condizioni OR

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// Condizione OR
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Prefissi della Tabella

Usa sempre il sistema di prefisso della tabella XOOPS:

```php
// Corretto - usando il prefisso
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Anche corretto
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## Query INSERT

### Utilizzo di Query Preparate

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

### Utilizzo di XoopsObject

```php
// Crea nuovo oggetto
$item = $itemHandler->create();

// Imposta i valori - il gestore sfugge automaticamente
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Inserisci
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## Query UPDATE

### Utilizzo di Query Preparate

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

### Utilizzo di XoopsObject

```php
// Ottieni oggetto esistente
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## Query DELETE

### Utilizzo di Query Preparate

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Utilizzo di XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Eliminazione in Massa con Criteria

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Sfuggire Quando Necessario

Se non puoi usare query preparate, usa il corretto escape:

```php
// Utilizza mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Tuttavia, **preferisci sempre le query preparate** rispetto allo sfuggire.

## Creazione di Query Dinamiche in Modo Sicuro

### Nomi di Colonna Sicuri

I nomi di colonna non possono essere parametrizzati. Valida contro una whitelist:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Valore predefinito sicuro
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Nomi di Tabella Sicuri

Allo stesso modo, valida i nomi delle tabelle:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Costruzione di Clausole WHERE Dinamiche

```php
$criteria = new CriteriaCompo();

// Aggiungi condizioni basate su input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## Query LIKE

Fai attenzione alle query LIKE per evitare iniezione di wildcard:

```php
// Sfuggi i caratteri speciali nel termine di ricerca
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Poi usa in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## Clausole IN

Quando usi le clausole IN, assicurati che tutti i valori siano correttamente tipizzati:

```php
// Array di ID dall'input dell'utente
$inputIds = $_POST['ids'] ?? [];

// Sanitizza: assicurati che siano tutti interi
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

O con Criteria:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Sicurezza delle Transazioni

Quando esegui più query correlate:

```php
// Inizia transazione
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback su errore
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## Gestione degli Errori

Non esporre mai gli errori SQL agli utenti:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Registra l'errore effettivo per il debug
    error_log('Database error: ' . $xoopsDB->error());

    // Mostra un messaggio generico all'utente
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## Errori Comuni da Evitare

### Errore 1: Interpolazione Diretta della Variabile

```php
// SBAGLIATO
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// GIUSTO
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Errore 2: Utilizzo di addslashes()

```php
// SBAGLIATO - addslashes NON è sufficiente
$safe = addslashes($_GET['input']);

// GIUSTO - usa query parametrizzate o escape corretto
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Errore 3: Fidarsi degli ID Numerici

```php
// SBAGLIATO - assumendo che l'input sia numerico
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// GIUSTO - esplicita il casting in intero
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Errore 4: Iniezione di Secondo Ordine

```php
// I dati dal database NON sono automaticamente sicuri
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// SBAGLIATO - fidarsi dei dati dal database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// GIUSTO - sempre usa parametri
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## Test di Sicurezza

### Testa le Tue Query

Testa i tuoi moduli con questi input per controllare l'iniezione SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Se uno di questi causa comportamenti imprevisti o errori, hai una vulnerabilità.

### Test Automatizzato

Usa strumenti di test automatizzati di iniezione SQL durante lo sviluppo:

- SQLMap
- Burp Suite
- OWASP ZAP

## Riassunto delle Best Practice

1. **Usa sempre query parametrizzate** (prepared statements)
2. **Usa XoopsObject/XoopsObjectHandler** quando possibile
3. **Usa le classi Criteria** per costruire query
4. **Whitelist valori consentiti** per nomi di colonne e tabelle
5. **Esegui il casting esplicito** di valori numerici con `(int)` o `(float)`
6. **Non esporre mai errori di database** agli utenti
7. **Usa transazioni** per più query correlate
8. **Test per l'iniezione SQL** durante lo sviluppo
9. **Sfuggi i wildcard LIKE** nelle query di ricerca
10. **Sanitizza i valori della clausola IN** individualmente

---

#security #sql-injection #database #xoops #prepared-statements #Criteria
