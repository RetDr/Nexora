# Cadra — Reconstrucción Frontend de Alta Fidelidad

Reconstrucción visual y funcional de la interfaz operativa de **Cadra** (Larkspur Cycles) desarrollada en React 18, TypeScript, Vite y CSS moderno, basada en la referencia original:
`https://demo.codeandchill.store/cadra/#/manufacturing/scheduling`

---

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js 18+ instalado.

### Instalación de dependencias
```bash
npm install
```

### Ejecución en entorno de desarrollo
```bash
npm run dev
```
La aplicación estará disponible inmediatamente en `http://localhost:5173`.

### Compilación para producción
```bash
npm run build
```
Genera los assets optimizados en la carpeta `dist/` con comprobación completa de tipos de TypeScript (`tsc -b`).

### Previsualización de producción
```bash
npm run preview
```

---

## 🧭 Mapa de Navegación y Rutas

La aplicación utiliza enrutamiento Hash compatible con la plataforma original:

| Sección | Ruta Hash | Características Clave |
|---|---|---|
| **Dashboard** | `#/dashboard` | Scrubber temporal interactivo (7a a 5p con marcador a las 11:57 AM), tarjeta de caja en mano con gráfico de barras, tarjetas KPI con sparklines, gráfico anual de ingresos vs costes, embudo de ventas y operaciones del día. |
| **Manufacturing — Scheduling** | `#/manufacturing/scheduling` | **Pantalla principal de referencia**: cronograma Gantt con barras de capacidad por día, marcador de hora actual (12:02 PM), desglose de fases conectadas y panel lateral de operaciones en vivo. |
| **Manufacturing — Work Orders** | `#/manufacturing/orders` | 4 tarjetas KPI (oscura, celeste, alerta, bicicletas), filtros por estado (`All`, `In progress`, `Released`, `Planned`, `On hold`, `Behind plan`, `Done`) y tabla de alta densidad con diagrama de pasos por estaciones. |
| **Sales — Pipeline** | `#/sales/pipeline` | Tablero Kanban por fases (`Quote`, `Confirmed`, `In production`, `Ready to ship`, `Shipped`), filtrado por comercial (`Everyone`, `Omar`, `Elif`, `Mine`) e importes por columna. |
| **Sales — Contacts** | `#/contacts` | Libreta de direcciones con depurador alfabético A-Z, tarjetas con marcado de favoritos (estrella), filtros de tipo y gráfico donut de distribución empresarial. |
| **Sales — Point of Sale (POS)** | `#/pos` | Terminal de ventas con banner del showroom Division St, catálogo por categorías, carrito interactivo con cálculo automático de totales, selector de descuentos (5%, 10%, 15%), sin impuestos (Oregon) y emisión de recibo. |
| **Stock — Existencias** | `#/inventory/stock` | Desglose gráfico horizontal de capital en inventario, lista de alerta de artículos bajo el punto de reorden con botones de acción directa y tabla de existencias desglosadas por almacén (`SEW`, `DIV`, `PHL`). |
| **Stock — Purchase Orders** | `#/purchasing/orders` | Órdenes de compra con indicador secuencial de 5 puntos de avance de estado, filtros y gráfico de distribución de gasto. |
| **Stock — Shipments** | `#/logistics/shipments` | Seguimiento logístico de envíos en carretera con líneas de ruta en tiempo real e identificación de retenciones en aduanas. |
| **Accounting — General Ledger** | `#/accounting/ledger` | Plan contable de cuentas de balance y libro diario con filtro por origen (`Sales`, `Bank`, `Purchases`, `Payroll`, `Manual`). |
| **Accounting — Invoices** | `#/accounting/invoices` | Antigüedad de saldos de clientes agrupados por tramos temporales y panel de los mayores deudores. |
| **Accounting — Payments** | `#/accounting/payments` | Gráfica de flujo de caja continuo, volumen por método de cobro y registro de facturas pendientes con botón de pago. |
| **Reporting — Overview** | `#/reporting/overview` | Gráfico macro de facturación vs costes de mercancía y velocímetro radial analógico de tasa de entregas a tiempo. |
| **Reporting — Report Builder** | `#/reporting/builder` | Constructor interactivo de informes con selector de métricas y agrupación temporal o por distribuidor. |
| **HR & Perfil** | `#/hr/directory` / `#/hr/directory/s-noor` | Directorio de equipo de planta y cajón lateral (*drawer*) con el perfil completo de Noor Haddad. |
| **Settings** | `#/settings` | Formulario de datos fiscales y legales con vista previa en tiempo real del documento de facturación que reacciona a los campos introducidos. |

---

## 🎨 Sistema de Diseño y Atajos

- **Dock Lateral Flotante**:
  - 🔍 **Búsqueda Rápida**: Acceso directo con `Cmd+K` / `Ctrl+K` o clic en el dock.
  - ➕ **Nuevo Registro**: Modal rápido para crear órdenes, cotizaciones o contactos.
  - 🌓 **Modo Oscuro / Claro**: Alternador de tema en tiempo real.
  - ⚙️ **Configuración**: Acceso directo al perfil de la empresa.
- **Header Global**:
  - Reloj en vivo a las 12:02 PM con indicador de operaciones y barra de progreso.
  - Desplegable de notificaciones y alertas críticas.
  - Clic en el avatar `NH` abre la ficha técnica del usuario.

---

## 📁 Documentación de Soporte

- `REFERENCE_MAP.md`: Mapeo exhaustivo entre las 18 imágenes de referencia y los módulos desarrollados.
- `IMPLEMENTATION_NOTES.md`: Decisiones técnicas, arquitectura y límites del proyecto.
