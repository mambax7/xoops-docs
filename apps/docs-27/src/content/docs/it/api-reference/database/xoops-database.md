---
title: "Classe XoopsDatabase"
description: "Livello di astrazione database che fornisce gestione connessione, esecuzione query e gestione risultati"
---

La classe `XoopsDatabase` fornisce un livello di astrazione database per XOOPS, gestendo connessioni, esecuzione query, elaborazione risultati e gestione errori. Supporta driver database multipli tramite un'architettura driver.

## Panoramica Classe

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## Gerarchia Classi

```
XoopsDatabase (Base Astratto)
├── XoopsMySQLDatabase (Estensione MySQL)
│   └── XoopsMySQLDatabaseProxy (Proxy Sicurezza)
└── XoopsMySQLiDatabase (Estensione MySQLi)
    └── XoopsMySQLiDatabaseProxy (Proxy Sicurezza)

XoopsDatabaseFactory
└── Crea istanze driver appropriati
```

## Ottenere un'Istanza Database

### Usando la Factory

```php
// Consigliato: Usa la factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Usando getInstance

```php
// Alternativa: Accesso singleton diretto
$db = XoopsDatabase::getInstance();
```

### Variabile Globale

```php
// Legacy: Usa variabile globale
global $xoopsDB;
```

## Metodi Core

### connect

Stabilisce una connessione database.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$selectdb` | bool | Se selezionare il database |

**Restituisce:** `bool` - True se connessione riuscita

**Esempio:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connesso con successo";
}
```

---

### query

Esegue una query SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$sql` | string | Stringa query SQL |
| `$limit` | int | Righe massime da restituire (0 = no limit) |
| `$start` | int | Offset iniziale |

**Restituisce:** `resource|bool` - Risorsa risultato o false se fallisce

**Esempio:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Query semplice
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Query con limit
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // Prime 10 righe

// Query con offset
$result = $db->query($sql, 10, 20); // 10 righe a partire dalla riga 20
```

---

### queryF

Esegue una query forzando l'operazione (bypassa controlli sicurezza).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Casi di Uso**
- Operazioni INSERT, UPDATE, DELETE
- Quando hai bisogno di bypassare restrizioni read-only

**Esempio:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### prefix

Prepone il prefisso tabella database.

```php
public function prefix(string $table = ''): string
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$table` | string | Nome tabella senza prefisso |

**Restituisce:** `string` - Nome tabella con prefisso

**Esempio:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (se prefisso è "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (solo il prefisso)
```

---

### fetchArray

Legge una riga di risultato come array associativo.

```php
abstract public function fetchArray($result): ?array
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$result` | resource | Risorsa risultato query |

**Restituisce:** `array|null` - Array associativo o null se nessun'altra riga

**Esempio:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "Utente: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

Legge una riga di risultato come oggetto.

```php
abstract public function fetchObject($result): ?object
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$result` | resource | Risorsa risultato query |

**Restituisce:** `object|null` - Oggetto con proprietà per ogni colonna

**Esempio:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Nome Utente: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

Legge una riga di risultato come array numerico.

```php
abstract public function fetchRow($result): ?array
```

**Esempio:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Nome Utente: " . $row[0] . ", Email: " . $row[1];
}
```

---

### fetchBoth

Legge una riga di risultato come array sia associativo che numerico.

```php
abstract public function fetchBoth($result): ?array
```

**Esempio:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // Per nome
echo $row[0];        // Per indice
```

---

### getRowsNum

Ottiene il numero di righe in un set di risultati.

```php
abstract public function getRowsNum($result): int
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$result` | resource | Risorsa risultato query |

**Restituisce:** `int` - Numero di righe

**Esempio:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Trovati $count utenti attivi";
```

---

### getAffectedRows

Ottiene il numero di righe interessate dall'ultima query.

```php
abstract public function getAffectedRows(): int
```

**Restituisce:** `int` - Numero di righe interessate

**Esempio:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Aggiornate $affected righe";
```

---

### getInsertId

Ottiene l'ID auto-generato dall'ultimo INSERT.

```php
abstract public function getInsertId(): int
```

**Restituisce:** `int` - Ultimo ID insert

**Esempio:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Articolo creato con ID: $newId";
```

---

### escape

Escapa una stringa per uso sicuro in query SQL.

```php
abstract public function escape(string $string): string
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$string` | string | Stringa da escapare |

**Restituisce:** `string` - Stringa escapata (senza virgolette)

**Esempio:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escapa e quota una stringa per SQL.

```php
public function quoteString(string $string): string
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$string` | string | Stringa da quotare |

**Restituisce:** `string` - Stringa escapata e quotata

**Esempio:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Libera la memoria associata a un risultato.

```php
abstract public function freeRecordSet($result): void
```

**Esempio:**
```php
$result = $db->query($sql);
// Processa risultati...
$db->freeRecordSet($result);  // Libera memoria
```

---

## Gestione Errori

### error

Ottiene l'ultimo messaggio di errore.

```php
abstract public function error(): string
```

**Esempio:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Errore database: " . $db->error();
}
```

---

### errno

Ottiene l'ultimo numero di errore.

```php
abstract public function errno(): int
```

**Esempio:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Errore #" . $db->errno() . ": " . $db->error();
}
```

---

## Istruzioni Preparate (MySQLi)

Il driver MySQLi supporta istruzioni preparate per sicurezza migliorata.

### prepare

Crea un'istruzione preparata.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Esempio:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### Istruzione Preparata con Parametri Multipli

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "Mio Articolo";
$content = "Contenuto articolo qui";
$authorId = 1;

if ($stmt->execute()) {
    echo "Articolo creato con ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## Supporto Transazioni

### beginTransaction

Avvia una transazione.

```php
public function beginTransaction(): bool
```

### commit

Esegue il commit della transazione corrente.

```php
public function commit(): bool
```

### rollback

Fa il rollback della transazione corrente.

```php
public function rollback(): bool
```

**Esempio:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Operazioni multiple
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Verifica errori
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transazione completata";

} catch (Exception $e) {
    $db->rollback();
    echo "Transazione fallita: " . $e->getMessage();
}
```

---

## Classe SqlUtility

Classe helper per operazioni su file SQL.

### splitMySqlFile

Divide un file SQL in query individuali.

```php
public static function splitMySqlFile(string $content): array
```

**Esempio:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Errore esecuzione: " . $query . "\n";
        echo "Errore: " . $db->error() . "\n";
    }
}
```

### prefixQuery

Sostituisce i placeholder di tabella con nomi tabella con prefisso.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Esempio:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Migliori Pratiche

### Sicurezza

1. **Sempre escapa input utente**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Usa istruzioni preparate quando disponibili**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Usa quoteString per valori**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Performance

1. **Usa sempre LIMIT per tabelle grandi**:
```php
$result = $db->query($sql, 100);  // Limita risultati
```

2. **Libera set di risultati quando finito**:
```php
$db->freeRecordSet($result);
```

3. **Usa indici appropriati** nelle definizioni di tabella

4. **Preferisci handler su SQL raw** quando possibile

### Gestione Errori

1. **Sempre verifica errori**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Usa transazioni per operazioni correlate multiple**:
```php
$db->beginTransaction();
// ... operazioni ...
$db->commit();  // o $db->rollback();
```

## Documentazione Correlata

- Criteria - Sistema criteri di query
- QueryBuilder - Costruzione query fluente
- ../Core/XoopsObjectHandler - Persistenza oggetto

---

*Vedi anche: [Codice Sorgente XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
