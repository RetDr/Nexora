# GUÍA DE ARQUITECTURA Y CONFIGURACIÓN: ADAPTACIÓN A CONSULTORIO ODONTOLÓGICO (DENTAL CLINIC OS)

Este documento detalla paso a paso las configuraciones técnicas, modificaciones de datos y adaptaciones visuales necesarias para reutilizar la arquitectura frontend actual (construida sobre el sistema Cadra/Nexora) en un software integral de gestión para clínicas y consultorios odontológicos (**Dental SaaS / Clinic OS**).

---

## 1. Visión general de la reutilización

La aplicación actual cuenta con una ventaja estructural clave: **su flujo operativo de manufactura (centros de trabajo, operaciones en paralelo, control de capacidades por horas, inventario con puntos de reorden, presupuestos por fases y trazabilidad de costes) es conceptualmente análogo al funcionamiento de una clínica odontológica de alta eficiencia**.

| Concepto en Nexora (Manufactura / Cadra) | Equivalente Odontológico (Dental Clinic OS) |
| :--- | :--- |
| **Estación de trabajo / Work Center** | **Sillón dental / Gabinete (Box 1, Box 2, Quirófano dental)** |
| **Orden de trabajo (Work Order)** | **Plan de tratamiento dental / Procedimiento clínico** |
| **Operación en curso / Floor status** | **Paciente en sillón / Estado de la sala de espera** |
| **Capacidad diaria (ej. 5/8)** | **Ocupación del sillón / Horas de agenda médica disponibles** |
| **Embudo de ventas (Pipeline Kanban)** | **Embudo de presupuestos odontológicos (Diagnóstico → Aceptado → Tratamiento → Alta)** |
| **Inventario de materiales y SKUs** | **Consumibles clínicos (Anestesia, resinas, implantes, brackets, guantes)** |
| **Punto de Venta (POS)** | **Caja de recepción (Cobros de consulta, copagos de mutuas, financiación)** |
| **Libro Mayor y Contabilidad** | **Liquidación de comisiones a odontólogos y facturación a pacientes/aseguradoras** |
| **Directorio de personal (HR)** | **Equipo médico (Odontólogos especialistas, higienistas, auxiliares y recepción)** |

---

## 2. Capa de Configuración (`clinic.config.ts`)

Para desacoplar el contenido sin alterar la arquitectura base, se crea un archivo de configuración centralizado que alimente el título, identidad, módulos y navegación.

```typescript
// src/config/clinic.config.ts

export interface ClinicConfig {
  name: string
  subtitle: string
  licenseNumber: string
  currency: string
  taxRate: number
  branding: {
    primaryColor: string
    accentColor: string
    logoIcon: string // 'Stethoscope', 'Activity', 'Smile'
  }
  boxes: Array<{ id: string; name: string; doctorDefault: string; type: 'general' | 'cirugia' | 'ortodoncia' }>
  specialties: string[]
  navigation: Array<{
    key: string
    label: string
    path: string
    badge?: number
  }>
}

export const clinicConfig: ClinicConfig = {
  name: 'DentaCare',
  subtitle: 'Clínica Odontológica Integral',
  licenseNumber: 'CS-84920-OD',
  currency: 'EUR', // o USD / COP / MXN
  taxRate: 0.21,
  branding: {
    primaryColor: '#0284c7', // Azul médico/dental
    accentColor: '#0d9488',  // Turquesa clínico
    logoIcon: 'Smile'
  },
  boxes: [
    { id: 'box-1', name: 'Gabinete 1 (Odontología General)', doctorDefault: 'Dra. Sofía Valenzuela', type: 'general' },
    { id: 'box-2', name: 'Gabinete 2 (Ortodoncia)', doctorDefault: 'Dr. Alejandro Soto', type: 'ortodoncia' },
    { id: 'box-3', name: 'Gabinete 3 (Endodoncia)', doctorDefault: 'Dra. Claudia Rivas', type: 'general' },
    { id: 'box-4', name: 'Quirófano (Implantología)', doctorDefault: 'Dr. Marcos Pineda', type: 'cirugia' }
  ],
  specialties: [
    'Odontología General',
    'Ortodoncia Invisible & Brackets',
    'Implantología y Cirugía Oral',
    'Endodoncia Microscópica',
    'Estética Dental (Carillas & Blanqueamiento)',
    'Periodoncia',
    'Odontopediatría'
  ],
  navigation: [
    { key: 'dashboard', label: 'Tablero', path: '/dashboard' },
    { key: 'agenda', label: 'Agenda & Sillones', path: '/agenda/turnos', badge: 3 },
    { key: 'presupuestos', label: 'Presupuestos', path: '/presupuestos/pipeline', badge: 5 },
    { key: 'pacientes', label: 'Pacientes', path: '/pacientes/directorio' },
    { key: 'materiales', label: 'Materiales & Stock', path: '/inventario/stock', badge: 2 },
    { key: 'caja', label: 'Caja & Cobros', path: '/caja/pos' },
    { key: 'liquidaciones', label: 'Liquidaciones', path: '/finanzas/liquidaciones' },
    { key: 'informes', label: 'Informes', path: '/reporting/clinica' }
  ]
}
```

---

## 3. Adaptación Visual y Sistema de Diseño

### 3.1 Paleta de Color Clínica
En [`src/styles.css`](file:///c:/Users/danie/OneDrive/Documentos/NEXORA/src/styles.css), se adaptan las variables de acento para transmitir asepsia, profesionalismo y confianza médica:

```css
:root {
  /* Tokens de identidad dental */
  --color-accent: #0284c7;           /* Azul médico dental (reemplaza terracota) */
  --color-accent-hover: #0369a1;
  --color-accent-contrast: #ffffff;
  
  --accent-teal: #0d9488;            /* Verde turquesa de higiene */
  --accent-teal-bg: #ccfbf1;
  
  --bg-blue-card: #e0f2fe;           /* Azul pastel médico para tarjeta secundaria */
  --text-blue-card: #0369a1;
}

/* Modo oscuro clínico */
.cadra-app-root.cadra-dark {
  --color-accent: #38bdf8;
  --bg-blue-card: #0c4a6e;
  --text-blue-card: #bae6fd;
}
```

### 3.2 Relieve 3D Táctil
Se mantiene el relieve 3D implementado con borde inferior extruido (`border-bottom: 2.5px solid #cfcfc5`) e iluminación cenital reflejada (`inset 0 1px 0 rgba(255,255,255,0.95)`). Esto otorga a las tarjetas de pacientes y fichas médicas un aspecto tangible similar a paneles de instrumentos médicos de alta gama.

---

## 4. Mapeo funcional módulo por módulo

### 4.1 Dashboard (Panel de Control de la Clínica)
- **Tarjeta de Bienvenida:**
  - *Texto:* *"Buenos días, Dra. Valenzuela. 4 pacientes en gabinete, 2 en sala de espera y 8 citas confirmadas para hoy. 1 paciente prioritario requiere revisión de implante."*
- **Línea de tiempo / Scrubber diario (7:00 AM - 7:00 PM):**
  - Muestra los turnos del día como puntos con colores según la especialidad (azul: odontología general, turquesa: ortodoncia, naranja: implantes, verde: limpiezas).
- **Indicador de Caja del Día (Cash on hand):**
  - Muestra la recaudación del día (`$4,850`), pagos en tarjeta, efectivo y transferencias.
- **4 Tarjetas KPI con `<AnimatedCounter />`:**
  1. **Ingresos del mes:** `$68,400` *(Conteo animado).*
  2. **Tratamientos completados (14 días):** `84 pacientes`.
  3. **Presupuestos aceptados pendientes de inicio:** `$42,300`.
  4. **Puntualidad de citas / Ocupación de sillones:** `94%`.

### 4.2 Agenda & Sillones (Reutilización de `SchedulingPage.tsx`)
Este es el módulo de mayor valor añadido. El diagrama Gantt actual se convierte directamente en el **Organizador de Sillones y Gabinetes**:
- **Filas del Gantt:**
  - Cada fila principal representa un **Gabinete o Sillón Dental** (Gabinete 1, Gabinete 2, Quirófano).
  - Al expandir un sillón, se muestran los doctores asignados y las citas del día.
- **Bloques de Cita (Píldoras Gantt):**
  - Muestran el nombre del paciente, el tratamiento y el porcentaje de avance (ej. *"Martínez, Juan - Endodoncia Box 2 · 75%"*).
  - Código de color por estado: **Verde** (en curso a tiempo), **Rojo** (cita retrasada más de 15 minutos), **Gris/Azul** (finalizada).
- **Capacidades superiores:**
  - En lugar de `5/8 operaciones`, muestra **Horas ocupadas vs Horas disponibles del sillón** (ej. `6h/8h`).
- **Panel lateral derecho ("En gabinete ahora"):**
  - Reutiliza `liveFloorData` mostrando qué doctor está atendiendo a qué paciente en cada sillón en tiempo real.

### 4.3 Presupuestos & Planes de Tratamiento (Reutilización de `PipelinePage.tsx`)
El tablero Kanban de ventas se transforma en el **Embudo de Aceptación de Presupuestos Odontológicos**:
- **Columnas del Kanban:**
  1. **Primera visita / Diagnóstico:** Pacientes que se realizaron revisión y radiografía.
  2. **Presupuesto presentado:** Plan entregado al paciente pendiente de decisión.
  3. **Aceptado / Financiación:** Presupuesto aprobado o en proceso de validación bancaria.
  4. **En tratamiento:** Pacientes activos acudiendo a sesiones periódicas.
  5. **Alta clínica / Revisiones:** Paciente que finalizó y pasa a mantenimiento semestral.
- **Tarjetas del Kanban:**
  - Nombre del paciente, código de historia clínica, tratamiento prescrito (ej. *"Carillas de porcelana ×6"*), valor total y doctor asignado.
  - Alerta visual si han pasado más de 7 días sin respuesta de llamada de seguimiento.

### 4.4 Materiales & Stock Odontológico (Reutilización de `StockPage.tsx` y `PurchaseOrdersPage.tsx`)
- **Gestión de consumibles médicos:**
  - Categorías: *Anestésicos, Resinas & Adhesivos, Ortodoncia, Instrumental Rotatorio, Desinfección & Protección, Implantes*.
- **Puntos de reorden críticos:**
  - Avisa cuando queden menos de 2 cajas de carpules de anestesia o menos de 5 implantes de cierta medida.
- **Sección "Dónde está el dinero del stock":**
  - Gráfico desglosado: 45% en cajas de implantes, 25% en aditamentos protésicos, 20% en arcos/brackets de ortodoncia, 10% en consumibles desechables.

### 4.5 Caja & Cobros de Recepción (Reutilización de `POSPage.tsx`)
- **Terminal de cobro en mostrador:**
  - Catálogo de actos clínicos rápidos (Consulta inicial, Limpieza por ultrasonido, Empaste simple, Radiografía panorámica, Férula de descarga).
  - Carrito de cobro: permite seleccionar el paciente, asociar el doctor que realizó el acto, aplicar copago de aseguradora y dividir el pago (parte en tarjeta, parte en efectivo o financiar a plazos).
  - Emisión instantánea de recibo fiscal o factura simplificada.

### 4.6 Liquidación de Doctores (Reutilización de `GeneralLedgerPage.tsx` y `InvoicesPage.tsx`)
- **Cálculo de honorarios médicos:**
  - En las clínicas dentales, los especialistas suelen cobrar un porcentaje (30% - 50%) sobre el tratamiento realizado menos el coste de laboratorio protésico.
  - La tabla de cuentas y partidas se adapta para calcular la liquidación mensual de cada odontólogo de forma transparente.

### 4.7 Fichas de Pacientes & Odontograma (Reutilización de `DirectoryProfileDrawer.tsx`)
- El cajón lateral deslizable actual (`NH - Noor Haddad`) se adapta como la **Ficha Rápida del Paciente**:
  - Foto del paciente, teléfono, DNI, aseguradora/mutua.
  - Alergias médicas destacadas en rojo (ej. *"Alérgico a la Penicilina", "Hipertenso"*).
  - Historial de citas pasadas y tratamientos pendientes.
  - Histórico de pagos y saldo pendiente.

---

## 5. Esquema de datos para sustitución de mocks

Para reemplazar los datos mockeados de `cadraData.ts`, se crea `dentalData.ts` con la siguiente estructura:

```typescript
// src/data/dentalData.ts

export const liveCabinetData = [
  {
    id: 1,
    box: 'Gabinete 1',
    patient: 'García Moreno, Carlos',
    historyNumber: 'HC-4029',
    doctor: 'Dra. Sofía Valenzuela',
    treatment: 'Endodoncia unirradicular pieza 2.4',
    progress: 70,
    status: 'ontrack' // 'ontrack' | 'behind'
  },
  {
    id: 2,
    box: 'Quirófano',
    patient: 'López Ruiz, Elena',
    historyNumber: 'HC-3981',
    doctor: 'Dr. Marcos Pineda',
    treatment: 'Colocación 2 implantes osteointegrados',
    progress: 40,
    status: 'behind'
  }
]

export const dentalTreatmentsCatalog = [
  { id: 'T-01', name: 'Limpieza dental con ultrasonido', category: 'Higiene', price: 50 },
  { id: 'T-02', name: 'Obturación estética composite (empaste)', category: 'Conservadora', price: 65 },
  { id: 'T-03', name: 'Endodoncia birradicular mecanizada', category: 'Endodoncia', price: 180 },
  { id: 'T-04', name: 'Implante titanio grado V + corona zirconio', category: 'Implantología', price: 1150 },
  { id: 'T-05', name: 'Ortodoncia alineadores invisibles (Plan completo)', category: 'Ortodoncia', price: 3200 }
]
```

---

## 6. Lista de componentes: Reutilización directa vs. Modificación

| Componente | Estado de reutilización | Adaptación requerida |
| :--- | :--- | :--- |
| **`Header.tsx` (con píldora deslizante)** | **100% Reutilizable** | Pasar los módulos de la clínica mediante configuración. |
| **`AnimatedCounter.tsx`** | **100% Reutilizable** | Ninguna. Funciona para euros, pacientes, porcentajes y tratamientos. |
| **`LeftDock.tsx` (Dock flotante)** | **100% Reutilizable** | Cambiar íconos de accesos directos (diente, agenda, paciente rápido). |
| **`Toast.tsx`** | **100% Reutilizable** | Ninguna. Mensajes de confirmación clínica. |
| **`QuickSearchModal.tsx`** | **100% Reutilizable** | Buscar por nombre de paciente, DNI o número de historia clínica. |
| **`QuickCreateModal.tsx`** | **Reutilizable con adaptación** | Formulario rápido: "Nueva cita", "Nuevo paciente" o "Nuevo presupuesto". |
| **`SchedulingPage.tsx`** | **Estructuralmente reutilizable** | Mapear filas a Gabinetes/Sillones en lugar de Work Orders de bicicletas. |
| **`PipelinePage.tsx`** | **Estructuralmente reutilizable** | Mapear columnas a etapas de presupuestos dentales. |
| **`StockPage.tsx`** | **Estructuralmente reutilizable** | Cambiar categorías a consumibles odontológicos y anestesia. |
| **`POSPage.tsx`** | **Estructuralmente reutilizable** | Cambiar productos de bicicleta por catálogo de tratamientos dentales. |
| **Odontograma visual** | **Nuevo componente específico** | Componente SVG interactivo del esquema dental (piezas 1.1 a 4.8) que se integra en el cajón de ficha del paciente. |

---

## 7. Plan de despliegue sugerido (Fases)

1. **Fase 1: Configuración de Marca y Rutas (1 día):**
   - Crear `clinic.config.ts`.
   - Ajustar las variables CSS de color primario a azul clínico (`#0284c7`).
   - Reemplazar las rutas en `Header.tsx` con la navegación médica.
2. **Fase 2: Adaptación de Datos Mock (1 día):**
   - Sustituir `cadraData.ts` por `dentalData.ts`.
   - Renombrar las etiquetas de la Agenda de Sillones y el Embudo de Presupuestos.
3. **Fase 3: Integración del Odontograma Interactivo (2 días):**
   - Añadir widget de mapa dental gráfico dentro del drawer de pacientes para marcar piezas a tratar, empastes existentes o implantes.
4. **Fase 4: Conexión con Backend / API Dental (3 días):**
   - Conectar endpoints para historias clínicas (HL7 / FHIR o REST estándar) y persistencia en base de datos.

