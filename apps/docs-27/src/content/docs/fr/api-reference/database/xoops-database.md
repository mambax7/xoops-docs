---
title: "Classe XoopsDatabase"
description: "Couche d'abstraction base de données fournissant la gestion de connexions, l'exécution de requêtes et la gestion de résultats"
---

La classe `XoopsDatabase` fournit une couche d'abstraction base de données pour XOOPS, gérant la connexion, l'exécution de requêtes, le traitement des résultats et la gestion des erreurs. Elle supporte plusieurs pilotes base de données par une architecture de pilotes.

## Vue d'ensemble de la classe

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

## Hiérarchie des classes

```
XoopsDatabase (Base abstraite)
├── XoopsMySQLDatabase (Extension MySQL)
│   └── XoopsMySQLDatabaseProxy (Proxy sécurité)
└── XoopsMySQLiDatabase (Extension MySQLi)
    └── XoopsMySQLiDatabaseProxy (Proxy sécurité)

XoopsDatabaseFactory
└── Crée des instances de pilotes appropriés
```

## Obtenir une instance de base de données

### Utiliser la fabrique

```php
// Recommandé : Utiliser la fabrique
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Utiliser getInstance

```php
// Alternative : Accès singleton direct
$db = XoopsDatabase::getInstance();
```

### Variable globale

```php
// Héritage : Utiliser la variable globale
global $xoopsDB;
```

## Méthodes principales

### connect

Établit une connexion base de données.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$selectdb` | bool | Si la base de données doit être sélectionnée |

**Retour :** `bool` - True en cas de connexion réussie

**Exemple :**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connecté avec succès";
}
```

---

### query

Exécute une requête SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$sql` | string | Chaîne de requête SQL |
| `$limit` | int | Maximum de lignes à retourner (0 = pas de limite) |
| `$start` | int | Décalage de départ |

**Retour :** `resource|bool` - Ressource de résultat ou false en cas d'échec

**Exemple :**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Requête simple
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Requête avec limite
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // Les 10 premières lignes

// Requête avec décalage
$result = $db->query($sql, 10, 20); // 10 lignes à partir de la ligne 20
```

---

### queryF

Exécute une requête forçant l'opération (contourne les vérifications de sécurité).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Cas d'utilisation :**
- Opérations INSERT, UPDATE, DELETE
- Quand vous avez besoin de contourner les restrictions de lecture seule

**Exemple :**
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

Ajoute le préfixe base de données au nom de la table.

```php
public function prefix(string $table = ''): string
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$table` | string | Nom de la table sans préfixe |

**Retour :** `string` - Nom de la table avec préfixe

**Exemple :**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (si préfixe est "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (juste le préfixe)
```

---

### fetchArray

Récupère une ligne de résultat sous forme de tableau associatif.

```php
abstract public function fetchArray($result): ?array
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$result` | resource | Ressource de résultat de requête |

**Retour :** `array|null` - Tableau associatif ou null s'il n'y a plus de lignes

**Exemple :**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "Utilisateur : " . $row['uname'] . "\n";
    echo "Email : " . $row['email'] . "\n";
}
```

---

### fetchObject

Récupère une ligne de résultat sous forme d'objet.

```php
abstract public function fetchObject($result): ?object
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$result` | resource | Ressource de résultat de requête |

**Retour :** `object|null` - Objet avec propriétés pour chaque colonne

**Exemple :**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Nom d'utilisateur : " . $user->uname;
    echo "Email : " . $user->email;
}
```

---

### fetchRow

Récupère une ligne de résultat sous forme de tableau numérique.

```php
abstract public function fetchRow($result): ?array
```

**Exemple :**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Nom d'utilisateur : " . $row[0] . ", Email : " . $row[1];
}
```

---

### fetchBoth

Récupère une ligne de résultat sous forme de tableau associatif et numérique.

```php
abstract public function fetchBoth($result): ?array
```

**Exemple :**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // Par nom
echo $row[0];        // Par index
```

---

### getRowsNum

Obtient le nombre de lignes dans un résultat.

```php
abstract public function getRowsNum($result): int
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$result` | resource | Ressource de résultat de requête |

**Retour :** `int` - Nombre de lignes

**Exemple :**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Trouvé $count utilisateurs actifs";
```

---

### getAffectedRows

Obtient le nombre de lignes affectées par la dernière requête.

```php
abstract public function getAffectedRows(): int
```

**Retour :** `int` - Nombre de lignes affectées

**Exemple :**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Mis à jour $affected lignes";
```

---

### getInsertId

Obtient l'ID auto-généré de la dernière insertion INSERT.

```php
abstract public function getInsertId(): int
```

**Retour :** `int` - Dernier ID inséré

**Exemple :**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Article créé avec ID : $newId";
```

---

### escape

Échappe une chaîne pour une utilisation sécurisée dans les requêtes SQL.

```php
abstract public function escape(string $string): string
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$string` | string | Chaîne à échapper |

**Retour :** `string` - Chaîne échappée (sans guillemets)

**Exemple :**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Échappe et met entre guillemets une chaîne pour SQL.

```php
public function quoteString(string $string): string
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$string` | string | Chaîne à mettre entre guillemets |

**Retour :** `string` - Chaîne échappée et mise entre guillemets

**Exemple :**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Libère la mémoire associée à un résultat.

```php
abstract public function freeRecordSet($result): void
```

**Exemple :**
```php
$result = $db->query($sql);
// Traiter les résultats...
$db->freeRecordSet($result);  // Libérer la mémoire
```

---

## Gestion des erreurs

### error

Obtient le dernier message d'erreur.

```php
abstract public function error(): string
```

**Exemple :**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Erreur base de données : " . $db->error();
}
```

---

### errno

Obtient le dernier numéro d'erreur.

```php
abstract public function errno(): int
```

**Exemple :**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Erreur #" . $db->errno() . " : " . $db->error();
}
```

---

## Requêtes préparées (MySQLi)

Le pilote MySQLi supporte les requêtes préparées pour une sécurité améliorée.

### prepare

Crée une requête préparée.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Exemple :**
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

---

## Support des transactions

### beginTransaction

Démarre une transaction.

```php
public function beginTransaction(): bool
```

### commit

Valide la transaction actuelle.

```php
public function commit(): bool
```

### rollback

Annule la transaction actuelle.

```php
public function rollback(): bool
```

**Exemple :**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Opérations multiples
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Vérifier les erreurs
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction complétée";

} catch (Exception $e) {
    $db->rollback();
    echo "Échec de la transaction : " . $e->getMessage();
}
```

---

## Meilleures pratiques

### Sécurité

1. **Toujours échapper les entrées utilisateur** :
```php
$safe = $db->escape($_POST['input']);
```

2. **Utiliser les requêtes préparées quand disponibles** :
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Utiliser quoteString pour les valeurs** :
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Performance

1. **Toujours utiliser LIMIT pour les grandes tables** :
```php
$result = $db->query($sql, 100);  // Limiter les résultats
```

2. **Libérer les jeux de résultats quand c'est fait** :
```php
$db->freeRecordSet($result);
```

3. **Utiliser les index appropriés** dans vos définitions de table

4. **Préférer les gestionnaires au SQL brut** quand possible

## Documentation connexe

- Criteria - Système de critères de requête
- QueryBuilder - Construction de requêtes fluide
- ../Core/XoopsObjectHandler - Persistance d'objet

---

*Voir aussi : [Code source XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
