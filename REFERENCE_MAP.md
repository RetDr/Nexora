# REFERENCE MAP — CADRA UI RECONSTRUCTION

Este documento mapea la estructura de carpetas de imágenes de referencia contra los módulos, rutas y componentes de la aplicación Cadra reconstruida.

## 1. Estructura de Carpetas de Referencia

```
Nexora images/
├── 1. Dashboard/
│   ├── Dashboard1.png         # Vista superior de Cadra Dashboard
│   └── Dashboard2.png         # Vista inferior de Cadra Dashboard
├── 2. Sales/
│   ├── Sales.png              # Tablero Kanban de ventas (#/sales/pipeline)
│   ├── Contacts.png           # Directorio y libreta de contactos (#/contacts)
│   ├── Point of sale.png      # POS: Catálogo y carrito (#/pos)
│   └── Point of sale2.png     # POS: Ventas del día e historial (#/pos)
├── 3. Manufac/
│   ├── Scheduling.png         # Pantalla principal: Cronograma Gantt (#/manufacturing/scheduling)
│   └── Orders.png             # Órdenes de trabajo (#/manufacturing/orders)
├── 4. Stock/
│   ├── Stock1.png             # Stock: KPIs, desglose de capital (#/inventory/stock)
│   ├── Stock2.png             # Stock: Tabla detallada de existencias por sede
│   ├── Purchase orders.png    # Órdenes de compra a proveedores (#/purchasing/orders)
│   └── Shipments.png          # Envíos y logística en ruta (#/logistics/shipments)
├── 5. Accounting/
│   ├── General ledger.png     # Libro mayor y diario contable (#/accounting/ledger)
│   ├── Invoices.png           # Facturación y análisis de antigüedad (#/accounting/invoices)
│   ├── Payments.png           # Flujo de caja y movimientos (#/accounting/payments)
│   └── Payments2.png          # Historial de transacciones y facturas por pagar
├── 6. Reporting/
│   ├── Overview.png           # Reporte general y velocímetro de entregas (#/reporting/overview)
│   └── Report builder.png     # Generador de reportes interactivo (#/reporting/builder)
└── Profile/
    ├── Profile.png            # Drawer / Ficha de empleado (#/hr/directory/s-noor)
    └── Settings.png           # Configuración de empresa y vista previa (#/settings)
```

## 2. Mapa de Rutas de la Aplicación

| Módulo | Ruta Hash | Sub-pestañas / Sub-módulos | Vista Reconstruida |
|---|---|---|---|
| **Dashboard** | `#/dashboard` | — | Dashboard completo con scrubber temporal, tarjetas KPI, gráfica anual, embudo de ventas, On the floor today y Running low |
| **Manufacturing** | `#/manufacturing/scheduling` | Scheduling, Work orders | Cronograma Gantt interactivo con curva de operaciones, indicador de hora 12:02 PM, panel lateral en vivo |
| | `#/manufacturing/orders` | Scheduling, Work orders | Tarjetas KPI de producción, filtros de estado, tabla con ruta visual por estaciones |
| **Sales** | `#/sales/pipeline` | Pipeline, Sales orders, Quotes, Customers | Tablero Kanban arrastrable/interactivo, filtros por vendedor, KPIs |
| | `#/contacts` | All, Customers, Vendors, Partners | Libreta A-Z con buscador, chips de contacto, gráfico donut |
| | `#/pos` | Categorías (Bikes, Framesets, Parts, etc.) | Terminal POS con catálogo, carrito, cálculo de impuestos/descuentos, cobro y métricas del día |
| **Stock / Inventory** | `#/inventory/stock` | Stock, Warehouses, Movements | Capital en inventario, reorden de piezas críticas, niveles por sede (SEW, DIV, PHL) |
| | `#/purchasing/orders` | Purchase orders, Vendors, Requests for quote | Órdenes de compra con estatus secuencial por puntos |
| | `#/logistics/shipments` | Shipments, Delivery routes | Logística y envíos en ruta con seguimiento Portland -> door |
| **Accounting** | `#/accounting/ledger` | General ledger, Invoices, Payments, Statements | Plan de cuentas y libro diario con filtro de fuente |
| | `#/accounting/invoices` | General ledger, Invoices, Payments, Statements | Cuentas por cobrar, barra de vencimientos por tramos y mayores deudores |
| | `#/accounting/payments` | General ledger, Invoices, Payments, Statements | Flujo de efectivo, métodos de pago, facturas pendientes de pago y transacciones |
| **Reporting** | `#/reporting/overview` | Overview, Report builder | Métricas macro, gráfico de ingresos vs costo de bienes y velocímetro de cumplimiento |
| | `#/reporting/builder` | Overview, Report builder | Selector de métricas (Revenue, Units, Margin...) y tabla de resultados |
| **HR & Perfil** | `#/hr/directory` / `#/hr/directory/s-noor` | Directory | Lista de equipo y drawer lateral con la ficha de Noor Haddad |
| **Settings** | `#/settings` | Company, Users, Notifications, Appearance, Integrations, Data | Formulario de datos fiscales y vista previa interactiva en vivo del documento de factura |

## 3. Sistema Visual & Tokens Identificados

- **Tipografía**: Inter / SF Pro / Geist sans-serif con alto contraste, pesos 400, 500, 600, 700.
- **Paleta de Colores**:
  - Fondo general: `#f4f4f2` / `#f5f5f3` (blanco cálido / off-white elegante de Cadra)
  - Superficies de tarjetas: `#ffffff` con radios suaves `border-radius: 16px` y sutil sombra difusa.
  - Tarjetas de acento oscuro: `#121417` / `#161616` (usada en la 1ra KPI de cada módulo y el dock flotante).
  - Tarjeta de acento suave: `#dce6f2` / `#d5e2f0` (azul pastel sutil en la 2da KPI).
  - Acento terracota/naranja de Cadra: `#e06845` / `#d8603d` (usado en badges numéricos, línea de tiempo, botón de compra, alertas).
  - Acento verde oliva/bosque: `#4e7c59` / `#3f6b49` (operaciones a tiempo, cobros, indicadores activos).
  - Bordes y divisores: `#e6e6e2` / `#e8e8e4`.
  - Texto principal: `#17181a`.
  - Texto secundario/muted: `#6b7280` / `#737982`.
- **Navegación Superior**:
  - Cápsula blanca flotante con badges circulares terracota (`Sales 4`, `Stock 6`, `Accounting 1`, etc.).
  - Pill negro activo con texto blanco.
- **Dock Lateral Izquierdo**:
  - Cápsula vertical negra flotante (`#151618`) con esquinas completamente redondeadas, iconos blancos y atajos rápidos.
- **Header Global**:
  - Reloj en vivo `12:02 PM`, estado de piso `5 on the floor · 4 on track · 1 behind` con barra de progreso.

