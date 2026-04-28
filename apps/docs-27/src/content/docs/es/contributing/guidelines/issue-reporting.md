---
title: "Directrices de Reportes de Problemas"
description: "Cómo reportar errores, solicitudes de características y otros problemas de manera efectiva"
---

> Los reportes de errores y solicitudes de características efectivos son cruciales para el desarrollo de XOOPS. Esta guía lo ayuda a crear problemas de alta calidad.

---

## Antes de Reportar

### Verificar Problemas Existentes

**Siempre buscar primero:**

1. Ir a [Problemas de GitHub](https://github.com/XOOPS/XoopsCore27/issues)
2. Buscar palabras clave relacionadas con su problema
3. Verificar problemas cerrados - podría estar ya resuelto
4. Ver solicitudes de cambios - podría estar en progreso

Usar filtros de búsqueda:
- `is:issue is:open label:bug` - Errores abiertos
- `is:issue is:open label:feature` - Solicitudes de características abiertas
- `is:issue sort:updated` - Problemas actualizados recientemente

### ¿Es Realmente un Problema?

Considerar primero:

- **¿Problema de configuración?** - Verificar la documentación
- **¿Pregunta de uso?** - Preguntar en foros o comunidad Discord
- **¿Problema de seguridad?** - Ver sección #security-issues más abajo
- **¿Específico del módulo?** - Reportar al mantenedor del módulo
- **¿Específico del tema?** - Reportar al autor del tema

---

## Tipos de Problemas

### Reporte de Error

Un error es un comportamiento inesperado o defecto.

**Ejemplos:**
- El login no funciona
- Errores de base de datos
- Validación de formulario faltante
- Vulnerabilidad de seguridad

### Solicitud de Característica

Una solicitud de característica es una sugerencia para nuevas funcionalidades.

**Ejemplos:**
- Agregar soporte para nueva característica
- Mejorar funcionalidad existente
- Agregar documentación faltante
- Mejoras de rendimiento

### Mejora

Una mejora mejora la funcionalidad existente.

**Ejemplos:**
- Mensajes de error mejores
- Rendimiento mejorado
- Diseño de API mejor
- Experiencia de usuario mejorada

### Documentación

Los problemas de documentación incluyen documentación faltante o incorrecta.

**Ejemplos:**
- Documentación de API incompleta
- Guías desactualizadas
- Ejemplos de código faltantes
- Errores tipográficos en documentación

---

## Reportar un Error

### Plantilla de Reporte de Error

```markdown
## Descripción
Descripción breve y clara del error.

## Pasos para Reproducir
1. Paso uno
2. Paso dos
3. Paso tres

## Comportamiento Esperado
Qué debería suceder.

## Comportamiento Actual
Qué sucede realmente.

## Entorno
- Versión de XOOPS: X.Y.Z
- Versión de PHP: 8.2/8.3/8.4
- Base de Datos: MySQL/MariaDB versión
- Sistema Operativo: Windows/macOS/Linux
- Navegador: Chrome/Firefox/Safari

## Capturas de Pantalla
Si es aplicable, agregar capturas de pantalla mostrando el problema.

## Contexto Adicional
Cualquier otra información relevante.

## Posible Solución
Si tiene sugerencias para solucionar el problema (opcional).
```

### Ejemplo de Buen Reporte de Error

```markdown
## Descripción
La página de login muestra una página en blanco cuando falla la conexión a la base de datos.

## Pasos para Reproducir
1. Detener el servicio MySQL
2. Navegar a la página de login
3. Observar el comportamiento

## Comportamiento Esperado
Mostrar un mensaje de error amigable explicando el problema de conexión a la base de datos.

## Comportamiento Actual
La página está completamente en blanco - sin mensaje de error, sin interfaz visible.

## Entorno
- Versión de XOOPS: 2.7.0
- Versión de PHP: 8.0.28
- Base de Datos: MySQL 5.7
- Sistema Operativo: Ubuntu 20.04
- Navegador: Chrome 120

## Contexto Adicional
Esto probablemente afecte a otras páginas también. El error debe mostrarse a administradores o registrarse apropiadamente.

## Posible Solución
Verificar conexión a base de datos en header.php antes de renderizar la plantilla.
```

### Ejemplo de Mal Reporte de Error

```markdown
## Descripción
El login no funciona

## Pasos para Reproducir
No funciona

## Comportamiento Esperado
Debería funcionar

## Comportamiento Actual
No lo hace

## Entorno
Última versión
```

---

## Reportar una Solicitud de Característica

### Plantilla de Solicitud de Característica

```markdown
## Descripción
Descripción clara y concisa de la característica.

## Declaración del Problema
¿Por qué se necesita esta característica? ¿Qué problema resuelve?

## Solución Propuesta
Describir la implementación ideal o UX.

## Alternativas Consideradas
¿Hay otras formas de lograr este objetivo?

## Contexto Adicional
Mockups, ejemplos o referencias.

## Impacto Esperado
¿Cómo beneficiaría esto a los usuarios? ¿Sería un cambio importante?
```

### Ejemplo de Buena Solicitud de Característica

```markdown
## Descripción
Agregar autenticación de dos factores (2FA) para cuentas de usuario.

## Declaración del Problema
Con el aumento de brechas de seguridad, muchas plataformas CMS ahora ofrecen 2FA. Los usuarios de XOOPS desean una seguridad de cuenta más fuerte más allá de contraseñas.

## Solución Propuesta
Implementar 2FA basado en TOTP (compatible con Google Authenticator, Authy, etc.).
- Los usuarios pueden habilitar 2FA en su perfil
- Mostrar código QR para configuración
- Generar códigos de respaldo para recuperación
- Requerir código 2FA en el login

## Alternativas Consideradas
- 2FA basado en SMS (requiere integración de operador, menos seguro)
- Claves de hardware (demasiado complejo para usuarios promedio)

## Contexto Adicional
Similar a implementaciones de GitHub, GitLab y WordPress.
Referencia: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Impacto Esperado
Aumenta la seguridad de cuentas. Podría ser opcional inicialmente, obligatorio en versiones futuras.
```

---

## Problemas de Seguridad

### NO Reportar Públicamente

**Nunca crear un problema público para vulnerabilidades de seguridad.**

### Reportar Privadamente

1. **Enviar correo al equipo de seguridad:** security@xoops.org
2. **Incluir:**
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Su información de contacto

### Divulgación Responsable

- Reconoceremos recepción dentro de 48 horas
- Proporcionaremos actualizaciones cada 7 días
- Trabajaremos en una línea de tiempo de solución
- Puede solicitar crédito por el descubrimiento
- Coordinar el timing de divulgación pública

### Ejemplo de Problema de Seguridad

```
Asunto: [SECURITY] Vulnerabilidad XSS en Formulario de Comentario

Descripción:
El formulario de comentario en el módulo Publisher no escapa apropiadamente la entrada del usuario,
permitiendo ataques XSS almacenados.

Pasos para Reproducir:
1. Crear un comentario con: <img src=x onerror="alert('xss')">
2. Enviar el formulario
3. El JavaScript se ejecuta al ver el comentario

Impacto:
Los atacantes pueden robar tokens de sesión de usuario, realizar acciones como usuarios,
o desfigurar el sitio web.

Entorno:
- XOOPS 2.7.0
- Módulo Publisher 1.x
```

---

## Mejores Prácticas para Títulos de Problemas

### Buenos Títulos

```
✅ La página de login muestra error en blanco cuando falla la conexión a la base de datos
✅ Agregar soporte de autenticación de dos factores
✅ Validación de formulario no previene inyección SQL en campo de nombre
✅ Mejorar rendimiento de consulta de lista de usuarios
✅ Actualizar documentación de instalación para PHP 8.2
```

### Malos Títulos

```
❌ Error en el sistema
❌ ¡Ayuda me!!
❌ No funciona
❌ Pregunta sobre XOOPS
❌ Error
```

### Directrices para Títulos

- **Ser específico** - Mencionar qué y dónde
- **Ser conciso** - Menos de 75 caracteres
- **Usar tiempo presente** - "muestra página en blanco" no "mostró en blanco"
- **Incluir contexto** - "en panel de administración", "durante instalación"
- **Evitar palabras genéricas** - No "arreglar", "ayuda", "problema"

---

## Mejores Prácticas para Descripciones de Problemas

### Incluir Información Esencial

1. **Qué** - Descripción clara del problema
2. **Dónde** - Qué página, módulo o característica
3. **Cuándo** - Pasos para reproducir
4. **Entorno** - Versión, SO, navegador, PHP
5. **Por Qué** - Por qué es importante

### Usar Formato de Código

```markdown
Mensaje de error: `Error: Cannot find user`

Fragmento de código:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Incluir Capturas de Pantalla

Para problemas de interfaz, incluir:
- Captura de pantalla del problema
- Captura de pantalla del comportamiento esperado
- Anotar qué está mal (flechas, círculos)

### Usar Etiquetas

Agregar etiquetas para categorizar:
- `bug` - Reporte de error
- `enhancement` - Solicitud de mejora
- `documentation` - Problema de documentación
- `help wanted` - Buscando ayuda
- `good first issue` - Bueno para nuevos colaboradores

---

## Después de Reportar

### Ser Receptivo

- Verificar preguntas en comentarios del problema
- Proporcionar información adicional si se solicita
- Probar arreglos sugeridos
- Verificar que el error aún existe con nuevas versiones

### Seguir Etiqueta

- Ser respetuoso y profesional
- Asumir buenas intenciones
- No exigir arreglos - los desarrolladores son voluntarios
- Ofrecer ayuda si es posible
- Agradecer a los colaboradores por su trabajo

### Mantener Problema Enfocado

- Mantenerse en tema
- No discutir problemas no relacionados
- Enlazar a problemas relacionados en su lugar
- No usar problemas para votación de características

---

## Qué Sucede con los Problemas

### Proceso de Clasificación

1. **Nuevo problema creado** - GitHub notifica a los mantenedores
2. **Revisión inicial** - Se verifica claridad y duplicados
3. **Asignación de etiqueta** - Categorizado y priorizado
4. **Asignación** - Asignado a alguien si es apropiado
5. **Discusión** - Se recopila información adicional si es necesario

### Niveles de Prioridad

- **Crítico** - Pérdida de datos, seguridad, ruptura completa
- **Alto** - Característica importante rota, afecta a muchos usuarios
- **Medio** - Parte de característica rota, hay solución temporal
- **Bajo** - Problema menor, cosmético, o caso de uso de nicho

### Resultados de Resolución

- **Arreglado** - Problema resuelto en PR
- **No se arreglará** - Rechazado por razones técnicas o estratégicas
- **Duplicado** - Igual que otro problema
- **Inválido** - Realmente no es un problema
- **Necesita más info** - Esperando detalles adicionales

---

## Documentación Relacionada

- Código de Conducta
- Flujo de Contribución
- Directrices de Pull Request
- Descripción General de Contribución

---

#xoops #issues #bug-reporting #feature-requests #github
