---
title: "Verificação de Pré-voo"
---

XOOPS 2.7.0 atualizou seu mecanismo de template de Smarty 3 para Smarty 4. Smarty 4 é mais rigoroso sobre a sintaxe de template do que Smarty 3, e alguns templates de tema personalizado e módulo podem precisar ser ajustados antes que funcionem corretamente no XOOPS 2.7.0.

Para ajudar a identificar e reparar esses problemas _antes_ de executar o upgrade principal, XOOPS 2.7.0 vem com um **scanner de pré-voo** no diretório `upgrade/`. Você deve executar o scanner de pré-voo pelo menos uma vez antes que o fluxo de trabalho de upgrade principal permita que você continue.

## O que o Scanner Faz

O scanner de pré-voo percorre seus temas existentes e templates de módulo procurando por incompatibilidades conhecidas com Smarty 4. Ele pode:

* **Escanear** seus diretórios `themes/` e `modules/` procurando por arquivos de template `.tpl` e `.html` que possam precisar de alterações
* **Relatar** problemas agrupados por arquivo e por tipo de problema
* **Reparar automaticamente** muitos problemas comuns quando você pedir

Nem todo problema pode ser reparado automaticamente. Alguns templates precisarão de edição manual, especialmente se usarem idiomas mais antigos do Smarty 3 que não têm equivalente direto no Smarty 4.

## Executando o Scanner

1. Copie o diretório de distribuição `upgrade/` para a raiz da web do seu site (se você ainda não fez isso como parte da etapa [Preparações para Atualização](ustep-01.md)).
2. Aponte seu navegador para a URL de pré-voo:

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Faça login com uma conta de administrador quando solicitado.
4. O scanner apresenta um formulário com três controles:
   * **Diretório de template** — deixe em branco para escanear `themes/` e `modules/`. Digite um caminho como `/themes/mytheme/` para restringir a varredura a um único diretório.
   * **Extensão de template** — deixe em branco para escanear arquivos `.tpl` e `.html`. Digite uma única extensão para restringir a varredura.
   * **Tentar correção automática** — marque esta caixa se quiser que o scanner repare problemas que sabe como corrigir. Deixe desmarcado para uma varredura somente leitura.
5. Pressione o botão **Executar**. O scanner percorre os diretórios selecionados e relata cada problema que encontra.

## Interpretando Resultados

O relatório de varredura lista cada arquivo que examinou e cada problema que encontrou. Cada entrada de problema informa:

* Qual arquivo contém o problema
* Que regra de Smarty 4 ele viola
* Se o scanner pôde repará-lo automaticamente

Se você executou a varredura com _Tentar correção automática_ ativada, o relatório também confirmará quais arquivos foram reescritos.

## Corrigindo Problemas Manualmente

Para problemas que o scanner não pode reparar automaticamente, abra o arquivo de template marcado em um editor e faça as alterações necessárias. As incompatibilidades comuns com Smarty 4 incluem:

* `{php} ... {/php}` blocos (não mais suportados no Smarty 4)
* Modificadores e chamadas de função descontinuados
* Uso de delimitador sensível a espaço em branco
* Suposições de plugin em tempo de registro que foram alteradas no Smarty 4

Se você não estiver confortável editando templates, a abordagem mais segura é mudar para um tema enviado (`xbootstrap5`, `default`, `xswatch5`, etc.) e lidar com o tema personalizado separadamente após a atualização ser concluída.

## Re-executando Até Estar Limpo

Após fazer correções — automáticas ou manuais — re-execute o scanner de pré-voo. Repita até que a varredura não reporte problemas restantes.

Quando a varredura estiver limpa, você pode encerrar a sessão de pré-voo pressionando o botão **Exit Scanner** na interface do scanner. Isto marca o pré-voo como completo e permite que o upgrade principal em `/upgrade/` prossiga.

## Continuando para o Upgrade

Com pré-voo completo, você pode iniciar o upgrade principal em:

```text
http://example.com/upgrade/
```

Veja [Executando Upgrade](ustep-02.md) para as próximas etapas.

## Se Você Pular Pré-voo

Pular pré-voo é fortemente desaconselhado, mas se você atualizou sem executá-lo e agora está vendo erros de template, veja a seção Erros de Template Smarty 4 em [Solução de Problemas](ustep-03.md). Você pode executar pré-voo depois dos fatos e limpar `xoops_data/caches/smarty_compile/` para se recuperar.
