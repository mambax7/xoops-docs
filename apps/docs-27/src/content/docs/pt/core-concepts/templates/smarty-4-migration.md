---
title: "Migração Smarty 4"
description: "Guia para atualizar templates XOOPS de Smarty 3 para Smarty 4"
---

Este guia cobre as mudanças e etapas de migração necessárias ao atualizar de Smarty 3 para Smarty 4 no XOOPS. Entender essas diferenças é essencial para manter compatibilidade com instalações XOOPS modernas.

## Documentação Relacionada

- Smarty-Basics - Fundamentos do Smarty no XOOPS
- Theme-Development - Criando temas XOOPS
- Template-Variables - Variáveis disponíveis em templates

## Visão Geral das Mudanças

Smarty 4 introduziu várias mudanças de ruptura do Smarty 3:

1. Comportamento de atribuição de variável mudou
2. Tags `{php}` completamente removidas
3. Mudanças na API de cache
4. Atualizações no tratamento de modificadores
5. Mudanças na política de segurança
6. Recursos deprecados removidos

## Mudanças de Acesso a Variável

### O Problema

Em Smarty 2/3, valores atribuídos eram diretamente acessíveis:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - funcionava bem *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Em Smarty 4, variáveis são envoltas em objetos `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Solução 1: Acessar Propriedade de Valor

```smarty
{* Smarty 4 - acessar propriedade de valor *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Solução 2: Modo de Compatibilidade

Ativar modo de compatibilidade em PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Isto permite acesso direto à variável como Smarty 3.

### Solução 3: Verificação de Versão Condicional

Escrever templates que funcionem em ambas as versões:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Solução 4: Função Wrapper

Criar uma função auxiliar para atribuições:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - atribuir normalmente, acessar via ->value em templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - atribuição padrão
        $smarty->assign($name, $value);
    }
}
```

## Removendo Tags {php}

### O Problema

Smarty 3+ não suporta tags `{php}` por razões de segurança:

```smarty
{* Isto NÃO FUNCIONA MAIS em Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Solução: Usar Variáveis Smarty

```smarty
{* Usar acesso à variável integrado do Smarty *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Solução: Mover Lógica para PHP

Lógica complexa deve estar em PHP, não em templates:

```php
// Em PHP - fazer o processamento
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Atribuir dados processados ao template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* Em template - apenas exibir *}
<h2><{$category.name}></h2>
```

### Solução: Plugins Personalizados

Para funcionalidade reutilizável, criar plugins Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* Em template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Mudanças de Cache

### Cache Smarty 3

```php
// Estilo Smarty 3
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Nocache por variável
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Cache Smarty 4

```php
// Estilo Smarty 4
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Ou usando propriedades (ainda funciona)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Constantes de Cache

```php
// Modos de cache
Smarty::CACHING_OFF                  // Sem cache
Smarty::CACHING_LIFETIME_CURRENT     // Usar cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Usar lifetime em cache
```

### Nocache em Templates

```smarty
{* Marcar conteúdo como nunca cacheado *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Mudanças de Modificador

### Modificadores de String

Alguns modificadores foram renomeados ou descontinuados:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - usar 'html' em vez disso *}
<{$text|escape:'html'}>
```

### Modificadores de Array

Modificadores de array requerem prefixo `@`:

```smarty
{* Contar elementos de array *}
<{$items|@count}> items

{* Unir array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Modificadores Personalizados

Modificadores personalizados devem ser registrados:

```php
// Registrar um modificador personalizado
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Processar e retornar
    return processed_string($string, $param1);
}
```

## Mudanças na Política de Segurança

### Segurança Smarty 4

Smarty 4 tem segurança padrão mais rigorosa:

```php
// Configurar política de segurança
$smarty->enableSecurity('Smarty_Security');

// Ou criar política personalizada
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Funções Permitidas

Por padrão, Smarty 4 restringe quais funções PHP podem ser usadas:

```smarty
{* Estas podem ser restritas *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Configurar funções permitidas se necessário:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Atualizações de Herança de Template

### Sintaxe de Bloco

A sintaxe de bloco permanece similar mas com algumas mudanças:

```smarty
{* Template pai *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Template filho *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Incluir conteúdo do bloco pai *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### Append e Prepend

```smarty
{block name=head append}
    {* Isto é adicionado após conteúdo pai *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* Isto é adicionado antes do conteúdo pai *}
    <script src="early.js"></script>
{/block}
```

## Recursos Deprecados

### Removidos em Smarty 4

| Recurso | Alternativa |
|---------|-------------|
| Tags `{php}` | Mover lógica para PHP ou usar plugins |
| `{include_php}` | Usar plugins registrados |
| `$smarty.capture` | Ainda funciona mas deprecado |
| `{strip}` com espaços | Usar ferramentas de minificação |

### Usar Alternativas

```smarty
{* Em vez de {php} *}
{* Mover para PHP e atribuir resultado *}

{* Em vez de include_php *}
<{include file="db:mytemplate.tpl"}>

{* Em vez de capture (ainda funciona mas considere) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Lista de Verificação de Migração

### Antes da Migração

1. [ ] Fazer backup de todos os templates
2. [ ] Listar todo uso de tag `{php}`
3. [ ] Documentar plugins personalizados
4. [ ] Testar funcionalidade atual

### Durante a Migração

1. [ ] Remover todas as tags `{php}`
2. [ ] Atualizar sintaxe de acesso a variáveis
3. [ ] Verificar uso de modificadores
4. [ ] Atualizar configuração de cache
5. [ ] Revisar configurações de segurança

### Após Migração

1. [ ] Testar todos os templates
2. [ ] Verificar se todos os formulários funcionam
3. [ ] Verificar se cache funciona
4. [ ] Testar com diferentes funções de usuário

## Testando Compatibilidade

### Detecção de Versão

```php
// Verificar versão Smarty em PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Código específico Smarty 4+
} else {
    // Código Smarty 3
}
```

### Verificação de Versão de Template

```smarty
{* Verificar versão em template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Código de template Smarty 4+ *}
<{else}>
    {* Código de template Smarty 3 *}
<{/if}>
```

## Escrevendo Templates Compatíveis com Cruzada

### Boas Práticas

1. **Evitar tags `{php}` inteiramente** - Elas não funcionam em Smarty 3+

2. **Manter templates simples** - Lógica complexa pertence a PHP

3. **Usar modificadores padrão** - Evitar os descontinuados

4. **Testar em ambas as versões** - Se você precisa suportar ambas

5. **Usar plugins para operações complexas** - Mais manutenível

### Exemplo: Template Compatível com Cruzada

```smarty
{* Funciona em Smarty 3 e 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## Problemas Comuns de Migração

### Problema: Variáveis Retornam Vazias

**Problema**: `<{$mod_url}>` retorna nada em Smarty 4

**Solução**: Usar `<{$mod_url->value}>` ou ativar modo de compatibilidade

### Problema: Erros de Tag PHP

**Problema**: Template lança erro em tags `{php}`

**Solução**: Remover todas as tags PHP e mover lógica para arquivos PHP

### Problema: Modificador Não Encontrado

**Problema**: Modificador personalizado lança erro "unknown modifier"

**Solução**: Registrar o modificador com `registerPlugin()`

### Problema: Restrição de Segurança

**Problema**: Função não permitida em template

**Solução**: Adicionar função à lista de permissões da política de segurança

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility
