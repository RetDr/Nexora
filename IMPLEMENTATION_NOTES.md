# NOTAS DE IMPLEMENTACIÓN — CADRA FRONTEND RECONSTRUCTION

Este documento detalla las decisiones de arquitectura, diseño visual, ingeniería frontend y limitaciones del proyecto de reconstrucción de alta fidelidad de **Cadra**.

---

## 1. Decisiones Clave de Arquitectura

1. **Estructura Modular por Dominios de Negocio**:
   - `src/types/`: Definiciones estrictas de TypeScript para cada entidad de negocio (órdenes de trabajo, Gantt, tratos del pipeline, contactos, POS, existencias, órdenes de compra, logística, contabilidad).
   - `src/data/cadraData.ts`: Colección completa y fidedigna de datos simulados locales que replican exactamente los números, clientes, códigos y métricas extraídos de las capturas de pantalla de Cadra.
   - `src/components/layout/`:
     - `Header.tsx`: Barra superior con el logotipo de Cadra / Larkspur Cycles, cápsula de navegación flotante con insignias terracota dinámicas (`Sales 4`, `Manufacturing 1`, `Stock 6`, etc.), cápsula de estado en vivo de producción (`12:02 PM`, `5 on the floor`, barra de progreso) y avatar de perfil `NH`.
     - `LeftDock.tsx`: Dock flotante negro vertical estilizado que ofrece acceso rápido a búsqueda global (`Cmd+K`), creación rápida de registros, alternancia de tema claro/oscuro, acceso al tablero de operaciones y configuración.
     - `QuickSearchModal.tsx`: Paleta de comandos con buscador predictivo y navegación por teclado.
     - `QuickCreateModal.tsx`: Formulario modal para crear órdenes, cotizaciones o contactos.
   - `src/pages/`:
     - `manufacturing/`: `SchedulingPage.tsx` (vista insignia con Gantt) y `WorkOrdersPage.tsx`.
     - `dashboard/`: `DashboardPage.tsx` con scrubber de tiempo interactivo, tarjetas KPI con sparklines, gráfico suavizado anual, embudo de ventas y operaciones de planta.
     - `sales/`: `PipelinePage.tsx` (Kanban interactivo de pedidos), `ContactsPage.tsx` (directorio A-Z con gráfico donut) y `POSPage.tsx` (terminal punto de venta con cálculo en tiempo real de subtotal, descuentos e impuestos).
     - `stock/`: `StockPage.tsx` (desglose de capital y existencias), `PurchaseOrdersPage.tsx` (órdenes de compra con indicador secuencial de 5 pasos) y `ShipmentsPage.tsx` (rastreo logístico en vivo).
     - `accounting/`: `GeneralLedgerPage.tsx` (plan de cuentas y libro diario), `InvoicesPage.tsx` (antigüedad de deuda en tramos) y `PaymentsPage.tsx` (flujo de caja y cuentas por pagar).
     - `reporting/`: `ReportingOverviewPage.tsx` (velocímetro radial y gráfico de ingresos vs costo) y `ReportBuilderPage.tsx` (generador interactivo de informes).
     - `hr/`: `DirectoryProfileDrawer.tsx` (directorio de personal y drawer lateral deslizante con la ficha completa de Noor Haddad).
     - `settings/`: `SettingsPage.tsx` (perfil empresarial con vista previa interactiva en tiempo real del documento de facturación).

2. **Sistema de Enrutamiento Hash**:
   - Totalmente compatible con la URL de la referencia original (`#/manufacturing/scheduling`, `#/manufacturing/orders`, `#/dashboard`, `#/sales/pipeline`, `#/pos`, `#/contacts`, `#/inventory/stock`, `#/purchasing/orders`, `#/logistics/shipments`, `#/accounting/ledger`, `#/accounting/invoices`, `#/accounting/payments`, `#/reporting/overview`, `#/reporting/builder`, `#/settings`, `#/hr/directory/s-noor`).
   - Escucha los eventos `hashchange` del navegador para permitir navegación hacia adelante y atrás, refresco de página directa y preservación de estado.

3. **Sistema Visual & Tokens CSS**:
   - Tipografía principal: *Plus Jakarta Sans* y *JetBrains Mono* (para números y códigos monoespaciados).
   - Superficies: Fondo `#f4f4f1` con tarjetas blancas con borde fino `#e6e6e2` y radio `16px`.
   - Paleta de estados: Acento terracota (`#d95c37`), verde esmeralda (`#15803d`), azul cobalto (`#2563eb`), y tarjetas oscuras `#141517`.
   - Compatibilidad completa con tema oscuro activable desde el dock flotante lateral.

---

## 2. Interactividad y Lógica Frontend Implementada

- **Punto de Venta (POS)**:
  - Filtrado reactivo por categorías (*Everything, Bikes, Framesets, Parts, Accessories, Apparel*).
  - Buscador predictivo por nombre o código SKU.
  - Carrito con suma, resta, eliminación individual y vaciado completo.
  - Selector de descuento (*None, 5%, 10%, 15%*) con recalculo instantáneo.
  - Respeto a las reglas fiscales indicadas en la referencia original (*Oregon has none: $0.00*).
  - Modal interactivo de recibo fiscal tras confirmar el cobro.
- **Cronograma de Fabricación (Scheduling)**:
  - Gráfico Gantt interactivo con indicador de hora actual vertical (12:02 PM en Miércoles 11).
  - Despliegue y colapso de operaciones secundarias por orden de trabajo.
  - Conexión secuencial de fases de trabajo (*TIG welding* -> *Frame alignment* -> *Powder coat*).
- **Ventas (Pipeline Kanban)**:
  - Filtro por responsable comercial (*Everyone, Omar, Elif, Mine*).
  - Avance o modificación de estado de las tarjetas.
- **Contactos & Directorio**:
  - Depurador alfabético interactivo (filtra de la A a la Z instantáneamente).
  - Marcado reactivo de favoritos con estrella (*Starred*).
  - Gráfico donut proporcional del desglose de empresas.
- **Configuración de Empresa**:
  - Reactividad bidireccional: al escribir en el formulario (Nombre comercial, Razón social, Dirección, Tax ID, Moneda), la vista previa de la factura a la derecha se actualiza en tiempo real.

---

## 3. Verificación Visual Real Realizada

Se utilizó el motor Chromium headless (Microsoft Edge) a resolución de escritorio estándar **1440 × 900 píxeles** sirviendo los assets construidos de producción para capturar y auditar visualmente las pantallas implementadas:

1. `verify_scheduling.png` comparada con `Nexora images/3. Manufac/Scheduling.png`.
2. `verify_orders.png` comparada con `Nexora images/3. Manufac/Orders.png`.
3. `verify_dashboard.png` comparada con `Nexora images/1. Dashboard/Dashboard1.png`.
4. `verify_pos.png` comparada con `Nexora images/2. Sales/Point of sale.png`.
5. `verify_pipeline.png` comparada con `Nexora images/2. Sales/Sales.png`.
6. `verify_stock.png` comparada con `Nexora images/4. Stock/Stock1.png`.
7. `verify_invoices.png` comparada con `Nexora images/5. Accounting/Invoices.png`.
8. `verify_settings.png` comparada con `Nexora images/Profile/Settings.png`.

La comparación demostró una correspondencia fiel en tipografía, jerarquía de información, alineación de elementos, micro-estados y densidad de datos.

---

## 4. Limitaciones y Alcance

- **Persistencia en Servidor**: El proyecto es estrictamente de frontend (sin backend ni base de datos remota activa). Todas las mutaciones (crear registros, modificar carrito, marcar favoritos, actualizar configuración) ocurren honestamente en el estado de React y en almacenamiento local del navegador.
- **Autenticación**: No requiere inicio de sesión con contraseña real; se presenta la sesión activa de Noor Haddad (Operations Lead).
- **Pagos Reales**: El cobro del POS emite un recibo simulado local sin conectarse a pasarelas reales de pago (Stripe/Square).

