---
title: "Preflight Check"
---

XOOPS 2.7.0 opgraderede sin skabelonmotor fra Smarty 3 til Smarty 4. Smarty 4 er strengere med hensyn til skabelonsyntaks end Smarty 3, og nogle brugerdefinerede temaer og modulskabeloner skal muligvis justeres, før de fungerer korrekt på XOOPS 2.7.

For at hjælpe med at identificere og reparere disse problemer _før_ du kører hovedopgraderingen, leveres XOOPS 2.7.0 med en **preflight-scanner** i `upgrade/`-biblioteket. Du skal køre preflight-scanneren mindst én gang, før hovedopgraderings-workflowet giver dig mulighed for at fortsætte.

## Hvad scanneren gør

Preflight-scanneren går gennem dine eksisterende temaer og modulskabeloner på udkig efter kendte Smarty 4-inkompatibiliteter. Det kan:

* **Scan** dine `themes/` og `modules/` mapper for `.tpl` og `.html` skabelonfiler, der muligvis skal ændres
* **Rapportér** problemer grupperet efter fil og efter problemtype
* **Reparer automatisk** mange almindelige problemer, når du beder det om det

Ikke alle problemer kan repareres automatisk. Nogle skabeloner har brug for manuel redigering, især hvis de bruger ældre Smarty 3 idiomer, der ikke har nogen direkte ækvivalent i Smarty 4.

## Kører scanneren

1. Kopier distributionskataloget `upgrade/` til dit websteds webrod (hvis du ikke allerede har gjort det som en del af trinnet [Forberedelser til opgradering](ustep-01.md)).
2. Peg din browser på preflighten URL:

   
```tekst
   http://example.com/upgrade/preflight.php
   
```

3. Log på med en administratorkonto, når du bliver bedt om det.
4. Scanneren præsenterer en formular med tre kontroller:
   * **Skabelonbibliotek** — lad tom for at scanne både `themes/` og `modules/`. Indtast en sti som `/themes/mytheme/` for at indsnævre scanningen til en enkelt mappe.
   * **Skabelonudvidelse** — lad tom for at scanne både `.tpl`- og `.html`-filer. Indtast en enkelt udvidelse for at indsnævre scanningen.
   * **Forsøg automatisk rettelse** — marker dette felt, hvis du ønsker, at scanneren skal reparere problemer, som den ved, hvordan den løser. Lad det være umarkeret for en skrivebeskyttet scanning.
5. Tryk på knappen **Kør**. Scanneren gennemgår de valgte mapper og rapporterer hvert problem, den finder.

## Fortolkning af resultater

Scanningsrapporten viser hver fil, den undersøgte, og hvert problem, den fandt. Hver problempost fortæller dig:

* Hvilken fil indeholder problemet
* Hvilken Smarty 4-regel den overtræder
* Om scanneren kunne reparere den automatisk

Hvis du kørte scanningen med _Attempt automatic fix_ aktiveret, vil rapporten også bekræfte, hvilke filer der blev omskrevet.

## Løsning af problemer manuelt

For problemer, som scanneren ikke kan reparere automatisk, skal du åbne den flagede skabelonfil i en editor og foretage de nødvendige ændringer. Almindelige Smarty 4-inkompatibiliteter omfatter:

* `{php} ... {/php}` blokke (understøttes ikke længere i Smarty 4)
* Forældede modifikatorer og funktionskald
* Brug af følsomt mellemrumstegn
* Antagelser om plugin-registreringstid, der ændrede sig i Smarty 4

Hvis du ikke er tryg ved at redigere skabeloner, er den sikreste tilgang at skifte til et afsendt tema (`xbootstrap5`, `default`, `xswatch5` osv.) og håndtere det brugerdefinerede tema separat, efter at opgraderingen er fuldført.

## Køres igen indtil Clean

Efter at have foretaget rettelser - uanset om de er automatiske eller manuelle - kør preflight-scanneren igen. Gentag indtil scanningen rapporterer ingen resterende problemer.

Når scanningen er ren, kan du afslutte preflight-sessionen ved at trykke på knappen **Afslut scanner** i scannerens brugergrænseflade. Dette markerer preflight som fuldført og tillader hovedopgraderingen på `/upgrade/` at fortsætte.

## Fortsætter til opgraderingen

Når preflight er gennemført, kan du starte hovedopgraderingen på:

```text
http://example.com/upgrade/
```

Se [Running Upgrade](ustep-02.md) for de næste trin.

## Hvis du springer Preflight over

Det frarådes kraftigt at springe forhåndskontrol over, men hvis du har opgraderet uden at køre det og nu ser skabelonfejl, skal du se afsnittet Smarty 4 Template Errors i [Fejlfinding](ustep-03.md). Du kan køre preflight efter kendsgerningen og rydde `xoops_data/caches/smarty_compile/` for at gendanne.
