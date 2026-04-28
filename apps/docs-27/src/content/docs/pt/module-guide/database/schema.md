---
title: "Design de Esquema de Banco de Dados"
---

## Visão Geral

O design adequado de esquema de banco de dados é crucial para o desempenho e manutenibilidade do módulo XOOPS. Este guia cobre as melhores práticas para design de tabelas, relacionamentos, indexação e migrações.

## Convenções de Nomenclatura de Tabelas

### Formato Padrão

```
{prefix}_{modulename}_{tablename}
```

Exemplos:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (tabela de junção)

### Em Arquivos de Esquema

Use espaço reservado `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Tipos de Coluna

### Tipos Recomendados

| Dado | Tipo MySQL | Tipo PHP | Descrição |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Identificadores ULID |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | IDs sequenciais |
| Texto Curto | `VARCHAR(n)` | `string` | Até 255 caracteres |
| Texto Longo | `TEXT` | `string` | Texto ilimitado |
| Texto Rico | `MEDIUMTEXT` | `string` | Conteúdo HTML |
| Booleano | `TINYINT(1)` | `bool` | Verdadeiro/falso |
| Enum | `ENUM(...)` | `string` | Opções fixas |
| Data | `DATE` | `DateTimeImmutable` | Apenas data |
| DateTime | `DATETIME` | `DateTimeImmutable` | Data e hora |
| Timestamp | `INT UNSIGNED` | `int` | Timestamp Unix |
| Preço | `DECIMAL(10,2)` | `float` | Valores monetários |
| JSON | `JSON` | `array` | Dados estruturados |

### Exemplo de Esquema de Entidade

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) NOT NULL COMMENT 'ULID identifier',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` MEDIUMTEXT,
    `summary` TEXT,
    `status` ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED,
    `views` INT UNSIGNED DEFAULT 0,
    `is_featured` TINYINT(1) DEFAULT 0,
    `published_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_slug` (`slug`),
    KEY `idx_status` (`status`),
    KEY `idx_author` (`author_id`),
    KEY `idx_category` (`category_id`),
    KEY `idx_published` (`published_at`),
    KEY `idx_featured` (`is_featured`, `published_at`),

    CONSTRAINT `fk_article_author`
        FOREIGN KEY (`author_id`) REFERENCES `{PREFIX}_users` (`uid`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_article_category`
        FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Relacionamentos

### Um-para-Muitos

```sql
-- Categorias (um)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- Artigos (muitos)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

### Muitos-para-Muitos

```sql
-- Artigos
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- Tags
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- Tabela de junção
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

### Auto-Referenciada (Hierarquia)

```sql
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(1000) COMMENT 'Materialized path: /1/5/12/',
    `depth` TINYINT UNSIGNED DEFAULT 0,

    KEY `idx_parent` (`parent_id`),
    KEY `idx_path` (`path`(255)),

    FOREIGN KEY (`parent_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL
);
```

## Estratégia de Indexação

### Quando Indexar

| Cenário | Tipo de Índice |
|----------|-----------|
| Chave primária | PRIMARY |
| Restrição única | UNIQUE |
| Chave estrangeira | Regular KEY |
| Coluna em cláusula WHERE | Regular KEY |
| Coluna em ORDER BY | Regular KEY |
| Busca de texto completo | FULLTEXT |

### Índices Compostos

A ordem importa - coluna mais seletiva primeiro:

```sql
-- Bom: combina WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Otimização de consulta
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Índices de Cobertura

Inclua todas as colunas consultadas para evitar busca em tabela:

```sql
-- Cobre: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrações

### Estrutura de Arquivo de Migração

```php
// migrations/001_create_articles.php
<?php

return new class {
    public function up(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');

        $sql = "CREATE TABLE IF NOT EXISTS `{$prefix}` (
            `id` VARCHAR(26) NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `created_at` DATETIME NOT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');
        $db->queryF("DROP TABLE IF EXISTS `{$prefix}`");
    }
};
```

### Adicionando Colunas

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Melhores Práticas

1. **Use InnoDB** - Suporta transações e chaves estrangeiras
2. **UTF8MB4** - Suporte Unicode completo incluindo emojis
3. **NOT NULL** - Use padrões ao invés de colunas anuláveis quando possível
4. **Tipos Apropriados** - Não use TEXT para cadeias curtas
5. **Index com Moderação** - Cada índice desacelera escritas
6. **Documente Esquema** - Adicione COMMENT às colunas
7. **Evite Palavras Reservadas** - Não use `order`, `group`, `key` como nomes de coluna

## Documentação Relacionada

- ../Database-Operations - Execução de consultas
- ../../04-API-Reference/Database/Criteria - Construção de consultas
- Migrations - Versionamento de esquema
- ../../01-Getting-Started/Configuration/Performance-Optimization - Otimização de consultas
