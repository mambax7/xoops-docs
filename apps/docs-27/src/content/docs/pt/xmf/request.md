---
title: "XMF Request"
description: 'Manipulação segura de requisições HTTP e validação de entrada com a classe Xmf\Request'
---

A classe `Xmf\Request` fornece acesso controlado a variáveis de requisição HTTP com sanitização integrada e conversão de tipo. Ela protege contra injeções potencialmente prejudiciais por padrão enquanto conforma entrada aos tipos especificados.

## Visão Geral

Manipulação de requisição é um dos aspectos mais críticos de segurança do desenvolvimento web. A classe XMF Request:

- Sanitiza automaticamente entrada para prevenir ataques XSS
- Fornece acessadores type-safe para tipos de dados comuns
- Suporta múltiplas fontes de requisição (GET, POST, COOKIE, etc.)
- Oferece manipulação consistente de valor padrão

## Uso Básico

```php
use Xmf\Request;

// Obter entrada string
$name = Request::getString('name', '');

// Obter entrada inteira
$id = Request::getInt('id', 0);

// Obter de fonte específica
$postData = Request::getString('data', '', 'POST');
```

## Métodos de Requisição

### getMethod()

Retorna o método de requisição HTTP para a requisição atual.

```php
$method = Request::getMethod();
// Retorna: 'GET', 'HEAD', 'POST', ou 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

O método principal que a maioria dos outros métodos `get*()` invocam. Obtém e retorna uma variável nomeada dos dados de requisição.

**Parâmetros:**
- `$name` - Nome da variável a obter
- `$default` - Valor padrão se variável não existir
- `$hash` - Hash de fonte: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, ou REQUEST (padrão)
- `$type` - Tipo de dados para limpeza (veja tipos FilterInput abaixo)
- `$mask` - Bitmask para opções de limpeza

**Valores de Mask:**

| Constante de Mask | Efeito |
|---------------|--------|
| `MASK_NO_TRIM` | Não aparar espaço em branco de início/fim |
| `MASK_ALLOW_RAW` | Pular limpeza, permitir entrada bruta |
| `MASK_ALLOW_HTML` | Permitir conjunto "seguro" limitado de marcação HTML |

```php
// Obter entrada bruta sem limpeza
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Permitir HTML seguro
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Métodos Type-Específicos

### getInt($name, $default, $hash)

Retorna um valor inteiro. Apenas dígitos são permitidos.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Retorna um valor float. Apenas dígitos e períodos permitidos.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Retorna um valor booleano.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Retorna uma string com apenas letras e underscores `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Retorna uma cadeia de comando com apenas `[A-Za-z0-9.-_]`, forçada para minúsculas.

```php
$op = Request::getCmd('op', 'list');
// Entrada "View_Item" torna-se "view_item"
```

### getString($name, $default, $hash, $mask)

Retorna uma cadeia limpa com código HTML ruim removido (a menos que sobrescrito por mask).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Permitir algum HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Retorna um array, processado recursivamente para remover XSS e código ruim.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Retorna texto bruto sem limpeza. Use com cuidado.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Retorna uma URL web validada (apenas esquemas relativos, http ou https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Retorna um caminho validado de sistema de arquivos ou web.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Retorna um endereço de email validado ou o padrão.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Retorna um endereço IPv4 ou IPv6 validado.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Retorna um valor de cabeçalho de requisição HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Métodos Utilitários

### hasVar($name, $hash)

Verificar se uma variável existe no hash especificado.

```php
if (Request::hasVar('submit', 'POST')) {
    // Formulário foi submetido
}

if (Request::hasVar('id', 'GET')) {
    // Parâmetro ID existe
}
```

### setVar($name, $value, $hash, $overwrite)

Definir uma variável no hash especificado. Retorna valor anterior ou null.

```php
// Definir um valor
$oldValue = Request::setVar('processed', true, 'POST');

// Apenas definir se ainda não existir
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Retorna cópia limpa de um array hash inteiro.

```php
// Obter todos os dados POST limpos
$postData = Request::get('POST');

// Obter todos os dados GET
$getData = Request::get('GET');

// Obter dados REQUEST sem aparagem
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Defina múltiplas variáveis de um array.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Não sobrescrever existentes
```

## Integração FilterInput

A classe Request usa `Xmf\FilterInput` para limpeza. Tipos de filtro disponíveis:

| Tipo | Descrição |
|------|-----------|
| ALPHANUM / ALNUM | Apenas alfanumérico |
| ARRAY | Limpar recursivamente cada elemento |
| BASE64 | Cadeia codificada em Base64 |
| BOOLEAN / BOOL | Verdadeiro ou falso |
| CMD | Comando - A-Z, 0-9, underscore, dash, período (minúscula) |
| EMAIL | Endereço de email válido |
| FLOAT / DOUBLE | Número de ponto flutuante |
| INTEGER / INT | Valor inteiro |
| IP | Endereço IP válido |
| PATH | Caminho de sistema de arquivos ou web |
| STRING | Cadeia geral (padrão) |
| USERNAME | Formato de nome de usuário |
| WEBURL | URL web |
| WORD | Apenas letras A-Z e underscore |

## Exemplos Práticos

### Processamento de Formulário

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validar submissão de formulário
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Título é obrigatório';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Por favor selecione uma categoria';
    }
}
```

### Manipulador AJAX

```php
use Xmf\Request;

// Verificar requisição AJAX
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Manipular delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Manipular update
            break;
    }
}
```

### Paginação

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validar intervalos
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Formulário de Busca

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Construir critério de busca
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Melhores Práticas de Segurança

1. **Sempre use métodos type-específicos** - Use `getInt()` para IDs, `getEmail()` para emails, etc.

2. **Forneça padrões sensatos** - Nunca assuma que entrada existe

3. **Valide após sanitização** - Sanitização remove dados ruins, validação garante dados corretos

4. **Use hash apropriado** - Especifique POST para dados de formulário, GET para parâmetros de query

5. **Evite entrada bruta** - Use apenas `getText()` ou `MASK_ALLOW_RAW` quando absolutamente necessário

```php
// Bom - type-specific com padrão
$id = Request::getInt('id', 0);

// Ruim - usando getString para dados numéricos
$id = (int) Request::getString('id', '0');
```

## Veja Também

- Getting-Started-with-XMF - Conceitos básicos de XMF
- XMF-Module-Helper - Classe module helper
- ../XMF-Framework - Visão geral do framework

---

#xmf #request #security #input-validation #sanitization
