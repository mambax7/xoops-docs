---
title: "Criando Sua Primeira Página"
description: "Guia passo a passo para criar e publicar conteúdo no XOOPS, incluindo formatação, incorporação de mídia e opções de publicação"
---

# Criando Sua Primeira Página no XOOPS

Aprenda como criar, formatar e publicar seu primeiro conteúdo no XOOPS.

## Entendendo o Conteúdo do XOOPS

### O que é uma Página/Post?

No XOOPS, o conteúdo é gerenciado através de módulos. Os tipos de conteúdo mais comuns são:

| Tipo | Descrição | Caso de Uso |
|---|---|---|
| **Página** | Conteúdo estático | Sobre nós, Contato, Serviços |
| **Post/Artigo** | Conteúdo com data | Notícias, Posts de blog |
| **Categoria** | Organização de conteúdo | Agrupar conteúdo relacionado |
| **Comentário** | Feedback de usuário | Permitir interação de visitante |

Este guia cobre a criação de uma página/artigo básica usando o módulo de conteúdo padrão do XOOPS.

## Acessando o Editor de Conteúdo

### Do Painel de Administrador

1. Faça login no painel de administrador: `http://seu-dominio.com/xoops/admin/`
2. Navegue para **Conteúdo > Páginas** (ou seu módulo de conteúdo)
3. Clique em "Adicionar Nova Página" ou "Novo Post"

### Frontend (se Ativado)

Se seu XOOPS estiver configurado para permitir criação de conteúdo no frontend:

1. Faça login como usuário registrado
2. Vá para seu perfil
3. Procure pela opção "Enviar Conteúdo"
4. Siga as mesmas etapas abaixo

## Interface do Editor de Conteúdo

O editor de conteúdo inclui:

```
┌─────────────────────────────────────┐
│ Editor de Conteúdo                  │
├─────────────────────────────────────┤
│                                     │
│ Título: [________________]          │
│                                     │
│ Categoria: [Dropdown]               │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Digite seu conteúdo aqui...     │ │
│ │                                 │ │
│ │ Você pode usar tags HTML aqui   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Descrição (Meta): [____________]   │
│                                     │
│ [Publicar] [Salvar Rascunho] [Visualizar] │
│                                     │
└─────────────────────────────────────┘
```

## Guia Passo a Passo: Criando Sua Primeira Página

### Passo 1: Acessar o Editor de Conteúdo

1. No painel de administrador, clique em **Conteúdo > Páginas**
2. Clique em **"Adicionar Nova Página"** ou **"Criar"**
3. Você verá o editor de conteúdo

### Passo 2: Digite o Título da Página

No campo "Título", digite o nome da página:

```
Título: Bem-vindo ao Nosso Site
```

Práticas recomendadas para títulos:
- Claro e descritivo
- Incluir palavras-chave se possível
- 50-60 caracteres ideal
- Evitar TUDO EM MAIÚSCULAS (difícil de ler)
- Ser específico (não "Página 1")

### Passo 3: Selecionar Categoria

Escolha onde organizar este conteúdo:

```
Categoria: [Dropdown ▼]
```

As opções podem incluir:
- Geral
- Notícias
- Blog
- Comunicados
- Serviços

Se as categorias não existem, peça ao administrador para criá-las.

### Passo 4: Escreva Seu Conteúdo

Clique na área do editor de conteúdo e digite seu texto.

#### Formatação Básica de Texto

Use a barra de ferramentas do editor:

| Botão | Ação | Resultado |
|---|---|---|
| **B** | Negrito | **Texto em negrito** |
| *I* | Itálico | *Texto em itálico* |
| <u>U</u> | Sublinhado | <u>Texto sublinhado</u> |

#### Usando HTML

XOOPS permite tags HTML seguras. Exemplos comuns:

```html
<!-- Parágrafos -->
<p>Este é um parágrafo.</p>

<!-- Títulos -->
<h1>Título Principal</h1>
<h2>Subtítulo</h2>

<!-- Listas -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Negrito e Itálico -->
<strong>Texto em negrito</strong>
<em>Texto em itálico</em>

<!-- Links -->
<a href="https://example.com">Texto do link</a>

<!-- Quebras de linha -->
<br>

<!-- Linha horizontal -->
<hr>
```

#### Exemplos de HTML Seguro

**Tags recomendadas:**
- Parágrafos: `<p>`, `<br>`
- Títulos: `<h1>` a `<h6>`
- Texto: `<strong>`, `<em>`, `<u>`
- Listas: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="">`
- Blockquotes: `<blockquote>`
- Tabelas: `<table>`, `<tr>`, `<td>`

**Evite estas tags** (podem estar desativadas por segurança):
- Scripts: `<script>`
- Estilos: `<style>`
- Iframes: `<iframe>` (a menos que configurado)
- Formulários: `<form>`, `<input>`

### Passo 5: Adicionar Imagens

#### Opção 1: Inserir URL de Imagem

Usando o editor:

1. Clique no botão **Inserir Imagem** (ícone de imagem)
2. Digite a URL da imagem: `https://example.com/image.jpg`
3. Digite texto alternativo: "Descrição da imagem"
4. Clique em "Inserir"

Equivalente em HTML:

```html
<img src="https://example.com/image.jpg" alt="Descrição">
```

#### Opção 2: Fazer Upload de Imagem

1. Primeiro, faça upload da imagem para o XOOPS:
   - Vá para **Conteúdo > Gerenciador de Mídia**
   - Faça upload de sua imagem
   - Copie a URL da imagem

2. No editor de conteúdo, insira usando URL (etapas anteriores)

#### Práticas Recomendadas de Imagem

- Use tamanhos de arquivo apropriados (otimize imagens)
- Use nomes de arquivo descritivos
- Sempre inclua texto alternativo (acessibilidade)
- Formatos suportados: JPG, PNG, GIF, WebP
- Largura recomendada: 600-800 pixels para conteúdo

### Passo 6: Incorporar Mídia

#### Incorporar Vídeo do YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Substitua `VIDEO_ID` pela ID do vídeo do YouTube.

**Para encontrar a ID do vídeo do YouTube:**
1. Abra o vídeo no YouTube
2. A URL é: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Copie a ID (caracteres após `v=`)

#### Incorporar Vídeo do Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Passo 7: Adicione Meta Descrição

No campo "Descrição", adicione um resumo breve:

```
Descrição: Aprenda como começar com nosso site.
Esta página fornece uma visão geral de nossos serviços e como podemos ajudá-lo.
```

**Práticas recomendadas de meta descrição:**
- 150-160 caracteres
- Incluir palavra-chave naturalmente
- Deve resumir com precisão o conteúdo
- Usado em resultados de mecanismo de busca
- Torne-o atraente (usuários veem isto)

### Passo 8: Configure Opções de Publicação

#### Status de Publicação

Escolha status de publicação:

```
Status: ☑ Publicado
```

Opções:
- **Publicado:** Visível ao público
- **Rascunho:** Visível apenas para admins
- **Pendente de Revisão:** Aguardando aprovação
- **Arquivado:** Oculto mas mantido

#### Visibilidade

Defina quem pode ver este conteúdo:

```
Visibilidade: ☐ Público
             ☐ Apenas Usuários Registrados
             ☐ Privado (Apenas Admin)
```

#### Data de Publicação

Defina quando o conteúdo fica visível:

```
Data de Publicação: [Date Picker] [Time]
```

Deixe como "Agora" para publicar imediatamente.

#### Permitir Comentários

Ativar ou desativar comentários de visitantes:

```
Permitir Comentários: ☑ Sim
```

Se ativado, visitantes podem adicionar feedback.

### Passo 9: Salve Seu Conteúdo

Múltiplas opções de salvamento:

```
[Publicar Agora]  [Salvar como Rascunho]  [Agendar]  [Visualizar]
```

- **Publicar Agora:** Tornar visível imediatamente
- **Salvar como Rascunho:** Manter privado por enquanto
- **Agendar:** Publicar em data/hora futura
- **Visualizar:** Ver como ficará antes de salvar

Clique em sua escolha:

```
Clique em [Publicar Agora]
```

### Passo 10: Verifique Sua Página

Após publicar, verifique seu conteúdo:

1. Vá para a página inicial do seu site
2. Navegue para sua área de conteúdo
3. Procure por sua página recém-criada
4. Clique para visualizá-la
5. Verifique:
   - [ ] O conteúdo é exibido corretamente
   - [ ] As imagens aparecem
   - [ ] A formatação parece boa
   - [ ] Os links funcionam
   - [ ] Título e descrição estão corretos

## Exemplo: Página Completa

### Título
```
Começando com XOOPS
```

### Conteúdo
```html
<h2>Bem-vindo ao XOOPS</h2>

<p>XOOPS é um poderoso e flexível sistema
de gerenciamento de conteúdo de código aberto.
Permite criar sites dinâmicos com conhecimento técnico mínimo.</p>

<h3>Características-Chave</h3>

<ul>
  <li>Gerenciamento fácil de conteúdo</li>
  <li>Registro e gerenciamento de usuários</li>
  <li>Sistema de módulo para extensibilidade</li>
  <li>Sistema de tematização flexível</li>
  <li>Recursos de segurança integrados</li>
</ul>

<h3>Começando</h3>

<p>Aqui estão os primeiros passos para
que seu site XOOPS funcione:</p>

<ol>
  <li>Configure configurações básicas</li>
  <li>Crie sua primeira página</li>
  <li>Configure contas de usuário</li>
  <li>Instale módulos adicionais</li>
  <li>Customize a aparência</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="Logo XOOPS">

<p>Para mais informações, visite
<a href="https://xoops.org/">xoops.org</a></p>
```

### Meta Descrição
```
Comece com XOOPS CMS. Conheça os recursos
e os primeiros passos para lançar seu site dinâmico.
```

## Recursos Avançados de Conteúdo

### Usando Editor WYSIWYG

Se um editor de texto rico estiver instalado:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Clique nos botões para formatar texto sem HTML.

### Inserindo Blocos de Código

Exibir exemplos de código:

```html
<pre><code>
// Exemplo PHP
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Criando Tabelas

Organize dados em tabelas:

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Recurso</th>
    <th>Descrição</th>
  </tr>
  <tr>
    <td>Flexível</td>
    <td>Fácil de personalizar</td>
  </tr>
  <tr>
    <td>Poderoso</td>
    <td>CMS completo</td>
  </tr>
</table>
```

### Quotes Inline

Destacar texto importante:

```html
<blockquote>
"XOOPS é um poderoso sistema de gerenciamento de conteúdo
que o capacita a construir sites dinâmicos."
</blockquote>
```

## Práticas Recomendadas de SEO para Conteúdo

Otimize seu conteúdo para mecanismos de busca:

### Título
- Incluir palavra-chave principal
- 50-60 caracteres
- Único por página

### Meta Descrição
- Incluir palavra-chave naturalmente
- 150-160 caracteres
- Atraente e preciso

### Conteúdo
- Escrever naturalmente, evitar preenchimento de palavra-chave
- Usar títulos (h2, h3) apropriadamente
- Incluir links internos para outras páginas
- Usar texto alternativo em todas as imagens
- Objetivo de 300+ palavras para artigos

### Estrutura de URL
- Manter URLs curtas e descritivas
- Usar hífens para separar palavras
- Evitar caracteres especiais
- Exemplo: `/sobre-nossa-empresa`

## Gerenciando Seu Conteúdo

### Editar Página Existente

1. Vá para **Conteúdo > Páginas**
2. Encontre sua página na lista
3. Clique em **Editar** ou no título da página
4. Faça alterações
5. Clique em **Atualizar**

### Deletar Página

1. Vá para **Conteúdo > Páginas**
2. Encontre sua página
3. Clique em **Deletar**
4. Confirme a exclusão

### Alterar Status de Publicação

1. Vá para **Conteúdo > Páginas**
2. Encontre a página, clique em **Editar**
3. Altere o status no dropdown
4. Clique em **Atualizar**

## Solução de Problemas de Criação de Conteúdo

### Conteúdo Não Aparecendo

**Sintoma:** Página publicada não está mostrando no site

**Solução:**
1. Verifique status de publicação: Deve ser "Publicado"
2. Verifique data de publicação: Deve ser atual ou anterior
3. Verifique visibilidade: Deve ser "Público"
4. Limpe cache: Admin > Ferramentas > Limpar Cache
5. Verifique permissões: Grupo de usuários deve ter acesso

### Formatação Não Funcionando

**Sintoma:** Tags HTML ou formatação aparecem como texto

**Solução:**
1. Verifique se HTML está ativado nas configurações do módulo
2. Use sintaxe HTML apropriada
3. Feche todas as tags: `<p>Texto</p>`
4. Use apenas tags permitidas
5. Use entidades HTML: `&lt;` para `<`, `&amp;` para `&`

### Imagens Não Sendo Exibidas

**Sintoma:** Imagens mostram ícone quebrado

**Solução:**
1. Verifique se a URL da imagem está correta
2. Verifique se o arquivo de imagem existe
3. Verifique permissões apropriadas na imagem
4. Tente fazer upload de imagem para XOOPS em vez disso
5. Verifique se há bloqueio externo (pode precisar de CORS)

### Problemas de Codificação de Caracteres

**Sintoma:** Caracteres especiais aparecem como gibberish

**Solução:**
1. Salve arquivo como codificação UTF-8
2. Certifique-se de que o charset da página é UTF-8
3. Adicione ao head HTML: `<meta charset="UTF-8">`
4. Evite copiar/colar do Word (use texto simples)

## Fluxo de Trabalho de Conteúdo Práticas Recomendadas

### Processo Recomendado

1. **Escrever no Editor Primeiro:** Use editor de conteúdo do admin
2. **Visualizar Antes de Publicar:** Clique no botão Visualizar
3. **Adicionar Metadados:** Complete título, descrição, tags
4. **Salvar como Rascunho Primeiro:** Salve como rascunho para evitar perder trabalho
5. **Revisão Final:** Releia antes de publicar
6. **Publicar:** Clique em Publicar quando pronto
7. **Verificar:** Verifique no site ao vivo
8. **Editar Se Necessário:** Faça correções rapidamente

### Controle de Versão

Sempre mantenha backups:

1. **Antes de Mudanças Importantes:** Salve como nova versão ou backup
2. **Arquivar Conteúdo Antigo:** Mantenha versões não publicadas
3. **Datar Seus Rascunhos:** Use nomenclatura clara: "Page-Draft-2025-01-28"

## Publicando Múltiplas Páginas

Crie uma estratégia de conteúdo:

```
Homepage
├── Sobre Nós
├── Serviços
│   ├── Serviço 1
│   ├── Serviço 2
│   └── Serviço 3
├── Blog
│   ├── Artigo 1
│   ├── Artigo 2
│   └── Artigo 3
├── Contato
└── Perguntas Frequentes
```

Crie páginas para seguir esta estrutura.

## Próximas Etapas

Após criar sua primeira página:

1. Configure contas de usuários
2. Instale módulos adicionais
3. Explore recursos de administração
4. Configure configurações
5. Otimize com configurações de desempenho

---

**Tags:** #criação-de-conteúdo #páginas #publicação #editor

**Artigos Relacionados:**
- Admin-Panel-Overview
- Managing-Users
- Installing-Modules
- ../Configuration/Basic-Configuration
