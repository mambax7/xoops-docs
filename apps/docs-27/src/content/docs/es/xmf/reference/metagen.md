---
title: "Clase XMF Metagen"
description: "Generación de etiquetas meta y ayudantes de SEO en el Marco XMF"
---

La clase `Metagen` en el Marco XMF proporciona un conjunto de herramientas integral para generar y gestionar etiquetas meta HTML, etiquetas Open Graph y otros metadatos relacionados con SEO.

## Descripción General de la Clase

La clase `Metagen` maneja:
- Etiquetas meta HTML estándar (descripción, palabras clave, etc.)
- Etiquetas meta Open Graph para compartir en redes sociales
- Etiquetas Twitter Card
- Datos estructurados y JSON-LD
- URLs canónicas
- Especificaciones de idioma y locales

### Estructura Básica de la Clase

```php
namespace Xmf;

class Metagen
{
    protected $meta = [];
    protected $ogTags = [];
    protected $twitterTags = [];
    protected $jsonLd = [];
    protected $canonicalUrl;
    protected $language;

    public function __construct() {}

    public function setDescription(string $description): self {}

    public function setKeywords(string $keywords): self {}

    public function renderAll(): string {}
}
```

## Uso Básico

### Etiquetas Meta Simples

```php
use Xmf\Metagen;

$metagen = new Metagen();

// Establecer etiquetas meta básicas
$metagen->setDescription('Este es mi sitio web impresionante');
$metagen->setKeywords('php, xoops, desarrollo web');

// Renderizar a HTML
echo $metagen->renderAll();

// Salida:
// <meta name="description" content="Este es mi sitio web impresionante" />
// <meta name="keywords" content="php, xoops, desarrollo web" />
```

## Etiquetas Meta Open Graph

Las etiquetas Open Graph ayudan a controlar cómo aparece el contenido cuando se comparte en redes sociales.

### Configuración Básica de Open Graph

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'Mi Artículo Impresionante');
$metagen->setOpenGraphProperty('og:description', 'Aprenda cómo usar Metagen para SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Datos Estructurados y JSON-LD

JSON-LD proporciona datos estructurados que los motores de búsqueda pueden entender mejor.

### Datos Estructurados de Artículo

```php
$metagen = new Metagen();

$articleData = [
    '@context' => 'https://schema.org',
    '@type' => 'Article',
    'headline' => 'Entendiendo XOOPS 4.0',
    'description' => 'Una guía completa de la modernización de XOOPS',
    'image' => 'https://example.com/article.jpg',
    'datePublished' => '2026-01-31T10:00:00Z',
    'dateModified' => '2026-01-31T15:00:00Z',
    'author' => [
        '@type' => 'Person',
        'name' => 'John Developer',
        'url' => 'https://example.com/author'
    ]
];

$metagen->setJsonLd($articleData);

echo $metagen->renderAll();
```

## Ejemplos de Integración de Módulo

### Módulo de Blog/Artículo

```php
namespace MyModule\Controller;

use Xmf\Metagen;
use MyModule\Repository\ArticleRepository;

class ArticleController
{
    public function viewAction($id)
    {
        $repository = new ArticleRepository();
        $article = $repository->getById($id);

        if (!$article) {
            return $this->notFound();
        }

        // Inicializar Metagen
        $metagen = new Metagen();

        // Establecer metadatos del artículo
        $metagen->setTitle($article->getTitle());
        $metagen->setDescription(
            substr($article->getBody(), 0, 160)
        );
        $metagen->setKeywords(
            implode(', ', $article->getTags())
        );
        $metagen->setAuthor($article->getAuthorName());

        // Open Graph
        $metagen->setOpenGraphProperty('og:type', 'article');
        $metagen->setOpenGraphProperty('og:title', $article->getTitle());
        $metagen->setOpenGraphProperty('og:description', $article->getExcerpt());
        $metagen->setOpenGraphProperty('og:image', $article->getFeaturedImage());
        $metagen->setOpenGraphProperty('og:url', $article->getUrl());

        // URL canónica
        $metagen->setCanonicalUrl($article->getUrl());

        // Almacenar en plantilla
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## Integración de Plantilla

### Implementación de Plantilla

```php
<!-- En su encabezado de plantilla -->
<?php if (isset($metagen)): ?>
    <?php echo $metagen->renderAll(); ?>
<?php endif; ?>

<!-- Estructura HTML estándar -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <?php echo $metagen->renderAll(); ?>
    <title><?php echo $metagen->getTitle(); ?></title>
</head>
<body>
    <!-- Contenido -->
</body>
</html>
```

## Mejores Prácticas

### Optimización de SEO

1. **Descripciones únicas** para cada página (150-160 caracteres)
2. **Palabras clave relevantes** (5-10 palabras clave primarias por página)
3. **URLs canónicas** para prevenir contenido duplicado
4. **Etiquetas Open Graph** para optimización de redes sociales
5. **Datos estructurados** para resultados de búsqueda mejorados
6. **Etiqueta meta viewport** para diseño responsivo

### Implementación Completa de SEO

```php
$metagen = new Metagen();

// Etiquetas meta básicas
$metagen->setTitle('Mi Sitio Web - Servicios de Desarrollo Web');
$metagen->setDescription('Servicios profesionales de desarrollo web');
$metagen->setKeywords('desarrollo web, php, xoops');
$metagen->setAuthor('John Developer');
$metagen->setLanguage('es');

// URL canónica
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// Open Graph para compartir en redes sociales
$metagen->setOpenGraphProperty('og:title', 'Servicios de Desarrollo Web');
$metagen->setOpenGraphProperty('og:description', 'Servicios profesionales');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/og-image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/services/web-development');
$metagen->setOpenGraphProperty('og:type', 'website');

// Twitter Card
$metagen->setTwitterCard('summary_large_image');
$metagen->setTwitterProperty('twitter:site', '@mycompany');
$metagen->setTwitterProperty('twitter:title', 'Servicios de Desarrollo Web');
$metagen->setTwitterProperty('twitter:image', 'https://example.com/twitter-image.jpg');

echo $metagen->renderAll();
```

## Referencia de API

### Métodos Principales

| Método | Parámetros | Devuelve | Descripción |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | Establecer título de página |
| `setDescription()` | string | self | Establecer descripción meta |
| `setKeywords()` | string | self | Establecer palabras clave meta |
| `setAuthor()` | string | self | Establecer nombre del autor |
| `setCanonicalUrl()` | string | self | Establecer URL canónica |
| `setLanguage()` | string | self | Establecer idioma de página |
| `setViewport()` | string | self | Establecer configuración de viewport |
| `setOpenGraphProperty()` | string, string | self | Agregar etiqueta OG |
| `setTwitterCard()` | string | self | Establecer tipo de Twitter Card |
| `setJsonLd()` | array | self | Establecer datos estructurados |
| `renderAll()` | - | string | Renderizar todas las etiquetas meta |

## Documentación Relacionada

- Database - Referencia de base de datos XMF
- JWT - Autenticación JWT en XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Mejores prácticas de integración de frontend

## Recursos

- [Protocolo Open Graph](https://ogp.me/)
- [Documentación de Twitter Card](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Datos Estructurados de Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Información de Versión

- **Introducido:** XOOPS 2.5.8
- **Última Actualización:** XOOPS 4.0
- **Compatibilidad:** PHP 7.4+
