# MISIÓN: RECONSTRUCCIÓN VISUAL COMPLETA DE CADRA — FRONTEND

Actúa como un **Senior Frontend Engineer, especialista en UI/UX, reverse engineering visual, React, TypeScript, CSS y pruebas visuales automatizadas**. Trabaja como un agente autónomo de programación: inspecciona los archivos, implementa, ejecuta, verifica y corrige el proyecto directamente en el entorno local.

Tu objetivo es transformar el proyecto inicial `cadra-frontend-starter` en una reconstrucción visual de alta fidelidad de la interfaz de referencia de Cadra.

Referencia original:
https://demo.codeandchill.store/cadra/#/manufacturing/scheduling

## 1. CONTEXTO DEL ENTORNO

En la carpeta de trabajo existen dos elementos principales:

- La carpeta del proyecto React/Vite que generaste anteriormente: `cadra-frontend-starter`.
- Una carpeta con las imágenes y capturas de referencia, organizada en subcarpetas que corresponden a las distintas secciones de la página original.

Ambas carpetas están ubicadas dentro de una misma carpeta principal.

Primero, inspecciona el directorio actual y sus subdirectorios para descubrir la estructura y los nombres reales. No supongas que las carpetas tienen nombres distintos de los que encuentres.

El proyecto existente es una base inicial. Puede tener pantallas genéricas, datos ficticios, componentes provisionales, estilos aproximados y funcionalidades incompletas.

**No te limites a modificar colores ni a conservar una implementación genérica. Debes utilizar las referencias visuales para reconstruir cada pantalla.**

## 2. REGLAS DE TRABAJO

1. Trabaja directamente sobre el proyecto existente. No crees una segunda aplicación innecesaria.
2. Antes de modificar archivos, inspecciona el proyecto completo: `package.json`, `src`, componentes, páginas, estilos, recursos y configuración.
3. Inspecciona todas las imágenes de referencia, no solamente las primeras que encuentres.
4. Conserva los recursos originales y reutiliza las imágenes, iconos y elementos gráficos que correspondan a la interfaz.
5. No elimines funcionalidades que ya estén implementadas correctamente.
6. No sustituyas pantallas complejas por tarjetas genéricas para terminar más rápido.
7. No inventes capturas de referencia ni afirmes haber comparado visualmente una pantalla si no lo has hecho.
8. No sobrescribas la carpeta de referencias.
9. No añadas dependencias innecesarias ni introduzcas librerías incompatibles con el proyecto.
10. No te detengas a solicitar aprobación para decisiones visuales ordinarias. Inspecciona, decide e implementa.
11. Si una herramienta no está disponible, busca una alternativa viable y continúa.
12. No expongas credenciales, tokens ni variables de entorno.
13. Mantén el código organizado, tipado, reutilizable y mantenible.
14. No afirmes que una función funciona si no la has probado.
15. Antes de terminar, ejecuta las comprobaciones disponibles y corrige los errores detectados.

## 3. FASE 1: AUDITORÍA DEL PROYECTO Y LAS REFERENCIAS

Antes de programar:

### 3.1. Inspecciona el proyecto

Identifica:
- Framework, versión de React y versión de TypeScript.
- Herramienta de construcción y scripts disponibles.
- Estructura de componentes, rutas y páginas.
- Sistema actual de estilos y tipografía.
- Iconos y dependencias existentes.
- Funcionalidades ya implementadas.
- Errores o problemas estructurales del código inicial.

### 3.2. Inspecciona la carpeta de imágenes

Recorre recursivamente todas las subcarpetas de referencias.

Identifica:
- Capturas completas de páginas.
- Capturas parciales o acercamientos.
- Logotipos, iconos, ilustraciones y fotografías.
- Recursos repetidos.
- Imágenes que puedan corresponder a productos o elementos específicos.
- Dimensiones, formatos y posibles variantes de cada imagen.

Si hay muchas imágenes, crea un inventario que relacione cada archivo con su carpeta, dimensiones y posible sección de la interfaz.

Utiliza las herramientas disponibles para inspeccionar las imágenes visualmente en grupos cuando sea posible. Si el agente no puede visualizar directamente los archivos, utiliza una herramienta local de generación de hojas de contacto o un método alternativo que permita revisar las capturas. No te limites a leer los nombres de los archivos.

Crea un archivo `REFERENCE_MAP.md` con:
- Estructura de las carpetas encontradas.
- Capturas asociadas a cada módulo.
- Recursos gráficos relevantes.
- Elementos visuales compartidos.
- Dudas o referencias que no puedan identificarse con seguridad.

Este archivo debe basarse en los recursos reales que encuentres.

### 3.3. Inspecciona la referencia web

Abre la URL original con el navegador disponible para el agente.

Si la aplicación sigue accesible:
- Inspecciona la pantalla inicial.
- Examina las rutas y los módulos navegables.
- Observa el comportamiento de la navegación lateral y superior.
- Comprueba los estados desplegados, los modales, los filtros y las tablas.
- Identifica las dimensiones aproximadas de la interfaz.
- Observa las interacciones que puedan reproducirse en el frontend.

Si no puedes acceder a la página, continúa con las capturas locales. No inventes información sobre lo que no has podido inspeccionar.

## 4. FASE 2: DEFINIR LA ARQUITECTURA VISUAL

Utiliza la implementación existente como punto de partida, pero refactoriza lo necesario.

Organiza el código de manera lógica. Por ejemplo:

- `src/components/layout/`: barra superior, navegación lateral, breadcrumbs y estructura compartida.
- `src/components/ui/`: botones, campos, selectores, badges, menús y componentes visuales.
- `src/components/data-display/`: tablas, métricas, gráficos y estados vacíos.
- `src/pages/`: páginas y módulos.
- `src/data/`: datos locales de demostración.
- `src/styles/`: variables, temas, estilos globales y componentes si la estructura actual lo permite.

No tienes que adoptar literalmente esta estructura si el proyecto ya dispone de una organización mejor.

### Sistema visual

Extrae de las referencias reales:
- Colores de fondo, superficies, bordes y texto.
- Colores de acciones principales y estados.
- Tipografía, tamaños, pesos y alturas de línea.
- Espaciados, márgenes, rellenos y separaciones.
- Radios de borde y sombras.
- Alturas de cabeceras, barras de navegación y filas.
- Anchos de columnas y paneles.
- Estados hover, activo, seleccionado, deshabilitado y enfocado.

Define variables CSS reutilizables para los valores compartidos.

No te bases únicamente en los estilos aproximados de la primera versión: corrige cualquier diferencia con respecto a las referencias.

### Componentes compartidos

Implementa una estructura coherente para:
- Barra de navegación superior.
- Navegación lateral expandida y contraída.
- Submenús y estados activos.
- Breadcrumbs.
- Títulos y descripciones de página.
- Botones y controles.
- Tarjetas y paneles.
- Tablas y paginación.
- Campos de búsqueda y filtros.
- Modales y menús contextuales.
- Notificaciones de éxito y error.
- Estados vacíos y de carga.

La navegación debe cambiar realmente el contenido de la aplicación. No deben ser botones decorativos.

## 5. FASE 3: RECONSTRUIR TODAS LAS PANTALLAS

Examina las carpetas de referencia y genera una lista de todas las secciones que aparecen.

**Cada sección identificada debe tener su propia pantalla o vista específica**, según corresponda a la estructura real de la aplicación.

No asumas que una captura representa una sección completa: puede haber subpáginas, pestañas, filtros o estados adicionales.

Para cada pantalla:

1. Encuentra su captura de referencia.
2. Identifica el layout, las columnas, los paneles y los controles.
3. Determina qué componentes son compartidos y cuáles son exclusivos.
4. Implementa la estructura visual.
5. Sustituye los datos genéricos por datos de demostración coherentes con esa sección.
6. Añade las interacciones necesarias.
7. Ejecuta la pantalla.
8. Compara el resultado con la captura.
9. Corrige las diferencias antes de continuar.

Presta especial atención a:
- Dimensiones y alineación de los componentes.
- Densidad de información.
- Cantidad de filas y columnas.
- Tipografía y jerarquía visual.
- Distribución de espacios.
- Tamaños de botones y controles.
- Estados y colores de los elementos.
- Posición y proporciones de paneles.
- Iconografía y recursos originales.

No reduzcas tablas extensas a tres filas si las referencias muestran más contenido. No sustituyas gráficos, cronogramas o vistas especializadas por simples tarjetas si la captura presenta una estructura diferente.

### Prioridad de implementación

Utiliza esta prioridad para organizar el trabajo, sin dejar de completar las demás secciones detectadas:

1. Layout global y navegación.
2. Manufacturing → Scheduling, la pantalla principal de referencia.
3. El resto de las pantallas de Manufacturing.
4. Dashboard.
5. Módulos de ventas, clientes, inventario, compras y logística que existan en las referencias.
6. Contabilidad, facturas, pagos y reportes.
7. Configuración, perfil y demás vistas identificadas.

Esta lista es orientativa: el inventario real de imágenes determina el alcance definitivo.

## 6. FASE 4: RUTAS Y NAVEGACIÓN

La referencia original utiliza una URL con hash:

`#/manufacturing/scheduling`

Mantén la compatibilidad con esa estructura si corresponde a las rutas identificadas en la aplicación.

Comprueba:
- Navegación directa mediante URL.
- Cambio de página desde la barra lateral.
- Estados activos correctos.
- Submenús expandibles.
- Navegación hacia atrás y adelante del navegador.
- Carga de una página concreta al refrescar.
- Ausencia de rutas rotas.
- Tratamiento de las rutas desconocidas.

Puedes utilizar el sistema de routing ya instalado o implementar una solución ligera compatible con el proyecto.

No conviertas todas las rutas en una sola pantalla cuyo título cambia, salvo que la referencia realmente funcione así.

## 7. FASE 5: FUNCIONALIDAD DEL FRONTEND

El objetivo es reconstruir el frontend. No necesitas desarrollar el backend original.

Sin embargo, las interacciones visibles deben funcionar con datos locales.

Implementa, cuando corresponda:

- Búsqueda real dentro de las tablas.
- Filtros funcionales.
- Ordenamiento de columnas.
- Paginación coherente.
- Selección individual y múltiple de registros.
- Menús desplegables.
- Formularios con validación.
- Creación y edición local de registros cuando la interfaz lo permita.
- Confirmación o cancelación de acciones.
- Modales que puedan abrirse y cerrarse.
- Cambio de pestañas.
- Cambio entre vistas.
- Acciones de los botones principales.
- Selección de productos y modificación de cantidades en el punto de venta.
- Cálculo coherente de subtotales y totales.
- Controles de configuración.
- Alternancia entre tema claro y oscuro si la interfaz la ofrece.
- Notificaciones cuando se complete una acción local.

Utiliza estado de React y datos locales. Si una interacción no puede conectarse a un backend inexistente, simula su comportamiento de manera honesta.

No muestres mensajes que indiquen que se ha guardado información en un servidor si solo se ha actualizado el estado local.

No conectes servicios externos ni proceses pagos reales.

## 8. FASE 6: CALIDAD VISUAL Y RESPONSIVE

La fidelidad visual en escritorio es la prioridad, porque se trata de una aplicación de gestión.

Usa las dimensiones de las capturas para establecer el viewport de comparación. Si no se conoce la resolución original, utiliza como punto de partida 1440 × 900 píxeles y documenta esta decisión.

Después comprueba también:
- Escritorio: 1440 × 900.
- Portátil: 1366 × 768.
- Tablet: aproximadamente 768 píxeles de ancho.
- Móvil: aproximadamente 390 píxeles de ancho.

Evita:
- Desbordamientos horizontales accidentales.
- Elementos superpuestos.
- Tablas ilegibles.
- Textos cortados sin motivo.
- Barras laterales que oculten el contenido de forma incorrecta.
- Modales fuera del viewport.
- Controles demasiado pequeños.
- Espacios vacíos excesivos.
- Diseños que cambien de forma incoherente entre páginas.

No fuerces una tabla de escritorio a convertirse en tarjetas móviles si eso no resulta apropiado. Puedes utilizar desplazamiento horizontal controlado para tablas complejas.

## 9. FASE 7: VERIFICACIÓN VISUAL REAL

Esta fase es obligatoria.

Primero, descubre qué herramientas de navegador y automatización están disponibles en tu entorno.

Si dispones de un navegador controlable, utilízalo para abrir tanto la referencia como la implementación local.

Si dispones de Playwright, Puppeteer u otra herramienta equivalente, puedes utilizarla para:
- Abrir las rutas.
- Capturar pantallas.
- Interactuar con los controles.
- Comprobar errores de consola.
- Detectar fallos de navegación.
- Verificar el comportamiento responsive.

No instales herramientas grandes si ya existe una alternativa funcional.

### Comparación visual

Para cada pantalla importante:

1. Captura la referencia y la implementación con el mismo viewport, cuando sea posible.
2. Compara las capturas lado a lado.
3. Comprueba proporciones, posiciones, tamaños, tipografía, colores y densidad.
4. Identifica las diferencias visuales más importantes.
5. Corrige el código.
6. Vuelve a capturar la pantalla.
7. Repite hasta que el resultado sea razonablemente fiel.

Si es posible, genera imágenes superpuestas o mapas de diferencias mediante herramientas locales.

No consideres suficiente una comparación basada solamente en el DOM, los nombres de clases o la ausencia de errores de compilación.

Si la página original no está disponible, compara contra las capturas locales y deja constancia de esta limitación.

No afirmes que has realizado una comparación visual si no tienes acceso a un mecanismo que permita inspeccionar las capturas.

## 10. FASE 8: PRUEBAS Y ESTABILIDAD

Ejecuta las comprobaciones disponibles en `package.json`.

Como mínimo:
- Instala dependencias si hace falta.
- Ejecuta el build de producción.
- Corrige errores de TypeScript.
- Corrige errores de compilación.
- Comprueba que la aplicación inicia.
- Comprueba que las rutas principales cargan.
- Revisa errores de consola.
- Comprueba imágenes y recursos no encontrados.
- Prueba los controles principales.
- Verifica los cálculos del punto de venta.
- Verifica los formularios y sus validaciones.

Si no hay pruebas automatizadas, añade pruebas razonables para los comportamientos críticos, siempre que no implique complicar innecesariamente el proyecto.

No ocultes errores mediante configuraciones permisivas de TypeScript ni desactives comprobaciones para conseguir un build aparentemente correcto.

## 11. RESTRICCIONES IMPORTANTES

- Solo frontend.
- Sin backend obligatorio.
- Sin autenticación real.
- Sin pagos reales.
- Sin dependencias de APIs privadas de Cadra.
- Sin copiar credenciales ni información sensible.
- Sin incorporar código fuente propietario obtenido sin autorización.
- Se permite reconstruir la presentación y el comportamiento visible utilizando las capturas y recursos de referencia disponibles.

La implementación debe ser una recreación independiente, mantenible y ejecutable localmente.

## 12. CRITERIOS DE ACEPTACIÓN

La tarea no se considera terminada simplemente porque la aplicación compile.

Debe cumplir los siguientes criterios:

1. Todas las secciones identificadas en las referencias tienen una vista correspondiente.
2. El layout compartido mantiene una apariencia consistente.
3. Las pantallas principales reproducen de forma fiel la distribución de las capturas.
4. Se utilizan los recursos gráficos apropiados.
5. La navegación funciona.
6. Las búsquedas, filtros, pestañas y acciones principales funcionan cuando están presentes.
7. El punto de venta calcula correctamente los totales.
8. La aplicación se adapta razonablemente a distintos tamaños de pantalla.
9. No hay errores críticos de ejecución ni rutas principales rotas.
10. El build de producción termina correctamente.
11. Se ha realizado una verificación visual real de las pantallas para las que hay herramientas disponibles.
12. Las limitaciones restantes están documentadas.

No inventes un porcentaje de fidelidad visual ni declares que la interfaz es idéntica si no existe una comparación que lo respalde.

## 13. ENTREGA FINAL

Al terminar:

- Deja el código implementado en la carpeta del proyecto original.
- Mantén intacta la carpeta de imágenes de referencia.
- Crea o actualiza `REFERENCE_MAP.md`.
- Crea `IMPLEMENTATION_NOTES.md` con decisiones importantes y limitaciones.
- Añade instrucciones de ejecución en `README.md`.
- Deja el proyecto arrancando con los comandos habituales de Vite.
- Elimina código muerto, duplicaciones innecesarias y errores detectados durante el trabajo.
- No elimines archivos útiles sin verificar su propósito.

Al final, presenta un informe breve que incluya:
1. Pantallas completadas.
2. Funcionalidades implementadas.
3. Pruebas ejecutadas y sus resultados.
4. Verificación visual realizada.
5. Limitaciones que siguen pendientes.
6. Comandos para ejecutar el proyecto.

## INSTRUCCIÓN FINAL

Comienza inspeccionando el directorio actual, localizando el proyecto y las referencias. Después trabaja de forma autónoma, implementando y verificando cada parte.

**No me entregues únicamente un plan, una lista de recomendaciones ni fragmentos de código. Modifica los archivos reales del proyecto y lleva la implementación tan lejos como permitan las herramientas disponibles.**

Prioriza una interfaz visualmente fiel, funcional, consistente y mantenible por encima de una implementación rápida pero genérica.