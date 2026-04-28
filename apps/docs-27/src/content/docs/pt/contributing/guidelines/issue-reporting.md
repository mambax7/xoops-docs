---
title: "Diretrizes de Relatório de Problemas"
description: "Como relatar bugs, requisições de recursos e outros problemas efetivamente"
---

> Relatórios de bugs e requisições de recursos efetivos são cruciais para o desenvolvimento de XOOPS. Este guia ajuda você a criar problemas de alta qualidade.

---

## Antes de Relatar

### Verificar Problemas Existentes

**Sempre procure primeiro:**

1. Vá para [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
2. Procure por palavras-chave relacionadas ao seu problema
3. Verifique problemas fechados - podem já estar resolvidos
4. Procure por pull requests - podem estar em andamento

Use filtros de pesquisa:
- `is:issue is:open label:bug` - Bugs abertos
- `is:issue is:open label:feature` - Requisições de recursos abertos
- `is:issue sort:updated` - Problemas atualizados recentemente

### É Realmente um Problema?

Considere primeiro:

- **Problema de configuração?** - Verifique a documentação
- **Pergunta de uso?** - Pergunte nos fóruns ou comunidade Discord
- **Problema de segurança?** - Consulte a seção #problemas-de-segurança abaixo
- **Específico de módulo?** - Relate ao mantenedor do módulo
- **Específico de tema?** - Relate ao autor do tema

---

## Tipos de Problemas

### Relatório de Bug

Um bug é um comportamento inesperado ou defeito.

**Exemplos:**
- Login não funcionando
- Erros de banco de dados
- Falta de validação de formulário
- Vulnerabilidade de segurança

### Requisição de Recurso

Uma requisição de recurso é uma sugestão para nova funcionalidade.

**Exemplos:**
- Adicionar suporte a novo recurso
- Melhorar funcionalidade existente
- Adicionar documentação faltante
- Melhorias de performance

### Aprimoramento

Um aprimoramento melhora a funcionalidade existente.

**Exemplos:**
- Mensagens de erro melhores
- Performance melhorada
- Design de API melhor
- Melhor experiência do usuário

### Documentação

Problemas de documentação incluem documentação faltante ou incorreta.

**Exemplos:**
- Documentação de API incompleta
- Guias desatualizados
- Exemplos de código faltando
- Erros de digitação na documentação

---

## Relatando um Bug

### Modelo de Relatório de Bug

```markdown
## Descrição
Breve e clara descrição do bug.

## Passos para Reproduzir
1. Passo um
2. Passo dois
3. Passo três

## Comportamento Esperado
O que deveria acontecer.

## Comportamento Real
O que realmente acontece.

## Ambiente
- Versão XOOPS: X.Y.Z
- Versão PHP: 8.2/8.3/8.4
- Banco de Dados: MySQL/MariaDB versão
- Sistema Operacional: Windows/macOS/Linux
- Navegador: Chrome/Firefox/Safari

## Capturas de Tela
Se aplicável, adicione capturas de tela mostrando o problema.

## Contexto Adicional
Qualquer outra informação relevante.

## Possível Correção
Se você tiver sugestões para corrigir o problema (opcional).
```

### Exemplo de Bom Relatório de Bug

```markdown
## Descrição
A página de login mostra página em branco quando a conexão com o banco de dados falha.

## Passos para Reproduzir
1. Pare o serviço MySQL
2. Navegue até a página de login
3. Observe o comportamento

## Comportamento Esperado
Mostrar uma mensagem de erro amigável explicando o problema de conexão com o banco de dados.

## Comportamento Real
A página está completamente em branco - sem mensagem de erro, sem interface visível.

## Ambiente
- Versão XOOPS: 2.7.0
- Versão PHP: 8.0.28
- Banco de Dados: MySQL 5.7
- Sistema Operacional: Ubuntu 20.04
- Navegador: Chrome 120

## Contexto Adicional
Isso provavelmente afeta outras páginas também. O erro deveria ser exibido aos admins ou registrado apropriadamente.

## Possível Correção
Verifique a conexão com o banco de dados em header.php antes de renderizar o template.
```

### Exemplo de Relatório de Bug Ruim

```markdown
## Descrição
Login não funciona

## Passos para Reproduzir
Não funciona

## Comportamento Esperado
Deveria funcionar

## Comportamento Real
Não funciona

## Ambiente
Versão mais recente
```

---

## Relatando uma Requisição de Recurso

### Modelo de Requisição de Recurso

```markdown
## Descrição
Descrição clara e concisa do recurso.

## Declaração do Problema
Por que este recurso é necessário? Que problema ele resolve?

## Solução Proposta
Descreva sua implementação ideal ou UX.

## Alternativas Consideradas
Existem outras maneiras de alcançar este objetivo?

## Contexto Adicional
Qualquer mock-up, exemplo ou referência.

## Impacto Esperado
Como isso beneficiaria os usuários? Seria quebra de compatibilidade?
```

### Exemplo de Boa Requisição de Recurso

```markdown
## Descrição
Adicionar autenticação de dois fatores (2FA) para contas de usuário.

## Declaração do Problema
Com crescentes violações de segurança, muitas plataformas CMS agora oferecem 2FA. Usuários XOOPS querem segurança de conta mais forte além de senhas.

## Solução Proposta
Implementar 2FA baseado em TOTP (compatível com Google Authenticator, Authy, etc.).
- Usuários podem ativar 2FA em seu perfil
- Exibir código QR para configuração
- Gerar códigos de backup para recuperação
- Exigir código 2FA no login

## Alternativas Consideradas
- 2FA baseado em SMS (requer integração de operadora, menos seguro)
- Chaves de hardware (muito complexo para usuários médios)

## Contexto Adicional
Similar às implementações do GitHub, GitLab e WordPress.
Referência: [Padrão TOTP RFC 6238](https://tools.ietf.org/html/rfc6238)

## Impacto Esperado
Aumenta segurança da conta. Poderia ser opcional inicialmente, obrigatório em versões futuras.
```

---

## Problemas de Segurança

### NÃO Relatar Publicamente

**Nunca crie um problema público para vulnerabilidades de segurança.**

### Relatar Privadamente

1. **Email para o time de segurança:** security@xoops.org
2. **Inclua:**
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Suas informações de contato

### Divulgação Responsável

- Reconheceremos o recebimento dentro de 48 horas
- Forneceremos atualizações a cada 7 dias
- Trabalharemos em um cronograma de correção
- Você pode solicitar crédito pela descoberta
- Coordenar o tempo de divulgação pública

### Exemplo de Problema de Segurança

```
Assunto: [SECURITY] Vulnerabilidade XSS no Formulário de Comentário

Descrição:
O formulário de comentário do módulo Publisher não escapa adequadamente a entrada do usuário,
permitindo ataques XSS armazenados.

Passos para Reproduzir:
1. Criar um comentário com: <img src=x onerror="alert('xss')">
2. Enviar o formulário
3. O JavaScript é executado ao visualizar o comentário

Impacto:
Atacantes podem roubar tokens de sessão do usuário, realizar ações como usuários,
ou desfigurar o website.

Ambiente:
- XOOPS 2.7.0
- Módulo Publisher 1.x
```

---

## Melhores Práticas para Título de Problema

### Bons Títulos

```
✅ Página de login mostra erro em branco quando a conexão com banco de dados falha
✅ Adicionar suporte de autenticação de dois fatores
✅ Validação de formulário não prevenindo injeção SQL em campo de nome
✅ Melhorar performance da consulta de lista de usuários
✅ Atualizar documentação de instalação para PHP 8.2
```

### Títulos Ruins

```
❌ Bug no sistema
❌ Me ajude!!
❌ Não funciona
❌ Pergunta sobre XOOPS
❌ Erro
```

### Diretrizes de Título

- **Seja específico** - Mencione o que e onde
- **Seja conciso** - Menos de 75 caracteres
- **Use tempo presente** - "mostra página em branco" não "mostrou página"
- **Inclua contexto** - "no painel admin", "durante instalação"
- **Evite palavras genéricas** - Não "corrigir", "ajudar", "problema"

---

## Melhores Práticas para Descrição de Problema

### Incluir Informações Essenciais

1. **O que** - Descrição clara do problema
2. **Onde** - Qual página, módulo ou recurso
3. **Quando** - Passos para reproduzir
4. **Ambiente** - Versão, SO, navegador, PHP
5. **Por que** - Por que isso é importante

### Use Formatação de Código

```markdown
Mensagem de erro: `Erro: Não foi possível encontrar o usuário`

Trecho de código:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Erro: Não foi possível encontrar o usuário";
}
```
```

### Inclua Capturas de Tela

Para problemas de UI, inclua:
- Captura de tela do problema
- Captura de tela do comportamento esperado
- Anotar o que está errado (setas, círculos)

### Use Rótulos

Adicione rótulos para categorizar:
- `bug` - Relatório de bug
- `enhancement` - Requisição de aprimoramento
- `documentation` - Problema de documentação
- `help wanted` - Procurando ajuda
- `good first issue` - Bom para novos contribuidores

---

## Depois de Relatar

### Seja Responsivo

- Verifique perguntas nos comentários do problema
- Forneça informações adicionais se solicitado
- Teste correções sugeridas
- Verifique se o bug ainda existe com novas versões

### Siga Etiqueta

- Seja respeitoso e profissional
- Assuma boas intenções
- Não exija correções - desenvolvedores são voluntários
- Ofereça ajudar se possível
- Agradeça aos contribuidores por seu trabalho

### Mantenha Problema Focado

- Fique no assunto
- Não discuta problemas não relacionados
- Link para problemas relacionados em vez disso
- Não use problemas para votação de recursos

---

## O Que Acontece aos Problemas

### Processo de Triagem

1. **Novo problema criado** - GitHub notifica mantenedores
2. **Revisão inicial** - Verificado por clareza e duplicatas
3. **Atribuição de rótulo** - Categorizado e priorizado
4. **Atribuição** - Atribuído a alguém se apropriado
5. **Discussão** - Informações adicionais coletadas se necessário

### Níveis de Prioridade

- **Crítico** - Perda de dados, segurança, quebra completa
- **Alto** - Recurso principal quebrado, afeta muitos usuários
- **Médio** - Parte de recurso quebrada, workaround disponível
- **Baixo** - Problema menor, cosmético ou caso de uso de nicho

### Resultados de Resolução

- **Corrigido** - Problema resolvido em um PR
- **Não será corrigido** - Rejeitado por razões técnicas ou estratégicas
- **Duplicado** - Mesmo que outro problema
- **Inválido** - Não é realmente um problema
- **Precisa mais informações** - Aguardando detalhes adicionais

---

## Exemplos de Problema

### Exemplo: Bom Relatório de Bug

```markdown
## Descrição
Usuários admin não conseguem deletar itens ao usar MySQL com modo strict ativado.

## Passos para Reproduzir
1. Ativar `sql_mode='STRICT_TRANS_TABLES'` em MySQL
2. Navegar para painel admin do Publisher
3. Clicar no botão delete em qualquer artigo
4. Erro é mostrado

## Comportamento Esperado
Artigo deveria ser deletado ou mostrar erro significativo.

## Comportamento Real
Erro: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Ambiente
- Versão XOOPS: 2.7.0
- Versão PHP: 8.2.0
- Banco de Dados: MySQL 8.0.32 com STRICT_TRANS_TABLES
- Sistema Operacional: Ubuntu 22.04
- Navegador: Firefox 120

## Capturas de Tela
[Captura de tela da mensagem de erro]

## Contexto Adicional
Isso acontece apenas com modo SQL strict. Funciona bem com configurações padrão.
A consulta está em class/PublisherItem.php:248

## Possível Correção
Use aspas simples ao redor de 'deleted_at' ou use backticks para todos os nomes de coluna.
```

### Exemplo: Boa Requisição de Recurso

```markdown
## Descrição
Adicionar endpoints de API REST para acesso somente leitura a conteúdo público.

## Declaração do Problema
Desenvolvedores querem construir apps mobile e serviços externos usando dados XOOPS.
Atualmente limitado a API SOAP que é desatualizada e pobremente documentada.

## Solução Proposta
Implementar API RESTful com:
- Endpoints para artigos, usuários, comentários (somente leitura)
- Autenticação baseada em token
- Códigos de status HTTP padrão e erros
- Documentação OpenAPI/Swagger
- Suporte a paginação

## Alternativas Consideradas
- API SOAP melhorada (legado, não em conformidade com padrões)
- GraphQL (mais complexo, talvez futuro)

## Contexto Adicional
Consulte refatoração de API do módulo Publisher para padrões similares.
Estaria alinhado com práticas modernas de desenvolvimento web.

## Impacto Esperado
Habilitar ecossistema de ferramentas de terceiros e apps mobile.
Melhoraria adoção de XOOPS e ecossistema.
```

---

## Documentação Relacionada

- Código de Conduta
- Fluxo de Contribuição
- Diretrizes de Pull Request
- Visão Geral de Contribuição

---

#xoops #issues #bug-reporting #feature-requests #github
