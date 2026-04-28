---
title: "Creando tu Primera Página"
description: "Guía paso a paso para crear y publicar contenido en XOOPS, incluyendo formato, inserción de medios y opciones de publicación"
---

# Creando tu Primera Página en XOOPS

Aprende cómo crear, formatear y publicar tu primer contenido en XOOPS.

## Entendiendo el Contenido de XOOPS

### ¿Qué es una Página/Publicación?

En XOOPS, el contenido se gestiona a través de módulos. Los tipos de contenido más comunes son:

| Tipo | Descripción | Caso de uso |
|---|---|---|
| **Página** | Contenido estático | Acerca de nosotros, Contacto, Servicios |
| **Publicación/Artículo** | Contenido con marca de tiempo | Noticias, Entradas de blog |
| **Categoría** | Organización de contenido | Agrupar contenido relacionado |
| **Comentario** | Retroalimentación del usuario | Permitir interacción de visitantes |

Esta guía cubre la creación de una página/artículo básico usando el módulo de contenido predeterminado de XOOPS.

## Accediendo al Editor de Contenido

### Desde el Panel de Admin

1. Inicia sesión en panel de admin: `http://your-domain.com/xoops/admin/`
2. Navega a **Contenido > Páginas** (o tu módulo de contenido)
3. Haz clic en "Añadir Nueva Página" o "Nueva Publicación"

### Frontend (si está habilitado)

Si tu XOOPS está configurado para permitir la creación de contenido en el frontend:

1. Inicia sesión como usuario registrado
2. Ve a tu perfil
3. Busca la opción "Enviar Contenido"
4. Sigue los mismos pasos a continuación

## Interfaz del Editor de Contenido

El editor de contenido incluye:

```
┌─────────────────────────────────────┐
│ Editor de Contenido                 │
├─────────────────────────────────────┤
│                                     │
│ Título: [________________]          │
│                                     │
│ Categoría: [Dropdown]               │
│                                     │
│ [B I U] [Link] [Imagen] [Video]   │
│ ┌─────────────────────────────────┐ │
│ │ Introduce tu contenido aquí...  │ │
│ │                                 │ │
│ │ Puedes usar etiquetas HTML aquí│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Descripción (Meta): [____________]  │
│                                     │
│ [Publicar] [Guardar borrador] [Ver previo]│
│                                     │
└─────────────────────────────────────┘
```

## Guía Paso a Paso: Creando tu Primera Página

### Paso 1: Acceder al Editor de Contenido

1. En el panel de admin, haz clic en **Contenido > Páginas**
2. Haz clic en **"Añadir Nueva Página"** o **"Crear"**
3. Verás el editor de contenido

### Paso 2: Introduce el Título de la Página

En el campo "Título", introduce el nombre de tu página:

```
Título: Bienvenido a Nuestro Sitio Web
```

Mejores prácticas para títulos:
- Claro y descriptivo
- Incluye palabras clave si es posible
- 50-60 caracteres ideal
- Evita MAYÚSCULAS (difícil de leer)
- Sé específico (no "Página 1")

### Paso 3: Seleccionar Categoría

Elige dónde organizar este contenido:

```
Categoría: [Dropdown ▼]
```

Las opciones pueden incluir:
- General
- Noticias
- Blog
- Anuncios
- Servicios

Si las categorías no existen, pide al administrador que las cree.

### Paso 4: Escribir tu Contenido

Haz clic en el área del editor de contenido e introduce tu texto.

#### Formato de Texto Básico

Usa la barra de herramientas del editor:

| Botón | Acción | Resultado |
|---|---|---|
| **B** | Negrita | **Texto en negrita** |
| *I* | Cursiva | *Texto en cursiva* |
| <u>U</u> | Subrayado | <u>Texto subrayado</u> |

#### Usando HTML

XOOPS permite etiquetas HTML seguras. Ejemplos comunes:

```html
<!-- Párrafos -->
<p>Este es un párrafo.</p>

<!-- Encabezados -->
<h1>Encabezado principal</h1>
<h2>Subencabezado</h2>

<!-- Listas -->
<ul>
  <li>Elemento 1</li>
  <li>Elemento 2</li>
  <li>Elemento 3</li>
</ul>

<!-- Negrita e Cursiva -->
<strong>Texto en negrita</strong>
<em>Texto en cursiva</em>

<!-- Enlaces -->
<a href="https://example.com">Texto del enlace</a>

<!-- Saltos de línea -->
<br>

<!-- Regla horizontal -->
<hr>
```

#### Ejemplos HTML Seguros

**Etiquetas recomendadas:**
- Párrafos: `<p>`, `<br>`
- Encabezados: `<h1>` a `<h6>`
- Texto: `<strong>`, `<em>`, `<u>`
- Listas: `<ul>`, `<ol>`, `<li>`
- Enlaces: `<a href="">`
- Citas: `<blockquote>`
- Tablas: `<table>`, `<tr>`, `<td>`

**Evita estas etiquetas** (pueden estar deshabilitadas por seguridad):
- Scripts: `<script>`
- Estilos: `<style>`
- Iframes: `<iframe>` (a menos que esté configurado)
- Formularios: `<form>`, `<input>`

### Paso 5: Añadir Imágenes

#### Opción 1: Insertar URL de Imagen

Usando el editor:

1. Haz clic en el botón **Insertar Imagen** (icono de imagen)
2. Introduce la URL de la imagen: `https://example.com/image.jpg`
3. Introduce texto alternativo: "Descripción de la imagen"
4. Haz clic en "Insertar"

Equivalente en HTML:

```html
<img src="https://example.com/image.jpg" alt="Descripción">
```

#### Opción 2: Subir Imagen

1. Sube la imagen a XOOPS primero:
   - Ve a **Contenido > Gestor de Medios**
   - Sube tu imagen
   - Copia la URL de la imagen

2. En el editor de contenido, inserta usando la URL (pasos anteriores)

#### Mejores Prácticas para Imágenes

- Usa tamaños de archivo apropiados (optimiza imágenes)
- Usa nombres de archivo descriptivos
- Siempre incluye texto alternativo (accesibilidad)
- Formatos soportados: JPG, PNG, GIF, WebP
- Ancho recomendado: 600-800 píxeles para contenido

### Paso 6: Incrustar Medios

#### Incrustar Video de YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Reemplaza `VIDEO_ID` con el ID del video de YouTube.

**Para encontrar el ID del video de YouTube:**
1. Abre el video en YouTube
2. La URL es: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Copia el ID (caracteres después de `v=`)

#### Incrustar Video de Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Paso 7: Añadir Descripción Meta

En el campo "Descripción", añade un resumen breve:

```
Descripción: Aprende cómo comenzar con nuestro sitio web.
Esta página proporciona una descripción general de nuestros servicios y cómo podemos ayudarte.
```

**Mejores prácticas para descripción meta:**
- 150-160 caracteres
- Incluye palabras clave naturalmente
- Debe resumir con precisión el contenido
- Se usa en los resultados de motores de búsqueda
- Hazla atractiva (los usuarios la ven)

### Paso 8: Configurar Opciones de Publicación

#### Estado de Publicación

Elige el estado de publicación:

```
Estado: ☑ Publicado
```

Opciones:
- **Publicado:** Visible para el público
- **Borrador:** Solo visible para admins
- **Pendiente de Revisión:** Esperando aprobación
- **Archivado:** Oculto pero guardado

#### Visibilidad

Establece quién puede ver este contenido:

```
Visibilidad: ☐ Público
            ☐ Solo Usuarios Registrados
            ☐ Privado (Solo Admin)
```

#### Fecha de Publicación

Establece cuándo el contenido se vuelve visible:

```
Fecha de Publicación: [Date Picker] [Hora]
```

Déjalo como "Ahora" para publicar inmediatamente.

#### Permitir Comentarios

Habilita o deshabilita los comentarios de visitantes:

```
Permitir Comentarios: ☑ Sí
```

Si está habilitado, los visitantes pueden añadir retroalimentación.

### Paso 9: Guardar tu Contenido

Múltiples opciones de guardado:

```
[Publicar Ahora]  [Guardar como Borrador]  [Programar]  [Ver Previo]
```

- **Publicar Ahora:** Hacerlo visible inmediatamente
- **Guardar como Borrador:** Mantenerlo privado por ahora
- **Programar:** Publicar en una fecha/hora futura
- **Ver Previo:** Ver cómo se ve antes de guardar

Haz clic en tu opción:

```
Haz clic en [Publicar Ahora]
```

### Paso 10: Verificar tu Página

Después de publicar, verifica tu contenido:

1. Ve a la página principal de tu sitio web
2. Navega a tu área de contenido
3. Busca tu página recién creada
4. Haz clic para verla
5. Comprueba:
   - [ ] El contenido se muestra correctamente
   - [ ] Las imágenes aparecen
   - [ ] El formato se ve bien
   - [ ] Los enlaces funcionan
   - [ ] El título y descripción son correctos

## Ejemplo: Página Completa

### Título
```
Comenzando con XOOPS
```

### Contenido
```html
<h2>Bienvenido a XOOPS</h2>

<p>XOOPS es un poderoso y flexible sistema de gestión de
contenido de código abierto. Te permite construir
sitios web dinámicos con conocimientos técnicos mínimos.</p>

<h3>Características Clave</h3>

<ul>
  <li>Fácil gestión de contenido</li>
  <li>Registro y gestión de usuarios</li>
  <li>Sistema de módulos para extensibilidad</li>
  <li>Sistema de temas flexible</li>
  <li>Características de seguridad incorporadas</li>
</ul>

<h3>Comenzando</h3>

<p>Aquí están los primeros pasos para poner en
funcionamiento tu sitio XOOPS:</p>

<ol>
  <li>Configura los ajustes básicos</li>
  <li>Crea tu primera página</li>
  <li>Configura cuentas de usuario</li>
  <li>Instala módulos adicionales</li>
  <li>Personaliza la apariencia</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="Logo de XOOPS">

<p>Para más información, visita
<a href="https://xoops.org/">xoops.org</a></p>
```

### Descripción Meta
```
Comienza con XOOPS CMS. Aprende sobre características
y los primeros pasos para lanzar tu sitio web dinámico.
```

## Características Avanzadas de Contenido

### Usando Editor WYSIWYG

Si está instalado un editor de texto enriquecido:

```
[B] [I] [U] [Link] [Imagen] [Código] [Cita]
```

Haz clic en los botones para formatear texto sin HTML.

### Insertando Bloques de Código

Muestra ejemplos de código:

```html
<pre><code>
// Ejemplo PHP
$variable = "Hola Mundo";
echo $variable;
</code></pre>
```

### Creando Tablas

Organiza datos en tablas:

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Característica</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Fácil de personalizar</td>
  </tr>
  <tr>
    <td>Poderoso</td>
    <td>CMS completo</td>
  </tr>
</table>
```

### Citas en Línea

Destaca texto importante:

```html
<blockquote>
"XOOPS es un poderoso sistema de gestión de contenido
que te empodera para construir sitios web dinámicos."
</blockquote>
```

## Mejores Prácticas SEO para Contenido

Optimiza tu contenido para motores de búsqueda:

### Título
- Incluye palabra clave principal
- 50-60 caracteres
- Único por página

### Descripción Meta
- Incluye palabra clave naturalmente
- 150-160 caracteres
- Convincente y precisa

### Contenido
- Escribe naturalmente, evita relleno de palabras clave
- Usa encabezados (h2, h3) apropiadamente
- Incluye enlaces internos a otras páginas
- Usa texto alternativo en todas las imágenes
- Apunta a 300+ palabras para artículos

### Estructura de URL
- Mantén URLs cortas y descriptivas
- Usa guiones para separar palabras
- Evita caracteres especiales
- Ejemplo: `/acerca-de-nuestra-empresa`

## Gestionando tu Contenido

### Editar Página Existente

1. Ve a **Contenido > Páginas**
2. Encuentra tu página en la lista
3. Haz clic en **Editar** o en el título de la página
4. Realiza cambios
5. Haz clic en **Actualizar**

### Eliminar Página

1. Ve a **Contenido > Páginas**
2. Encuentra tu página
3. Haz clic en **Eliminar**
4. Confirma la eliminación

### Cambiar Estado de Publicación

1. Ve a **Contenido > Páginas**
2. Encuentra la página, haz clic en **Editar**
3. Cambia el estado en el desplegable
4. Haz clic en **Actualizar**

## Solución de Problemas de Creación de Contenido

### El Contenido No Aparece

**Síntoma:** La página publicada no se muestra en el sitio web

**Solución:**
1. Comprueba el estado de publicación: Debe ser "Publicado"
2. Comprueba la fecha de publicación: Debe ser actual o pasada
3. Comprueba la visibilidad: Debe ser "Público"
4. Borra la caché: Admin > Herramientas > Borrar Caché
5. Comprueba permisos: El grupo de usuario debe tener acceso

### El Formato No Funciona

**Síntoma:** Las etiquetas HTML o formato aparecen como texto

**Solución:**
1. Verifica que HTML esté habilitado en la configuración del módulo
2. Usa sintaxis HTML correcta
3. Cierra todas las etiquetas: `<p>Texto</p>`
4. Usa solo etiquetas permitidas
5. Usa entidades HTML: `&lt;` para `<`, `&amp;` para `&`

### Las Imágenes No Se Muestran

**Síntoma:** Las imágenes muestran icono roto

**Solución:**
1. Verifica que la URL de la imagen sea correcta
2. Comprueba que el archivo de imagen existe
3. Verifica permisos adecuados en la imagen
4. Intenta subir la imagen a XOOPS en su lugar
5. Comprueba si hay bloqueo externo (puede necesitar CORS)

### Problemas de Codificación de Caracteres

**Síntoma:** Los caracteres especiales aparecen como caracteres sin sentido

**Solución:**
1. Guarda el archivo como codificación UTF-8
2. Asegúrate de que el charset de la página sea UTF-8
3. Añade al head HTML: `<meta charset="UTF-8">`
4. Evita copiar/pegar de Word (usa texto plano)

## Mejores Prácticas de Flujo de Contenido

### Proceso Recomendado

1. **Escribe en el Editor Primero:** Usa el editor de contenido admin
2. **Previsualiza Antes de Publicar:** Haz clic en el botón Previsualizar
3. **Añade Metadatos:** Completa título, descripción, etiquetas
4. **Guarda como Borrador Primero:** Guarda como borrador para evitar perder trabajo
5. **Revisión Final:** Relee antes de publicar
6. **Publicar:** Haz clic en Publicar cuando esté listo
7. **Verificar:** Comprueba en el sitio en vivo
8. **Editar si es Necesario:** Haz correcciones rápidamente

### Control de Versiones

Siempre mantén copias de seguridad:

1. **Antes de Cambios Principales:** Guarda como nueva versión o copia de seguridad
2. **Archiva Contenido Antiguo:** Mantén versiones no publicadas
3. **Fecha tus Borradores:** Usa nombres claros: "Página-Borrador-2025-01-28"

## Publicando Múltiples Páginas

Crea una estrategia de contenido:

```
Página Principal
├── Acerca de Nosotros
├── Servicios
│   ├── Servicio 1
│   ├── Servicio 2
│   └── Servicio 3
├── Blog
│   ├── Artículo 1
│   ├── Artículo 2
│   └── Artículo 3
├── Contacto
└── Preguntas Frecuentes
```

Crea páginas siguiendo esta estructura.

## Próximos Pasos

Después de crear tu primera página:

1. Configura cuentas de usuario
2. Instala módulos adicionales
3. Explora características de admin
4. Configura ajustes
5. Optimiza con configuración de rendimiento

---

**Etiquetas:** #creación-de-contenido #páginas #publicación #editor

**Artículos Relacionados:**
- Admin-Panel-Overview
- Managing-Users
- Installing-Modules
- ../Configuration/Basic-Configuration
