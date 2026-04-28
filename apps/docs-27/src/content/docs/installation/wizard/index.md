---
title: "Installation Wizard"
description: "Step-by-step walkthrough of the XOOPS installation wizard — 15 screens explained."
---

The XOOPS installation wizard guides you through a 15-step process that configures your database, creates the admin account, and prepares your site for first use.

## Before you start

- You have [uploaded XOOPS to your server](/xoops-docs/2.7/installation/ftp-upload/) or set up a local environment
- You have [verified the requirements](/xoops-docs/2.7/installation/requirements/)
- You have your database credentials ready

## Wizard steps

| Step | Screen | What happens |
|------|--------|--------------|
| 1 | [Language Selection](./step-01/) | Choose installation language |
| 2 | [Welcome](./step-02/) | License agreement |
| 3 | [Configuration Check](./step-03/) | PHP/server environment check |
| 4 | [Path Setting](./step-04/) | Set root path and URL |
| 5 | [Database Connection](./step-05/) | Enter database host, user, password |
| 6 | [Database Configuration](./step-06/) | Set database name and table prefix |
| 7 | [Save Configuration](./step-07/) | Write mainfile.php |
| 8 | [Table Creation](./step-08/) | Create the database schema |
| 9 | [Initial Settings](./step-09/) | Site name, admin email |
| 10 | [Data Insertion](./step-10/) | Populate default data |
| 11 | [Site Configuration](./step-11/) | URL, time zone, language |
| 12 | [Select Theme](./step-12/) | Choose a default theme |
| 13 | [Module Installation](./step-13/) | Install bundled modules |
| 14 | [Welcome](./step-14/) | Installation complete message |
| 15 | [Cleanup](./step-15/) | Remove the install folder |

:::caution[Security]
After completing the wizard, **delete or rename the `install/` folder** — step 15 guides you through this. Leaving it accessible is a security risk.
:::
