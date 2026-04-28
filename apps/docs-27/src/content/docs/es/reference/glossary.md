---
title: "Glosario de XOOPS"
description: "Definiciones de términos y conceptos específicos de XOOPS"
---

> Glosario completo de terminología y conceptos específicos de XOOPS.

---

## A

### Admin Framework
El marco de interfaz administrativa estandarizado introducido en XOOPS 2.3, que proporciona páginas de administración consistentes en todos los módulos.

### Autoloading
La carga automática de clases PHP cuando se necesitan, utilizando el estándar PSR-4 en XOOPS moderno.

---

## B

### Block
Una unidad de contenido independiente que puede posicionarse en regiones de temas. Los bloques pueden mostrar contenido de módulos, HTML personalizado o datos dinámicos.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
El proceso de inicialización del núcleo de XOOPS antes de ejecutar código de módulo, típicamente a través de `mainfile.php` y `header.php`.

---

## C

### Criteria / CriteriaCompo
Clases para construir condiciones de consultas de base de datos de forma orientada a objetos.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
Un ataque de seguridad prevenido en XOOPS usando tokens de seguridad vía `XoopsFormHiddenToken`.

---

## D

### DI (Dependency Injection)
Un patrón de diseño planeado para XOOPS 4.0 donde las dependencias se inyectan en lugar de crearse internamente.

### Dirname
El nombre del directorio de un módulo, utilizado como identificador único en todo el sistema.

### DTYPE (Data Type)
Constantes que definen cómo se almacenan y sanitizan las variables de XoopsObject:
- `XOBJ_DTYPE_INT` - Entero
- `XOBJ_DTYPE_TXTBOX` - Texto (línea única)
- `XOBJ_DTYPE_TXTAREA` - Texto (múltiples líneas)
- `XOBJ_DTYPE_EMAIL` - Dirección de correo

---

## E

### Event
Un evento en el ciclo de vida de XOOPS que puede desencadenar código personalizado a través de preloads o hooks.

---

## F

### Framework
Ver XMF (XOOPS Module Framework).

### Form Element
Un componente del sistema de formularios de XOOPS que representa un campo de formulario HTML.

---

## G

### Group
Una colección de usuarios con permisos compartidos. Los grupos principales incluyen: Administradores, Usuarios Registrados, Anónimos.

---

## H

### Handler
Una clase que gestiona operaciones CRUD para instancias de XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Una clase de utilidad que proporciona acceso fácil a controladores de módulos, configuraciones y servicios.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Las clases principales de XOOPS que proporcionan funcionalidad fundamental: acceso a base de datos, gestión de usuarios, seguridad, etc.

---

## L

### Language File
Archivos PHP que contienen constantes para internacionalización, almacenados en directorios `language/[code]/`.

---

## M

### mainfile.php
El archivo de configuración principal de XOOPS que contiene credenciales de base de datos y definiciones de rutas.

### MCP (Model-Controller-Presenter)
Un patrón arquitectónico similar a MVC, frecuentemente utilizado en desarrollo de módulos de XOOPS.

### Middleware
Software que se sitúa entre la solicitud y la respuesta, planeado para XOOPS 4.0 usando PSR-15.

### Module
Un paquete independiente que extiende la funcionalidad de XOOPS, instalado en el directorio `modules/`.

### MOC (Map of Content)
Un concepto de Obsidian para notas de descripción general que vinculan contenido relacionado.

---

## N

### Namespace
Característica PHP para organizar clases, utilizada en XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Notification
El sistema de XOOPS para alertar a los usuarios sobre eventos vía correo electrónico o PM.

---

## O

### Object
Ver XoopsObject.

---

## P

### Permission
Control de acceso gestionado a través de grupos y controladores de permisos.

### Preload
Una clase que se conecta con eventos de XOOPS, cargada automáticamente desde el directorio `preloads/`.

### PSR (PHP Standards Recommendation)
Estándares de PHP-FIG que XOOPS 4.0 implementará completamente.

---

## R

### Renderer
Una clase que genera elementos de formularios u otros componentes de interfaz en formatos específicos (Bootstrap, etc.).

---

## S

### Smarty
El motor de plantillas utilizado por XOOPS para separar la presentación de la lógica.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Service
Una clase que proporciona lógica empresarial reutilizable, típicamente accedida a través del Helper.

---

## T

### Template
Un archivo Smarty (`.tpl` o `.html`) que define la capa de presentación para módulos.

### Theme
Una colección de plantillas y activos que definen la apariencia visual del sitio.

### Token
Un mecanismo de seguridad (protección CSRF) que asegura que los envíos de formularios provengan de fuentes legítimas.

---

## U

### uid
ID de Usuario - el identificador único para cada usuario en el sistema.

---

## V

### Variable (Var)
Un campo definido en un XoopsObject usando `initVar()`.

---

## W

### Widget
Un componente de interfaz pequeño e independiente, similar a bloques.

---

## X

### XMF (XOOPS Module Framework)
Una colección de utilidades y clases para desarrollo moderno de módulos de XOOPS.

### XOBJ_DTYPE
Constantes para definir tipos de datos de variables en XoopsObject.

### XoopsDatabase
La capa de abstracción de base de datos que proporciona ejecución de consultas y escape de caracteres.

### XoopsForm
El sistema de generación de formularios para crear formularios HTML programáticamente.

### XoopsObject
La clase base para todos los objetos de datos en XOOPS, proporcionando gestión de variables y sanitización.

### xoops_version.php
El archivo de manifiesto de módulo que define propiedades, tablas, bloques, plantillas y configuración de módulos.

---

## Acrónimos Comunes

| Acrónimo | Significado |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System |
| XMF | XOOPS Module Framework |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| ORM | Object-Relational Mapping |
| PSR | PHP Standards Recommendation |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Create, Read, Update, Delete |

---

## 🔗 Documentación Relacionada

- Conceptos Principales
- Referencia de API
- Recursos Externos

---

#xoops #glossary #reference #terminology #definitions
