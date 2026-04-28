---
title: "Sanitización de Entrada"
description: "Uso de MyTextSanitizer y técnicas de validación en XOOPS"
---

Nunca confíe en entrada del usuario. Siempre valide y sanitize todos los datos de entrada antes de usarlos. XOOPS proporciona la clase `MyTextSanitizer` para sanitizar entradas de texto y varias funciones auxiliares para validación.

## Documentación Relacionada

- Security-Best-Practices - Guía completa de seguridad
- CSRF-Protection - Sistema de tokens y clase XoopsSecurity
- SQL-Injection-Prevention - Prácticas de seguridad de base de datos

## La Regla de Oro

**Nunca confíe en entrada del usuario.** Todos los datos de fuentes externas deben ser:

1. **Validados**: Verificar que coincidan con el formato y tipo esperado
2. **Sanitizados**: Eliminar o escapar caracteres potencialmente peligrosos
3. **Escapados**: Al mostrar, escapar para el contexto específico (HTML, JavaScript, SQL)

## Clase MyTextSanitizer

XOOPS proporciona la clase `MyTextSanitizer` (comúnmente aliasada como `$myts`) para sanitización de texto.

### Obtener la Instancia

```php
// Obtener la instancia singleton
$myts = MyTextSanitizer::getInstance();
```

### Sanitización de Texto Básico

```php
$myts = MyTextSanitizer::getInstance();

// Para campos de texto plano (sin HTML permitido)
$title = $myts->htmlSpecialChars($_POST['title']);

// Esto convierte:
// < a &lt;
// > a &gt;
// & a &amp;
// " a &quot;
// ' a &#039;
```

### Procesamiento de Contenido de Textarea

El método `displayTarea()` proporciona procesamiento exhaustivo de textarea:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = Sin HTML permitido, 1 = HTML permitido
    $allowsmiley = 1,    // 1 = Smilies habilitados
    $allowxcode = 1,     // 1 = Códigos XOOPS habilitados (BBCode)
    $allowimages = 1,    // 1 = Imágenes permitidas
    $allowlinebreak = 1  // 1 = Saltos de línea convertidos a <br>
);
```

### Métodos de Sanitización Comunes

```php
$myts = MyTextSanitizer::getInstance();

// Escape de caracteres especiales HTML
$safe_text = $myts->htmlSpecialChars($text);

// Eliminar slashes si magic quotes está activado
$text = $myts->stripSlashesGPC($text);

// Convertir códigos XOOPS (BBCode) a HTML
$html = $myts->xoopsCodeDecode($text);

// Convertir smileys a imágenes
$html = $myts->smiley($text);

// Hacer enlaces clicables
$html = $myts->makeClickable($text);

// Procesamiento completo de texto para vista previa
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Validación de Entrada

### Validación de Valores Enteros

```php
// Validar ID entero
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternativa con filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### Validación de Direcciones de Correo Electrónico

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### Validación de URLs

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Comprobación adicional para protocolos permitidos
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### Validación de Fechas

```php
$date = $_POST['date'] ?? '';

// Validar formato de fecha (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validar que la fecha es válida
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### Validación de Nombres de Archivo

```php
// Eliminar todos los caracteres excepto alfanuméricos, guión bajo y guión
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// O usar un enfoque de lista blanca
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Manejo de Diferentes Tipos de Entrada

### Entrada de Cadena

```php
$myts = MyTextSanitizer::getInstance();

// Texto corto (títulos, nombres)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limitar longitud
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Verificar campos obligatorios vacíos
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### Entrada Numérica

```php
// Entero
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Asegurar rango 0-1000

// Flotante
$price = (float)$_POST['price'];
$price = round($price, 2); // Redondear a 2 decimales

// Validar rango
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### Entrada Booleana

```php
// Valores de casilla de verificación
$is_active = isset($_POST['is_active']) ? 1 : 0;

// O con comprobación de valor explícito
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Entrada de Matriz

```php
// Validar entrada de matriz (por ejemplo, múltiples casillas de verificación)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### Entrada de Select/Option

```php
// Validar contra valores permitidos
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Objeto Request (XMF)

Cuando se usa XMF, la clase Request proporciona manejo de entrada más limpio:

```php
use Xmf\Request;

// Obtener entero
$id = Request::getInt('id', 0);

// Obtener cadena
$title = Request::getString('title', '');

// Obtener matriz
$ids = Request::getArray('ids', []);

// Obtener con especificación de método
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Verificar método de solicitud
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## Creación de una Clase de Validación

Para formularios complejos, cree una clase de validación dedicada:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Validación de título
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Validación de correo electrónico
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Validación de estado
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Uso:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Mostrar errores al usuario
}
```

## Sanitización para Almacenamiento en Base de Datos

Al almacenar datos en la base de datos:

```php
$myts = MyTextSanitizer::getInstance();

// Para almacenamiento (se procesará nuevamente en mostrado)
$title = $myts->addSlashes($_POST['title']);

// Mejor: Usar sentencias preparadas (ver Prevención de Inyección SQL)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Sanitización para Mostrado

Diferentes contextos requieren diferentes escapes:

```php
$myts = MyTextSanitizer::getInstance();

// Contexto HTML
echo $myts->htmlSpecialChars($title);

// Dentro de atributos HTML
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// Contexto JavaScript
echo json_encode($title);

// Parámetro de URL
echo urlencode($title);

// URL completa
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Errores Comunes

### Codificación Doble

**Problema**: Los datos se codifican múltiples veces

```php
// Incorrecto - codificación doble
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Correcto - codificar una sola vez, en el momento apropiado
$title = $_POST['title']; // Almacenar crudo
echo $myts->htmlSpecialChars($title); // Codificar en salida
```

### Codificación Inconsistente

**Problema**: Algunas salidas están codificadas, otras no

**Solución**: Siempre usar un enfoque consistente, preferiblemente codificando en salida:

```php
// Asignación de plantilla
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Validación Faltante

**Problema**: Solo sanitizar sin validar

**Solución**: Siempre validar primero, luego sanitizar:

```php
// Primero validar
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Luego sanitizar para almacenamiento/mostrado
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Resumen de Mejores Prácticas

1. **Usar MyTextSanitizer** para procesamiento de contenido de texto
2. **Usar filter_var()** para validación de formato específico
3. **Usar casting de tipo** para valores numéricos
4. **Validar contra valores permitidos** para entradas de select
5. **Validar antes de sanitizar**
6. **Escapar en salida**, no en entrada
7. **Usar sentencias preparadas** para consultas de base de datos
8. **Crear clases de validación** para formularios complejos
9. **Nunca confiar en validación del lado del cliente** - siempre validar en el servidor

---

#security #sanitization #validation #xoops #MyTextSanitizer #input-handling
