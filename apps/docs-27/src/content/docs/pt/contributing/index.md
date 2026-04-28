---
title: "Diretrizes de Contribuição"
description: "Como contribuir para desenvolvimento de XOOPS CMS, padrões de codificação e diretrizes comunitárias"
---

# Contribuindo para XOOPS

> Junte-se à comunidade XOOPS e ajude a torná-lo o melhor CMS do mundo.

---

## Visão Geral

XOOPS é um projeto de código aberto que prospera em contribuições comunitárias. Se você está corrigindo bugs, adicionando recursos, melhorando documentação ou ajudando outros, suas contribuições são valiosas.

---

## Conteúdo da Seção

### Diretrizes
- Código de Conduta
- Fluxo de Contribuição
- Diretrizes de Pull Request
- Relatório de Problema

### Estilo de Código
- Padrões de Codificação PHP
- Padrões JavaScript
- Diretrizes CSS
- Padrões de Template Smarty

### Decisões de Arquitetura
- Índice de ADR
- Modelo de ADR
- ADR-001: Arquitetura Modular
- ADR-002: Abstração de Banco de Dados

---

## Começando

### 1. Configurar Ambiente de Desenvolvimento

```bash
# Fazer fork do repositório no GitHub
# Depois clonar seu fork
git clone https://github.com/SEU_USUARIO/XoopsCore27.git
cd XoopsCore27

# Adicionar remote upstream
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Instalar dependências
composer install
```

### 2. Criar Branch de Recurso

```bash
# Sincronizar com upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Fazer Mudanças

Siga os padrões de codificação e escreva testes para novos recursos.

### 4. Submeter Pull Request

```bash
# Fazer commit das mudanças
git add .
git commit -m "Add: Descrição breve das mudanças"

# Push para seu fork
git push origin feature/my-feature
```

Depois crie uma Pull Request no GitHub.

---

## Padrões de Codificação

### Padrões de PHP

XOOPS segue padrões de codificação PSR-1, PSR-4 e PSR-12.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Classe Item
 *
 * Representa um item no módulo
 */
class Item extends XoopsObject
{
    /**
     * Construtor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Obter título formatado
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### Convenções Principais

| Regra | Exemplo |
|-------|---------|
| Nomes de classe | `PascalCase` |
| Nomes de método | `camelCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Variáveis | `$camelCase` |
| Arquivos | `ClassName.php` |
| Indentação | 4 espaços |
| Comprimento de linha | Máx 120 caracteres |

### Templates Smarty

```smarty
{* Arquivo: templates/mymodule_index.tpl *}
{* Descrição: Template de página de índice *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## Fluxo de Trabalho Git

### Nomenclatura de Branch

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Recurso | `feature/description` | `feature/add-user-export` |
| Correção | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Release | `release/version` | `release/2.7.0` |

### Mensagens de Commit

Siga commits convencionais:

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

**Tipos:**
- `feat`: Novo recurso
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Estilo de código (formatação)
- `refactor`: Refatoração de código
- `test`: Adicionando testes
- `chore`: Manutenção

**Exemplos:**
```
feat(auth): adicionar autenticação de dois fatores

Implementar 2FA baseado em TOTP para contas de usuário.
- Adicionar geração de código QR para aplicativos autenticador
- Armazenar segredos criptografados no perfil do usuário
- Adicionar recurso de códigos de backup

Fecha #123
```

```
fix(forms): resolver vulnerabilidade XSS em entrada de texto

Escapar adequadamente entrada do usuário no método render de XoopsFormText.

Security: CVE-2024-XXXX
```

---

## Testes

### Executando Testes

```bash
# Executar todos os testes
./vendor/bin/phpunit

# Executar suite de teste específica
./vendor/bin/phpunit --testsuite unit

# Executar com cobertura
./vendor/bin/phpunit --coverage-html coverage/
```

### Escrevendo Testes

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## Lista de Verificação de Pull Request

Antes de submeter um PR, certifique-se:

- [ ] Código segue padrões de codificação XOOPS
- [ ] Todos os testes passam
- [ ] Novos recursos têm testes
- [ ] Documentação atualizada se necessário
- [ ] Nenhum conflito de merge com branch principal
- [ ] Mensagens de commit são descritivas
- [ ] Descrição de PR explica mudanças
- [ ] Problemas relacionados estão vinculados

---

## Registros de Decisão de Arquitetura

ADRs documentam decisões arquiteturais significativas.

### Modelo de ADR

```markdown
# ADR-XXX: Título

## Status
Proposto | Aceito | Descontinuado | Supersedido

## Contexto
Qual é o problema que estamos endereçando?

## Decisão
Qual é a mudança sendo proposta?

## Consequências
Quais são os efeitos positivos e negativos?

## Alternativas Consideradas
Quais outras opções foram avaliadas?
```

### ADRs Atuais

| ADR | Título | Status |
|-----|--------|--------|
| ADR-001 | Arquitetura Modular | Aceito |
| ADR-002 | Acesso a Banco de Dados Orientado a Objetos | Aceito |
| ADR-003 | Motor de Template Smarty | Aceito |
| ADR-004 | Design de Sistema de Segurança | Aceito |
| ADR-005 | Middleware PSR-15 (4.0.x) | Proposto |

---

## Reconhecimento

Contribuidores são reconhecidos através de:

- **Lista de Contribuidores** - Listados no repositório
- **Notas de Release** - Creditados em releases
- **Galeria da Fama** - Contribuidores destacados
- **Certificação de Módulo** - Badge de qualidade para módulos

---

## Documentação Relacionada

- Roteiro XOOPS 4.0
- Conceitos Principais
- Desenvolvimento de Módulo

---

## Recursos

- [Repositório GitHub](https://github.com/XOOPS/XoopsCore27)
- [Rastreador de Problemas](https://github.com/XOOPS/XoopsCore27/issues)
- [Fóruns XOOPS](https://xoops.org/modules/newbb/)
- [Comunidade Discord](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
