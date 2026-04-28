---
title: "Classe XoopsObject"
description: "Classe de base pour tous les objets de données du système XOOPS fournissant la gestion des propriétés, la validation et la sérialisation"
---

La classe `XoopsObject` est la classe de base fondamentale pour tous les objets de données du système XOOPS. Elle fournit une interface standardisée pour gérer les propriétés d'objets, la validation, le suivi des modifications et la sérialisation.

## Vue d'ensemble de la classe

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Hiérarchie des classes

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Objets de modules personnalisés]
```

## Propriétés

| Propriété | Type | Visibilité | Description |
|----------|------|------------|-------------|
| `$vars` | array | protégé | Stocke les définitions et valeurs de variables |
| `$cleanVars` | array | protégé | Stocke les valeurs nettoyées pour les opérations base de données |
| `$isNew` | bool | protégé | Indique si l'objet est nouveau (pas encore dans la base de données) |
| `$errors` | array | protégé | Stocke les messages d'erreur et de validation |

## Constructeur

```php
public function __construct()
```

Crée une nouvelle instance XoopsObject. L'objet est marqué comme nouveau par défaut.

**Exemple :**
```php
$object = new XoopsObject();
// L'objet est nouveau et n'a pas de variables définies
```

## Méthodes principales

### initVar

Initialise une définition de variable pour l'objet.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$key` | string | Nom de la variable |
| `$dataType` | int | Constante de type de données (voir Types de données) |
| `$value` | mixed | Valeur par défaut |
| `$required` | bool | Si le champ est obligatoire |
| `$maxlength` | int | Longueur maximale pour les types string |
| `$options` | string | Options supplémentaires |

**Types de données :**

| Constante | Valeur | Description |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Entrée boîte texte |
| `XOBJ_DTYPE_TXTAREA` | 2 | Contenu textarea |
| `XOBJ_DTYPE_INT` | 3 | Valeur entière |
| `XOBJ_DTYPE_URL` | 4 | String URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Adresse email |
| `XOBJ_DTYPE_ARRAY` | 6 | Tableau sérialisé |
| `XOBJ_DTYPE_OTHER` | 7 | Type personnalisé |
| `XOBJ_DTYPE_SOURCE` | 8 | Code source |
| `XOBJ_DTYPE_STIME` | 9 | Format horodatage court |
| `XOBJ_DTYPE_MTIME` | 10 | Format horodatage moyen |
| `XOBJ_DTYPE_LTIME` | 11 | Format horodatage long |
| `XOBJ_DTYPE_FLOAT` | 12 | Nombre décimal |
| `XOBJ_DTYPE_DECIMAL` | 13 | Nombre décimal |
| `XOBJ_DTYPE_ENUM` | 14 | Énumération |

**Exemple :**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

Définit la valeur d'une variable.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$key` | string | Nom de la variable |
| `$value` | mixed | Valeur à définir |
| `$notGpc` | bool | Si true, la valeur ne vient pas de GET/POST/COOKIE |

**Retour :** `bool` - True si succès, false sinon

**Exemple :**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Contenu ici</p>', true); // Pas de saisie utilisateur
$object->setVar('status', 1);
```

---

### getVar

Récupère la valeur d'une variable avec formatage optionnel.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$key` | string | Nom de la variable |
| `$format` | string | Format de sortie |

**Options de format :**

| Format | Description |
|--------|-------------|
| `'s'` | Affichage - Entités HTML échappées pour l'affichage |
| `'e'` | Édition - Pour les valeurs d'entrée de formulaire |
| `'p'` | Aperçu - Similaire à l'affichage |
| `'f'` | Données formulaire - Brutes pour le traitement de formulaires |
| `'n'` | Aucun - Valeur brute, sans formatage |

**Retour :** `mixed` - La valeur formatée

**Exemple :**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (pour valeur input)
echo $object->getVar('title', 'n'); // "Hello <World>" (brut)

// Pour les types de données tableaux
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Retourne le tableau
```

---

### setVars

Définit plusieurs variables à la fois à partir d'un tableau.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$values` | array | Tableau associatif de paires clé => valeur |
| `$notGpc` | bool | Si true, les valeurs ne viennent pas de GET/POST/COOKIE |

**Exemple :**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// Depuis la base de données (pas de saisie utilisateur)
$object->setVars($row, true);
```

---

### getValues

Récupère toutes les valeurs de variables.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$keys` | array | Clés spécifiques à récupérer (null pour toutes) |
| `$format` | string | Format de sortie |
| `$maxDepth` | int | Profondeur maximale pour les objets imbriqués |

**Retour :** `array` - Tableau associatif de valeurs

**Exemple :**
```php
$object = new MyObject();

// Obtenir toutes les valeurs
$allValues = $object->getValues();

// Obtenir des valeurs spécifiques
$subset = $object->getValues(['title', 'status']);

// Obtenir les valeurs brutes pour la base de données
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Assigne une valeur directement sans validation (utiliser avec prudence).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$key` | string | Nom de la variable |
| `$value` | mixed | Valeur à assigner |

**Exemple :**
```php
// Assignation directe depuis une source de confiance (ex. base de données)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Nettoie toutes les variables pour les opérations base de données.

```php
public function cleanVars(): bool
```

**Retour :** `bool` - True si toutes les variables sont valides

**Exemple :**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Les variables sont nettoyées et prêtes pour la base de données
    $cleanData = $object->cleanVars;
} else {
    // Des erreurs de validation se sont produites
    $errors = $object->getErrors();
}
```

---

### isNew

Vérifie ou définit si l'objet est nouveau.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Exemple :**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Méthodes de gestion des erreurs

### setErrors

Ajoute un message d'erreur.

```php
public function setErrors(string|array $error): void
```

**Exemple :**
```php
$object->setErrors('Le titre est obligatoire');
$object->setErrors(['Erreur champ 1', 'Erreur champ 2']);
```

---

### getErrors

Récupère tous les messages d'erreur.

```php
public function getErrors(): array
```

**Exemple :**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Retourne les erreurs formatées en HTML.

```php
public function getHtmlErrors(): string
```

**Exemple :**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Méthodes utilitaires

### toArray

Convertit l'objet en tableau.

```php
public function toArray(): array
```

**Exemple :**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Retourne les définitions des variables.

```php
public function getVars(): array
```

**Exemple :**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Champ : $key, Type : {$definition['data_type']}\n";
}
```

---

## Exemple d'utilisation complet

```php
<?php
/**
 * Objet Article personnalisé
 */
class Article extends XoopsObject
{
    /**
     * Constructeur - Initialiser toutes les variables
     */
    public function __construct()
    {
        parent::__construct();

        // Clé primaire
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Champs obligatoires
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Champs optionnels
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Horodatages
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Indicateurs de statut
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Métadonnées comme tableau
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Obtenir la date de création formatée
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Vérifier si l'article est publié
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Incrémenter le compteur d'affichages
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Validation personnalisée
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Validation du titre
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Le titre est obligatoire');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Le titre doit avoir au moins 5 caractères');
        }

        // Validation de l'auteur
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('L\'auteur est obligatoire');
        }

        return empty($this->errors);
    }
}

// Utilisation
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Contenu de l\'article ici...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'Un exemple d\'article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Enregistrer dans la base de données via gestionnaire
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article enregistré avec ID : " . $article->getVar('article_id');
} else {
    echo "Erreurs : " . $article->getHtmlErrors();
}
```

## Meilleures pratiques

1. **Toujours initialiser les variables** : Définir toutes les variables dans le constructeur avec `initVar()`

2. **Utiliser les types de données appropriés** : Choisir la constante `XOBJ_DTYPE_*` correcte pour la validation

3. **Gérer les entrées utilisateur avec soin** : Utiliser `setVar()` avec `$notGpc = false` pour les saisies utilisateur

4. **Valider avant enregistrement** : Toujours appeler `cleanVars()` avant les opérations base de données

5. **Utiliser les paramètres de format** : Utiliser le format approprié dans `getVar()` pour le contexte

6. **Étendre pour la logique personnalisée** : Ajouter des méthodes spécifiques au domaine dans les sous-classes

## Documentation connexe

- XoopsObjectHandler - Modèle gestionnaire pour la persistance des objets
- ../Database/Criteria - Construction de requêtes avec Criteria
- ../Database/XoopsDatabase - Opérations base de données

---

*Voir aussi : [Code source XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
