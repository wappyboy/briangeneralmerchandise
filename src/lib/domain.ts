import type {
  AppData,
  Booking,
  BookingLineItem,
  BookingPayment,
  BookingStatus,
  Contract,
  DashboardStats,
  InventoryItem,
  PaymentStatus,
  Quotation,
} from "@/types/admin";

const activeReservationStatuses: BookingStatus[] = [
  "Pending",
  "For Review",
  "Confirmed",
  "Scheduled",
  "Ongoing",
];

export function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function createReference(prefix: string) {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  return `${prefix}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function parseMoney(value: FormDataEntryValue | string | number | null) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
}

export function normalizeQuantity(value: FormDataEntryValue | string | number | null) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? Math.max(0, Math.floor(numberValue)) : 0;
}

export function calculateTotals(items: BookingLineItem[], payments: BookingPayment[] = []) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = items.reduce((sum, item) => sum + item.discount, 0);
  const additionalCharges = items.reduce((sum, item) => sum + item.additionalCharge, 0);
  const totalAmount = Math.max(0, subtotal - discountTotal + additionalCharges);
  const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = Math.max(0, totalAmount - amountPaid);

  return {
    subtotal,
    discountTotal,
    additionalCharges,
    totalAmount,
    amountPaid,
    remainingBalance,
    paymentStatus: getPaymentStatus(totalAmount, amountPaid),
  };
}

export function getPaymentStatus(totalAmount: number, amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) {
    return "Unpaid";
  }

  if (amountPaid >= totalAmount) {
    return amountPaid > totalAmount ? "Refund Due" : "Paid";
  }

  return "Partial";
}

export function eventRangesOverlap(a: Booking, b: Booking) {
  if (a.eventDate !== b.eventDate) {
    return false;
  }

  const aStart = a.eventStartTime || "00:00";
  const aEnd = a.eventEndTime || "23:59";
  const bStart = b.eventStartTime || "00:00";
  const bEnd = b.eventEndTime || "23:59";

  return aStart < bEnd && bStart < aEnd;
}

export function findBookingConflicts(booking: Booking, bookings: Booking[]) {
  return bookings.filter(
    (candidate) =>
      candidate.id !== booking.id &&
      candidate.status !== "Cancelled" &&
      candidate.status !== "Completed" &&
      eventRangesOverlap(booking, candidate)
  );
}

export function quantityReservedForItem(
  itemId: string,
  bookings: Booking[],
  eventDate?: string,
  excludeBookingId?: string
) {
  return bookings.reduce((sum, booking) => {
    if (booking.id === excludeBookingId || !activeReservationStatuses.includes(booking.status)) {
      return sum;
    }

    if (eventDate && booking.eventDate !== eventDate) {
      return sum;
    }

    return (
      sum +
      booking.items
        .filter((lineItem) => lineItem.itemId === itemId)
        .reduce((lineSum, lineItem) => lineSum + lineItem.quantity, 0)
    );
  }, 0);
}

export function getAvailableQuantity(
  item: InventoryItem,
  bookings: Booking[],
  eventDate?: string,
  excludeBookingId?: string
) {
  const unavailable = item.damagedQuantity + item.maintenanceQuantity;
  const reserved = quantityReservedForItem(item.id, bookings, eventDate, excludeBookingId);
  return Math.max(0, item.totalQuantity - unavailable - reserved);
}

export function validateAvailability(booking: Booking, data: AppData) {
  const errors: string[] = [];

  for (const lineItem of booking.items) {
    if (!lineItem.itemId) {
      continue;
    }

    const inventoryItem = data.inventory.find((item) => item.id === lineItem.itemId);
    if (!inventoryItem) {
      errors.push(`${lineItem.name} is no longer in inventory.`);
      continue;
    }

    const available = getAvailableQuantity(
      inventoryItem,
      data.bookings,
      booking.eventDate,
      booking.id
    );

    if (lineItem.quantity > available) {
      errors.push(
        `${lineItem.name} only has ${available} available for ${booking.eventDate}. Requested ${lineItem.quantity}.`
      );
    }
  }

  return errors;
}

export function withBookingTotals(booking: Booking): Booking {
  const totals = calculateTotals(booking.items, booking.payments);

  return {
    ...booking,
    ...totals,
    updatedAt: new Date().toISOString(),
  };
}

export function deriveInventory(data: AppData): InventoryItem[] {
  return data.inventory.map((item) => {
    const reservedQuantity = quantityReservedForItem(item.id, data.bookings);
    const availableQuantity = Math.max(
      0,
      item.totalQuantity - item.damagedQuantity - item.maintenanceQuantity - reservedQuantity
    );

    return {
      ...item,
      reservedQuantity,
      availableQuantity,
      status:
        item.status === "Inactive" || item.status === "Damaged" || item.status === "Under Maintenance"
          ? item.status
          : reservedQuantity > 0
            ? "Reserved"
            : "Available",
    };
  });
}

export function getDashboardStats(data: AppData): DashboardStats {
  const now = new Date();
  const inventory = deriveInventory(data);

  return {
    totalBookings: data.bookings.length,
    pendingBookings: data.bookings.filter((booking) =>
      ["Pending", "For Review"].includes(booking.status)
    ).length,
    confirmedBookings: data.bookings.filter((booking) =>
      ["Confirmed", "Scheduled", "Ongoing"].includes(booking.status)
    ).length,
    completedBookings: data.bookings.filter((booking) => booking.status === "Completed").length,
    cancelledBookings: data.bookings.filter((booking) => booking.status === "Cancelled").length,
    upcomingEvents: data.bookings.filter(
      (booking) => booking.status !== "Cancelled" && new Date(booking.eventDate) >= now
    ).length,
    totalRevenue: data.bookings.reduce((sum, booking) => sum + booking.amountPaid, 0),
    outstandingBalances: data.bookings.reduce(
      (sum, booking) => sum + booking.remainingBalance,
      0
    ),
    lowStockItems: inventory.filter(
      (item) => item.status !== "Inactive" && item.availableQuantity <= 2
    ).length,
  };
}

export function summarizeBookingForDocument(
  booking: Booking,
  quotation?: Quotation,
  contract?: Contract
) {
  const itemLines = booking.items
    .map(
      (item) =>
        `${item.quantity} x ${item.name} (${item.category}) @ PHP ${item.unitPrice.toLocaleString()}`
    )
    .join("\n");

  return [
    `Booking Reference: ${booking.reference}`,
    quotation ? `Quotation Reference: ${quotation.reference}` : "",
    contract ? `Contract Reference: ${contract.reference}` : "",
    `Customer: ${booking.customer.fullName}`,
    `Contact: ${booking.customer.phone} / ${booking.customer.email}`,
    `Event: ${booking.eventType} on ${booking.eventDate} ${booking.eventStartTime}-${booking.eventEndTime}`,
    `Venue: ${booking.venue}, ${booking.venueAddress}`,
    `Setup: ${booking.setupSchedule}`,
    `Pull-out: ${booking.pullOutSchedule}`,
    "",
    "Services and Rental Items:",
    itemLines,
    "",
    `Total Amount: PHP ${booking.totalAmount.toLocaleString()}`,
    `Amount Paid: PHP ${booking.amountPaid.toLocaleString()}`,
    `Remaining Balance: PHP ${booking.remainingBalance.toLocaleString()}`,
    "",
    "Terms: Down payments reserve listed equipment for the event schedule. Damage, loss, overtime, delivery, setup, cancellation, and pull-out terms apply as agreed by both parties.",
    "",
    "Customer Signature: ______________________________",
    "Business Signature: ______________________________",
  ]
    .filter(Boolean)
    .join("\n");
}
