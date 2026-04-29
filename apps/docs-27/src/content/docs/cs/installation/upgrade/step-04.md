---
title: "Po Upgradu"
---

## Aktualizujte systémový modul

Po použití všech potřebných oprav se výběrem _Continue_ nastaví vše pro aktualizaci modulu **systému**. Toto je velmi důležitý krok a je nutný pro správné dokončení upgradu.

![XOOPS Aktualizační systémový modul](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Vyberte _Update_ pro provedení aktualizace systémového modulu.

## Aktualizujte další dodávané moduly XOOPS

XOOPS se dodává se třemi volitelnými moduly – pm (Soukromé zprávy,) profilem (Uživatelský profil) a Protector (Protector) Měli byste provést aktualizaci kteréhokoli z těchto nainstalovaných modulů.

![XOOPS Aktualizace dalších modulů](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Aktualizujte další moduly

Je pravděpodobné, že existují aktualizace dalších modulů, které by mohly umožnit modulům pracovat lépe pod vaším nyní aktualizovaným XOOPS. Měli byste prozkoumat a použít všechny vhodné aktualizace modulu.

## Recenze New Cookie Hardening Preferences

Upgrade XOOPS 2.7.0 přidává dvě nové předvolby, které řídí způsob vydávání souborů cookie relace:

* **`session_cookie_samesite`** – řídí atribut souboru cookie SameSite. `Lax` je bezpečné výchozí nastavení pro většinu webů. Pokud váš web nespoléhá na navigaci mezi zdroji, použijte `Strict` pro maximální ochranu. `None` je vhodné pouze tehdy, pokud víte, že jej potřebujete.
* **`session_cookie_secure`** — je-li povoleno, je soubor cookie relace odesílán pouze prostřednictvím připojení HTTPS. Zapněte, pokud váš web běží na HTTPS.

Tato nastavení můžete zkontrolovat v části Možnosti systému → Předvolby → Obecná nastavení.

## Ověření vlastních motivů

Pokud váš web používá vlastní motiv, projděte rozhraním frontend a oblastí pro správu a ujistěte se, že se stránky vykreslují správně. Upgrade na Smarty 4 může ovlivnit vlastní šablony, i když kontrola před výstupem proběhla úspěšně. Pokud zaznamenáte problémy s vykreslováním, navštivte znovu [Odstraňování problémů](ustep-03.md).

## Vyčistit soubory instalace a aktualizace

Z bezpečnostních důvodů odeberte tyto adresáře ze svého webového kořenového adresáře, jakmile bude potvrzeno, že aktualizace funguje:

* `upgrade/` — adresář pracovního postupu upgradu
* `install/` — pokud existuje, buď jako `install/` nebo jako přejmenovaný adresář `installremove*`

Pokud je ponecháte na místě, zpřístupníte skripty pro upgrade a instalaci komukoli, kdo se na váš web dostane.

## Otevřete svůj web

Pokud jste se řídili radou _Vypněte své stránky_, měli byste je znovu zapnout, jakmile zjistíte, že fungují správně.