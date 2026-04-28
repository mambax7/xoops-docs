---
title: "XoopsDatabase Klasse"
description: "Datenbankabstraktionsschicht mit Verbindungsverwaltung, Abfrageausführung und Ergebnisverarbeitung"
---

Die `XoopsDatabase` Klasse bietet eine Datenbankabstraktionsschicht für XOOPS, die Verbindungsverwaltung, Abfrageausführung, Ergebnisverarbeitung und Fehlerbehandlung handhabt. Sie unterstützt mehrere Datenbanktreiber durch eine Treiberarchitektur.

## Klassenübersicht

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

## Klassenhierarchie

```
XoopsDatabase (Abstrakte Basis)
├── XoopsMySQLDatabase (MySQL-Erweiterung)
│   └── XoopsMySQLDatabaseProxy (Sicherheits-Proxy)
└── XoopsMySQLiDatabase (MySQLi-Erweiterung)
    └── XoopsMySQLiDatabaseProxy (Sicherheits-Proxy)

XoopsDatabaseFactory
└── Erstellt geeignete Treiberinstanzen
```

## Datenbankinstanz abrufen

### Factory verwenden

```php
// Empfohlen: Factory verwenden
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### getInstance verwenden

```php
// Alternative: Direkter Singleton-Zugriff
$db = XoopsDatabase::getInstance();
```

### Globale Variable

```php
// Legacy: Globale Variable verwenden
global $xoopsDB;
```

## Kern-Methoden

### connect

Erstellt eine Datenbankverbindung.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$selectdb` | bool | Ob Datenbank ausgewählt werden soll |

**Rückgabewert:** `bool` - True bei erfolgreichem Verbindungsaufbau

**Beispiel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### query

Führt eine SQL-Abfrage aus.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$sql` | string | SQL-Abfragestring |
| `$limit` | int | Maximale Zeilen zum Zurückgeben (0 = keine Begrenzung) |
| `$start` | int | Start-Offset |

**Rückgabewert:** `resource|bool` - Ergebnis-Ressource oder false bei Fehler

**Beispiel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Einfache Abfrage
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Abfrage mit Begrenzung
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // Erste 10 Zeilen

// Abfrage mit Offset
$result = $db->query($sql, 10, 20); // 10 Zeilen ab Zeile 20
```

---

### queryF

Führt eine Abfrage aus und erzwingt die Operation (umgeht Sicherheitsprüfungen).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Anwendungsfälle:**
- INSERT, UPDATE, DELETE Operationen
- Wenn Sie Read-Only-Einschränkungen umgehen müssen

**Beispiel:**
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

Stellt dem Tabellennam das Datenbankpräfix voran.

```php
public function prefix(string $table = ''): string
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$table` | string | Tabellenname ohne Präfix |

**Rückgabewert:** `string` - Tabellenname mit Präfix

**Beispiel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (wenn Präfix "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (nur das Präfix)
```

---

### fetchArray

Holt eine Ergebniszeile als assoziatives Array.

```php
abstract public function fetchArray($result): ?array
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$result` | resource | Abfrageergebnis-Ressource |

**Rückgabewert:** `array|null` - Assoziatives Array oder null wenn keine weiteren Zeilen

**Beispiel:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

Holt eine Ergebniszeile als Objekt.

```php
abstract public function fetchObject($result): ?object
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$result` | resource | Abfrageergebnis-Ressource |

**Rückgabewert:** `object|null` - Objekt mit Eigenschaften für jede Spalte

**Beispiel:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

Holt eine Ergebniszeile als numerisches Array.

```php
abstract public function fetchRow($result): ?array
```

**Beispiel:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### fetchBoth

Holt eine Ergebniszeile als assoziatives und numerisches Array.

```php
abstract public function fetchBoth($result): ?array
```

**Beispiel:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // Nach Name
echo $row[0];        // Nach Index
```

---

### getRowsNum

Holt die Anzahl der Zeilen in einem Ergebniset.

```php
abstract public function getRowsNum($result): int
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$result` | resource | Abfrageergebnis-Ressource |

**Rückgabewert:** `int` - Anzahl der Zeilen

**Beispiel:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Holt die Anzahl der von der letzten Abfrage betroffenen Zeilen.

```php
abstract public function getAffectedRows(): int
```

**Rückgabewert:** `int` - Anzahl der betroffenen Zeilen

**Beispiel:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Holt die Auto-generierte ID vom letzten INSERT.

```php
abstract public function getInsertId(): int
```

**Rückgabewert:** `int` - Letzte Insert-ID

**Beispiel:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Created article with ID: $newId";
```

---

### escape

Escaped einen String für sichere Verwendung in SQL-Abfragen.

```php
abstract public function escape(string $string): string
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$string` | string | Zu escapender String |

**Rückgabewert:** `string` - Escapedter String (ohne Anführungszeichen)

**Beispiel:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escaped und quoted einen String für SQL.

```php
public function quoteString(string $string): string
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$string` | string | Zu quotender String |

**Rückgabewert:** `string` - Escapedter und quotierter String

**Beispiel:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Gibt dem Ergebnis zugeordneten Speicher frei.

```php
abstract public function freeRecordSet($result): void
```

**Beispiel:**
```php
$result = $db->query($sql);
// Ergebnisse verarbeiten...
$db->freeRecordSet($result);  // Speicher freigeben
```

---

## Fehlerbehandlung

### error

Holt die letzte Fehlermeldung.

```php
abstract public function error(): string
```

**Beispiel:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### errno

Holt die letzte Fehlernummer.

```php
abstract public function errno(): int
```

**Beispiel:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Best Practices

### Sicherheit

1. **Benutzereingabe immer escapen**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Prepared Statements verwenden wenn verfügbar**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **quoteString für Werte verwenden**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Leistung

1. **Immer LIMIT für große Tabellen verwenden**:
```php
$result = $db->query($sql, 100);  // Ergebnisse begrenzen
```

2. **Ergebnis-Sets freigeben wenn fertig**:
```php
$db->freeRecordSet($result);
```

3. **Geeignete Indizes verwenden** in Ihre Tabledefinitionen

4. **Handler statt Roh-SQL bevorzugen** wenn möglich

### Fehlerbehandlung

1. **Immer auf Fehler überprüfen**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Transaktionen für mehrere verwandte Operationen verwenden**:
```php
$db->beginTransaction();
// ... Operationen ...
$db->commit();  // oder $db->rollback();
```

## Zugehörige Dokumentation

- Criteria - Abfragekriterien-System
- QueryBuilder - Fließender Abfragebau
- ../Core/XoopsObjectHandler - Objektpersistenz

---

*Siehe auch: [XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
