---
title: "Boas Práticas de Desenvolvimento de Módulo"
---

## Visão Geral

Este documento consolida as melhores práticas para desenvolver módulos XOOPS de alta qualidade. Seguir essas diretrizes garante módulos manteníveis, seguros e eficazes em relação ao desempenho.

## Arquitetura

### Seguir Arquitetura Limpa

Organize código em camadas:

```
src/
├── Domain/          # Lógica de negócios, entidades
├── Application/     # Casos de uso, serviços
├── Infrastructure/  # Banco de dados, serviços externos
└── Presentation/    # Controllers, templates
```

### Responsabilidade Única

Cada classe deve ter um motivo para mudar:

```php
// Bom: Classes focadas
class ArticleRepository { /* apenas persistência */ }
class ArticleValidator { /* apenas validação */ }
class ArticleNotifier { /* apenas notificações */ }

// Ruim: Classe Deus
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### Injeção de Dependência

Injete dependências, não as crie:

```php
// Bom
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Ruim
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Qualidade de Código

### Segurança de Tipo

Use tipos rigorosos e declarações de tipo:

```php
<?php

declare(strict_types=1);

final class ArticleService
{
    public function findById(int $id): ?Article
    {
        // ...
    }

    public function create(CreateArticleDTO $dto): Article
    {
        // ...
    }
}
```

### Tratamento de Erros

Use exceções apropriadamente:

```php
// Lançar exceções específicas
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Não pode editar este artigo');

// Capturar no nível apropriado
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Segurança Nula

Evite nulo quando possível:

```php
// Usar padrão de objeto nulo
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Usar padrão Optional/Maybe
public function findById(int $id): ?Article
{
    // Retorno claramente anulável
}
```

## Banco de Dados

### Usar Criteria para Consultas

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Escapar Entrada do Usuário

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Usar Transações

```php
$db->query('START TRANSACTION');

try {
    $handler->insert($article);
    $handler->insert($metadata);
    $db->query('COMMIT');
} catch (\Exception $e) {
    $db->query('ROLLBACK');
    throw $e;
}
```

## Segurança

### Sempre Validar Entrada

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Validação adicional
if (strlen($title) < 5) {
    throw new ValidationException('Título muito curto');
}
```

### Usar Tokens CSRF

```php
// Em formulário
$form->addElement(new XoopsFormHiddenToken());

// Ao enviar
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Token inválido');
}
```

### Verificar Permissões

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Desempenho

### Usar Cache

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Otimizar Consultas

```php
// Usar índices
// Adicionar a sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Selecionar apenas colunas necessárias
$handler->getObjects($criteria, false, true); // asArray = true

// Usar paginação
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Testes

### Escrever Testes Unitários

```php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('Título', 'Conteúdo');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```

## Documentação Relacionada

- Código-Limpo - Princípios de código limpo
- Organização-de-Código - Estrutura do projeto
- Testes - Guia de testes
- ../02-Conceitos-Principais/Segurança/Boas-Práticas-de-Segurança - Guia de segurança
