---
title: "Convenções de Template Smarty"
description: "Padrões de codificação de templates Smarty do XOOPS e melhores práticas"
---

> XOOPS usa Smarty para templating. Este guia cobre convenções e melhores práticas para desenvolvimento de templates Smarty.

---

## Visão Geral

Templates Smarty do XOOPS seguem:

- **Estrutura de template XOOPS** e nomenclatura
- **Padrões de acessibilidade** (WCAG)
- **Marcação HTML5 semântica**
- **Nomenclatura de classe estilo BEM**
- **Otimização de performance**

---

## Estrutura de Arquivo

### Organização de Template

```
templates/
├── admin/                   # Templates de administrador
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # Templates de bloco
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # Templates compartilhados
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # Templates de email
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # Templates de página
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # Armazenado em BD para sobreposições de tema
└── db:modulename_footer.tpl
```

### Nomenclatura de Arquivo

```smarty
{* Arquivos de template XOOPS usam prefixo de módulo *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* Templates de administrador *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## Cabeçalho de Arquivo

### Comentário de Cabeçalho de Template

```smarty
{*
 * XOOPS Module - Nome do Módulo
 * @file Template de lista de itens
 * @author Seu Nome <email@example.com>
 * @copyright 2026 Projeto XOOPS
 * @license GPL-2.0-or-later
 * Descrição do que este template exibe
 *}

<h1><{$page_title}></h1>
```

---

## Variáveis e Nomenclatura

### Convenção de Nomenclatura de Variável

```smarty
{* Use nomes descritivos *}
<{$page_title}>              {* ✅ Claro *}
<{$items}>                   {* ✅ Claro *}
<{$user_count}>              {* ✅ Claro *}

<{$p_t}>                     {* ❌ Abreviação pouco clara *}
<{$x}>                       {* ❌ Pouco claro *}
```

### Escopo de Variável

```smarty
{* Variáveis globais XOOPS *}
<{$xoops_url}>              {* URL raiz *}
<{$xoops_sitename}>         {* Nome do site *}
<{$xoops_requesturi}>       {* URI atual *}
<{$xoops_isadmin}>          {* Flag de modo admin *}
<{$xoops_user_is_admin}>    {* Usuário é admin *}

{* Variáveis comuns de módulo *}
<{$module_id}>              {* ID do módulo atual *}
<{$module_name}>            {* Nome do módulo atual *}
<{$moduledir}>              {* Diretório de módulo *}
<{$lang}>                   {* Idioma atual *}
```

---

## Formatação e Espaçamento

### Estrutura Básica

```smarty
{*
 * Cabeçalho de template
 *}

{* Incluir outros templates *}
<{include file="db:modulename_header.tpl"}>

{* Conteúdo principal *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* Renderizar itens *}
  <{else}>
    {* Mostrar estado vazio *}
  <{/if}>
</main>

{* Rodapé *}
<{include file="db:modulename_footer.tpl"}>
```

### Indentação

```smarty
{* Use 2 espaços para indentação *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* Não pule linhas dentro de blocos *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```

### Espaçamento Ao Redor de Tags

```smarty
{* Sem espaços dentro dos delimitadores de tag *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* Espaço após pipes em modificadores *}
<{$text|truncate:50}>        {* ✅ *}
<{$text|truncate:50}>        {* ✅ *}

{* Espaço ao redor de operadores em condicionais *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```

---

## Estruturas de Controle

### Condicionais

```smarty
{* if/else simples *}
<{if $is_published}>
  <span class="status--published">Publicado</span>
<{else}>
  <span class="status--draft">Rascunho</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">Ativo</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">Revisão Pendente</div>
<{else}>
  <div class="alert--danger">Inativo</div>
<{/if}>

{* Ternário inline (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```

### Loops

```smarty
{* foreach básico *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* Com chave e contador *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* Com alternação *}
<{foreach item=item from=$items}>
  <div class="item <{if $smarty.foreach.item.iteration % 2 == 0}>item--even<{else}>item--odd<{/if}>">
    <{$item.title}>
  </div>
<{/foreach}>

{* Verificar se vazio *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">Nenhum item encontrado</p>
<{/if}>
```

### Section (descontinuado, use foreach em seu lugar)

```smarty
{* Não use section - está descontinuado *}
{* ❌ <{section name=i loop=$items}> *}

{* Use foreach em seu lugar *}
{* ✅ *}
<{foreach item=item from=$items}>
```

---

## Saída de Variável

### Saída Básica

```smarty
{* Exibir variável como está *}
<{$title}>

{* Exibir com padrão se vazio *}
<{$title|default:'Sem Título'}>

{* Escape HTML (padrão por segurança) *}
<{$content}>                  {* Escapado por padrão *}
<{$content|escape:'html'}>    {* Explicitamente escapado *}

{* Saída bruta (use com cuidado!) *}
<{$html_content|escape:false}>

{* Codificação especial *}
<{$url|escape:'url'}>         {* Para contexto de URL *}
<{$json|escape:'javascript'}> {* Para JavaScript *}
```

### Modificadores

```smarty
{* Formatação de texto *}
<{$text|upper}>              {* Converter para maiúsculas *}
<{$text|lower}>              {* Converter para minúsculas *}
<{$text|capitalize}>         {* Capitalizar primeira letra *}
<{$text|truncate:50:'...'}>  {* Truncar para 50 caracteres *}

{* Formatação de número *}
<{$price|number_format:2}>   {* Formatar número *}
<{$count|string_format:"%03d"}> {* Formatar como string *}

{* Formatação de data *}
<{$date|date_format:'%Y-%m-%d'}> {* Formatar data *}
<{$date|date_format:'%B %d, %Y'}>

{* Operações de array *}
<{$items|@count}>            {* Contar itens (note @) *}
<{$items|@array_keys}>       {* Obter chaves *}

{* Encadeando modificadores *}
<{$title|upper|truncate:30:'...'}> {* Encadear múltiplos *}

{* Modificador condicional *}
<{$status|default:'pending'}>
```

---

## Constantes

### Usando Constantes XOOPS

```smarty
{* Use constantes define()d do PHP *}
{* Estas devem ser definidas em PHP primeiro *}

{* Constantes principais *}
<{$smarty.const._MD_MODULENAME_TITLE}>
<{$smarty.const._MD_MODULENAME_SUBMIT}>

{* Constantes de módulo *}
<{$smarty.const.MODULEDIR}>
<{$smarty.const.MODULEURL}>

{* Constantes customizadas *}
<{$smarty.const._MY_CONSTANT}>
```

### Constantes de Idioma

```smarty
{* Use constantes de idioma para i18n *}
{* Definir em arquivo de idioma: define('_MD_MODULENAME_TITLE', 'Título em Inglês'); *}

<h1><{$smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$smarty.const._MD_MODULENAME_SUBMIT}></button>
```

---

## Melhores Práticas HTML

### Marcação Semântica

```smarty
{* Use elementos HTML semânticos *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">Por <{$item.author}></span>
  </footer>
</article>
```

### Acessibilidade

```smarty
{* Use HTML semântico para acessibilidade *}

{* Links com texto significativo *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ Texto de link significativo *}
</a>

{* Imagens com texto alternativo *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* Rótulos de formulário com entradas *}
<label for="email-input" class="form-field__label">
  Endereço de Email
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* Cabeçalhos em ordem *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ Em ordem *}
<h4></h4>                  {* ❌ Pula h3 *}

{* Use atributos aria quando necessário *}
<nav aria-label="Navegação principal">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  Menu
</button>
```

---

## Padrões Comuns

### Paginação

```smarty
{* Exibir paginação *}
<{if $paginator|default:false}>
  <nav class="pagination" aria-label="Paginação">
    <ul class="pagination__list">
      <{if $paginator.has_previous}>
        <li class="pagination__item">
          <a href="<{$paginator.first_url}>" class="pagination__link">Primeira</a>
        </li>
      <{/if}>

      <{foreach item=page from=$paginator.pages}>
        <li class="pagination__item">
          <{if $page.is_current}>
            <span class="pagination__link pagination__link--current" aria-current="page">
              <{$page.number}>
            </span>
          <{else}>
            <a href="<{$page.url}>" class="pagination__link">
              <{$page.number}>
            </a>
          <{/if}>
        </li>
      <{/foreach}>

      <{if $paginator.has_next}>
        <li class="pagination__item">
          <a href="<{$paginator.last_url}>" class="pagination__link">Última</a>
        </li>
      <{/if}>
    </ul>
  </nav>
<{/if}>
```

### Trilha de Navegação

```smarty
{* Exibir navegação de trilha *}
<nav class="breadcrumb" aria-label="Trilha">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="<{$xoops_url}>" class="breadcrumb__link">Início</a>
    </li>

    <{foreach item=crumb from=$breadcrumbs}>
      <li class="breadcrumb__item">
        <{if $crumb.url}>
          <a href="<{$crumb.url}>" class="breadcrumb__link">
            <{$crumb.title}>
          </a>
        <{else}>
          <span class="breadcrumb__current" aria-current="page">
            <{$crumb.title}>
          </span>
        <{/if}>
      </li>
    <{/foreach}>
  </ol>
</nav>
```

### Mensagens de Alerta

```smarty
{* Exibir mensagens *}
<{if $messages|default:false}>
  <{foreach item=message from=$messages}>
    <div class="alert alert--<{$message.type}>" role="alert">
      <{$message.text}>
    </div>
  <{/foreach}>
<{/if}>

{* Exibir erros *}
<{if $errors|default:false}>
  <div class="alert alert--danger" role="alert">
    <h2 class="alert__title">Erro</h2>
    <ul class="alert__list">
      <{foreach item=error from=$errors}>
        <li><{$error}></li>
      <{/foreach}>
    </ul>
  </div>
<{/if}>
```

---

## Performance

### Otimização de Template

```smarty
{* Atribuir variáveis uma vez, reutilizar *}
<{assign var=item_count value=$items|@count}>
<{if $item_count > 0}>
  <p>Encontrado <{$item_count}> itens</p>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{/if}>

{* Use {assign} para valores calculados *}
<{assign var=is_admin value=$xoops_isadmin}>
<{if $is_admin}>
  {* Opções de admin *}
<{/if}>
<{if $is_admin}>
  {* Reutilizar mesmo valor calculado *}
<{/if}>

{* Evite lógica complexa em templates *}
{* ❌ Cálculo complexo em template *}
<{$total = 0}>
<{foreach item=item from=$items}>
  <{$total = $total + $item.price * $item.quantity}>
<{/foreach}>
<p><{$total}></p>

{* ✅ Computar em PHP, exibir em template *}
<p><{$total}></p> {* Passado do controlador PHP *}
```

---

## Melhores Práticas

### Faça

- Use HTML5 semântico
- Inclua texto alternativo para imagens
- Use constantes de idioma para texto
- Escape saída (padrão)
- Mantenha lógica mínima
- Use nomes de variável significativos
- Inclua cabeçalhos de arquivo
- Use nomes de classe estilo BEM
- Teste com leitores de tela

### Não Faça

- Não misture lógica e apresentação
- Não esqueça texto alternativo
- Não use HTML bruto sem escapar
- Não crie variáveis globais em templates
- Não use recursos Smarty descontinuados
- Não aninhe templates muito profundamente
- Não ignore acessibilidade
- Não codifique texto (use constantes)

---

## Exemplos de Template

### Template de Módulo Completo

```smarty
{*
 * XOOPS Module - Publisher
 * @file Template de lista de itens
 * @author Equipe XOOPS
 * @copyright 2026 Projeto XOOPS
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
  </header>

  <{if $items|@count > 0}>
    <section class="items-list">
      <ul class="items-list__items">
        <{foreach item=item from=$items}>
          <li class="items-list__item item-card">
            <article class="item-card">
              <h2 class="item-card__title">
                <a href="<{$item.url}>" class="item-card__link">
                  <{$item.title}>
                </a>
              </h2>

              <div class="item-card__meta">
                <time class="item-card__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
                  <{$item.created|date_format:'%B %d, %Y'}>
                </time>
                <span class="item-card__author">
                  Por <{$item.author}>
                </span>
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>

    <{if $paginator|default:false}>
      <{include file="db:publisher_pagination.tpl"}>
    <{/if}>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```

---

## Documentação Relacionada

- Padrões JavaScript
- Diretrizes CSS
- Código de Conduta
- Padrões PHP

---

#xoops #smarty #templates #conventions #best-practices
