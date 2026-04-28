---
title: "Sanitização de Entrada"
description: "Usando MyTextSanitizer e técnicas de validação no XOOPS"
---

Nunca confie em entrada do usuário. Sempre valide e sanitize todos os dados de entrada antes de usá-los. XOOPS fornece a classe `MyTextSanitizer` para sanitizar entrada de texto e várias funções auxiliares para validação.

## Documentação Relacionada

- Security-Best-Practices - Guia abrangente de segurança
- CSRF-Protection - Sistema de token e classe XoopsSecurity
- SQL-Injection-Prevention - Práticas de segurança de banco de dados

## A Regra de Ouro

**Nunca confie em entrada do usuário.** Todos os dados de fontes externas devem ser:

1. **Validados**: Verificar se corresponde ao formato e tipo esperados
2. **Sanitizados**: Remover ou escapar caracteres potencialmente perigosos
3. **Escapados**: Ao exibir, escapar para o contexto específico (HTML, JavaScript, SQL)

## Classe MyTextSanitizer

XOOPS fornece a classe `MyTextSanitizer` (comumente aliasada como `$myts`) para sanitização de texto.

### Obtendo a Instância

```php
// Obter a instância singleton
$myts = MyTextSanitizer::getInstance();
```

### Sanitização Básica de Texto

```php
$myts = MyTextSanitizer::getInstance();

// Para campos de texto simples (sem HTML permitido)
$title = $myts->htmlSpecialChars($_POST['title']);

// Isto converte:
// < para &lt;
// > para &gt;
// & para &amp;
// " para &quot;
// ' para &#039;
```

### Processamento de Conteúdo de Textarea

O método `displayTarea()` fornece processamento abrangente de textarea:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = Sem HTML permitido, 1 = HTML permitido
    $allowsmiley = 1,    // 1 = Smilies ativados
    $allowxcode = 1,     // 1 = Códigos XOOPS ativados (BBCode)
    $allowimages = 1,    // 1 = Imagens permitidas
    $allowlinebreak = 1  // 1 = Quebras de linha convertidas para <br>
);
```

### Métodos de Sanitização Comum

```php
$myts = MyTextSanitizer::getInstance();

// Escape de caracteres especiais HTML
$safe_text = $myts->htmlSpecialChars($text);

// Remover barras invertidas se magic quotes estiverem ativadas
$text = $myts->stripSlashesGPC($text);

// Converter códigos XOOPS (BBCode) para HTML
$html = $myts->xoopsCodeDecode($text);

// Converter smileys para imagens
$html = $myts->smiley($text);

// Tornar links clicáveis
$html = $myts->makeClickable($text);

// Processamento completo de texto para visualização
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Validação de Entrada

### Validando Valores Inteiros

```php
// Validar ID inteiro
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'ID inválido');
    exit();
}

// Alternativa com filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'ID inválido');
    exit();
}
```

### Validando Endereços de Email

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Endereço de email inválido');
    exit();
}
```

### Validando URLs

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'URL inválida');
    exit();
}

// Verificação adicional para protocolos permitidos
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Apenas URLs HTTP e HTTPS são permitidas');
    exit();
}
```

### Validando Datas

```php
$date = $_POST['date'] ?? '';

// Validar formato de data (AAAA-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Formato de data inválido');
    exit();
}

// Validar validade de data real
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Data inválida');
    exit();
}
```

### Validando Nomes de Arquivo

```php
// Remover todos os caracteres exceto alfanuméricos, sublinhado e hífen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Ou usar abordagem de whitelist
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Lidando com Diferentes Tipos de Entrada

### Entrada de String

```php
$myts = MyTextSanitizer::getInstance();

// Texto curto (títulos, nomes)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limitar comprimento
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Verificar campos obrigatórios vazios
if (empty($title)) {
    redirect_header('form.php', 3, 'Título é obrigatório');
    exit();
}
```

### Entrada Numérica

```php
// Inteiro
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Garantir intervalo 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Arredondar para 2 casas decimais

// Validar intervalo
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Preço inválido');
    exit();
}
```

### Entrada Booleana

```php
// Valores de checkbox
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Ou com verificação de valor explícita
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Entrada de Array

```php
// Validar entrada de array (por ex., múltiplos checkboxes)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### Entrada de Seleção/Opção

```php
// Validar contra valores permitidos
$allowed_statuses = ['draft', 'publicado', 'arquivado'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Status inválido');
    exit();
}
```

## Objeto Request (XMF)

Ao usar XMF, a classe Request fornece manipulação de entrada mais limpa:

```php
use Xmf\Request;

// Obter inteiro
$id = Request::getInt('id', 0);

// Obter string
$title = Request::getString('title', '');

// Obter array
$ids = Request::getArray('ids', []);

// Obter com especificação de método
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Verificar método de requisição
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Método de requisição inválido');
    exit();
}
```

## Criando uma Classe de Validação

Para formulários complexos, crie uma classe de validação dedicada:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Validação de título
        if (empty($data['title'])) {
            $this->errors['title'] = 'Título é obrigatório';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Título deve ter 255 caracteres ou menos';
        }

        // Validação de email
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Formato de email inválido';
            }
        }

        // Validação de status
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Status inválido';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Uso:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Exibir erros para o usuário
}
```

## Sanitizando para Armazenamento em Banco de Dados

Ao armazenar dados no banco de dados:

```php
$myts = MyTextSanitizer::getInstance();

// Para armazenamento (será processado novamente na exibição)
$title = $myts->addSlashes($_POST['title']);

// Melhor: Usar prepared statements (veja Prevenção de Injeção de SQL)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Sanitizando para Exibição

Diferentes contextos exigem diferentes escapos:

```php
$myts = MyTextSanitizer::getInstance();

// Contexto HTML
echo $myts->htmlSpecialChars($title);

// Dentro de atributos HTML
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// Contexto JavaScript
echo json_encode($title);

// Parâmetro de URL
echo urlencode($title);

// URL completa
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Armadilhas Comuns

### Codificação Dupla

**Problema**: Dados são codificados várias vezes

```php
// Errado - codificação dupla
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Certo - codificar uma vez, no momento apropriado
$title = $_POST['title']; // Armazenar bruto
echo $myts->htmlSpecialChars($title); // Codificar na saída
```

### Codificação Inconsistente

**Problema**: Algumas saídas são codificadas, outras não

**Solução**: Sempre usar uma abordagem consistente, preferencialmente codificando na saída:

```php
// Atribuição de template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Validação Ausente

**Problema**: Apenas sanitizar sem validar

**Solução**: Sempre validar primeiro, depois sanitizar:

```php
// Primeiro validar
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Nome de usuário contém caracteres inválidos');
    exit();
}

// Então sanitizar para armazenamento/exibição
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Resumo de Boas Práticas

1. **Usar MyTextSanitizer** para processamento de conteúdo de texto
2. **Usar filter_var()** para validação de formato específico
3. **Usar conversão de tipo** para valores numéricos
4. **Whitelist valores permitidos** para entradas de seleção
5. **Validar antes de sanitizar**
6. **Escapar na saída**, não na entrada
7. **Usar prepared statements** para consultas de banco de dados
8. **Criar classes de validação** para formulários complexos
9. **Nunca confiar em validação do lado do cliente** - sempre validar no servidor

---

#segurança #sanitização #validação #xoops #MyTextSanitizer #manipulação-entrada
