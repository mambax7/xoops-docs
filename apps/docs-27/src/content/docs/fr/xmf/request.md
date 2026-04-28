---
title: "XMF Request"
description: 'Gestion sécurisée des requêtes HTTP et validation des entrées avec la classe Xmf\Request'
---

La classe `Xmf\Request` fournit un accès contrôlé aux variables de requête HTTP avec assainissement et conversion de type intégrés. Elle protège contre les injections potentiellement nuisibles par défaut tout en conformant l'entrée aux types spécifiés.

## Aperçu

La gestion des requêtes est l'un des aspects les plus critiques pour la sécurité du développement web. La classe XMF Request:

- Assainit automatiquement l'entrée pour prévenir les attaques XSS
- Fournit des accesseurs sécurisés pour les types de données courants
- Supporte plusieurs sources de requête (GET, POST, COOKIE, etc.)
- Offre une gestion cohérente des valeurs par défaut

## Utilisation de base

```php
use Xmf\Request;

// Obtenir une entrée de chaîne
$name = Request::getString('name', '');

// Obtenir une entrée entière
$id = Request::getInt('id', 0);

// Obtenir à partir d'une source spécifique
$postData = Request::getString('data', '', 'POST');
```

## Méthodes Request

### getMethod()

Retourne la méthode de requête HTTP pour la requête actuelle.

```php
$method = Request::getMethod();
// Retourne: 'GET', 'HEAD', 'POST', ou 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

La méthode centrale que la plupart des autres méthodes `get*()` invoquent. Récupère et retourne une variable nommée à partir des données de la requête.

**Paramètres:**
- `$name` - Nom de la variable à récupérer
- `$default` - Valeur par défaut si la variable n'existe pas
- `$hash` - Hachage source: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, ou REQUEST (défaut)
- `$type` - Type de données pour le nettoyage (voir les types FilterInput ci-dessous)
- `$mask` - Masque de bits pour les options de nettoyage

**Valeurs du masque:**

| Constante Masque | Effet |
|------------------|--------|
| `MASK_NO_TRIM` | Ne pas supprimer les espaces de début/fin |
| `MASK_ALLOW_RAW` | Ignorer le nettoyage, permettre l'entrée brute |
| `MASK_ALLOW_HTML` | Permettre un ensemble limité de balisage HTML "sûr" |

```php
// Obtenir l'entrée brute sans nettoyage
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Permettre le HTML sûr
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Méthodes spécifiques aux types

### getInt($name, $default, $hash)

Retourne une valeur entière. Seuls les chiffres sont autorisés.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Retourne une valeur décimale. Seuls les chiffres et les points sont autorisés.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Retourne une valeur booléenne.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Retourne une chaîne avec seulement des lettres et des traits de soulignement `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Retourne une chaîne de commande avec seulement `[A-Za-z0-9.-_]`, forcée en minuscules.

```php
$op = Request::getCmd('op', 'list');
// L'entrée "View_Item" devient "view_item"
```

### getString($name, $default, $hash, $mask)

Retourne une chaîne nettoyée avec le mauvais code HTML supprimé (sauf si remplacé par masque).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Permettre du HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Retourne un tableau, traité récursivement pour supprimer XSS et le mauvais code.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Retourne du texte brut sans nettoyage. À utiliser avec prudence.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Retourne une URL web validée (schémas relatifs, http ou https uniquement).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Retourne un chemin système de fichiers ou web validé.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Retourne une adresse e-mail validée ou la valeur par défaut.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Retourne une adresse IPv4 ou IPv6 validée.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Retourne une valeur d'en-tête de requête HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Méthodes utilitaires

### hasVar($name, $hash)

Vérifie si une variable existe dans le hachage spécifié.

```php
if (Request::hasVar('submit', 'POST')) {
    // Le formulaire a été soumis
}

if (Request::hasVar('id', 'GET')) {
    // Le paramètre ID existe
}
```

### setVar($name, $value, $hash, $overwrite)

Définit une variable dans le hachage spécifié. Retourne la valeur précédente ou null.

```php
// Définir une valeur
$oldValue = Request::setVar('processed', true, 'POST');

// Définir seulement si elle n'existe pas déjà
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Retourne une copie nettoyée d'un tableau de hachage entier.

```php
// Obtenir toutes les données POST nettoyées
$postData = Request::get('POST');

// Obtenir toutes les données GET
$getData = Request::get('GET');

// Obtenir les données REQUEST sans trim
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Définit plusieurs variables à partir d'un tableau.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Ne pas remplacer l'existant
```

## Intégration FilterInput

La classe Request utilise `Xmf\FilterInput` pour le nettoyage. Types de filtres disponibles:

| Type | Description |
|------|-------------|
| ALPHANUM / ALNUM | Alphanumérique uniquement |
| ARRAY | Nettoyer récursivement chaque élément |
| BASE64 | Chaîne codée en base64 |
| BOOLEAN / BOOL | Vrai ou faux |
| CMD | Commande - A-Z, 0-9, trait de soulignement, tiret, point (minuscules) |
| EMAIL | Adresse e-mail valide |
| FLOAT / DOUBLE | Nombre décimal |
| INTEGER / INT | Valeur entière |
| IP | Adresse IP valide |
| PATH | Chemin système de fichiers ou web |
| STRING | Chaîne générale (par défaut) |
| USERNAME | Format nom d'utilisateur |
| WEBURL | URL web |
| WORD | Lettres A-Z et trait de soulignement uniquement |

## Exemples pratiques

### Traitement de formulaire

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Valider la soumission du formulaire
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### Gestionnaire AJAX

```php
use Xmf\Request;

// Vérifier la requête AJAX
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Gérer la suppression
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Gérer la mise à jour
            break;
    }
}
```

### Pagination

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Valider les plages
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Formulaire de recherche

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Construire les critères de recherche
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Bonnes pratiques de sécurité

1. **Toujours utiliser des méthodes spécifiques au type** - Utiliser `getInt()` pour les IDs, `getEmail()` pour les e-mails, etc.

2. **Fournir des valeurs par défaut sensées** - Ne jamais supposer que l'entrée existe

3. **Valider après l'assainissement** - L'assainissement supprime les mauvaises données, la validation assure les données correctes

4. **Utiliser le hachage approprié** - Spécifier POST pour les données de formulaire, GET pour les paramètres de requête

5. **Éviter l'entrée brute** - Utiliser `getText()` ou `MASK_ALLOW_RAW` uniquement quand absolument nécessaire

```php
// Bon - spécifique au type avec défaut
$id = Request::getInt('id', 0);

// Mauvais - utiliser getString pour les données numériques
$id = (int) Request::getString('id', '0');
```

## Voir aussi

- Getting-Started-with-XMF - Concepts XMF de base
- XMF-Module-Helper - Classe d'aide du module
- ../XMF-Framework - Aperçu du framework

---

#xmf #request #security #input-validation #sanitization
