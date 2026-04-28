---
title: "Solução de Problemas"
---

## Erros de Template Smarty 4

A classe mais comum de problemas ao atualizar do XOOPS 2.5.x para 2.7.0 é incompatibilidade de template Smarty 4. Se você pular ou não completar a [Verificação de Pré-voo](preflight.md), você pode ver erros de template no frontend ou na área de administração após a atualização.

Para se recuperar:

1. **Re-execute o scanner de pré-voo** em `/upgrade/preflight.php`. Aplique qualquer reparo automático que oferece ou corrija manualmente os templates marcados.
2. **Limpe o cache de template compilado.** Remova tudo exceto `index.html` de `xoops_data/caches/smarty_compile/`. Os templates compilados Smarty 3 não são compatíveis com Smarty 4 e arquivos obsoletos podem causa erros confusos.
3. **Mude para um tema enviado temporariamente.** Na área de administração, selecione `xbootstrap5` ou `default` como tema ativo. Isto confirmará se o problema está limitado a um tema personalizado ou é em todo o site.
4. **Valide qualquer tema personalizado e templates de módulo** antes de mudar o tráfego de produção de volta. Preste atenção particular aos templates que usam blocos `{php}`, modificadores descontinuados ou sintaxe de delimitador não padrão — estes são os breaks Smarty 4 mais comuns.

Veja também a seção Smarty 4 em [Tópicos Especiais](../../installation/specialtopics.md).

## Problemas de Permissão

O Upgrade do XOOPS pode precisar escrever em arquivos que foram feitos somente leitura. Se for este o caso, você verá uma mensagem assim:

![Erro de Tornar Gravável de Upgrade XOOPS](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

A solução é alterar as permissões. Você pode alterar permissões usando FTP se não tiver acesso mais direto. Aqui está um exemplo usando FileZilla:

![Alteração de Permissão de FileZilla](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Saída de Depuração

Você pode habilitar saída de depuração extra no logger adicionando um parâmetro de depuração à URL usada para iniciar o Upgrade:

```text
http://example.com/upgrade/?debug=1
```
