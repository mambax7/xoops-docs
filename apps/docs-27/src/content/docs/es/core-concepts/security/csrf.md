---
title: "Protección CSRF"
description: "Comprensión e implementación de protección CSRF en XOOPS usando la clase XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Los ataques de Falsificación de Solicitud Entre Sitios (CSRF) engañan a los usuarios para que realicen acciones no deseadas en un sitio donde están autenticados. XOOPS proporciona protección CSRF incorporada a través de la clase `XoopsSecurity`.

## Documentación Relacionada

- Security-Best-Practices - Guía completa de seguridad
- Input-Sanitization - MyTextSanitizer y validación
- SQL-Injection-Prevention - Prácticas de seguridad de base de datos

## Comprensión de Ataques CSRF

Un ataque CSRF ocurre cuando:

1. Un usuario está autenticado en su sitio XOOPS
2. El usuario visita un sitio web malicioso
3. El sitio malicioso envía una solicitud a su sitio XOOPS usando la sesión del usuario
4. Su sitio procesa la solicitud como si viniera del usuario legítimo

## La Clase XoopsSecurity

XOOPS proporciona la clase `XoopsSecurity` para proteger contra ataques CSRF. Esta clase gestiona tokens de seguridad que deben incluirse en formularios y verificarse al procesar solicitudes.

### Generación de Token

La clase de seguridad genera tokens únicos que se almacenan en la sesión del usuario y deben incluirse en formularios:

```php
$security = new XoopsSecurity();

// Obtener campo de entrada HTML de token
$tokenHTML = $security->getTokenHTML();

// Obtener solo el valor del token
$tokenValue = $security->createToken();
```

### Verificación de Token

Al procesar envíos de formulario, verifique que el token sea válido:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Uso del Sistema de Tokens XOOPS

### Con Clases XoopsForm

Cuando se usan clases de formulario XOOPS, la protección de token es directa:

```php
// Crear formulario
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Añadir elementos de formulario
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Añadir campo de token oculto - SIEMPRE incluya esto
$form->addElement(new XoopsFormHiddenToken());

// Añadir botón de envío
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### Con Formularios Personalizados

Para formularios HTML personalizados que no usan XoopsForm:

```php
// En su plantilla o archivo PHP
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Incluya el token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### En Plantillas Smarty

Cuando se generan formularios en plantillas Smarty:

```php
// En su archivo PHP
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* En su plantilla *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Incluya el token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## Procesamiento de Envíos de Formulario

### Verificación Básica de Token

```php
// En su script de procesamiento de formulario
$security = new XoopsSecurity();

// Verificar el token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// El token es válido, procesar el formulario
$title = $_POST['title'];
// ... continuar procesando
```

### Con Manejo de Errores Personalizado

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Obtener información detallada del error
    $errors = $security->getErrors();

    // Registrar el error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirigir con mensaje de error
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### Para Solicitudes AJAX

Cuando se trabaja con solicitudes AJAX, incluya el token en su solicitud:

```javascript
// JavaScript - obtener token del campo oculto
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Incluir en solicitud AJAX
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// Controlador PHP AJAX
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Procesar solicitud AJAX
```

## Verificación del Encabezado HTTP Referer

Para protección adicional, especialmente para solicitudes AJAX, también puede verificar el encabezado referer HTTP:

```php
$security = new XoopsSecurity();

// Verificar encabezado referer
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// También verificar el token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### Comprobación de Seguridad Combinada

```php
$security = new XoopsSecurity();

// Realizar ambas comprobaciones
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Configuración de Token

### Vida Útil del Token

Los tokens tienen una vida útil limitada para prevenir ataques de reproducción. Puede configurar esto en las configuraciones de XOOPS o manejar tokens expirados correctamente:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // El token puede haber expirado
    // Regenerar formulario con nuevo token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Múltiples Formularios en la Misma Página

Cuando tiene múltiples formularios en la misma página, cada uno debe tener su propio token:

```php
// Formulario 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Formulario 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Mejores Prácticas

### Siempre Use Tokens para Operaciones de Cambio de Estado

Incluya tokens en cualquier formulario que:

- Cree datos
- Actualice datos
- Elimine datos
- Cambie configuración del usuario
- Realice cualquier acción administrativa

### No Confíe Únicamente en Verificación de Referer

El encabezado referer HTTP puede ser:

- Eliminado por herramientas de privacidad
- Faltante en algunos navegadores
- Falsificado en algunos casos

Siempre use verificación de token como su defensa principal.

### Regenere Tokens Apropiadamente

Considere regenerar tokens:

- Después de un envío de formulario exitoso
- Después de iniciar/cerrar sesión
- A intervalos regulares para sesiones largas

### Maneje la Expiración de Token Correctamente

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Almacenar datos de formulario temporalmente
    $_SESSION['form_backup'] = $_POST;

    // Redirigir de vuelta al formulario con mensaje
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## Problemas Comunes y Soluciones

### Error Token No Encontrado

**Problema**: La verificación de seguridad falla con "token not found"

**Solución**: Asegúrese de que el campo de token esté incluido en su formulario:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Error Token Expirado

**Problema**: Los usuarios ven "token expired" después de completar formularios largos

**Solución**: Considere usar JavaScript para actualizar el token periódicamente:

```javascript
// Actualizar token cada 10 minutos
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### Problemas de Token AJAX

**Problema**: Las solicitudes AJAX fallan en la validación de token

**Solución**: Asegúrese de que el token se pase con cada solicitud AJAX y verifíquelo en el servidor:

```php
// Controlador AJAX
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // No limpiar token para AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## Ejemplo: Implementación Completa de Formulario

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Manejar envío de formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Procesar envío válido
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... guardar en base de datos

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Mostrar formulario
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#security #csrf #xoops #forms #tokens #XoopsSecurity
