---
title: "FAQ de Temas"
description: "Preguntas frecuentes sobre temas de XOOPS"
---

# Preguntas Frecuentes sobre Temas

> Preguntas comunes y respuestas sobre temas de XOOPS, personalización y gestión.

---

## Instalación y Activación de Tema

### P: ¿Cómo instalo un nuevo tema en XOOPS?

**R:**
1. Descargar el archivo zip del tema
2. Ir a XOOPS Admin > Apariencia > Temas
3. Hacer clic en "Subir" y seleccionar el archivo zip
4. El tema aparece en la lista de temas
5. Hacer clic para activarlo en su sitio

Alternativa: Extraer manualmente en directorio `/themes/` y actualizar panel de administración.

---

### P: La subida del tema falla con "Permiso denegado"

**R:** Corregir permisos del directorio de temas:

```bash
# Hacer directorio de temas escribible
chmod 755 /path/to/xoops/themes

# Corregir subidas si está subiendo
chmod 777 /path/to/xoops/uploads

# Corregir propiedad si es necesario
chown -R www-data:www-data /path/to/xoops/themes
```

---

### P: ¿Cómo configuro un tema diferente para usuarios específicos?

**R:**
1. Ir a Gestor de Usuarios > Editar Usuario
2. Ir a la pestaña "Otro"
3. Seleccionar tema preferido en dropdown "Tema de Usuario"
4. Guardar

Los temas seleccionados por el usuario anulan el tema predeterminado del sitio.

---

### P: ¿Puedo tener diferentes temas para administración y sitio de usuario?

**R:** Sí, establecer en XOOPS Admin > Configuración:

1. **Tema frontend** - Tema predeterminado del sitio
2. **Tema de administración** - Tema del panel de control de administración (generalmente separado)

Buscar configuraciones como:
- `theme_set` - Tema frontend
- `admin_theme` - Tema de administración

---

## Personalización de Tema

### P: ¿Cómo personalizo un tema existente?

**R:** Crear un tema hijo para preservar actualizaciones:

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Crear copia para edición *}
    ├── style.css
    ├── templates/
    └── images/
```

Luego editar `theme.html` en tu tema personalizado.

---

### P: ¿Cómo cambio los colores del tema?

**R:** Editar el archivo CSS del tema:

```bash
# Ubicar CSS del tema
themes/mytheme/style.css

# O plantilla del tema
themes/mytheme/theme.html
```

Para temas de XOOPS:

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### P: ¿Cómo agrego CSS personalizado a un tema?

**R:** Varias opciones:

**Opción 1: Editar theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* CSS existente *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Opción 2: Crear custom.css**
```bash
# Crear archivo
themes/mytheme/custom.css

# Agregar estilos
body { background: #fff; }
```

**Opción 3: Configuración de Administrador (si soportado)**
Ir a XOOPS Admin > Configuración > Configuración de Tema y agregar CSS personalizado.

---

### P: ¿Cómo modifico plantillas HTML del tema?

**R:** Ubicar el archivo de plantilla:

```bash
# Listar plantillas del tema
ls -la themes/mytheme/templates/

# Plantillas comunes
themes/mytheme/templates/theme.html      {* Diseño principal *}
themes/mytheme/templates/header.html     {* Encabezado *}
themes/mytheme/templates/footer.html     {* Pie de página *}
themes/mytheme/templates/sidebar.html    {* Barra lateral *}
```

Editar con sintaxis Smarty correcta:

```html
<!-- themes/mytheme/templates/theme.html -->
{* Plantilla de Tema XOOPS *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## Estructura de Tema

### P: ¿Qué archivos son requeridos en un tema?

**R:** Estructura mínima:

```
themes/mytheme/
├── theme.html              {* Plantilla principal (requerida) *}
├── style.css              {* Hoja de estilos (opcional pero recomendada) *}
├── screenshot.png         {* Imagen de vista previa para administración (opcional) *}
├── images/                {* Imágenes del tema *}
│   └── logo.png
└── templates/             {* Opcional: Plantillas adicionales *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

Ver Estructura de Tema para detalles.

---

### P: ¿Cómo creo un tema desde cero?

**R:** Crear la estructura:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Crear `theme.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

Crear `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Variables de Tema

### P: ¿Qué variables están disponibles en plantillas de tema?

**R:** Variables comunes de tema de XOOPS:

```smarty
{* Información del Sitio *}
{$xoops_sitename}          {* Nombre del sitio *}
{$xoops_url}               {* URL del sitio *}
{$xoops_theme}             {* Nombre del tema actual *}

{* Contenido de Página *}
{$xoops_contents}          {* Contenido principal de página *}
{$xoops_pagetitle}         {* Título de página *}
{$xoops_headers}           {* Etiquetas meta, estilos en encabezado *}

{* Información del Módulo *}
{$xoops_module_header}     {* Encabezado específico del módulo *}
{$xoops_moduledesc}        {* Descripción del módulo *}

{* Información del Usuario *}
{$xoops_isuser}            {* ¿Usuario ha iniciado sesión? *}
{$xoops_userid}            {* ID de usuario *}
{$xoops_uname}             {* Nombre de usuario *}

{* Bloques *}
{$xoops_blocks}            {* Todo contenido de bloque *}

{* Otro *}
{$xoops_charset}           {* Conjunto de caracteres del documento *}
{$xoops_version}           {* Versión de XOOPS *}
```

---

### P: ¿Cómo agrego variables personalizado a mi tema?

**R:** En su código PHP antes de renderizar:

```php
<?php
// En módulo o código de administración
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Agregar variables personalizado
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Usar en plantilla de tema
$xoopsTpl->display('file:theme.html');
?>
```

En tema:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Estilo de Tema

### P: ¿Cómo hago mi tema responsivo?

**R:** Usar CSS Grid o Flexbox:

```css
/* themes/mytheme/style.css */

/* Enfoque móvil primero */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet y superior */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Escritorio y superior */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

O usar integración de Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Barra lateral *}</div>
    </div>
</div>
```

---

### P: ¿Cómo agrego modo oscuro a mi tema?

**R:**
```css
/* themes/mytheme/style.css */

/* Modo claro (predeterminado) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* O con clase CSS */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

Alternar con JavaScript:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Cargar preferencia
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## Problemas de Tema

### P: Tema muestra errores "variable de plantilla no reconocida"

**R:** La variable no está siendo pasada a la plantilla. Verificar:

1. **Variable está asignada** en PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Plantilla existe** donde se especifica
3. **Sintaxis de plantilla es correcta**:
```smarty
{* Correcto *}
{$variable_name}

{* Incorrecto *}
$variable_name
{variable_name}
```

---

### P: Los cambios de CSS no aparecen en el navegador

**R:** Limpiar caché del navegador:

1. Actualización forzada: `Ctrl+Shift+R` (Cmd+Shift+R en Mac)
2. Limpiar caché de tema en servidor:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Verificar ruta de archivo CSS en tema:
```bash
ls -la themes/mytheme/style.css
```

---

### P: Las imágenes en el tema no se cargan

**R:** Verificar rutas de imagen:

```html
{* INCORRECTO - ruta relativa desde raíz web *}
<img src="themes/mytheme/images/logo.png">

{* CORRECTO - usar xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* O en CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### P: Plantillas de tema faltantes o causando errores

**R:** Ver Errores de Plantilla para depuración.

---

## Distribución de Tema

### P: ¿Cómo empaqueto un tema para distribución?

**R:** Crear un zip distributable:

```bash
# Estructura
mytheme/
├── theme.html           {* Requerida *}
├── style.css
├── screenshot.png       {* 300x225 recomendado *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Opcional *}
    ├── header.html
    └── footer.html

# Crear zip
zip -r mytheme.zip mytheme/
```

---

### P: ¿Puedo vender mi tema de XOOPS?

**R:** Verificar licencia de XOOPS:
- Temas usando clases/plantillas de XOOPS deben respetar la licencia de XOOPS
- Temas de CSS/HTML puro tienen menos restricciones
- Verificar Directrices de Contribución de XOOPS para detalles

---

## Rendimiento de Tema

### P: ¿Cómo optimizo el rendimiento del tema?

**R:**
1. **Minimizar CSS/JS** - Eliminar código no usado
2. **Optimizar imágenes** - Usar formatos apropiados (WebP, AVIF)
3. **Usar CDN** para recursos
4. **Carga perezosa** de imágenes:
```html
<img src="image.jpg" loading="lazy">
```

5. **Versiones de invalidación de caché**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Ver FAQ de Rendimiento para más detalles.

---

## Documentación Relacionada

- Errores de Plantilla
- Estructura de Tema
- FAQ de Rendimiento
- Depuración de Smarty

---

#xoops #temas #faq #solución_de_problemas #personalización
