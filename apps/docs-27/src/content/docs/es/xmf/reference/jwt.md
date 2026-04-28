---
title: "JWT - Tokens Web JSON"
description: "Implementación JWT de XMF para autenticación segura basada en tokens y protección AJAX"
---

El espacio de nombres `Xmf\Jwt` proporciona soporte de Tokens Web JSON (JWT) para módulos de XOOPS. Los JWT permiten autenticación segura sin estado y son particularmente útiles para proteger solicitudes AJAX.

## ¿Qué son los Tokens Web JSON?

Los Tokens Web JSON son una forma estándar de publicar un conjunto de *afirmaciones* (datos) como una cadena de texto, con verificación criptográfica de que las afirmaciones no han sido alteradas. Para especificaciones detalladas, ver:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Características Clave

- **Firmados**: Los tokens están firmados criptográficamente para detectar alteraciones
- **Autónomos**: Toda la información necesaria está en el token mismo
- **Sin estado**: No se requiere almacenamiento de sesión del lado del servidor
- **Expirables**: Los tokens pueden incluir tiempos de vencimiento

> **Nota:** Los JWT están firmados, no encriptados. Los datos se codifican en Base64 y son visibles. Use JWT para verificación de integridad, no para ocultar datos sensibles.

## ¿Por qué usar JWT en XOOPS?

### El Problema del Token AJAX

Los formularios de XOOPS usan tokens nonce para protección CSRF. Sin embargo, los nonce funcionan mal con AJAX porque:

1. **Un solo uso**: Los nonce típicamente son válidos para un envío
2. **Problemas asincronos**: Múltiples solicitudes AJAX pueden llegar fuera de orden
3. **Complejidad de actualización**: Sin forma confiable de actualizar tokens de forma asincrónica
4. **Vinculación de contexto**: Los tokens estándar no verifican qué script los emitió

### Ventajas de JWT

Los JWT resuelven estos problemas:

- Incluyen un tiempo de vencimiento (afirmación `exp`) para validez limitada en el tiempo
- Admiten afirmaciones personalizadas para vincular tokens a scripts específicos
- Permiten múltiples solicitudes dentro del período de validez
- Proporcionan verificación criptográfica del origen del token

## Clases Principales

### JsonWebToken

La clase `Xmf\Jwt\JsonWebToken` maneja la creación y decodificación de tokens.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Crear una clave
$key = KeyFactory::build('my_application_key');

// Crear una instancia de JsonWebToken
$jwt = new JsonWebToken($key, 'HS256');

// Crear un token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Vence en 300 segundos

// Decodificar y verificar un token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### Métodos

**`new JsonWebToken($key, $algorithm)`**

Crear un nuevo manejador JWT.
- `$key`: Un objeto `Xmf\Key\KeyAbstract`
- `$algorithm`: Algoritmo de firma (predeterminado: 'HS256')

**`create($payload, $expirationOffset)`**

Crear una cadena de token firmada.
- `$payload`: Matriz de afirmaciones
- `$expirationOffset`: Segundos hasta vencimiento (opcional)

**`decode($jwtString, $assertClaims)`**

Decodificar y validar un token.
- `$jwtString`: El token a decodificar
- `$assertClaims`: Afirmaciones a verificar (matriz vacía para ninguna)
- Devuelve: Carga útil stdClass o false si es inválido

**`setAlgorithm($algorithm)`**

Cambiar el algoritmo de firma/verificación.

### TokenFactory

El `Xmf\Jwt\TokenFactory` proporciona una forma conveniente de crear tokens.

```php
use Xmf\Jwt\TokenFactory;

// Crear un token con manejo automático de claves
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token vence en 120 segundos
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: Cadena de nombre de clave o objeto KeyAbstract
- `$payload`: Matriz de afirmaciones
- `$expirationOffset`: Vencimiento en segundos

Lanza excepciones en caso de fallo: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

La clase `Xmf\Jwt\TokenReader` simplifica leer tokens de varias fuentes.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// Desde una cadena
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// Desde una cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// Desde un parámetro de solicitud
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// Desde encabezado de Autorización (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Todos los métodos devuelven la carga útil como `stdClass` o `false` si es inválido.

### KeyFactory

El `Xmf\Jwt\KeyFactory` crea y gestiona claves criptográficas.

```php
use Xmf\Jwt\KeyFactory;

// Construir una clave (crea si no existe)
$key = KeyFactory::build('my_application_key');

// Con almacenamiento personalizado
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Las claves se almacenan persistentemente. El almacenamiento predeterminado utiliza el sistema de archivos.

## Ejemplo de Protección AJAX

Aquí hay un ejemplo completo que demuestra JWT protegido con AJAX.

### Script de Página (Genera Token)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Afirmaciones a incluir y verificar
$assertClaims = ['aud' => basename(__FILE__)];

// Verificar si esta es una solicitud AJAX
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Manejar solicitud AJAX
    $GLOBALS['xoopsLogger']->activated = false;

    // Verificar el token desde el encabezado de Autorización
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }

    // Token es válido - procesar la solicitud
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Su lógica AJAX aquí
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Solicitud de página regular - generar token y mostrar página
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Crear token con afirmaciones
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token válido por 2 minutos
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript para llamadas AJAX
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
                console.log('Acción completada:', data);
                // Actualizar UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Sesión expirada. Por favor, actualice la página.');
            } else {
                alert('Ocurrió un error: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Guardar Elemento</button>';
echo '<button onclick="performAction(\'delete\')">Eliminar Elemento</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Mejores Prácticas

### Vencimiento del Token

Establecer tiempos de vencimiento apropiados basados en caso de uso:

```php
// De corta duración para operaciones sensibles (2 minutos)
$token = TokenFactory::build('key', $claims, 120);

// Más tiempo para interacciones generales de página (30 minutos)
$token = TokenFactory::build('key', $claims, 1800);
```

### Verificación de Afirmaciones

Siempre verificar la afirmación `aud` (audiencia) para asegurar que los tokens se usen con el script previsto:

```php
// Al crear
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// Al verificar
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Nombres de Clave

Usar nombres de clave descriptivos para propósitos diferentes:

```php
// Claves separadas para características diferentes
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Manejo de Errores

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Algoritmo inválido
    error_log('Error JWT: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Argumento inválido
    error_log('Error JWT: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Valor inesperado
    error_log('Error JWT: ' . $e->getMessage());
}

// La lectura de tokens devuelve false en caso de fallo (sin excepción)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token inválido, vencido o alterado
}
```

## Métodos de Transporte de Token

### Encabezado de Autorización (Recomendado)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Cookie

```php
// Establecer cookie con token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Leer desde cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Parámetro de Solicitud

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Consideraciones de Seguridad

1. **Usar HTTPS**: Siempre usar HTTPS para prevenir interceptación de token
2. **Vencimiento Corto**: Usar el tiempo de vencimiento más corto práctico
3. **Afirmaciones Específicas**: Incluir afirmaciones que vinculen tokens a contextos específicos
4. **Validación del Lado del Servidor**: Siempre validar tokens del lado del servidor
5. **No Almacenar Datos Sensibles**: Recuerde que los tokens son legibles (no encriptados)

## Referencia de API

### Xmf\Jwt\JsonWebToken

| Método | Descripción |
|--------|-------------|
| `__construct($key, $algorithm)` | Crear manejador JWT |
| `setAlgorithm($algorithm)` | Establecer algoritmo de firma |
| `create($payload, $expiration)` | Crear token firmado |
| `decode($token, $assertClaims)` | Decodificar y verificar token |

### Xmf\Jwt\TokenFactory

| Método | Descripción |
|--------|-------------|
| `build($key, $payload, $expiration)` | Crear cadena de token |

### Xmf\Jwt\TokenReader

| Método | Descripción |
|--------|-------------|
| `fromString($key, $token, $claims)` | Decodificar desde cadena |
| `fromCookie($key, $name, $claims)` | Decodificar desde cookie |
| `fromRequest($key, $name, $claims)` | Decodificar desde solicitud |
| `fromHeader($key, $claims, $header)` | Decodificar desde encabezado |

### Xmf\Jwt\KeyFactory

| Método | Descripción |
|--------|-------------|
| `build($name, $storage)` | Obtener u crear clave |

## Ver También

- ../Basics/XMF-Request - Manejo de solicitudes
- ../XMF-Framework - Descripción general del marco
- Database - Utilidades de base de datos

---

#xmf #jwt #security #ajax #authentication #tokens
