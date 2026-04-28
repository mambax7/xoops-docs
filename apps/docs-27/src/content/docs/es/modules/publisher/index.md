---
title: "Módulo Publisher"
description: "Documentación completa para el módulo de noticias y blog Publisher para XOOPS"
---

> El módulo de publicación de noticias y blogs de primera clase para XOOPS CMS.

---

## Descripción General

Publisher es el módulo definitivo de gestión de contenidos para XOOPS, evolucionado de SmartSection para convertirse en la solución de blog y noticias más rica en características. Proporciona herramientas completas para crear, organizar y publicar contenido con soporte completo de flujo de trabajo editorial.

**Requisitos:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x recomendado)

---

## Características Clave

### Gestión de Contenidos
- **Categorías y Subcategorías** - Organización jerárquica del contenido
- **Edición de Texto Rico** - Múltiples editores WYSIWYG soportados
- **Archivos Adjuntos** - Adjuntar archivos a artículos
- **Gestión de Imágenes** - Imágenes de página y categoría
- **Envolvimiento de Archivos** - Envolver archivos como artículos

### Flujo de Trabajo de Publicación
- **Publicación Programada** - Establecer fechas de publicación futura
- **Fechas de Expiración** - Contenido de expiración automática
- **Moderación** - Flujo de trabajo de aprobación editorial
- **Gestión de Borradores** - Guardar trabajo en progreso

### Pantalla y Plantillas
- **Cuatro Plantillas Base** - Múltiples diseños de visualización
- **Plantillas Personalizadas** - Crear sus propios diseños
- **Optimización SEO** - URLs amigables para motores de búsqueda
- **Diseño Responsivo** - Salida compatible con dispositivos móviles

### Interacción del Usuario
- **Calificaciones** - Sistema de calificación de artículos
- **Comentarios** - Discusiones de lectores
- **Compartir en Redes Sociales** - Compartir en redes sociales

### Permisos
- **Control de Envío** - Quién puede enviar artículos
- **Permisos a Nivel de Campo** - Controlar campos de formulario por grupo
- **Permisos de Categoría** - Control de acceso por categoría
- **Derechos de Moderación** - Configuración de moderación global

---

## Contenido de las Secciones

### Guía de Usuario
- Guía de Instalación
- Configuración Básica
- Creación de Artículos
- Gestión de Categorías
- Configuración de Permisos

### Guía del Desarrollador
- Extendiendo Publisher
- Creación de Plantillas Personalizadas
- Referencia de API
- Ganchos y Eventos

---

## Inicio Rápido

### 1. Instalación

```bash
# Descargar desde GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copiar al directorio de módulos
cp -r publisher /path/to/xoops/htdocs/modules/
```

Luego instale a través de XOOPS Admin → Módulos → Instalar.

### 2. Crear Su Primera Categoría

1. Vaya a **Admin → Publisher → Categorías**
2. Haga clic en **Agregar Categoría**
3. Rellene:
   - **Nombre**: Noticias
   - **Descripción**: Últimas noticias y actualizaciones
   - **Imagen**: Cargar imagen de categoría
4. Guardar

### 3. Crear Su Primer Artículo

1. Vaya a **Admin → Publisher → Artículos**
2. Haga clic en **Agregar Artículo**
3. Rellene:
   - **Título**: Bienvenido a Nuestro Sitio
   - **Categoría**: Noticias
   - **Contenido**: El contenido de su artículo
4. Establecer **Estado**: Publicado
5. Guardar

---

## Opciones de Configuración

### Configuración General

| Configuración | Descripción | Predeterminado |
|---------|-------------|---------|
| Editor | Editor WYSIWYG a usar | XOOPS Predeterminado |
| Elementos por página | Artículos mostrados por página | 10 |
| Mostrar breadcrumb | Mostrar rastro de navegación | Sí |
| Permitir calificaciones | Habilitar calificaciones de artículos | Sí |
| Permitir comentarios | Habilitar comentarios de artículos | Sí |

### Configuración de SEO

| Configuración | Descripción | Predeterminado |
|---------|-------------|---------|
| URLs SEO | Habilitar URLs amigables | No |
| Reescritura de URL | mod_rewrite de Apache | Ninguno |
| Palabras clave meta | Auto-generar palabras clave | Sí |

### Matriz de Permisos

| Permiso | Anónimo | Registrado | Editor | Admin |
|------------|-----------|------------|--------|-------|
| Ver artículos | ✓ | ✓ | ✓ | ✓ |
| Enviar artículos | ✗ | ✓ | ✓ | ✓ |
| Editar propios artículos | ✗ | ✓ | ✓ | ✓ |
| Editar todos los artículos | ✗ | ✗ | ✓ | ✓ |
| Aprobar artículos | ✗ | ✗ | ✓ | ✓ |
| Gestionar categorías | ✗ | ✗ | ✗ | ✓ |

---

## Estructura del Módulo

```
modules/publisher/
├── admin/                  # Interfaz de administración
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # Clases PHP
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Archivos de inclusión
│   ├── common.php
│   └── functions.php
├── templates/              # Plantillas Smarty
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Traducciones
│   └── english/
├── sql/                    # Esquema de base de datos
│   └── mysql.sql
├── xoops_version.php       # Información del módulo
└── index.php               # Entrada del módulo
```

---

## Migración

### Desde SmartSection

Publisher incluye una herramienta de migración integrada:

1. Vaya a **Admin → Publisher → Importar**
2. Seleccione **SmartSection** como fuente
3. Elija opciones de importación:
   - Categorías
   - Artículos
   - Comentarios
4. Haga clic en **Importar**

### Desde Módulo de Noticias

1. Vaya a **Admin → Publisher → Importar**
2. Seleccione **Noticias** como fuente
3. Asigne categorías
4. Haga clic en **Importar**

---

## Documentación Relacionada

- Guía de Desarrollo de Módulos
- Plantillas Smarty
- Marco XMF

---

## Recursos

- [Repositorio de GitHub](https://github.com/XoopsModules25x/publisher)
- [Seguimiento de Problemas](https://github.com/XoopsModules25x/publisher/issues)
- [Tutorial Original](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #módulo #blog #noticias #cms #gestión-de-contenidos
