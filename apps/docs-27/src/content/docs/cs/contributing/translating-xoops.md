---
title: "Dodatek 3: Překlad XOOPS do místního jazyka"
---

XOOPS 2.7.0 se dodává pouze se soubory v angličtině. Překlady do jiných jazyků jsou spravovány komunitou a distribuovány prostřednictvím GitHub a různých místních stránek podpory XOOPS.

## Kde najít existující překlady

- **GitHub** — překlady komunity jsou stále častěji zveřejňovány jako samostatná úložiště pod organizací [XOOPS](https://github.com/XOOPS) a na účtech jednotlivých přispěvatelů. Vyhledejte GitHub pro `xoops-language-<your-language>` nebo vyhledejte aktuální balíčky v organizaci XOOPS.
- **Místní stránky podpory XOOPS** – mnoho regionálních komunit XOOPS publikuje překlady na svých vlastních stránkách. Navštivte [https://xoops.org](https://xoops.org) a postupujte podle odkazů na místní komunity.
- **Překlady modulů** — překlady pro jednotlivé moduly komunity jsou obvykle umístěny vedle modulu samotného v organizaci `XOOPSModules25x` GitHub (`25x` v názvu je historický; moduly jsou udržovány jak pro ZXQPH000082QX7.xZ, tak pro 2.x).

Pokud již překlad pro váš jazyk existuje, přetáhněte jazykové adresáře do instalace XOOPS (viz „Jak nainstalovat překlad“ níže).

## Co je potřeba přeložit

XOOPS 2.7.0 uchovává jazykové soubory vedle kódu, který je spotřebovává. Kompletní překlad pokrývá všechna tato místa:

- **Core** — `htdocs/language/english/` — konstanty celého webu používané každou stránkou (přihlášení, běžné chyby, data, šablony pošty atd.).
- **Installer** — `htdocs/install/language/english/` — řetězce zobrazené instalačním průvodcem. Přeložte tyto *před* spuštěním instalačního programu, pokud chcete lokalizovanou instalaci.
- **Systémový modul** — `htdocs/modules/system/language/english/` — zdaleka největší sada; pokrývá celý administrátorský ovládací panel.
- **Přiložené moduly** – každý ze `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` a `htdocs/modules/debugbar/language/english/`.
- **Témata** — několik témat dodává své vlastní jazykové soubory; zkontrolujte `htdocs/themes/<theme>/language/`, pokud existuje.

Překlad „pouze jádro“ je minimální užitečná jednotka a odpovídá prvním dvěma odrážkám výše.

## Jak překládat

1. Zkopírujte adresář `english/` vedle něj a přejmenujte kopii na svůj jazyk. Název adresáře by měl být anglický název jazyka s malými písmeny (`spanish`, `german`, `french`, `japanese`, `arabic` atd.).

   
```
   htdocs/language/english/    →    htdocs/language/spanish/
   
```

2. Otevřete každý soubor `.php` v novém adresáři a přeložte **hodnoty řetězce** uvnitř volání `define()`. **ne** neměňte názvy konstant – odkazují se na ně z kódu PHP v celém jádru.

   
```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
```

3. **Uložte každý soubor jako UTF-8 *bez* BOM.** XOOPS 2.7.0 používá `utf8mb4` end-to-end (databáze, relace, výstup po jednotlivých bodech) a odmítá soubory V programu Poznámkový blok++ je to možnost **"UTF-8"**, *nikoli* "UTF-8-BOM". V kódu VS je výchozí; stačí potvrdit kódování ve stavovém řádku.

4. Aktualizujte jazyk a metadata znakové sady v horní části každého souboru tak, aby odpovídala vašemu jazyku:

   
```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   
```

   `_LANGCODE` by měl být kód [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) pro váš jazyk. `_CHARSET` je vždy `UTF-8` v XOOPS 2.7.0 — varianta ISO-8859-1 již neexistuje.

5. Opakujte pro instalační program, systémový modul a všechny přibalené moduly, které potřebujete.

## Jak nainstalovat překlad

Pokud jste získali hotový překlad jako strom adresářů:

1. Zkopírujte každý adresář `<language>/` do odpovídajícího nadřazeného adresáře `language/english/` ve vaší instalaci XOOPS. Například zkopírujte `language/spanish/` do `htdocs/language/`, `install/language/spanish/` do `htdocs/install/language/` a tak dále.
2. Ujistěte se, že vlastnictví souboru a oprávnění jsou čitelné pro webový server.
3. Buď vyberte nový jazyk při instalaci (průvodce vyhledá dostupné jazyky `htdocs/language/`), nebo na existujícím webu změňte jazyk v **Správce → Systém → Předvolby → Obecná nastavení**.

## Sdílení překladu zpět

Přispějte prosím svým překladem zpět do komunity.1. Vytvořte úložiště GitHub (nebo rozvětvete existující jazykové úložiště, pokud pro váš jazyk existuje).
2. Použijte jasný název, například `xoops-language-<language-code>` (např. `xoops-language-es`, `xoops-language-pt-br`).
3. Zrcadlete adresářovou strukturu XOOPS uvnitř vašeho úložiště, aby se soubory seřadily podle toho, kde byly zkopírovány:

   
```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   
```

4. Zahrňte dokument `README.md`:
   - Název jazyka a kód ISO
   - Kompatibilita verze XOOPS (např. `XOOPS 2.7.0+`)
   - Překladatel a úvěry
   - Zda je překlad pouze jádrový nebo pokrývá přibalené moduly
5. Otevřete žádost o stažení příslušného úložiště module/core na GitHub nebo zveřejněte oznámení na [https://xoops.org](https://xoops.org), aby jej komunita mohla najít.

> **Poznámka**
>
> Pokud váš jazyk vyžaduje změny jádra pro formátování data nebo kalendáře, zahrňte tyto změny také do balíčku. Jazyky se skripty zprava doleva (arabština, hebrejština, perština, urdština) fungují hned po vybalení v XOOPS 2.7.0 — v tomto vydání byla přidána podpora RTL a jednotlivá témata ji přebírají automaticky.