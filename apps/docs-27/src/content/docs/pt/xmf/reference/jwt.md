---
title: "JWT - JSON Web Tokens"
description: "Implementação XMF JWT para autenticação baseada em token segura e proteção AJAX"
---

O namespace `Xmf\Jwt` fornece suporte a JSON Web Token (JWT) para módulos XOOPS. JWTs permitem autenticação segura e stateless e são particularmente úteis para proteger requisições AJAX.

## O que são JSON Web Tokens?

JSON Web Tokens são uma forma padrão de publicar um conjunto de *claims* (dados) como uma cadeia de texto, com verificação criptográfica que os claims não foram adulterados. Para especificações detalhadas, veja:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Características Principais

- **Assinado**: Tokens são assinados criptograficamente para detectar adulteração
- **Auto-contido**: Todas as informações necessárias estão no token em si
- **Stateless**: Nenhum armazenamento de sessão server-side necessário
- **Expirável**: Tokens podem incluir tempos de expiração

> **Nota:** JWTs são assinados, não criptografados. Os dados são codificados em Base64 e visíveis. Use JWTs para verificação de integridade, não para ocultar dados sensíveis.

## Por Que Usar JWT em XOOPS?

### O Problema do Token AJAX

Formulários XOOPS usam tokens nonce para proteção CSRF. Porém, nonces funcionam mal com AJAX porque:

1. **Uso Único**: Nonces tipicamente são válidos para uma submissão
2. **Problemas Assíncronos**: Múltiplas requisições AJAX podem chegar fora de ordem
3. **Complexidade de Atualização**: Sem forma confiável de atualizar tokens assincronamente
4. **Binding de Contexto**: Tokens padrão não verificam qual script os emitiu

### Vantagens JWT

JWTs resolvem estes problemas ao:

- Incluir tempo de expiração (claim `exp`) para validade limitada de tempo
- Suportar claims customizados para vincular tokens a scripts específicos
- Permitir múltiplas requisições dentro do período de validade
- Fornecer verificação criptográfica da origem do token

## Classes Principais

### JsonWebToken

A classe `Xmf\Jwt\JsonWebToken` manipula criação e decodificação de token.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Criar uma chave
$key = KeyFactory::build('my_application_key');

// Criar instância JsonWebToken
$jwt = new JsonWebToken($key, 'HS256');

// Criar um token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expira em 300 segundos

// Decodificar e verificar um token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### Métodos

**`new JsonWebToken($key, $algorithm)`**

Cria novo manipulador JWT.
- `$key`: Um objeto `Xmf\Key\KeyAbstract`
- `$algorithm`: Algoritmo de assinatura (padrão: 'HS256')

**`create($payload, $expirationOffset)`**

Cria cadeia de token assinado.
- `$payload`: Array de claims
- `$expirationOffset`: Segundos até expiração (opcional)

**`decode($jwtString, $assertClaims)`**

Decodifica e valida um token.
- `$jwtString`: O token a decodificar
- `$assertClaims`: Claims a verificar (array vazio para nenhum)
- Retorna: stdClass payload ou false se inválido

**`setAlgorithm($algorithm)`**

Muda o algoritmo de assinatura/verificação.

### TokenFactory

O `Xmf\Jwt\TokenFactory` fornece uma forma conveniente de criar tokens.

```php
use Xmf\Jwt\TokenFactory;

// Criar token com manipulação automática de chave
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token expira em 120 segundos
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: Cadeia de nome de chave ou objeto KeyAbstract
- `$payload`: Array de claims
- `$expirationOffset`: Expiração em segundos

Lança exceções em falha: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

A classe `Xmf\Jwt\TokenReader` simplifica leitura de tokens de várias fontes.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// De uma cadeia
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// De um cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// De um parâmetro de requisição
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// Do cabeçalho de Autorização (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Todos os métodos retornam payload como `stdClass` ou `false` se inválido.

### KeyFactory

O `Xmf\Jwt\KeyFactory` cria e gerencia chaves criptográficas.

```php
use Xmf\Jwt\KeyFactory;

// Construir uma chave (cria se não existir)
$key = KeyFactory::build('my_application_key');

// Com armazenamento customizado
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Chaves são armazenadas persistentemente. O armazenamento padrão usa o sistema de arquivos.

## Exemplo de Proteção AJAX

Aqui está um exemplo completo demonstrando AJAX protegido por JWT.

### Script de Página (Gera Token)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Claims a incluir e verificar
$assertClaims = ['aud' => basename(__FILE__)];

// Verificar se isto é uma requisição AJAX
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Manipular requisição AJAX
    $GLOBALS['xoopsLogger']->activated = false;

    // Verificar token do cabeçalho de Autorização
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Token é válido - processar a requisição
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Sua lógica AJAX aqui
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Requisição de página normal - gerar token e exibir página
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Criar token com claims
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token válido por 2 minutos
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript para chamadas AJAX
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Atualizar UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Melhores Práticas

### Expiração de Token

Defina tempos de expiração apropriados baseado em caso de uso:

```php
// Curta duração para operações sensíveis (2 minutos)
$token = TokenFactory::build('key', $claims, 120);

// Mais tempo para interações de página geral (30 minutos)
$token = TokenFactory::build('key', $claims, 1800);
```

### Verificação de Claim

Sempre verifique o claim `aud` (audience) para garantir tokens são usados com o script pretendido:

```php
// Ao criar
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// Ao verificar
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Nomeação de Chave

Use nomes de chave descritivos para propósitos diferentes:

```php
// Chaves separadas para diferentes recursos
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Manipulação de Erro

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Algoritmo inválido
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Argumento inválido
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Valor inesperado
    error_log('JWT Error: ' . $e->getMessage());
}

// Ler tokens retorna false em falha (sem exceção)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token inválido, expirado ou adulterado
}
```

## Métodos de Transporte de Token

### Cabeçalho de Autorização (Recomendado)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Cookie

```php
// Definir cookie com token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Ler de cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Parâmetro de Requisição

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Considerações de Segurança

1. **Use HTTPS**: Sempre use HTTPS para prevenir interceptação de token
2. **Expiração Curta**: Use o tempo de expiração mais curto praticável
3. **Claims Específicos**: Inclua claims que vinculem tokens a contextos específicos
4. **Validação Server-Side**: Sempre valide tokens server-side
5. **Não Armazene Dados Sensíveis**: Lembre que tokens são legíveis (não criptografados)

## Referência da API

### Xmf\Jwt\JsonWebToken

| Método | Descrição |
|--------|-----------|
| `__construct($key, $algorithm)` | Criar manipulador JWT |
| `setAlgorithm($algorithm)` | Definir algoritmo de assinatura |
| `create($payload, $expiration)` | Criar token assinado |
| `decode($token, $assertClaims)` | Decodificar e verificar token |

### Xmf\Jwt\TokenFactory

| Método | Descrição |
|--------|-----------|
| `build($key, $payload, $expiration)` | Criar cadeia de token |

### Xmf\Jwt\TokenReader

| Método | Descrição |
|--------|-----------|
| `fromString($key, $token, $claims)` | Decodificar de cadeia |
| `fromCookie($key, $name, $claims)` | Decodificar de cookie |
| `fromRequest($key, $name, $claims)` | Decodificar de requisição |
| `fromHeader($key, $claims, $header)` | Decodificar de cabeçalho |

### Xmf\Jwt\KeyFactory

| Método | Descrição |
|--------|-----------|
| `build($name, $storage)` | Obter ou criar chave |

## Veja Também

- ../Basics/XMF-Request - Manipulação de requisições
- ../XMF-Framework - Visão geral do framework
- Database - Utilitários de banco de dados

---

#xmf #jwt #security #ajax #authentication #tokens
