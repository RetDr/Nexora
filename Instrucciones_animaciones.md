# IMPLEMENTACIÓN DE ANIMACIONES COORDINADAS, TRANSICIONES Y TEMAS

## 1. Objetivo general

Trabaja sobre el proyecto frontend existente. La interfaz visual ya está construida y su estructura actual debe conservarse.

Implementa un sistema global de animaciones que proporcione una experiencia fluida, elegante, rápida y consistente en todas las páginas y módulos de la aplicación.

**Prioridad máxima: coordinación entre animaciones.** No quiero una colección de efectos independientes ni una interfaz donde todos los elementos aparezcan simultáneamente. Quiero una secuencia visual organizada, con jerarquía, tiempos coherentes y transiciones naturales.

Antes de modificar el código:

1. Inspecciona la arquitectura, los componentes compartidos, el enrutamiento, el sistema de temas y las dependencias instaladas.
2. Identifica los elementos que se reutilizan entre páginas: navegación superior, pestañas, encabezados, tarjetas, indicadores numéricos, tablas, gráficos, formularios, menús, notas y modales.
3. Centraliza las reglas de animación para evitar implementaciones duplicadas o incompatibles.
4. Conserva el diseño, los colores de marca, los datos, las rutas y las funcionalidades existentes, excepto cuando sea necesario corregir el sistema de temas.

## 2. Sistema centralizado de movimiento

Define un sistema de movimiento compartido, preferiblemente mediante variables CSS y utilidades o componentes reutilizables.

Establece una escala inicial coherente:

- Microinteracciones: 120–180 ms.
- Transiciones de controles y navegación: 180–280 ms.
- Entrada de tarjetas y bloques: 300–450 ms.
- Aparición escalonada de contenido: retrasos pequeños y progresivos, normalmente de 30–70 ms entre elementos.
- Easing: curvas suaves de desaceleración para entradas y aceleración natural para salidas.

Estos valores son referencias iniciales, no reglas rígidas. Ajústalos tras probar la interfaz real.

Usa curvas de aceleración naturales, por ejemplo `cubic-bezier(0.22, 1, 0.36, 1)` para entradas suaves. Evita movimientos lineales, rebotes exagerados, escalas excesivas y duraciones que hagan lenta la navegación.

Centraliza los parámetros para poder ajustar la sensación general de toda la aplicación desde un solo lugar.

## 3. Navegación superior: indicador deslizante

El indicador rectangular negro que señala la pestaña activa no debe aparecer y desaparecer al cambiar de opción.

Debe desplazarse horizontalmente desde la pestaña anterior hasta la nueva, conservando su continuidad visual.

Requisitos:

- Calcula dinámicamente la posición horizontal y el ancho del indicador según la pestaña activa.
- Anima posición y ancho con una transición suave, sin saltos ni parpadeos.
- El indicador debe seguir correctamente el cambio de ruta, incluso cuando se navega directamente a una URL.
- Evita que el indicador se desincronice al redimensionar la ventana, cambiar el contenido o modificar el tamaño de fuente.
- Si existen pestañas desplazables horizontalmente, el indicador debe seguir funcionando.
- Conserva los estados hover, focus y active de cada opción.
- Si el indicador es oscuro, asegúrate de que siga siendo visible en ambos temas.

Implementa la solución con CSS y referencias a elementos DOM de React cuando corresponda. Utiliza `transform: translateX(...)` y ajustes de ancho cuando sea posible, evitando animar propiedades que provoquen recálculos de layout innecesarios.

Si ya existe una librería de animaciones instalada y resulta apropiada, puedes reutilizarla. No añadas dependencias pesadas sin justificación.

## 4. Entrada del encabezado y los títulos

Al acceder a una pestaña o página, los títulos y los textos importantes deben aparecer desde abajo, desplazándose ligeramente hacia su posición final.

La animación debe combinar:

- Opacidad desde 0 hasta 1.
- Desplazamiento vertical inicial pequeño, aproximadamente entre 12 y 20 px.
- Posición final exacta, sin desplazamiento residual.
- Entrada rápida, suave y limpia.

Los títulos principales, subtítulos y elementos destacados deben aparecer secuencialmente, uno después de otro, con pequeños intervalos.

La jerarquía sugerida es:

1. Título principal.
2. Subtítulo o descripción.
3. Acciones principales.
4. Indicadores o resúmenes.
5. Contenido secundario.

No animes cada palabra o letra individualmente salvo que el proyecto original lo haga claramente. La referencia principal es una entrada escalonada de textos o bloques completos, con sensación de precisión y fluidez.

Evita que los encabezados vuelvan a animarse en cada renderizado de React. La animación debe ejecutarse al entrar en una página o cuando exista un cambio de contexto que realmente lo justifique.

## 5. Contadores numéricos animados

Todos los indicadores numéricos relevantes deben animarse desde cero hasta su valor real, a una velocidad rápida y agradable.

Ejemplos: ventas, ingresos, unidades, porcentajes, totales, estadísticas y valores destacados de tarjetas.

Requisitos:

- El número comienza en 0 y llega al valor objetivo mediante una interpolación progresiva.
- La duración inicial sugerida es de 600–900 ms, ajustada según la magnitud y el contexto.
- Usa una función de aceleración que permita una lectura rápida del resultado, sin que el conteo se perciba lento.
- Conserva el formato original: separadores de miles, decimales, porcentajes, moneda, prefijos y sufijos.
- Los valores negativos, decimales y cantidades grandes deben funcionar correctamente.
- Si los datos llegan de forma asíncrona, no empieces hasta disponer de un valor válido.
- No reinicies el contador por cualquier renderizado. Reinícialo solo al entrar en la vista cuando sea intencional o cuando cambie realmente el valor que representa.
- Para valores que se actualizan continuamente, evita que el número vuelva a cero cada vez.
- Respeta la precisión original de los datos.

Implementa un componente reutilizable de contador animado, configurable por valor, duración, formato y activación.

Usa `requestAnimationFrame` o una solución equivalente eficiente. No generes actualizaciones innecesarias de estado ni múltiples bucles simultáneos.

## 6. Entrada de tarjetas y bloques

Las tarjetas deben aparecer desde abajo hacia su posición definitiva.

La animación combina:

- Opacidad progresiva.
- Desplazamiento vertical inicial aproximado de 16–24 px.
- Duración de 300–450 ms.
- Curva de desaceleración suave.
- Retrasos escalonados según la posición y la jerarquía del bloque.

Las tarjetas que pertenecen al mismo grupo deben formar una secuencia visual coordinada, no una aparición desordenada.

Aplica el comportamiento a los bloques pertinentes de todas las páginas: paneles de resumen, tarjetas de productos, módulos de configuración, secciones de reportes y otros componentes equivalentes.

Importante:

- No alteres la posición final, dimensiones, alineación o espaciado de los elementos.
- No introduzcas desplazamientos que provoquen saltos de contenido.
- No mantengas las tarjetas ocultas mientras esperan a que termine una animación anterior.
- Evita que las animaciones se repitan constantemente al actualizar datos.
- Para listas largas, utiliza grupos o ventanas de aparición y evita retrasos acumulativos excesivos.

## 7. Líneas, gráficos, notas y contenido secundario

Los gráficos, líneas divisorias, notas, etiquetas, elementos decorativos y bloques secundarios deben aparecer de forma progresiva y discreta.

Adapta el efecto al tipo de elemento:

- Líneas: aparición mediante opacidad o revelado progresivo, si el tipo de línea lo permite.
- Gráficos: aparición mediante opacidad y, cuando la biblioteca lo soporte, animación de trazado o revelado de series.
- Notas y etiquetas: transición de opacidad con un desplazamiento mínimo o sin desplazamiento.
- Elementos decorativos: aparición discreta, sin competir con el contenido principal.
- Tablas: aparición del contenedor y sus encabezados; animación escalonada de filas solo si mejora la lectura y no perjudica el rendimiento.
- Formularios: entrada suave de grupos de campos, conservando la estabilidad del layout.

No apliques una misma animación a todo indiscriminadamente. El movimiento debe comunicar jerarquía y facilitar la lectura.

Si la biblioteca de gráficos ya incorpora animaciones, configura sus opciones existentes en lugar de envolverlas en múltiples animaciones superpuestas.

## 8. Efecto general de carga progresiva

Quiero una experiencia semejante a una interfaz skeleton moderna, pero con el contenido real apareciendo de forma progresiva y coordinada.

No es necesario mostrar un skeleton falso cuando los datos ya están disponibles. El efecto deseado es que los elementos pasen de un estado visual inicial discreto a su estado definitivo mediante animaciones.

Secuencia recomendada al entrar en una página:

**Fase A — Encabezado**
- Entra el título principal.
- Entra el subtítulo.
- Aparecen las acciones principales.

**Fase B — Resumen**
- Aparecen las tarjetas principales, con retrasos cortos.
- Sus contadores comienzan a animarse al mostrarse las tarjetas.

**Fase C — Contenido principal**
- Aparecen los gráficos, tablas y bloques principales.
- Las series o líneas se revelan de forma suave cuando sea compatible.

**Fase D — Detalles**
- Aparecen las notas, etiquetas, metadatos y elementos secundarios.

No esperes obligatoriamente a que termine toda una fase para empezar la siguiente. Las fases pueden solaparse ligeramente para conseguir fluidez. La secuencia es una guía de jerarquía, no una sucesión lenta de barreras.

Mantén las animaciones suficientemente rápidas para que la aplicación siga sintiéndose inmediata.

## 9. Coordinación entre rutas y componentes

Este es el requisito más importante.

Implementa una estrategia común de entrada de páginas y aparición de contenido. Puede basarse en componentes de animación reutilizables, variantes compartidas o clases CSS coordinadas.

Reglas:

- La transición entre rutas debe sentirse continua.
- No reinicies toda la página cuando solo cambie una sección pequeña.
- Evita que el contenido antiguo y el nuevo se superpongan incorrectamente.
- No acumules retrasos de cientos de milisegundos por cada elemento.
- Los títulos deben tener prioridad visual sobre las tarjetas; las tarjetas, sobre los detalles secundarios.
- Las animaciones de los contadores deben comenzar en un momento coherente con la aparición de sus tarjetas.
- Los gráficos no deben competir con la entrada del título principal.
- Los menús, desplegables, modales y tooltips deben responder inmediatamente, sin quedar bloqueados por la animación de la página.
- Las actualizaciones de datos no deben volver a ejecutar indiscriminadamente todas las animaciones.
- Evita animar simultáneamente las mismas propiedades desde CSS, JavaScript y una biblioteca externa.

Utiliza `transform` y `opacity` siempre que sea posible. Reserva las animaciones de ancho, alto u otras propiedades de layout para los casos donde sean realmente necesarias.

## 10. Corrección completa del modo oscuro y claro

Actualmente, al cambiar entre modo oscuro y modo claro, algunos textos conservan el mismo color y pierden contraste.

Corrige el sistema de temas de toda la aplicación.

Implementa o completa un sistema de tokens semánticos compartidos, por ejemplo:

- `--color-background`
- `--color-surface`
- `--color-surface-elevated`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-border`
- `--color-accent`
- `--color-accent-contrast`
- `--color-interactive-hover`
- `--color-input-background`
- `--color-chart-grid`

El tema claro debe tener fondos claros y textos oscuros con contraste suficiente. El tema oscuro debe tener fondos oscuros y textos claros con contraste suficiente.

Requisitos:

- Todos los textos deben reaccionar al cambio de tema.
- Incluye títulos, párrafos, etiquetas, tablas, encabezados, menús, botones, formularios, placeholders, notas, tooltips, modales, gráficos y estados hover/focus/disabled.
- Corrige los colores codificados directamente en componentes que impidan cambiar de tema.
- No inviertas indiscriminadamente los colores con filtros CSS.
- Conserva los colores de marca cuando sean compatibles con la legibilidad.
- Ajusta las gráficas, ejes, leyendas, cuadrículas y tooltips al tema activo.
- El cambio de tema debe ser suave, pero breve. Anima las propiedades de color y fondo necesarias sin crear una transición lenta sobre todos los elementos.
- Evita destellos de tema incorrecto durante la carga inicial.
- Conserva la preferencia actual del usuario si el proyecto ya tiene persistencia de tema.

Valida que los colores y el contraste funcionen realmente en ambos modos. No des por corregido el tema solo porque cambie el fondo.

## 11. Accesibilidad y rendimiento

Respeta `prefers-reduced-motion`.

Cuando esté activado, reduce o elimina los desplazamientos, revelados y conteos que no sean esenciales, manteniendo el contenido completamente visible y funcional.

Además:

- No dependas de animaciones para revelar información indispensable.
- Evita elementos invisibles si la animación se cancela o no se ejecuta.
- Limpia temporizadores, observadores y `requestAnimationFrame` al desmontar componentes.
- Evita animaciones costosas de sombras, filtros o grandes superficies.
- Usa `IntersectionObserver` cuando sea útil para animar contenido al entrar en el viewport, sin repetir la animación continuamente.
- No animes cada elemento de tablas extensas.
- Verifica que el rendimiento siga siendo fluido al cambiar rápidamente entre pestañas.
- Asegura que la navegación por teclado y los estados de foco sigan funcionando.

## 12. Validación obligatoria

Una vez implementado:

1. Recorre todas las rutas y módulos de la aplicación.
2. Comprueba el indicador deslizante de la navegación superior.
3. Verifica las entradas escalonadas de encabezados y tarjetas.
4. Confirma que los contadores llegan al valor correcto y conservan el formato.
5. Comprueba gráficos, tablas, notas, menús, modales y formularios.
6. Alterna repetidamente entre los temas oscuro y claro y revisa todos los textos.
7. Prueba cambios rápidos de pestañas, navegación directa a rutas y redimensionamiento de la ventana.
8. Revisa la consola y corrige errores, advertencias relevantes y animaciones que se reinicien indebidamente.
9. Ejecuta las pruebas existentes y el build de producción.
10. Si hay herramientas de navegador disponibles, utiliza capturas de pantalla para verificar visualmente los resultados en ambas temáticas.

No te limites a instalar una biblioteca o crear unas pocas clases CSS. Implementa las animaciones en los componentes reales del proyecto.

Al finalizar, entrega un resumen con los archivos modificados, el sistema de movimiento creado, las rutas verificadas, los problemas corregidos y cualquier limitación pendiente.

## 13. Arquitectura reutilizable: requisito adicional

Evalúa si la interfaz actual puede utilizarse como una base para construir aplicaciones de otros sectores conservando su estructura visual.

Quiero distinguir entre:

- **Capa visual:** navegación, layout, tarjetas, tablas, formularios, gráficos, temas, animaciones y componentes compartidos.
- **Capa de configuración:** título de la aplicación, identidad de marca, menú, secciones, permisos y preferencias.
- **Capa de contenido:** datos, textos, métricas, tablas, gráficos, formularios y operaciones específicas del sector.
- **Capa funcional:** lógica de negocio y servicios propios de cada aplicación.

Si el proyecto no está suficientemente desacoplado, identifica las dependencias que lo impiden y propone o implementa una separación progresiva sin romper las funcionalidades actuales.

No conviertas toda la aplicación en un sistema genérico excesivamente complejo. Reutiliza lo que realmente sea común y mantén módulos específicos cuando tengan comportamientos distintos.

Al terminar, responde expresamente:

1. ¿La interfaz actual es reutilizable para otros tipos de aplicaciones?
2. ¿Qué elementos pueden cambiarse únicamente mediante configuración y datos?
3. ¿Qué componentes requieren modificaciones de código?
4. ¿Qué arquitectura recomiendas para crear nuevas aplicaciones con la misma identidad visual?
5. ¿Qué limitaciones reales existen en el estado actual del proyecto?

Distingue claramente entre funcionalidades que ya funcionan y mejoras que solo estás proponiendo. No afirmes que la aplicación es completamente reutilizable si todavía contiene dependencias específicas del negocio.

## Resultado esperado

Una interfaz con animaciones fluidas, rápidas, elegantes y coordinadas; navegación superior con indicador deslizante; encabezados y tarjetas que entran progresivamente; contadores animados; gráficos y detalles que aparecen de forma discreta; temas claro y oscuro correctamente contrastados; y una evaluación técnica honesta de la reutilización de la arquitectura.

Conserva el diseño existente. Mejora el movimiento y la consistencia visual sin convertir la interfaz en una demostración de efectos ni perjudicar la usabilidad.