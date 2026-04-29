---
title: "Konfigurace databáze"
---

Tato stránka shromažďuje informace o databázi, kterou bude XOOPS používat.

Po zadání požadovaných informací a opravě případných problémů pokračujte kliknutím na tlačítko „Pokračovat“.

![Konfigurace databáze instalačního programu XOOPS](/xoops-docs/2.7/img/installation/installer-06.png)

## Údaje shromážděné v tomto kroku

### Databáze

#### Název databáze

Název databáze na hostiteli, kterou by měl XOOPS používat. Uživatel databáze zadaný v předchozím kroku by měl mít všechna oprávnění k této databázi. Instalační program se pokusí vytvořit tuto databázi, pokud neexistuje.

#### Předpona tabulky

Tato předpona bude přidána k názvům všech nových tabulek vytvořených XOOPS. To pomáhá vyhnout se konfliktům názvů, pokud je databáze sdílena s jinými aplikacemi. Jedinečná předpona také ztěžuje uhodnutí názvů tabulek, což má bezpečnostní výhody. Pokud si nejste jisti, ponechte výchozí

#### Znaková sada databáze

Instalační program má výchozí hodnotu `utf8mb4`, která podporuje celý rozsah Unicode včetně emotikonů a doplňkových znaků. Zde můžete vybrat jinou znakovou sadu, ale `utf8mb4` je doporučeno prakticky pro všechny jazyky a lokality a mělo by být ponecháno tak, jak je, pokud nemáte konkrétní důvod ji změnit.

#### Řazení databáze

Pole řazení je ve výchozím nastavení ponecháno prázdné. Pokud je prázdné, MySQL použije výchozí řazení pro kteroukoli znakovou sadu zvolenou výše (pro `utf8mb4` je to obvykle `utf8mb4_general_ci` nebo `utf8mb4_0900_ai_ci` v závislosti na verzi MySQL). Pokud potřebujete konkrétní řazení – například pro shodu s existující databází – vyberte jej zde. V opačném případě je doporučená volba ponechání prázdné.