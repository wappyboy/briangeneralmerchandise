export type AdminRole = "owner" | "manager" | "staff";

export type BookingStatus =
  | "Pending"
  | "For Review"
  | "Confirmed"
  | "Scheduled"
  | "Ongoing"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Unpaid" | "Partial" | "Paid" | "Refund Due";

export type InventoryStatus =
  | "Available"
  | "Reserved"
  | "In Use"
  | "Under Maintenance"
  | "Damaged"
  | "Inactive";

export type ServiceStatus = "Active" | "Archived";
export type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired";
export type ContractStatus = "Draft" | "Generated" | "Sent" | "Signed" | "Cancelled" | "Expired";
export type PaymentType = "Down Payment" | "Partial Payment" | "Full Payment" | "Security Deposit";

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
};

export type BookingLineItem = {
  id: string;
  itemId?: string;
  serviceId?: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  additionalCharge: number;
};

export type BookingPayment = {
  id: string;
  bookingId: string;
  type: PaymentType;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  paidAt: string;
  createdAt: string;
};

export type BookingHistoryEntry = {
  id: string;
  at: string;
  actor: string;
  message: string;
};

export type Booking = {
  id: string;
  reference: string;
  customerId: string;
  customer: Customer;
  eventType: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  venue: string;
  venueAddress: string;
  setupSchedule: string;
  pullOutSchedule: string;
  specialRequests?: string;
  internalNotes?: string;
  items: BookingLineItem[];
  subtotal: number;
  discountTotal: number;
  additionalCharges: number;
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  payments: BookingPayment[];
  history: BookingHistoryEntry[];
  createdAt: string;
  updatedAt: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  rentalPrice: number;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  maintenanceQuantity: number;
  status: InventoryStatus;
  image?: string;
  notes?: string;
  updatedAt: string;
};

export type RentalService = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  inclusions: {
    name: string;
    quantity: number;
  }[];
  status: ServiceStatus;
  updatedAt: string;
};

export type Quotation = {
  id: string;
  reference: string;
  bookingId: string;
  status: QuotationStatus;
  expiresAt: string;
  notes?: string;
  totalAmount: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
};

export type ContractVersion = {
  id: string;
  version: number;
  status: ContractStatus;
  contentSnapshot: string;
  signedCopyName?: string;
  signedDate?: string;
  createdAt: string;
};

export type Contract = {
  id: string;
  reference: string;
  bookingId: string;
  quotationId?: string;
  status: ContractStatus;
  versions: ContractVersion[];
  createdAt: string;
  updatedAt: string;
};

export type AppData = {
  users: {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
  }[];
  customers: Customer[];
  bookings: Booking[];
  inventory: InventoryItem[];
  services: RentalService[];
  quotations: Quotation[];
  contracts: Contract[];
};

export type DashboardStats = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  upcomingEvents: number;
  totalRevenue: number;
  outstandingBalances: number;
  lowStockItems: number;
};

export type AdminSnapshot = AppData & {
  stats: DashboardStats;
  recentBookings: Booking[];
  recentPayments: BookingPayment[];
  generatedAt: string;
};
