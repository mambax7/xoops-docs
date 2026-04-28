---
title: "Módulo Publisher"
description: "Documentação completa do módulo de notícias e blog Publisher para XOOPS"
---

> O principal módulo de publicação de notícias e blog para XOOPS CMS.

---

## Visão Geral

O Publisher é o módulo de gerenciamento de conteúdo definitivo para XOOPS, evoluído do SmartSection para se tornar a solução de blog e notícias mais completa em recursos. Fornece ferramentas abrangentes para criar, organizar e publicar conteúdo com suporte total ao fluxo de trabalho editorial.

**Requisitos:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x recomendado)

---

## Recursos Principais

### Gerenciamento de Conteúdo
- **Categorias e Subcategorias** - Organização hierárquica de conteúdo
- **Edição de Texto Rico** - Múltiplos editores WYSIWYG suportados
- **Anexos de Arquivo** - Anexar arquivos aos artigos
- **Gerenciamento de Imagem** - Imagens de página e categoria
- **Encapsulamento de Arquivo** - Envolver arquivos como artigos

### Fluxo de Trabalho de Publicação
- **Publicação Agendada** - Definir datas futuras de publicação
- **Datas de Expiração** - Auto-expirar conteúdo
- **Moderação** - Fluxo de trabalho de aprovação editorial
- **Gerenciamento de Rascunho** - Salvar trabalho em andamento

### Exibição e Templates
- **Quatro Templates Base** - Múltiplos layouts de exibição
- **Templates Personalizados** - Criar seus próprios designs
- **Otimização SEO** - URLs amigáveis para mecanismos de busca
- **Design Responsivo** - Saída pronta para celular

### Interação do Usuário
- **Classificações** - Sistema de classificação de artigos
- **Comentários** - Discussões do leitor
- **Compartilhamento Social** - Compartilhar em redes sociais

### Permissões
- **Controle de Envio** - Quem pode enviar artigos
- **Permissões em Nível de Campo** - Controlar campos de formulário por grupo
- **Permissões de Categoria** - Controle de acesso por categoria
- **Direitos de Moderação** - Configurações globais de moderação

---

## Conteúdo da Seção

### Guia do Usuário
- Guia de Instalação
- Configuração Básica
- Criando Artigos
- Gerenciando Categorias
- Configurando Permissões

### Guia do Desenvolvedor
- Estendendo o Publisher
- Criando Templates Personalizados
- Referência da API
- Ganchos e Eventos

---

## Início Rápido

### 1. Instalação

```bash
# Baixar do GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copiar para diretório de módulos
cp -r publisher /path/to/xoops/htdocs/modules/
```

Então instale via XOOPS Admin → Módulos → Instalar.

### 2. Criar Sua Primeira Categoria

1. Vá para **Admin → Publisher → Categorias**
2. Clique **Adicionar Categoria**
3. Preencha:
   - **Nome**: Notícias
   - **Descrição**: Últimas notícias e atualizações
   - **Imagem**: Carregar imagem de categoria
4. Salvar

### 3. Criar Seu Primeiro Artigo

1. Vá para **Admin → Publisher → Artigos**
2. Clique **Adicionar Artigo**
3. Preencha:
   - **Título**: Bem-vindo ao Nosso Site
   - **Categoria**: Notícias
   - **Conteúdo**: Seu conteúdo de artigo
4. Definir **Status**: Publicado
5. Salvar

---

## Opções de Configuração

### Configurações Gerais

| Configuração | Descrição | Padrão |
|---------|-------------|---------|
| Editor | Editor WYSIWYG a usar | XOOPS Padrão |
| Itens por página | Artigos mostrados por página | 10 |
| Mostrar breadcrumb | Exibir trilha de navegação | Sim |
| Permitir classificações | Habilitar classificações de artigos | Sim |
| Permitir comentários | Habilitar comentários de artigos | Sim |

### Configurações de SEO

| Configuração | Descrição | Padrão |
|---------|-------------|---------|
| URLs de SEO | Habilitar URLs amigáveis | Não |
| Reescrita de URL | Apache mod_rewrite | Nenhum |
| Palavras-chave de meta | Auto-gerar palavras-chave | Sim |

### Matriz de Permissões

| Permissão | Anônimo | Registrado | Editor | Admin |
|------------|-----------|------------|--------|-------|
| Ver artigos | ✓ | ✓ | ✓ | ✓ |
| Enviar artigos | ✗ | ✓ | ✓ | ✓ |
| Editar próprios artigos | ✗ | ✓ | ✓ | ✓ |
| Editar todos os artigos | ✗ | ✗ | ✓ | ✓ |
| Aprovar artigos | ✗ | ✗ | ✓ | ✓ |
| Gerenciar categorias | ✗ | ✗ | ✗ | ✓ |

---

## Estrutura do Módulo

```
modules/publisher/
├── admin/                  # Interface de admin
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # Classes PHP
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Arquivos de inclusão
│   ├── common.php
│   └── functions.php
├── templates/              # Templates Smarty
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Traduções
│   └── english/
├── sql/                    # Schema do banco de dados
│   └── mysql.sql
├── xoops_version.php       # Informações do módulo
└── index.php               # Entrada do módulo
```

---

## Migração

### Do SmartSection

O Publisher inclui ferramenta de migração integrada:

1. Vá para **Admin → Publisher → Importar**
2. Selecione **SmartSection** como fonte
3. Escolha opções de importação:
   - Categorias
   - Artigos
   - Comentários
4. Clique **Importar**

### Do Módulo Notícias

1. Vá para **Admin → Publisher → Importar**
2. Selecione **Notícias** como fonte
3. Mapeie categorias
4. Clique **Importar**

---

## Documentação Relacionada

- Guia de Desenvolvimento de Módulo
- Template Smarty
- Framework XMF

---

## Recursos

- [Repositório GitHub](https://github.com/XoopsModules25x/publisher)
- [Rastreador de Problemas](https://github.com/XoopsModules25x/publisher/issues)
- [Tutorial Original](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #módulo #blog #notícias #cms #gerenciamento-de-conteúdo
