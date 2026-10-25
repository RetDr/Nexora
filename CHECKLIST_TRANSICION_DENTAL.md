# 📋 CHECKLIST & PARÁMETROS PARA LA TRANSICIÓN A CONSULTORIO ODONTOLÓGICO

Este documento reúne **toda la información y parámetros específicos** que necesitas definir para transformar Nexora en el software de tu clínica dental (**Dental Clinic OS**). 

Puedes usar esta plantilla rellenando los campos entre corchetes `[ ]`.

---

## 1. Identidad de Marca y Visual (Branding)
- [ ] **Nombre de la clínica:** *(Ej: DentaCare, OdontoAdvance, Clínica Dental San Lucas)*
- [ ] **Eslogan o subtítulo:** *(Ej: Clínica Odontológica Integral, Especialistas en Estética y Cirugía)*
- [ ] **Logo:** 
  - Formato preferido: Vectorial `.svg` o `.png` transparente (mínimo `256x256px` o versión horizontal `180x48px`).
  - Si no hay archivo aún: elegir icono de Lucide *(ej. `Smile`, `Stethoscope`, `Activity`, `Sparkles`, `ShieldCheck`)*.
- [ ] **Paleta de Colores Corporativos:**
  - **Color Principal / Acento:** *(Ej. `#0284c7` Azul médico, `#0ea5e9` Celeste cian, `#059669` Verde salud)*.
  - **Color Secundario / Higiene:** *(Ej. `#0d9488` Turquesa clínico)*.
  - **Color de Fondo Modo Claro:** *(Por defecto Cadra: `#f5f5f3` o blanco clínico `#f8fafc`)*.
  - **Modo Oscuro:** *(¿Deseas conservarlo activo? Sí / No)*.

---

## 2. Información General y Parámetros Fiscales
- [ ] **País y Moneda:** *(Ej: USD `$`, EUR `€`, COP `$`, MXN `$`)*.
- [ ] **Identificador Fiscal / Licencia Sanitaria:** *(Ej: NIF / RUT / Registro Sanitario)*.
- [ ] **Impuesto / IVA por defecto:** *(Ej: `0%` exento de IVA por salud, o `21%`, `19%`, `16%`)*.
- [ ] **Horario de atención general:** *(Ej: Lunes a Viernes de 8:00 AM a 7:00 PM; Sábados de 8:00 AM a 2:00 PM)*.
- [ ] **Intervalo de citas en la agenda:** *(Ej: 15 min, 30 min, 45 min o 60 min)*.

---

## 3. Pestañas de Navegación (Header & Menú Superior)
En la barra de pestañas central (`Header`), ¿cuáles de estos módulos deseas conservar o renombrar?
- [ ] **Pestaña 1:** `Dashboard` o `Inicio` *(Resumen diario, recaudación, citas del día, alertas)*.
- [ ] **Pestaña 2:** `Agenda` o `Sillones` *(Gantt de Boxes dentales y turnos en paralelo)*.
- [ ] **Pestaña 3:** `Presupuestos` o `Tratamientos` *(Embudo Kanban de planes propuestos y aceptados)*.
- [ ] **Pestaña 4:** `Pacientes` o `Directorio` *(Fichas médicas, historial clínico y odontograma)*.
- [ ] **Pestaña 5:** `Materiales` o `Stock` *(Consumibles clínicos, anestesia, resinas, alertas de stock mínimo)*.
- [ ] **Pestaña 6:** `Caja & Cobros` *(Punto de venta en recepción, recibos y facturas)*.
- [ ] **Pestaña 7:** `Liquidaciones` o `Finanzas` *(Honorarios médicos de doctores y balance general)*.
- [ ] **Pestaña 8:** `Reportes` o `Informes` *(Rentabilidad por sillón, tasa de aceptación de presupuestos)*.

---

## 4. Sillones Dentales / Gabinetes (Estructura de la Agenda Gantt)
Define los sillones o salas de atención con los que cuenta la clínica:

| ID Sillón | Nombre del Gabinete | Tipo de Sala | Doctor(a) Asignado por defecto |
| :--- | :--- | :--- | :--- |
| `box-1` | *Gabinete 1* | Odontología General | *Dra. Sofía Valenzuela* |
| `box-2` | *Gabinete 2* | Ortodoncia | *Dr. Alejandro Soto* |
| `box-3` | *Gabinete 3* | Endodoncia / Estética | *Dra. Claudia Rivas* |
| `box-4` | *Quirófano* | Cirugía e Implantes | *Dr. Marcos Pineda* |

---

## 5. Equipo Médico y Personal (Módulo HR / Directorio)
Datos para cargar en el directorio del personal:
- [ ] **Odontólogos Especialistas:** Nombres, especialidad, porcentaje de honorarios *(ej. 35% o 40%)*, teléfono y correo.
- [ ] **Higienistas & Auxiliares dentales:** Nombres, turno de trabajo y sillón de apoyo asignado.
- [ ] **Recepción / Administración:** Responsable de caja y llamadas de seguimiento.

---

## 6. Catálogo de Tratamientos y Tarifas (Módulo POS / Caja)
Define tus 8 a 15 tratamientos más frecuentes con su precio base y duración estimada:

| Código | Tratamiento Dental | Categoría | Duración (min) | Precio Base |
| :--- | :--- | :--- | :--- | :--- |
| `T-01` | *Primera consulta + Diagnóstico* | Diagnóstico | 30 min | *$0 / $30* |
| `T-02` | *Limpieza dental ultrasonido* | Higiene | 45 min | *$50* |
| `T-03` | *Empaste / Obturación composite* | Conservadora | 45 min | *$65* |
| `T-04` | *Endodoncia unirradicular* | Endodoncia | 60 min | *$180* |
| `T-05` | *Implante de titanio + corona* | Implantología | 90 min | *$1,150* |
| `T-06` | *Ortodoncia invisible (mensualidad)* | Ortodoncia | 30 min | *$120* |
| `T-07` | *Blanqueamiento dental LED* | Estética | 60 min | *$220* |
| `T-08` | *Extracción quirúrgica (cordal)* | Cirugía | 45 min | *$110* |

---

## 7. Embudo de Presupuestos (Pipeline Kanban)
¿Cuáles etapas prefieres para el seguimiento de pacientes? *(Sugerencia estándar)*:
1. `1ª Visita / Diagnóstico` *(Cita realizada, presupuesto pendiente de redactar)*.
2. `Presupuesto Entregado` *(Esperando respuesta del paciente)*.
3. `Aceptado / Financiación` *(Aprobado, listo para iniciar)*.
4. `En Tratamiento` *(Acudiendo a sesiones periódicas)*.
5. `Finalizado / Mantenimiento` *(Alta clínica con revisión cada 6 meses)*.

---

## 8. Consumibles Críticos (Stock)
Lista de 5 a 10 materiales cuyo control de inventario es prioritario:
- Anestesia con vasoconstrictor *(ej. Mepivacaína / Articaína)*.
- Composite estético *(jeringas / cápsulas A2, A3)*.
- Guantes de nitrilo y mascarillas quirúrgicas.
- Cajas de implantes y aditamentos protésicos.
- Brackets y arcos de ortodoncia.

---

## 9. Formas de Pago y Convenios de Aseguradoras
- [ ] **Métodos de pago en recepción:** Efectivo, Tarjeta (TPV / Datáfono), Transferencia bancaria, Financiación a plazos *(ej. 3, 6, 12 meses)*.
- [ ] **Aseguradoras / Mutuas (si aplica):** *(Ej. Sanitas, Adeslas, Sura, Colmédica, MetLife o solo pacientes particulares)*.

---

## 💡 ¿Cómo lo aplicamos una vez tengas estos datos?
Solo necesitas responder con los datos que tengas disponibles (no hace falta que estén todos al 100%, podemos usar valores por defecto para lo que falte), y nosotros generaremos:
1. El archivo central [`src/config/clinic.config.ts`](file:///c:/Users/danie/OneDrive/Documentos/NEXORA/src/config/clinic.config.ts) que inyectará toda tu información en la app.
2. La actualización automática del `Header`, la `Agenda Gantt` y el `Catálogo POS`.

