---
title: "Após o Upgrade"
---

## Atualizar o Módulo do Sistema

Depois que todos os patches necessários foram aplicados, selecionar _Continuar_ configurará tudo para atualizar o módulo **sistema**. Esta é uma etapa muito importante e é necessária para completar o upgrade apropriadamente.

![Atualização do Módulo do Sistema XOOPS](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Selecione _Atualizar_ para realizar a atualização do módulo Sistema.

## Atualizar Outros Módulos Fornecidos pelo XOOPS

XOOPS é fornecido com três módulos opcionais - pm (Mensagem Privada,) perfil (Perfil de Usuário) e protetor (Protetor) Você deve fazer uma atualização em qualquer desses módulos que estejam instalados.

![Atualização de Outros Módulos XOOPS](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Atualizar Outros Módulos

É provável que haja atualizações para outros módulos que possam permitir que os módulos funcionem melhor sob seu XOOPS agora atualizado. Você deve investigar e aplicar quaisquer atualizações de módulo apropriadas.

## Revisar Novas Preferências de Endurecimento de Cookie

O upgrade do XOOPS 2.7.0 adiciona duas novas preferências que controlam como os cookies de sessão são emitidos:

* **`session_cookie_samesite`** — controla o atributo SameSite do cookie. `Lax` é um padrão seguro para a maioria dos sites. Use `Strict` para proteção máxima se seu site não depender de navegação entre origens. `None` é apropriado apenas se você sabe que precisa dele.
* **`session_cookie_secure`** — quando ativado, o cookie de sessão é enviado apenas sobre conexões HTTPS. Ative isto se seu site funciona em HTTPS.

Você pode revisar essas configurações em Opções de Sistema → Preferências → Configurações Gerais.

## Validar Temas Personalizados

Se seu site usar um tema personalizado, caminhe pelo frontend e pela área de administração para confirmar que as páginas são renderizadas corretamente. O upgrade para Smarty 4 pode afetar templates personalizados mesmo que a varredura de pré-voo tenha passado. Se você ver problemas de renderização, revise [Solução de Problemas](ustep-03.md).

## Limpar Arquivos de Instalação e Upgrade

Para segurança, remova esses diretórios de sua raiz da web uma vez que o upgrade seja confirmado como funcionando:

* `upgrade/` — o diretório do fluxo de trabalho de upgrade
* `install/` — se presente, como `install/` ou como diretório renomeado `installremove*`

Deixar esses em lugar expõe os scripts de upgrade e instalação a qualquer pessoa que possa alcançar seu site.

## Abrir Seu Site

Se você seguiu o conselho de _Desligar seu site_, você deve ligá-lo de volta uma vez que tenha determinado que está funcionando corretamente.
