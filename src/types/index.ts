export type ModuleKey = 
  | 'dashboard'
  | 'sales'
  | 'manufacturing'
  | 'stock'
  | 'accounting'
  | 'hr'
  | 'reporting'
  | 'settings'

export interface WorkOrderItem {
  id: string
  code: string
  title: string
  customer: string
  customerInitials: string
  quantity: number
  rush?: boolean
  route: { name: string; status: 'done' | 'active' | 'pending' }[]
  progress: number
  finishes: string
  finishesDays: string
  status: 'In progress' | 'Released' | 'Planned' | 'On hold' | 'Behind plan' | 'Done'
  color: string
}

export interface GanttOperation {
  id: string
  name: string
  worker: string
  workerInitials: string
  startDay: number // 0 = Sun 8, 1 = Mon 9, 2 = Tue 10, 3 = Wed 11, etc.
  durationDays: number
  progress: number
  status: 'done' | 'active' | 'behind' | 'pending'
  dates: string
}

export interface GanttOrder {
  id: string
  code: string
  name: string
  units: number
  color: string
  progress: number
  operations: GanttOperation[]
}

export interface LiveFloorItem {
  id: string
  workerInitials: string
  operation: string
  workOrder: string
  product: string
  progress: number
  status: 'on_track' | 'behind'
}

export interface SaleDeal {
  id: string
  customer: string
  customerInitials: string
  code: string
  details: string
  extraBadge?: string
  value: number
  daysLeft?: string
  owner: string
  stage: 'quote' | 'confirmed' | 'production' | 'ready' | 'shipped'
  progress?: number
  workOrder?: string
  date?: string
}

export interface ContactItem {
  id: string
  company: string
  initials: string
  rep: string
  type: 'Customer' | 'Vendor' | 'Partner'
  city: string
  state?: string
  country?: string
  category: string
  email: string
  phone: string
  starred?: boolean
  assignedDoctorId?: 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4' | 'general' | string
}

export interface POSProduct {
  id: string
  initials: string
  name: string
  sku: string
  price: number
  category: 'Bikes' | 'Framesets' | 'Parts' | 'Accessories' | 'Apparel'
  onFloor: number
  bgColor?: string
  textColor?: string
}

export interface CartItem {
  product: POSProduct
  quantity: number
}

export interface StockItem {
  id: string
  name: string
  sku: string
  subCategory: string
  kind: 'Complete bike' | 'Frameset' | 'Components' | 'Materials' | 'Accessories'
  onHand: number
  reorderAt: number
  sites: { sew: number; div: number; phl: number }
  onOrder: number
  value: number
  warning?: boolean
}

export interface PurchaseOrderItem {
  id: string
  code: string
  title: string
  vendor: string
  vendorInitials: string
  vendorCategory: string
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Received' | 'Billed'
  statusStep: number // 1 to 5
  due: string
  isPlanned?: boolean
  total: number
}

export interface ShipmentItem {
  id: string
  code: string
  customer: string
  carrier: string
  tracking: string
  status: 'Exception' | 'Out for delivery' | 'In transit' | 'Delivered'
  statusStep: number
  eta: string
  etaNote: string
  parcels: number
  weight: string
  destination: string
  isException?: boolean
  liveNote?: string
}

export interface LedgerEntry {
  id: string
  date: string
  relativeDate: string
  entry: string
  ref: string
  source: 'Sales' | 'Bank' | 'Purchases' | 'Payroll' | 'Manual'
  amount: number
  isDebit?: boolean
  accountCode: string
}

export interface InvoiceItem {
  id: string
  code: string
  customer: string
  customerInitials: string
  city: string
  terms: string
  amount: number
  dueDate: string
  status: 'Current' | '1-30 days' | '31-60 days' | '60+ days'
  daysLate?: number
}

export interface PaymentTransaction {
  id: string
  party: string
  initials: string
  docRef: string
  method: 'ACH transfer' | 'Card' | 'Wire'
  date: string
  relativeDate: string
  amount: number
  type: 'in' | 'out'
}

