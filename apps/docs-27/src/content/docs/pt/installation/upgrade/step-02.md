---
title: "Executando Upgrade"
---

Antes de executar o upgrade principal, certifique-se de ter concluído a [Verificação de Pré-voo](preflight.md). A interface do upgrade exige que o pré-voo seja executado pelo menos uma vez e o direcionará lá se você não tiver.

Inicie o upgrade apontando seu navegador para o diretório _upgrade_ do seu site:

```text
http://example.com/upgrade/
```

Isto deve mostrar uma página assim:

![Inicialização de Upgrade XOOPS](/xoops-docs/2.7/img/installation/upgrade-01.png)

Selecione o botão "Continuar" para prosseguir.

Cada "Continuar" avança através de outro patch. Continue até que todos os patches sejam aplicados e a página Atualizar Módulo do Sistema seja apresentada.

![Patch Aplicado de Upgrade XOOPS](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## O que o Upgrade 2.5.11 → 2.7.0 Aplica

Ao atualizar do XOOPS 2.5.11 para 2.7.0, o upgrade aplica os seguintes patches. Cada é apresentado como um passo separado no assistente para que você possa confirmar o que está sendo alterado:

1. **Remover PHPMailer agrupado obsoleto.** A cópia agrupada do PHPMailer dentro do módulo Protector é deletada. PHPMailer agora é fornecido através do Composer em `xoops_lib/vendor/`.
2. **Remover pasta HTMLPurifier obsoleta.** Da mesma forma, a pasta HTMLPurifier antiga dentro do módulo Protector é deletada. HTMLPurifier agora é fornecida através do Composer.
3. **Criar tabela `tokens`.** Uma nova tabela `tokens` é adicionada para armazenamento de token genérico com escopo. A tabela tem colunas para ID de token, ID de usuário, escopo, hash e carimbos de emissão/expiração/uso, e é usada por recursos baseados em token no XOOPS 2.7.0.
4. **Ampliar `bannerclient.passwd`.** A coluna `bannerclient.passwd` é ampliada para `VARCHAR(255)` para que possa armazenar hashes de senha moderno (bcrypt, argon2) em vez da coluna herdada estreita.
5. **Adicionar preferências de cookie de sessão.** Duas novas preferências são inseridas: `session_cookie_samesite` (para o atributo SameSite do cookie) e `session_cookie_secure` (para forçar cookies somente HTTPS). Veja [Após o Upgrade](ustep-04.md) para como revisar essas após o upgrade ser concluído.

Nenhuma dessas etapas toca seus dados de conteúdo. Seus usuários, posts, imagens e dados de módulo permanecem intocados.

## Escolhendo um Idioma

A distribuição principal do XOOPS vem com suporte em inglês. O suporte para locales adicionais é fornecido por [Sites de suporte local XOOPS](https://xoops.org/modules/xoopspartners/). Este suporte pode vir em forma de distribuição personalizada ou arquivos adicionais para adicionar à distribuição principal.

As traduções do XOOPS são mantidas em [transifex](https://www.transifex.com/xoops/public/)

Se o Upgrade do XOOPS tiver suporte a idioma adicional, você pode alterar o idioma selecionando o ícone de idioma nos menus superiores e escolhendo um idioma diferente.

![Idioma de Upgrade XOOPS](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
