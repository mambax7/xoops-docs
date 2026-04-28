---
title: "JWT - JSON Web Tokens"
description: "Implémentation XMF JWT pour l'authentification basée sur les jetons sécurisée et la protection AJAX"
---

L'espace de noms `Xmf\Jwt` fournit le support JSON Web Token (JWT) pour les modules XOOPS. Les JWTs permettent une authentification sécurisée et sans état, et sont particulièrement utiles pour protéger les requêtes AJAX.

## Que sont les JSON Web Tokens?

Les JSON Web Tokens sont un moyen standard de publier un ensemble de *réclamations* (données) sous forme de chaîne de texte, avec vérification cryptographique que les réclamations n'ont pas été modifiées. Pour les spécifications détaillées, voir:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Caractéristiques clés

- **Signés**: Les jetons sont signés cryptographiquement pour détecter les modifications
- **Auto-contenus**: Toutes les informations nécessaires sont dans le jeton lui-même
- **Sans état**: Aucun stockage de session côté serveur requis
- **Expirables**: Les jetons peuvent inclure des heures d'expiration

> **Note:** Les JWTs sont signés, pas chiffrés. Les données sont codées en Base64 et visibles. Utilisez les JWTs pour la vérification de l'intégrité, pas pour masquer les données sensibles.

## Pourquoi utiliser JWT dans XOOPS?

### Le problème du jeton AJAX

Les formulaires XOOPS utilisent des jetons nonce pour la protection CSRF. Cependant, les nonces fonctionnent mal avec AJAX car:

1. **Utilisation unique**: Les nonces sont généralement valides pour une soumission
2. **Problèmes asynchrones**: Plusieurs requêtes AJAX peuvent arriver dans le désordre
3. **Complexité d'actualisation**: Aucun moyen fiable d'actualiser les jetons de manière asynchrone
4. **Liaison de contexte**: Les jetons standard ne vérifient pas quel script les a émis

### Avantages des JWTs

Les JWTs résolvent ces problèmes en:

- Incluant un délai d'expiration (réclamation `exp`) pour une validité limitée dans le temps
- Supportant des réclamations personnalisées pour lier les jetons à des scripts spécifiques
- Permettant plusieurs requêtes dans la période de validité
- Fournissant une vérification cryptographique de l'origine du jeton

## Classes principales

### JsonWebToken

La classe `Xmf\Jwt\JsonWebToken` gère la création et le décodage des jetons.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Créer une clé
$key = KeyFactory::build('my_application_key');

// Créer une instance JsonWebToken
$jwt = new JsonWebToken($key, 'HS256');

// Créer un jeton
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expire dans 300 secondes

// Décoder et vérifier un jeton
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### Méthodes

**`new JsonWebToken($key, $algorithm)`**

Crée un nouveau gestionnaire JWT.
- `$key`: Un objet `Xmf\Key\KeyAbstract`
- `$algorithm`: Algorithme de signature (défaut: 'HS256')

**`create($payload, $expirationOffset)`**

Crée une chaîne de jeton signée.
- `$payload`: Tableau de réclamations
- `$expirationOffset`: Secondes jusqu'à l'expiration (optionnel)

**`decode($jwtString, $assertClaims)`**

Décode et valide un jeton.
- `$jwtString`: Le jeton à décoder
- `$assertClaims`: Réclamations à vérifier (tableau vide pour aucune)
- Retourne: Payload stdClass ou false si invalide

**`setAlgorithm($algorithm)`**

Change l'algorithme de signature/vérification.

### TokenFactory

La `Xmf\Jwt\TokenFactory` fournit un moyen pratique de créer des jetons.

```php
use Xmf\Jwt\TokenFactory;

// Créer un jeton avec gestion automatique des clés
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Le jeton expire dans 120 secondes
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: Chaîne de nom de clé ou objet KeyAbstract
- `$payload`: Tableau de réclamations
- `$expirationOffset`: Expiration en secondes

Lance des exceptions en cas d'échec: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

La classe `Xmf\Jwt\TokenReader` simplifie la lecture des jetons à partir de diverses sources.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// À partir d'une chaîne
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// À partir d'un cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// À partir d'un paramètre de requête
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// À partir de l'en-tête Authorization (jeton Bearer)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Toutes les méthodes retournent le payload en tant que `stdClass` ou `false` si invalide.

### KeyFactory

La `Xmf\Jwt\KeyFactory` crée et gère les clés cryptographiques.

```php
use Xmf\Jwt\KeyFactory;

// Construire une clé (crée si elle n'existe pas)
$key = KeyFactory::build('my_application_key');

// Avec stockage personnalisé
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Les clés sont stockées de manière persistante. Le stockage par défaut utilise le système de fichiers.

## Exemple de protection AJAX

Voici un exemple complet démontrant AJAX protégé par JWT.

### Script de page (génère le jeton)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Réclamations à inclure et vérifier
$assertClaims = ['aud' => basename(__FILE__)];

// Vérifier si c'est une requête AJAX
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Gérer la requête AJAX
    $GLOBALS['xoopsLogger']->activated = false;

    // Vérifier le jeton à partir de l'en-tête Authorization
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Le jeton est valide - traiter la requête
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Votre logique AJAX ici
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Requête de page régulière - générer le jeton et afficher la page
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Créer le jeton avec les réclamations
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Jeton valide pour 2 minutes
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript pour les appels AJAX
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Mettre à jour l'interface utilisateur
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Bonnes pratiques

### Expiration du jeton

Définir des délais d'expiration appropriés en fonction du cas d'utilisation:

```php
// Courte durée de vie pour les opérations sensibles (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Plus long pour les interactions de page générale (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Vérification des réclamations

Toujours vérifier la réclamation `aud` (audience) pour assurer que les jetons sont utilisés avec le script prévu:

```php
// Lors de la création
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// Lors de la vérification
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Nommage des clés

Utiliser des noms de clés descriptifs pour différents objectifs:

```php
// Clés distinctes pour différentes fonctionnalités
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Gestion des erreurs

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Algorithme invalide
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Argument invalide
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Valeur inattendue
    error_log('JWT Error: ' . $e->getMessage());
}

// La lecture des jetons retourne false en cas d'échec (pas d'exception)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Jeton invalide, expiré, ou modifié
}
```

## Méthodes de transport de jeton

### En-tête Authorization (recommandé)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Cookie

```php
// Définir un cookie avec le jeton
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Lire à partir du cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Paramètre de requête

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Considérations de sécurité

1. **Utiliser HTTPS**: Toujours utiliser HTTPS pour prévenir l'interception des jetons
2. **Courte expiration**: Utiliser le délai d'expiration le plus court pratique
3. **Réclamations spécifiques**: Inclure des réclamations qui lient les jetons à des contextes spécifiques
4. **Validation côté serveur**: Toujours valider les jetons côté serveur
5. **Ne pas stocker les données sensibles**: Rappelez-vous que les jetons sont lisibles (pas chiffrés)

## Référence API

### Xmf\Jwt\JsonWebToken

| Méthode | Description |
|--------|-------------|
| `__construct($key, $algorithm)` | Créer un gestionnaire JWT |
| `setAlgorithm($algorithm)` | Définir l'algorithme de signature |
| `create($payload, $expiration)` | Créer un jeton signé |
| `decode($token, $assertClaims)` | Décoder et vérifier le jeton |

### Xmf\Jwt\TokenFactory

| Méthode | Description |
|--------|-------------|
| `build($key, $payload, $expiration)` | Créer une chaîne de jeton |

### Xmf\Jwt\TokenReader

| Méthode | Description |
|--------|-------------|
| `fromString($key, $token, $claims)` | Décoder à partir d'une chaîne |
| `fromCookie($key, $name, $claims)` | Décoder à partir d'un cookie |
| `fromRequest($key, $name, $claims)` | Décoder à partir d'une requête |
| `fromHeader($key, $claims, $header)` | Décoder à partir d'un en-tête |

### Xmf\Jwt\KeyFactory

| Méthode | Description |
|--------|-------------|
| `build($name, $storage)` | Obtenir ou créer une clé |

## Voir aussi

- ../Basics/XMF-Request - Gestion des requêtes
- ../XMF-Framework - Aperçu du framework
- Database - Utilitaires de base de données

---

#xmf #jwt #security #ajax #authentication #tokens
