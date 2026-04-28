---
title: "phpinfo"
---

Esta etapa é opcional, mas pode economizar facilmente horas de frustração.

Como um teste pré-instalação do sistema de hospedagem, um pequeno script PHP muito útil é criado localmente e enviado para o sistema de destino.

O script PHP é apenas uma linha:

```php
<?php phpinfo();
```

Usando um editor de texto, crie um arquivo nomeado _info.php_ com esta uma linha.

Em seguida, envie este arquivo para sua raiz web.

![Upload do info.php do Filezilla](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Acesse seu script abrindo-o no seu navegador, ou seja, acessando `http://example.com/info.php`. Se tudo estiver funcionando corretamente, você deverá ver uma página algo como isto:

![Exemplo de phpinfo()](/xoops-docs/2.7/img/installation/php-info.png)

Nota: alguns serviços de hospedagem podem desabilitar a função _phpinfo()_ como medida de segurança. Você geralmente receberá uma mensagem nesse sentido, se esse for o caso.

A saída do script pode ser útil para solução de problemas, portanto, considere salvar uma cópia dela.

Se o teste funcionar, você deve estar pronto para a instalação. Você deve deletar o script _info.php_ e prosseguir com a instalação.

Se o teste falhar, investigue por quê! Qualquer problema que esteja impedindo este teste simples de funcionar **impedirá** uma instalação real de funcionar.
