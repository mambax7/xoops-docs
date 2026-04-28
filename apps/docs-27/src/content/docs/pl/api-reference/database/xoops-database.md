---
title: "Klasa XoopsDatabase"
description: "Warstwa abstrakcji bazy danych zapewniająca zarządzanie połączeniami, wykonywanie zapytań i obsługę wyników"
---

Klasa `XoopsDatabase` zapewnia warstwę abstrakcji bazy danych dla XOOPS, obsługując zarządzanie połączeniami, wykonywanie zapytań, przetwarzanie wyników i obsługę błędów. Obsługuje wiele sterowników baz danych poprzez architekturę sterownika.

## Przegląd Klasy

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

## Hierarchia Klas

```
XoopsDatabase (Klasa Bazowa Abstrakcyjna)
├── XoopsMySQLDatabase (Rozszerzenie MySQL)
│   └── XoopsMySQLDatabaseProxy (Proxy Bezpieczeństwa)
└── XoopsMySQLiDatabase (Rozszerzenie MySQLi)
    └── XoopsMySQLiDatabaseProxy (Proxy Bezpieczeństwa)

XoopsDatabaseFactory
└── Tworzy odpowiednie instancje sterowników
```

## Pobieranie Instancji Bazy Danych

### Używanie Fabryki

```php
// Zalecane: Użyj fabryki
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Używanie getInstance

```php
// Alternatywa: Bezpośredni dostęp singleton
$db = XoopsDatabase::getInstance();
```

### Zmienna Globalna

```php
// Starsze: Użyj zmiennej globalnej
global $xoopsDB;
```

## Metody Podstawowe

### connect

Nawiązuje połączenie z bazą danych.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$selectdb` | bool | Czy wybrać bazę danych |

**Zwraca:** `bool` - True przy pomyślnym połączeniu

**Przykład:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### query

Wykonuje zapytanie SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$sql` | string | Ciąg zapytania SQL |
| `$limit` | int | Maksymalna liczba wierszy do zwrócenia (0 = brak limitu) |
| `$start` | int | Przesunięcie początkowe |

**Zwraca:** `resource|bool` - Zasób wyniku lub false w przypadku niepowodzenia

**Przykład:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Proste zapytanie
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Zapytanie z limitem
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // Pierwsze 10 wierszy

// Zapytanie z przesunięciem
$result = $db->query($sql, 10, 20); // 10 wierszy poczynając od wiersza 20
```

---

### queryF

Wykonuje zapytanie wymuszające operację (obchodzi kontrole bezpieczeństwa).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Przypadki Użycia:**
- Operacje INSERT, UPDATE, DELETE
- Gdy musisz ominąć ograniczenia tylko do odczytu

**Przykład:**
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

Poprzedza prefiks tabeli bazy danych.

```php
public function prefix(string $table = ''): string
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$table` | string | Nazwa tabeli bez prefiksu |

**Zwraca:** `string` - Nazwa tabeli z prefiksem

**Przykład:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (jeśli prefiks to "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (tylko prefiks)
```

---

### fetchArray

Pobiera wiersz wyniku jako tablicę asocjacyjną.

```php
abstract public function fetchArray($result): ?array
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$result` | resource | Zasób wyniku zapytania |

**Zwraca:** `array|null` - Tablica asocjacyjna lub null jeśli brak więcej wierszy

**Przykład:**
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

Pobiera wiersz wyniku jako obiekt.

```php
abstract public function fetchObject($result): ?object
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$result` | resource | Zasób wyniku zapytania |

**Zwraca:** `object|null` - Obiekt z właściwościami dla każdej kolumny

**Przykład:**
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

Pobiera wiersz wyniku jako tablicę liczbową.

```php
abstract public function fetchRow($result): ?array
```

**Przykład:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### fetchBoth

Pobiera wiersz wyniku jako tablicę asocjacyjną i liczbową.

```php
abstract public function fetchBoth($result): ?array
```

**Przykład:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // Po nazwie
echo $row[0];        // Po indeksie
```

---

### getRowsNum

Pobiera liczbę wierszy w zestawie wyników.

```php
abstract public function getRowsNum($result): int
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$result` | resource | Zasób wyniku zapytania |

**Zwraca:** `int` - Liczba wierszy

**Przykład:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Pobiera liczbę dotkniętych wierszy z ostatniego zapytania.

```php
abstract public function getAffectedRows(): int
```

**Zwraca:** `int` - Liczba dotkniętych wierszy

**Przykład:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Pobiera automatycznie wygenerowane ID z ostatniego INSERT.

```php
abstract public function getInsertId(): int
```

**Zwraca:** `int` - ID ostatniego wstawienia

**Przykład:**
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

Ucieka od ciągu na potrzeby bezpiecznego użycia w zapytaniach SQL.

```php
abstract public function escape(string $string): string
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$string` | string | Ciąg do ucieczki |

**Zwraca:** `string` - Ciąg ucieczki (bez cudzysłowów)

**Przykład:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Ucieka i cytuje ciąg dla SQL.

```php
public function quoteString(string $string): string
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$string` | string | Ciąg do cytowania |

**Zwraca:** `string` - Ciąg z ucieczką i cytowany

**Przykład:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Zwalnia pamięć powiązaną z wynikiem.

```php
abstract public function freeRecordSet($result): void
```

**Przykład:**
```php
$result = $db->query($sql);
// Przetwarzaj wyniki...
$db->freeRecordSet($result);  // Zwolnij pamięć
```

---

## Obsługa Błędów

### error

Pobiera ostatnią wiadomość błędu.

```php
abstract public function error(): string
```

**Przykład:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### errno

Pobiera ostatni numer błędu.

```php
abstract public function errno(): int
```

**Przykład:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Przygotowane Instrukcje (MySQLi)

Sterownik MySQLi obsługuje przygotowane instrukcje w celu zwiększenia bezpieczeństwa.

### prepare

Tworzy przygotowaną instrukcję.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Przykład:**
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

### Przygotowana Instrukcja z Wieloma Parametrami

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Article created with ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## Obsługa Transakcji

### beginTransaction

Rozpoczyna transakcję.

```php
public function beginTransaction(): bool
```

### commit

Zatwierdza bieżącą transakcję.

```php
public function commit(): bool
```

### rollback

Wycofuje bieżącą transakcję.

```php
public function rollback(): bool
```

**Przykład:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Wiele operacji
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Sprawdź błędy
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction completed";

} catch (Exception $e) {
    $db->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
```

---

## Kompletne Przykłady Użycia

### Podstawowe Operacje CRUD

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// UTWÓRZ
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// CZYTAJ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// AKTUALIZUJ
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// USUŃ
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### Zapytanie o Paginację

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Pobierz całkowitą liczbę
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Pobierz stronę wyników
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### Zapytanie Wyszukiwania z LIKE

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Ogranicz do 50 wyników

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### Zapytanie Join

```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## Klasa SqlUtility

Klasa pomocnicza do operacji na plikach SQL.

### splitMySqlFile

Dzieli plik SQL na pojedyncze zapytania.

```php
public static function splitMySqlFile(string $content): array
```

**Przykład:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```

### prefixQuery

Zastępuje symbole zastępcze tabeli prefabrykowanymi nazwami tabel.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Przykład:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Najlepsze Praktyki

### Bezpieczeństwo

1. **Zawsze uciekaj od danych wejścia użytkownika**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Używaj przygotowanych instrukcji gdy jest dostępne**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Używaj quoteString dla wartości**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Wydajność

1. **Zawsze używaj LIMIT dla dużych tabel**:
```php
$result = $db->query($sql, 100);  // Ogranicz wyniki
```

2. **Zwolnij zestawy wyników gdy gotowe**:
```php
$db->freeRecordSet($result);
```

3. **Używaj odpowiednich indeksów** w definicjach tabeli

4. **Wolności handlery nad surowym SQL** gdy to możliwe

### Obsługa Błędów

1. **Zawsze sprawdzaj błędy**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Używaj transakcji dla wielu powiązanych operacji**:
```php
$db->beginTransaction();
// ... operacje ...
$db->commit();  // lub $db->rollback();
```

## Powiązana Dokumentacja

- Criteria - System kryteriów zapytań
- QueryBuilder - Fluent budowanie zapytań
- ../Core/XoopsObjectHandler - Trwałość obiektu

---

*Patrz też: [Kod Źródłowy XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
