---
title: "Spuštěný upgrade"
---

Před spuštěním hlavního upgradu se ujistěte, že jste dokončili [Preflight Check](preflight.md). Uživatelské rozhraní upgradu vyžaduje, aby byla kontrola před výstupem spuštěna alespoň jednou, a pokud tak neučiníte, nasměruje vás tam.

Spusťte upgrade nasměrováním prohlížeče do adresáře _upgrade_ vašeho webu:

```text
http://example.com/upgrade/
```

Mělo by se zobrazit tato stránka:

![Spuštění upgradu XOOPS](/xoops-docs/2.7/img/installation/upgrade-01.png)

Pokračujte kliknutím na tlačítko "Pokračovat".

Každý "Continue" postupuje přes další patch. Pokračujte, dokud nebudou aplikovány všechny opravy a nezobrazí se stránka Aktualizace systémového modulu.

![Použitá oprava upgradu XOOPS](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Co platí aktualizace 2.5.11 → 2.7.0

Při upgradu ze XOOPS 2.5.11 na 2.7.0 upgradovatel aplikuje následující opravy. Každý z nich je v průvodci prezentován jako samostatný krok, takže můžete potvrdit, co se mění:

1. **Odstraňte zastaralý přiložený PHPMailer.** Přiložená kopie PHPMailer uvnitř modulu Protector je smazána. PHPMailer je nyní dodáván prostřednictvím Composer v `xoops_lib/vendor/`.
2. **Odstraňte zastaralou složku HTMLPurifier.** Podobně se odstraní stará složka HTMLPurifier v modulu Protector. HTMLPurifier je nyní dodáván prostřednictvím Composer.
3. **Vytvořte tabulku `tokens`.** Byla přidána nová tabulka `tokens` pro obecné úložiště tokenů s rozsahem. Tabulka obsahuje sloupce pro ID tokenu, ID uživatele, rozsah, hash a časová razítka issued/expires/used a používají ji funkce založené na tokenech v XOOPS 2.7.0.
4. **Rozšířit `bannerclient.passwd`.** Sloupec `bannerclient.passwd` je rozšířen na `VARCHAR(255)`, takže může ukládat moderní hash hesel (bcrypt, argon2) namísto starého úzkého sloupce.
5. **Přidat předvolby souborů cookie relace.** Jsou vloženy dvě nové předvolby: `session_cookie_samesite` (pro atribut cookie SameSite) a `session_cookie_secure` (k vynucení souborů cookie pouze HTTPS). Podívejte se na [Po upgradu](ustep-04.md), kde najdete, jak je zkontrolovat po dokončení upgradu.

Žádný z těchto kroků se nedotýká vašich dat obsahu. Vaši uživatelé, příspěvky, obrázky a data modulu zůstanou nedotčeny.

## Výběr jazyka

Hlavní distribuce XOOPS přichází s podporou angličtiny. Podporu pro další národní prostředí poskytují [XOOPS Lokální stránky podpory](https://xoops.org/modules/xoopspartners/). Tato podpora může mít formu přizpůsobené distribuce nebo dalších souborů, které lze přidat do hlavní distribuce.

Překlady XOOPS jsou udržovány na [transifex](https://www.transifex.com/xoops/public/)

Pokud má váš upgrade XOOPS další jazykovou podporu, můžete jazyk změnit výběrem ikony jazyka v horních nabídkách a výběrem jiného jazyka.

![XOOPS jazyk upgradu](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)