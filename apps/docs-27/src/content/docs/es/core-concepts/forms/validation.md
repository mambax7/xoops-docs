---
title: "Validación de Formularios"
---

## Descripción General

XOOPS proporciona validación tanto del lado del cliente como del lado del servidor para entradas de formulario. Esta guía cubre técnicas de validación, validadores incorporados e implementación de validación personalizada.

## Arquitectura de Validación

```mermaid
flowchart TB
    A[Envío de Formulario] --> B{Validación del Cliente}
    B -->|Pasar| C[Solicitud del Servidor]
    B -->|Fallar| D[Mostrar Errores del Cliente]
    C --> E{Validación del Servidor}
    E -->|Pasar| F[Procesar Datos]
    E -->|Fallar| G[Retornar Errores]
    G --> H[Mostrar Errores del Servidor]
```

## Validación del Lado del Servidor

### Uso de XoopsFormValidator

```php
use Xoops\Core\Form\Validator;

$validator = new Validator();

$validator->addRule('username', 'required', 'Username is required');
$validator->addRule('username', 'minLength:3', 'Username must be at least 3 characters');
$validator->addRule('username', 'maxLength:50', 'Username cannot exceed 50 characters');
$validator->addRule('email', 'email', 'Please enter a valid email address');
$validator->addRule('password', 'minLength:8', 'Password must be at least 8 characters');

if (!$validator->validate($_POST)) {
    $errors = $validator->getErrors();
    // Manejar errores
}
```

### Reglas de Validación Incorporadas

| Regla | Descripción | Ejemplo |
|------|-------------|---------|
| `required` | El campo no debe estar vacío | `required` |
| `email` | Formato de correo electrónico válido | `email` |
| `url` | Formato de URL válido | `url` |
| `numeric` | Solo valor numérico | `numeric` |
| `integer` | Solo valor entero | `integer` |
| `minLength` | Longitud mínima de cadena | `minLength:3` |
| `maxLength` | Longitud máxima de cadena | `maxLength:100` |
| `min` | Valor numérico mínimo | `min:1` |
| `max` | Valor numérico máximo | `max:100` |
| `regex` | Patrón regex personalizado | `regex:/^[a-z]+$/` |
| `in` | Valor en lista | `in:draft,published,archived` |
| `date` | Formato de fecha válido | `date` |
| `alpha` | Solo letras | `alpha` |
| `alphanumeric` | Letras y números | `alphanumeric` |

### Reglas de Validación Personalizada

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Validación de Solicitudes

### Sanitización de Entrada

```php
use Xoops\Core\Request;

// Obtener valores sanitizados
$username = Request::getString('username', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$age = Request::getInt('age', 0, 'POST');
$price = Request::getFloat('price', 0.0, 'POST');
$tags = Request::getArray('tags', [], 'POST');

// Con validación
$username = Request::getString('username', '', 'POST', [
    'minLength' => 3,
    'maxLength' => 50
]);
```

### Prevención de XSS

```php
use Xoops\Core\Text\Sanitizer;

$sanitizer = Sanitizer::getInstance();

// Sanitizar contenido HTML
$cleanContent = $sanitizer->sanitizeForDisplay($userContent);

// Eliminar todo HTML
$plainText = $sanitizer->stripHtml($userContent);

// Permitir etiquetas específicas
$content = $sanitizer->sanitizeForDisplay($userContent, [
    'allowedTags' => '<p><br><strong><em><a>'
]);
```

## Validación del Lado del Cliente

### Atributos de Validación HTML5

```php
// Campo obligatorio
$element->setExtra('required');

// Validación de patrón
$element->setExtra('pattern="[a-zA-Z0-9]+" title="Alphanumeric only"');

// Restricciones de longitud
$element->setExtra('minlength="3" maxlength="50"');

// Restricciones numéricas
$element->setExtra('min="1" max="100"');
```

### Validación de JavaScript

```javascript
document.getElementById('myForm').addEventListener('submit', function(e) {
    const username = document.getElementById('username').value;
    const errors = [];

    if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (errors.length > 0) {
        e.preventDefault();
        displayErrors(errors);
    }
});
```

## Protección CSRF

### Generación de Token

```php
// Generar token en formulario
$form->addElement(new \XoopsFormHiddenToken());

// Esto añade un campo oculto con token de seguridad
```

### Verificación de Token

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Validación de Carga de Archivos

```php
use Xoops\Core\Uploader;

$uploader = new Uploader(
    uploadDir: XOOPS_UPLOAD_PATH . '/images/',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 1920,
    maxHeight: 1080
);

if ($uploader->fetchMedia('image_upload')) {
    if ($uploader->upload()) {
        $savedFile = $uploader->getSavedFileName();
    } else {
        $errors[] = $uploader->getErrors();
    }
}
```

## Mostrar Errores

### Recopilar Errores

```php
$errors = [];

if (empty($username)) {
    $errors['username'] = 'Username is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (!empty($errors)) {
    // Almacenar en sesión para mostrar después de redirigir
    $_SESSION['form_errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit;
}
```

### Mostrar Errores

```smarty
{if $errors}
<div class="alert alert-danger">
    <ul>
        {foreach $errors as $field => $message}
        <li>{$message}</li>
        {/foreach}
    </ul>
</div>
{/if}
```

## Mejores Prácticas

1. **Validar siempre en el servidor** - La validación del cliente puede ser eludida
2. **Usar consultas parametrizadas** - Prevenir inyección SQL
3. **Sanitizar salida** - Prevenir ataques XSS
4. **Validar cargas de archivos** - Verificar tipos MIME y tamaños
5. **Usar tokens CSRF** - Prevenir falsificación de solicitud entre sitios
6. **Limitar tasa de envíos** - Prevenir abuso

## Documentación Relacionada

- Referencia de Elementos de Formulario
- Descripción General de Formularios
- Mejores Prácticas de Seguridad
