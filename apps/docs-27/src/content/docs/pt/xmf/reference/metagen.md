---
title: "Classe XMF Metagen"
description: "Geração de meta tags e helpers de SEO no XMF Framework"
---

A classe `Metagen` no XMF Framework fornece um kit de ferramentas abrangente para geração e gerenciamento de tags HTML meta, tags Open Graph e outro metadado relacionado a SEO.

## Visão Geral da Classe

A classe `Metagen` manipula:
- Tags meta HTML padrão (description, keywords, etc.)
- Tags meta Open Graph para compartilhamento social
- Tags Twitter Card
- Dados estruturados e JSON-LD
- URLs canônicas
- Especificações de linguagem e localidade

### Estrutura Básica da Classe

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

### Tags Meta Simples

```php
use Xmf\Metagen;

$metagen = new Metagen();

// Definir tags meta básicas
$metagen->setDescription('Este é meu site incrível');
$metagen->setKeywords('php, xoops, desenvolvimento web');

// Renderizar para HTML
echo $metagen->renderAll();

// Saída:
// <meta name="description" content="Este é meu site incrível" />
// <meta name="keywords" content="php, xoops, desenvolvimento web" />
```

## Tags Meta Open Graph

Tags Open Graph ajudam controlar como conteúdo aparece quando compartilhado em redes sociais.

### Configuração Básica Open Graph

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'Meu Artigo Incrível');
$metagen->setOpenGraphProperty('og:description', 'Aprenda como usar Metagen para SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Dados Estruturados e JSON-LD

JSON-LD fornece dados estruturados que mecanismos de busca podem entender melhor.

### Dados Estruturados de Artigo

```php
$metagen = new Metagen();

$articleData = [
    '@context' => 'https://schema.org',
    '@type' => 'Article',
    'headline' => 'Entendendo XOOPS 4.0',
    'description' => 'Um guia abrangente para modernização XOOPS',
    'image' => 'https://example.com/article.jpg',
    'datePublished' => '2026-01-31T10:00:00Z',
    'dateModified' => '2026-01-31T15:00:00Z',
    'author' => [
        '@type' => 'Person',
        'name' => 'João Desenvolvedor',
        'url' => 'https://example.com/author'
    ]
];

$metagen->setJsonLd($articleData);

echo $metagen->renderAll();
```

## Exemplos de Integração com Módulo

### Módulo Blog/Artigo

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

        // Definir metadados de artigo
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

        // URL Canônica
        $metagen->setCanonicalUrl($article->getUrl());

        // Armazenar em template
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## Integração com Template

### Implementação de Template

```php
<!-- No cabeçalho do seu template -->
<?php if (isset($metagen)): ?>
    <?php echo $metagen->renderAll(); ?>
<?php endif; ?>

<!-- Estrutura HTML padrão -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <?php echo $metagen->renderAll(); ?>
    <title><?php echo $metagen->getTitle(); ?></title>
</head>
<body>
    <!-- Conteúdo -->
</body>
</html>
```

## Melhores Práticas

### Otimização de SEO

1. **Descrições únicas** para cada página (150-160 caracteres)
2. **Palavras-chave relevantes** (5-10 palavras-chave primárias por página)
3. **URLs canônicas** para prevenção de conteúdo duplicado
4. **Tags Open Graph** para otimização de mídia social
5. **Dados estruturados** para resultados de busca aprimorados
6. **Meta tag de viewport móvel** para design responsivo

### Implementação Completa de SEO

```php
$metagen = new Metagen();

// Tags meta básicas
$metagen->setTitle('Meu Website - Serviços de Desenvolvimento Web');
$metagen->setDescription('Serviços profissionais de desenvolvimento web');
$metagen->setKeywords('desenvolvimento web, php, xoops');
$metagen->setAuthor('João Desenvolvedor');
$metagen->setLanguage('en');

// URL Canônica
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// Open Graph para compartilhamento social
$metagen->setOpenGraphProperty('og:title', 'Serviços de Desenvolvimento Web');
$metagen->setOpenGraphProperty('og:description', 'Serviços profissionais');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/og-image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/services/web-development');
$metagen->setOpenGraphProperty('og:type', 'website');

// Twitter Card
$metagen->setTwitterCard('summary_large_image');
$metagen->setTwitterProperty('twitter:site', '@mycompany');
$metagen->setTwitterProperty('twitter:title', 'Serviços de Desenvolvimento Web');
$metagen->setTwitterProperty('twitter:image', 'https://example.com/twitter-image.jpg');

echo $metagen->renderAll();
```

## Referência da API

### Métodos Principais

| Método | Parâmetros | Retorna | Descrição |
|--------|-----------|---------|-----------|
| `setTitle()` | string | self | Definir título da página |
| `setDescription()` | string | self | Definir meta description |
| `setKeywords()` | string | self | Definir meta keywords |
| `setAuthor()` | string | self | Definir nome do autor |
| `setCanonicalUrl()` | string | self | Definir URL canônica |
| `setLanguage()` | string | self | Definir linguagem da página |
| `setViewport()` | string | self | Definir configurações de viewport |
| `setOpenGraphProperty()` | string, string | self | Adicionar tag OG |
| `setTwitterCard()` | string | self | Definir tipo de Twitter card |
| `setJsonLd()` | array | self | Definir dados estruturados |
| `renderAll()` | - | string | Renderizar todas as meta tags |

## Documentação Relacionada

- Database - Referência de banco de dados XMF
- JWT - Autenticação JWT em XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Melhores práticas de integração frontend

## Recursos

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Structured Data](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Informação de Versão

- **Introduzido:** XOOPS 2.5.8
- **Última Atualização:** XOOPS 4.0
- **Compatibilidade:** PHP 7.4+
