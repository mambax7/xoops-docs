---
title: "Preflight Check"
---

XOOPS 2.7.0 upgraded its templating engine from Smarty 3 to Smarty 4. Smarty 4 is stricter about template syntax than Smarty 3, and some custom themes and module templates may need to be adjusted before they will work correctly on XOOPS 2.7.0.

To help identify and repair these issues _before_ you run the main upgrader, XOOPS 2.7.0 ships with a **preflight scanner** in the `upgrade/` directory. You must run the preflight scanner at least once before the main upgrade workflow will let you continue.

## What the Scanner Does

The preflight scanner walks through your existing themes and module templates looking for known Smarty 4 incompatibilities. It can:

* **Scan** your `themes/` and `modules/` directories for `.tpl` and `.html` template files that may need changes
* **Report** issues grouped by file and by type of problem
* **Automatically repair** many common issues when you ask it to

Not every problem can be repaired automatically. Some templates will need manual editing, especially if they use older Smarty 3 idioms that have no direct equivalent in Smarty 4.

## Running the Scanner

1. Copy the distribution `upgrade/` directory into your site web root (if you have not already done so as part of the [Preparations for Upgrade](ustep-01.md) step).
2. Point your browser at the preflight URL:

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Log in with an administrator account when prompted.
4. The scanner presents a form with three controls:
   * **Template directory** — leave blank to scan both `themes/` and `modules/`. Enter a path like `/themes/mytheme/` to narrow the scan to a single directory.
   * **Template extension** — leave blank to scan both `.tpl` and `.html` files. Enter a single extension to narrow the scan.
   * **Attempt automatic fix** — check this box if you want the scanner to repair issues it knows how to fix. Leave it unchecked for a read-only scan.
5. Press the **Run** button. The scanner walks the selected directories and reports each issue it finds.

## Interpreting Results

The scan report lists every file it examined and every issue it found. Each issue entry tells you:

* Which file contains the problem
* What Smarty 4 rule it violates
* Whether the scanner could repair it automatically

If you ran the scan with _Attempt automatic fix_ enabled, the report will also confirm which files were rewritten.

## Fixing Issues Manually

For issues the scanner cannot repair automatically, open the flagged template file in an editor and make the required changes. Common Smarty 4 incompatibilities include:

* `{php} ... {/php}` blocks (no longer supported in Smarty 4)
* Deprecated modifiers and function calls
* Whitespace-sensitive delimiter usage
* Register-time plugin assumptions that changed in Smarty 4

If you are not comfortable editing templates, the safest approach is to switch to a shipped theme (`xbootstrap5`, `default`, `xswatch5`, etc.) and deal with the custom theme separately after the upgrade completes.

## Re-running Until Clean

After making fixes — whether automatic or manual — re-run the preflight scanner. Repeat until the scan reports no remaining issues.

Once the scan is clean, you can end the preflight session by pressing the **Exit Scanner** button in the scanner UI. This marks preflight as complete and allows the main upgrader at `/upgrade/` to proceed.

## Continuing to the Upgrade

With preflight complete, you can launch the main upgrader at:

```text
http://example.com/upgrade/
```

See [Running Upgrade](ustep-02.md) for the next steps.

## If You Skip Preflight

Skipping preflight is strongly discouraged, but if you upgraded without running it and are now seeing template errors, see the Smarty 4 Template Errors section of [Troubleshooting](ustep-03.md). You can run preflight after the fact and clear `xoops_data/caches/smarty_compile/` to recover.
