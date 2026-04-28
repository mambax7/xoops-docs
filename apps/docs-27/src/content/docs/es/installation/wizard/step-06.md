---
title: "Configuración de Base de Datos"
---

Esta página recopila la información sobre la base de datos que XOOPS usará.

Después de introducir la información solicitada y corregir cualquier problema, selecciona el botón "Continuar" para proceder.

![Configuración de Base de Datos del Instalador de XOOPS](/xoops-docs/2.7/img/installation/installer-06.png)

## Datos Recopilados en Este Paso

### Base de Datos

#### Nombre de base de datos

El nombre de la base de datos en el host que XOOPS debe usar. El usuario de base de datos introducido en el paso anterior debería tener todos los privilegios en esta base de datos. El instalador intentará crear esta base de datos si no existe.

#### Prefijo de tabla

Este prefijo se añadirá a los nombres de todas las nuevas tablas creadas por XOOPS. Esto ayuda a evitar conflictos de nombre si la base de datos se comparte con otras aplicaciones. Un prefijo único también hace más difícil adivinar nombres de tabla, lo que tiene beneficios de seguridad. Si no estás seguro, simplemente mantén el valor predeterminado.

#### Juego de caracteres de base de datos

El instalador por defecto es `utf8mb4`, que soporta el rango completo Unicode incluyendo emoji y caracteres suplementarios. Puedes seleccionar un juego de caracteres diferente aquí, pero `utf8mb4` es recomendado para prácticamente todos los idiomas y configuraciones locales y debería dejarse como está a menos que tengas una razón específica para cambiarlo.

#### Colación de base de datos

El campo de colación está en blanco por defecto. Cuando está en blanco, MySQL aplica la colación predeterminada para cualquier juego de caracteres que fue seleccionado anteriormente (para `utf8mb4` esto es típicamente `utf8mb4_general_ci` o `utf8mb4_0900_ai_ci`, dependiendo de la versión de MySQL). Si necesitas una colación específica — por ejemplo para coincidir con una base de datos existente — selecciona aquí. De lo contrario, dejar en blanco es la opción recomendada.
