---
title: "Mejores Prácticas de Seguridad"
description: "Guía completa de seguridad para desarrollo de módulos XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Las API de Seguridad son estables entre versiones]
Las prácticas de seguridad y las API documentadas aquí funcionan tanto en XOOPS 2.5.x como en XOOPS 4.0.x. Las clases principales de seguridad (`XoopsSecurity`, `MyTextSanitizer`) permanecen estables.
:::

Este documento proporciona mejores prácticas completas de seguridad para desarrolladores de módulos XOOPS. Seguir estas guías ayudará a asegurar que sus módulos sean seguros y no introduzcan vulnerabilidades en instalaciones XOOPS.

## Principios de Seguridad

Todo desarrollador XOOPS debe seguir estos principios fundamentales de seguridad:

1. **Defensa en Profundidad**: Implementar múltiples capas de controles de seguridad
2. **Menor Privilegio**: Proporcionar solo los derechos de acceso mínimos necesarios
3. **Validación de Entrada**: Nunca confiar en entrada del usuario
4. **Seguro por Defecto**: La seguridad debe ser la configuración predeterminada
5. **Mantenerlo Simple**: Los sistemas complejos son más difíciles de asegurar

## Documentación Relacionada

- CSRF-Protection - Sistema de tokens y clase XoopsSecurity
- Input-Sanitization - MyTextSanitizer y validación
- SQL-Injection-Prevention - Prácticas de seguridad de base de datos

## Referencia Rápida de Lista de Verificación

Antes de lanzar su módulo, verifique:

- [ ] Todos los formularios incluyen tokens XOOPS
- [ ] Toda entrada del usuario es validada y sanitizada
- [ ] Toda salida está escapada apropiadamente
- [ ] Todas las consultas de base de datos usan sentencias parametrizadas
- [ ] Las cargas de archivos están validadas apropiadamente
- [ ] Las comprobaciones de autenticación y autorización están en su lugar
- [ ] El manejo de errores no revela información sensible
- [ ] La configuración sensible está protegida
- [ ] Las bibliotecas de terceros están actualizadas
- [ ] Se ha realizado prueba de seguridad

## Autenticación y Autorización

### Comprobación de Autenticación del Usuario

```php
// Verificar si el usuario está conectado
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Comprobación de Permisos del Usuario

```php
// Verificar si el usuario tiene permiso para acceder a este módulo
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Verificar permiso específico
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Configuración de Permisos de Módulo

```php
// Crear permiso en función de instalación/actualización
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Añadir permiso para todos los grupos
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Seguridad de Sesión

### Mejores Prácticas de Manejo de Sesión

1. No almacenar información sensible en la sesión
2. Regenerar IDs de sesión después de iniciar sesión/cambios de privilegio
3. Validar datos de sesión antes de usarlos

```php
// Regenerar ID de sesión después de iniciar sesión
session_regenerate_id(true);

// Validar datos de sesión
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verificar que el usuario existe en la base de datos
}
```

### Prevención de Fijación de Sesión

```php
// Después de un inicio de sesión exitoso
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// En solicitudes posteriores
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Posible intento de secuestro de sesión
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## Seguridad de Carga de Archivos

### Validación de Cargas de Archivos

```php
// Verificar si el archivo fue cargado apropiadamente
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Verificar tamaño de archivo
if ($_FILES['userfile']['size'] > 1000000) { // Límite 1MB
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Verificar tipo de archivo
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validar extensión de archivo
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### Usar Cargador XOOPS

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Guardar nombre de archivo en base de datos
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Almacenamiento Seguro de Archivos Cargados

```php
// Definir directorio de carga fuera de raíz web
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Crear directorio si no existe
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Mover archivo cargado
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Manejo de Errores y Logging

### Manejo de Errores Seguro

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Registrar el error
    xoops_error($e->getMessage());

    // Mostrar un mensaje de error genérico al usuario
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### Registro de Eventos de Seguridad

```php
// Registrar eventos de seguridad
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Seguridad de Configuración

### Almacenamiento de Configuración Sensible

```php
// Definir ruta de configuración fuera de raíz web
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Cargar configuración
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Manejar configuración faltante
}
```

### Protección de Archivos de Configuración

Use `.htaccess` para proteger archivos de configuración:

```apache
# En .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Bibliotecas de Terceros

### Selección de Bibliotecas

1. Elegir bibliotecas mantenidas activamente
2. Verificar vulnerabilidades de seguridad
3. Verificar que la licencia de la biblioteca es compatible con XOOPS

### Actualización de Bibliotecas

```php
// Verificar versión de biblioteca
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Aislamiento de Bibliotecas

```php
// Cargar biblioteca de forma controlada
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Pruebas de Seguridad

### Lista de Verificación de Pruebas Manuales

1. Probar todos los formularios con entrada inválida
2. Intentar eludir autenticación y autorización
3. Probar funcionalidad de carga de archivos con archivos maliciosos
4. Verificar vulnerabilidades XSS en toda salida
5. Probar inyección SQL en todas las consultas de base de datos

### Pruebas Automatizadas

Usar herramientas automatizadas para escanear vulnerabilidades:

1. Herramientas de análisis de código estático
2. Escáneres de aplicaciones web
3. Verificadores de dependencia para bibliotecas de terceros

## Escape de Salida

### Contexto HTML

```php
// Para contenido HTML regular
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Usar MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### Contexto JavaScript

```php
// Para datos usados en JavaScript
echo json_encode($variable);

// Para JavaScript en línea
echo 'var data = ' . json_encode($variable) . ';';
```

### Contexto de URL

```php
// Para datos usados en URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Variables de Plantilla

```php
// Asignar variables a plantilla Smarty
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// Para contenido HTML que debe mostrarse tal cual
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Recursos

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#security #best-practices #xoops #module-development #authentication #authorization
