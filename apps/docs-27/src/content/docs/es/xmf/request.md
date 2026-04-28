---
title: "Solicitud XMF"
description: 'Manejo seguro de solicitudes HTTP y validación de entrada con la clase Xmf\Request'
---

La clase `Xmf\Request` proporciona acceso controlado a variables de solicitud HTTP con sanitización integrada y conversión de tipos. Protege contra inyecciones potencialmente dañinas de forma predeterminada mientras conforma la entrada a tipos especificados.

## Descripción general

El manejo de solicitudes es uno de los aspectos más críticos para la seguridad en desarrollo web. La clase XMF Request:

- Sanitiza automáticamente la entrada para prevenir ataques XSS
- Proporciona accesores seguros de tipo para tipos de datos comunes
- Soporta múltiples fuentes de solicitud (GET, POST, COOKIE, etc.)
- Ofrece manejo consistente de valores predeterminados

## Uso básico

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Métodos de solicitud

### getMethod()

Devuelve el método de solicitud HTTP para la solicitud actual.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

El método principal que la mayoría de otros métodos `get*()` invocan. Obtiene y devuelve una variable nombrada de los datos de solicitud.

**Parámetros:**
- `$name` - Nombre de variable a obtener
- `$default` - Valor predeterminado si la variable no existe
- `$hash` - Hash de fuente: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, o REQUEST (predeterminado)
- `$type` - Tipo de dato para limpieza (vea los tipos de FilterInput a continuación)
- `$mask` - Máscara de bits para opciones de limpieza

**Valores de máscara:**

| Constante de máscara | Efecto |
|---------------|--------|
| `MASK_NO_TRIM` | No recortar espacios en blanco al inicio/final |
| `MASK_ALLOW_RAW` | Saltar limpieza, permitir entrada sin procesar |
| `MASK_ALLOW_HTML` | Permitir un conjunto limitado "seguro" de marcado HTML |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Métodos específicos de tipo

### getInt($name, $default, $hash)

Devuelve un valor entero. Solo se permiten dígitos.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Devuelve un valor flotante. Solo se permiten dígitos y puntos.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Devuelve un valor booleano.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Devuelve una cadena con solo letras y guiones bajos `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Devuelve una cadena de comando con solo `[A-Za-z0-9.-_]`, forzado a minúsculas.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Devuelve una cadena limpia sin código HTML dañino (a menos que sea anulado por máscara).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Devuelve un arreglo, procesado recursivamente para eliminar XSS y código dañino.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Devuelve texto sin procesar sin limpieza. Use con precaución.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Devuelve una URL web validada (solo esquemas relativos, http o https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Devuelve una ruta de sistema de archivos o web validada.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Devuelve una dirección de correo validada o la predeterminada.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Devuelve una dirección IPv4 o IPv6 validada.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Devuelve un valor de encabezado de solicitud HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Métodos de utilidad

### hasVar($name, $hash)

Verifica si una variable existe en el hash especificado.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Establece una variable en el hash especificado. Devuelve el valor anterior o null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Devuelve una copia limpia de un arreglo hash completo.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Establece múltiples variables de un arreglo.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## Integración de FilterInput

La clase Request utiliza `Xmf\FilterInput` para limpieza. Tipos de filtro disponibles:

| Tipo | Descripción |
|------|-------------|
| ALPHANUM / ALNUM | Solo alfanumérico |
| ARRAY | Limpiar recursivamente cada elemento |
| BASE64 | Cadena codificada en Base64 |
| BOOLEAN / BOOL | Verdadero o falso |
| CMD | Comando - A-Z, 0-9, guion bajo, guion, punto (minúscula) |
| EMAIL | Dirección de correo válida |
| FLOAT / DOUBLE | Número de punto flotante |
| INTEGER / INT | Valor entero |
| IP | Dirección IP válida |
| PATH | Ruta de sistema de archivos o web |
| STRING | Cadena general (predeterminado) |
| USERNAME | Formato de nombre de usuario |
| WEBURL | URL web |
| WORD | Solo letras A-Z y guion bajo |

## Ejemplos prácticos

### Procesamiento de formularios

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
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

### Controlador AJAX

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### Paginación

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Formulario de búsqueda

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Mejores prácticas de seguridad

1. **Siempre use métodos específicos de tipo** - Use `getInt()` para IDs, `getEmail()` para correos, etc.

2. **Proporcione valores predeterminados sensatos** - Nunca asuma que la entrada existe

3. **Valide después de la sanitización** - La sanitización elimina datos malos, la validación asegura datos correctos

4. **Use hash apropiado** - Especifique POST para datos de formulario, GET para parámetros de consulta

5. **Evite entrada sin procesar** - Solo use `getText()` o `MASK_ALLOW_RAW` cuando sea absolutamente necesario

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Ver también

- Getting-Started-with-XMF - Conceptos básicos de XMF
- XMF-Module-Helper - Clase ayudante de módulo
- ../XMF-Framework - Descripción general del marco

---

#xmf #request #security #input-validation #sanitization
