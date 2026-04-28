---
title: "Classe XoopsObject"
description: "Classe base para todos os objetos de dados no sistema XOOPS, fornecendo gerenciamento de propriedades, validação e serialização"
---

A classe `XoopsObject` é a classe base fundamental para todos os objetos de dados no sistema XOOPS. Ela fornece uma interface padronizada para gerenciar propriedades de objetos, validação, rastreamento de alterações e serialização.

## Visão Geral da Classe

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Hierarquia de Classes

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Objetos de Módulo Personalizados]
```

## Propriedades

| Propriedade | Tipo | Visibilidade | Descrição |
|----------|------|------------|-------------|
| `$vars` | array | protegida | Armazena definições e valores de variáveis |
| `$cleanVars` | array | protegida | Armazena valores sanitizados para operações de banco de dados |
| `$isNew` | bool | protegida | Indica se o objeto é novo (ainda não no banco de dados) |
| `$errors` | array | protegida | Armazena validação e mensagens de erro |

## Construtor

```php
public function __construct()
```

Cria uma nova instância de XoopsObject. O objeto é marcado como novo por padrão.

**Exemplo:**
```php
$object = new XoopsObject();
// Objeto é novo e não tem variáveis definidas
```

## Métodos Principais

### initVar

Inicializa uma definição de variável para o objeto.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$key` | string | Nome da variável |
| `$dataType` | int | Constante de tipo de dados (veja Tipos de Dados) |
| `$value` | mixed | Valor padrão |
| `$required` | bool | Se o campo é obrigatório |
| `$maxlength` | int | Comprimento máximo para tipos de string |
| `$options` | string | Opções adicionais |

**Tipos de Dados:**

| Constante | Valor | Descrição |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Entrada de caixa de texto |
| `XOBJ_DTYPE_TXTAREA` | 2 | Conteúdo de textarea |
| `XOBJ_DTYPE_INT` | 3 | Valor inteiro |
| `XOBJ_DTYPE_URL` | 4 | String de URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Endereço de email |
| `XOBJ_DTYPE_ARRAY` | 6 | Array serializado |
| `XOBJ_DTYPE_OTHER` | 7 | Tipo personalizado |
| `XOBJ_DTYPE_SOURCE` | 8 | Código-fonte |
| `XOBJ_DTYPE_STIME` | 9 | Formato de hora curta |
| `XOBJ_DTYPE_MTIME` | 10 | Formato de hora média |
| `XOBJ_DTYPE_LTIME` | 11 | Formato de hora longa |
| `XOBJ_DTYPE_FLOAT` | 12 | Ponto flutuante |
| `XOBJ_DTYPE_DECIMAL` | 13 | Número decimal |
| `XOBJ_DTYPE_ENUM` | 14 | Enumeração |

**Exemplo:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

Define o valor de uma variável.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$key` | string | Nome da variável |
| `$value` | mixed | Valor a definir |
| `$notGpc` | bool | Se verdadeiro, o valor não é de GET/POST/COOKIE |

**Retorna:** `bool` - Verdadeiro se bem-sucedido, falso caso contrário

**Exemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Não é da entrada do usuário
$object->setVar('status', 1);
```

---

### getVar

Recupera o valor de uma variável com formatação opcional.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$key` | string | Nome da variável |
| `$format` | string | Formato de saída |

**Opções de Formato:**

| Formato | Descrição |
|--------|-------------|
| `'s'` | Mostrar - Entidades HTML escapadas para exibição |
| `'e'` | Editar - Para valores de entrada de formulário |
| `'p'` | Visualizar - Semelhante a mostrar |
| `'f'` | Dados do formulário - Bruto para processamento de formulário |
| `'n'` | Nenhum - Valor bruto, sem formatação |

**Retorna:** `mixed` - O valor formatado

**Exemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (para valor de entrada)
echo $object->getVar('title', 'n'); // "Hello <World>" (bruto)

// Para tipos de dados de array
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Retorna array
```

---

### setVars

Define múltiplas variáveis de uma vez a partir de um array.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$values` | array | Array associativo de pares chave => valor |
| `$notGpc` | bool | Se verdadeiro, os valores não são de GET/POST/COOKIE |

**Exemplo:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// Do banco de dados (não é entrada do usuário)
$object->setVars($row, true);
```

---

### getValues

Recupera todos os valores das variáveis.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$keys` | array | Chaves específicas a recuperar (null para todas) |
| `$format` | string | Formato de saída |
| `$maxDepth` | int | Profundidade máxima para objetos aninhados |

**Retorna:** `array` - Array associativo de valores

**Exemplo:**
```php
$object = new MyObject();

// Obter todos os valores
$allValues = $object->getValues();

// Obter valores específicos
$subset = $object->getValues(['title', 'status']);

// Obter valores brutos para o banco de dados
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Atribui um valor diretamente sem validação (usar com cuidado).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$key` | string | Nome da variável |
| `$value` | mixed | Valor a atribuir |

**Exemplo:**
```php
// Atribuição direta de fonte confiável (ex: banco de dados)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Sanitiza todas as variáveis para operações de banco de dados.

```php
public function cleanVars(): bool
```

**Retorna:** `bool` - Verdadeiro se todas as variáveis são válidas

**Exemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // As variáveis estão sanitizadas e prontas para o banco de dados
    $cleanData = $object->cleanVars;
} else {
    // Erros de validação ocorreram
    $errors = $object->getErrors();
}
```

---

### isNew

Verifica ou define se o objeto é novo.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Exemplo:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Métodos de Tratamento de Erros

### setErrors

Adiciona uma mensagem de erro.

```php
public function setErrors(string|array $error): void
```

**Exemplo:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Recupera todas as mensagens de erro.

```php
public function getErrors(): array
```

**Exemplo:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Retorna erros formatados como HTML.

```php
public function getHtmlErrors(): string
```

**Exemplo:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Métodos Utilitários

### toArray

Converte o objeto em um array.

```php
public function toArray(): array
```

**Exemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Retorna as definições de variáveis.

```php
public function getVars(): array
```

**Exemplo:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Exemplo Completo de Uso

```php
<?php
/**
 * Objeto de Artigo Personalizado
 */
class Article extends XoopsObject
{
    /**
     * Construtor - Inicializar todas as variáveis
     */
    public function __construct()
    {
        parent::__construct();

        // Chave primária
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Campos obrigatórios
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Campos opcionais
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Flags de status
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadados como array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Obter data de criação formatada
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Verificar se o artigo está publicado
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Incrementar contador de visualizações
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Validação personalizada
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Validação de título
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Validação de autor
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Uso
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Salvar no banco de dados via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Melhores Práticas

1. **Sempre Inicializar Variáveis**: Defina todas as variáveis no construtor usando `initVar()`

2. **Use Tipos de Dados Apropriados**: Escolha a constante `XOBJ_DTYPE_*` correta para validação

3. **Manipule Entrada do Usuário com Cuidado**: Use `setVar()` com `$notGpc = false` para entrada do usuário

4. **Valide Antes de Salvar**: Sempre chame `cleanVars()` antes de operações de banco de dados

5. **Use Parâmetros de Formato**: Use o formato apropriado em `getVar()` para o contexto

6. **Estenda para Lógica Personalizada**: Adicione métodos específicos de domínio em subclasses

## Documentação Relacionada

- XoopsObjectHandler - Padrão de handler para persistência de objeto
- ../Database/Criteria - Construção de consultas com Criteria
- ../Database/XoopsDatabase - Operações de banco de dados

---

*Veja também: [Código-Fonte do XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
