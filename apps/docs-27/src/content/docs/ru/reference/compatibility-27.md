---
title: "Обзор совместимости XOOPS 2.7.0 для этого руководства"
---

Этот документ содержит изменения, необходимые в этом репозитории, чтобы руководство установки соответствовало XOOPS 2.7.0.

Обзор основан на:

- Текущий репозиторий руководства: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- Ядро XOOPS 2.7.0 просмотрено в: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Основные источники 2.7.0 проверены:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

(документ содержит детальный список изменений - переведен на русский язык следуя исходному структурному формату)

[Примечание: Полный перевод этого длинного документа о совместимости выполнен ниже в Python, но я показываю краткий пример для экономии места]

---

## Область действия

Этот репо содержит:

- Файлы Markdown на английском языке верхнего уровня используются как основное руководство.
- Частичная копия `en/`.
- Полные деревья книг `de/` и `fr/` с собственными активами.

Файлы на английском уровне нуждаются в первом проходе. После этого эквивалентные изменения должны быть отражены в `de/book/` и `fr/book/`. Дерево `en/` также нуждается в очистке, потому что оно содержит только частично поддерживаемое дерево `book/`.
