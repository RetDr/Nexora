# 📋 CHECKLIST & PARÁMETROS PARA LA TRANSICIÓN A CONSULTORIO ODONTOLÓGICO

Este documento reúne **toda la información y parámetros específicos** que necesitas definir para transformar Nexora en el software de tu clínica dental (**Dental Clinic OS**).

## 1. Identidad de Marca y Visual (Branding)

* \[x\] **Nombre de la clínica:** VitaDent

* \[x\] **Eslogan o subtítulo:** clínica odontológica

* \[x\] **Logo:**

  * Formato preferido: `.png` transparente extraído del logo original.

  * Icono alternativo (Lucide): `Sparkles` o `Smile`.

* \[x\] **Paleta de Colores Corporativos:**

  * **Color Principal / Acento:** `#9A3B8A` (Púrpura/Rosado Magenta extraído del logo).

  * **Color Secundario / Higiene:** `#8A8A8F` (Gris medio/claro extraído de los detalles visuales).

  * **Color de Fondo Modo Claro:** `#f8fafc` (Blanco clínico).

  * **Modo Oscuro:** Sí (Optimizado para contrastar con el magenta y blanco del logo, fondo `#121214`).

## 2. Información General y Parámetros Fiscales

* \[x\] **País y Moneda:** Colombia (COP `$`)

* \[x\] **Identificador Fiscal / Licencia Sanitaria:** RUT

* \[x\] **Impuesto / IVA por defecto:** `0%` (Exento de IVA por servicios de salud).

* \[x\] **Horario de atención general:** Lunes a Viernes de 8:00 AM a 7:00 PM; Sábados de 8:00 AM a 2:00 PM.

* \[x\] **Intervalo de citas en la agenda:** 30 min.

## 3. Pestañas de Navegación (Header & Menú Superior)

*(Nota: Todo el menú y la prioridad de las pestañas es 100% configurable por el administrador).*
Módulos a conservar y activar en el Header (en orden de prioridad):

* \[x\] **Pestaña 1:** `Agenda` (Control de citas y turnos).

* \[x\] **Pestaña 2:** `Pacientes` (Directorio y acceso rápido).

* \[x\] **Pestaña 3:** `Pagos` (Gestión de cobros y facturación).

* \[x\] **Pestaña 4:** `Inicio` (Dashboard diario, alertas).

* \[x\] **Pestaña 5:** `Presupuestos` (Gestión de planes de tratamiento).

* \[x\] **Pestaña 6:** `Stock` (Materiales y consumibles).

* \[x\] **Pestaña 7:** `Precios` (Configuración de tarifas y catálogo).

* \[x\] **Pestaña 8:** `Informes` (Reportes de clínica).

## 4. Equipo Médico y Personal (Módulo HR / Directorio)

* \[x\] **Odontólogos Especialistas:**

  * Dra. Sofía Valenzuela (General - 35%)

  * Dr. Alejandro Soto (Ortodoncia - 40%)

  * Dra. Claudia Rivas (Endodoncia - 40%)

  * Dr. Marcos Pineda (Cirugía - 40%)

* \[x\] **Higienistas & Auxiliares dentales:** Auxiliar General (Turno Completo, apoyo).

* \[x\] **Recepción / Administración:** Recepcionista principal (Control de Caja y Agenda).

## 5. Catálogo de Tratamientos y Tarifas (Módulo POS / Caja)

| Código | Tratamiento Dental | Categoría | Duración (min) | Precio Base | 
| ----- | ----- | ----- | ----- | ----- | 
| `T-01` | Primera consulta + Diagnóstico | Diagnóstico | 30 min | \$ 50.000 | 
| `T-02` | Limpieza dental ultrasonido | Higiene | 45 min | \$ 90.000 | 
| `T-03` | Empaste / Obturación composite | Conservadora | 45 min | \$ 120.000 | 
| `T-04` | Endodoncia unirradicular | Endodoncia | 60 min | \$ 350.000 | 
| `T-05` | Implante de titanio + corona | Implantología | 90 min | \$ 2.500.000 | 
| `T-06` | Ortodoncia (mensualidad) | Ortodoncia | 30 min | \$ 100.000 | 
| `T-07` | Blanqueamiento dental LED | Estética | 60 min | \$ 300.000 | 
| `T-08` | Extracción quirúrgica (cordal) | Cirugía | 45 min | \$ 250.000 | 

## 6. Flujo de Acceso a Pacientes

Flujo principal configurado para la gestión de pacientes:

* **Búsqueda Rápida:** Buscador general por nombre, documento o teléfono.
* **Vista Detallada:** Al seleccionar al paciente en la búsqueda, el sistema transita directamente a mostrar *toda* su información centralizada (historial clínico, evolución, odontograma, pagos y próximas citas).

## 7. Consumibles Críticos (Stock)

* \[x\] Anestesia con vasoconstrictor.

* \[x\] Composite estético.

* \[x\] Guantes de nitrilo y mascarillas quirúrgicas.

* \[x\] Cajas de implantes y aditamentos protésicos.

* \[x\] Brackets y arcos de ortodoncia.

## 8. Formas de Pago y Convenios de Aseguradoras

* \[x\] **Métodos de pago en recepción:** Efectivo, Tarjeta de Crédito/Débito, Transferencia bancaria (Nequi/Bancolombia).

* \[x\] **Aseguradoras / Mutuas:** Atención a pacientes particulares y medicina prepagada (Sura, Colsanitas).