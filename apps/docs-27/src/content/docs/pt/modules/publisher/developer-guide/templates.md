---
title: "Templates e Blocos"
description: "Visão geral de templates e blocos do Publisher para exibição de conteúdo"
---

## Visão Geral

O Publisher oferece templates personalizáveis para exibir artigos e blocos para integração em sidebar/widget. Este guia abrange personalização de template e configuração de bloco.

## Arquivos de Template

### Templates Principais

| Template | Propósito |
|----------|---------|
| `publisher_index.tpl` | Página inicial do módulo |
| `publisher_item.tpl` | Visualização de artigo único |
| `publisher_category.tpl` | Listagem de categoria |
| `publisher_archive.tpl` | Página de arquivo |
| `publisher_search.tpl` | Resultados de busca |
| `publisher_submit.tpl` | Formulário de envio de artigo |
| `publisher_print.tpl` | Visualização impressão-amigável |

### Templates de Bloco

| Template | Propósito |
|----------|---------|
| `publisher_block_latest.tpl` | Bloco de artigos recentes |
| `publisher_block_spotlight.tpl` | Bloco de artigo em destaque |
| `publisher_block_category.tpl` | Bloco de listagem de categoria |
| `publisher_block_author.tpl` | Bloco de artigos do autor |

## Variáveis de Template

### Variáveis de Artigo

```smarty
{* Disponível em publisher_item.tpl *}
<{$item.title}>           {* Título do artigo *}
<{$item.body}>            {* Conteúdo completo *}
<{$item.summary}>         {* Resumo/trecho *}
<{$item.author}>          {* Nome do autor *}
<{$item.authorid}>        {* ID de usuário do autor *}
<{$item.datesub}>         {* Data de publicação *}
<{$item.datemodified}>    {* Data de última modificação *}
<{$item.counter}>         {* Contagem de visualizações *}
<{$item.rating}>          {* Classificação média *}
<{$item.votes}>           {* Número de votos *}
<{$item.categoryname}>    {* Nome da categoria *}
<{$item.categorylink}>    {* URL da categoria *}
<{$item.itemurl}>         {* URL do artigo *}
<{$item.image}>           {* Imagem em destaque *}
```

### Variáveis de Categoria

```smarty
{* Disponível em publisher_category.tpl *}
<{$category.name}>        {* Nome da categoria *}
<{$category.description}> {* Descrição da categoria *}
<{$category.image}>       {* Imagem da categoria *}
<{$category.total}>       {* Contagem de artigos *}
<{$category.link}>        {* URL da categoria *}
```

## Personalizando Templates

### Local de Sobrescrita

Copie os templates para seu tema para personalizar:

```
themes/meumtema/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Exemplo: Template de Artigo Personalizado

```smarty
{* themes/meumtema/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">Por <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Editar Artigo
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Imprimir</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## Blocos

### Blocos Disponíveis

| Bloco | Descrição |
|-------|-------------|
| Notícias Recentes | Mostra artigos recentes |
| Destaque | Destaque de artigo em destaque |
| Menu de Categoria | Navegação de categoria |
| Arquivos | Links de arquivo |
| Top Autores | Escritores mais ativos |
| Itens Populares | Artigos mais visualizados |

### Opções de Bloco

#### Bloco de Notícias Recentes

| Opção | Descrição |
|--------|-------------|
| Itens a exibir | Número de artigos |
| Filtro de categoria | Limitar a categorias específicas |
| Mostrar resumo | Exibir trecho de artigo |
| Comprimento do título | Truncar títulos |
| Template | Arquivo de template do bloco |

### Template de Bloco Personalizado

```smarty
{* themes/meumtema/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> visualizações</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Truques de Template

### Exibição Condicional

```smarty
{* Mostrar conteúdo diferente para usuários diferentes *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Edição de Admin</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Editar Seu Artigo</a>
<{/if}>
```

### Classe CSS Personalizada

```smarty
{* Adicionar estilo baseado em status *}
<article class="article <{$item.status}>">
    {* Conteúdo *}
</article>
```

### Formatação de Data

```smarty
{* Formatar datas com Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Documentação Relacionada

- ../User-Guide/Basic-Configuration - Configurações do módulo
- ../User-Guide/Creating-Articles - Gerenciamento de conteúdo
- ../../04-API-Reference/Template/Template-System - Motor de template XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Personalização de tema
