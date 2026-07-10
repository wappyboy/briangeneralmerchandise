import "server-only";

import { promises as fs } from "fs";
import path from "path";

import {
  calculateTotals,
  createId,
  createReference,
  deriveInventory,
  getDashboardStats,
  validateAvailability,
  withBookingTotals,
} from "@/lib/domain";
import type {
  AdminSnapshot,
  AppData,
  Booking,
  BookingLineItem,
  BookingPayment,
  BookingStatus,
  Contract,
  ContractStatus,
  InventoryItem,
  Quotation,
  QuotationStatus,
  RentalService,
} from "@/types/admin";

const dataFile = process.env.APP_DATA_FILE
  ? path.resolve(process.env.APP_DATA_FILE)
  : path.join(process.cwd(), "data", "event-rental-data.json");

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(createSeedData(), null, 2));
  }
}

function now() {
  return new Date().toISOString();
}

function createSeedData(): AppData {
  const updatedAt = now();

  const inventory: InventoryItem[] = [
    {
      id: "item_sounds_basic",
      name: "Basic Sounds System",
      category: "Sounds",
      rentalPrice: 6500,
      totalQuantity: 2,
      availableQuantity: 2,
      reservedQuantity: 0,
      damagedQuantity: 0,
      maintenanceQuantity: 0,
      status: "Available",
      image: "/soundsystem.jpg",
      notes: "Mixer, speakers, microphones, and operator support.",
      updatedAt,
    },
    {
      id: "item_led_lights",
      name: "LED Par Lights Set",
      category: "Lights",
      rentalPrice: 2800,
      totalQuantity: 6,
      availableQuantity: 6,
      reservedQuantity: 0,
      damagedQuantity: 0,
      maintenanceQuantity: 0,
      status: "Available",
      image: "/soundsystem2.jpg",
      notes: "Useful for stage wash and simple program lighting.",
      updatedAt,
    },
    {
      id: "item_table_round",
      name: "Round Table",
      category: "Tables",
      rentalPrice: 180,
      totalQuantity: 40,
      availableQuantity: 40,
      reservedQuantity: 0,
      damagedQuantity: 0,
      maintenanceQuantity: 0,
      status: "Available",
      image: "/tables.jpg",
      notes: "Good for receptions and family events.",
      updatedAt,
    },
    {
      id: "item_mono_chair",
      name: "Monoblock Chair",
      category: "Chairs",
      rentalPrice: 20,
      totalQuantity: 250,
      availableQuantity: 250,
      reservedQuantity: 0,
      damagedQuantity: 0,
      maintenanceQuantity: 0,
      status: "Available",
      image: "/tables.jpg",
      notes: "White monoblock chairs.",
      updatedAt,
    },
    {
      id: "item_tent_3x6",
      name: "3x6 Tent",
      category: "Tents",
      rentalPrice: 3500,
      totalQuantity: 4,
      availableQuantity: 4,
      reservedQuantity: 0,
      damagedQuantity: 0,
      maintenanceQuantity: 0,
      status: "Available",
      image: "/wedding.jpg",
      notes: "Outdoor cover for small to medium gatherings.",
      updatedAt,
    },
  ];

  const services: RentalService[] = [
    {
      id: "svc_basic_package",
      name: "Basic Event Package",
      category: "Packages",
      description: "Sounds setup with selected tables and chairs for small events.",
      price: 12000,
      image: "/bday.jpg",
      inclusions: [
        { name: "Basic Sounds System", quantity: 1 },
        { name: "Round Table", quantity: 10 },
        { name: "Monoblock Chair", quantity: 80 },
      ],
      status: "Active",
      updatedAt,
    },
    {
      id: "svc_stage_setup",
      name: "Stage Setup Support",
      category: "Stage",
      description: "Setup labor and coordination for program or reception stages.",
      price: 8500,
      image: "/wedding.jpg",
      inclusions: [{ name: "Setup crew", quantity: 1 }],
      status: "Active",
      updatedAt,
    },
  ];

  return {
    users: [],
    customers: [],
    bookings: [],
    inventory,
    services,
    quotations: [],
    contracts: [],
  };
}

export async function readData(): Promise<AppData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  const data = JSON.parse(raw) as AppData;
  data.inventory = deriveInventory(data);
  return data;
}

async function writeData(data: AppData) {
  data.inventory = deriveInventory(data);
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function mutateData<T>(callback: (data: AppData) => T | Promise<T>) {
  const data = await readData();
  const result = await callback(data);
  await writeData(data);
  return result;
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const data = await readData();
  const payments = data.bookings.flatMap((booking) => booking.payments);

  return {
    ...data,
    inventory: deriveInventory(data),
    stats: getDashboardStats(data),
    recentBookings: [...data.bookings]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8),
    recentPayments: payments.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
    generatedAt: now(),
  };
}

function findOrCreateCustomer(data: AppData, customer: Booking["customer"]) {
  const existing = data.customers.find(
    (candidate) =>
      candidate.email.toLowerCase() === customer.email.toLowerCase() ||
      candidate.phone === customer.phone
  );

  if (existing) {
    Object.assign(existing, {
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    return existing;
  }

  const created = {
    ...customer,
    id: createId("cust"),
    createdAt: now(),
  };
  data.customers.push(created);
  return created;
}

export async function createBookingRequest(payload: {
  customer: Omit<Booking["customer"], "id" | "createdAt">;
  eventType: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  venue: string;
  venueAddress: string;
  setupSchedule?: string;
  pullOutSchedule?: string;
  specialRequests?: string;
  items: BookingLineItem[];
}) {
  return mutateData((data) => {
    const createdAt = now();
    const customer = findOrCreateCustomer(data, {
      ...payload.customer,
      id: "",
      createdAt,
    });
    const totals = calculateTotals(payload.items);

    const booking: Booking = {
      id: createId("book"),
      reference: createReference("BGM"),
      customerId: customer.id,
      customer,
      eventType: payload.eventType,
      eventDate: payload.eventDate,
      eventStartTime: payload.eventStartTime,
      eventEndTime: payload.eventEndTime,
      venue: payload.venue,
      venueAddress: payload.venueAddress,
      setupSchedule: payload.setupSchedule || `${payload.eventDate} ${payload.eventStartTime}`,
      pullOutSchedule: payload.pullOutSchedule || `${payload.eventDate} ${payload.eventEndTime}`,
      specialRequests: payload.specialRequests,
      internalNotes: "",
      items: payload.items,
      ...totals,
      status: "Pending",
      payments: [],
      history: [
        {
          id: createId("hist"),
          at: createdAt,
          actor: "Customer",
          message: "Booking request submitted.",
        },
      ],
      createdAt,
      updatedAt: createdAt,
    };

    const availabilityErrors = validateAvailability(booking, data);
    if (availabilityErrors.length > 0) {
      throw new Error(availabilityErrors.join(" "));
    }

    data.bookings.unshift(booking);
    return booking;
  });
}

function getBooking(data: AppData, bookingId: string) {
  const booking = data.bookings.find((candidate) => candidate.id === bookingId);

  if (!booking) {
    throw new Error("Booking not found.");
  }

  return booking;
}

function addHistory(booking: Booking, actor: string, message: string) {
  booking.history.unshift({
    id: createId("hist"),
    at: now(),
    actor,
    message,
  });
}

export async function handleAdminAction(action: string, payload: Record<string, unknown>) {
  return mutateData((data) => {
    if (action === "booking.status") {
      const booking = getBooking(data, String(payload.bookingId));
      const nextStatus = String(payload.status) as BookingStatus;

      if (nextStatus !== "Cancelled") {
        const errors = validateAvailability(booking, data);
        if (errors.length > 0) {
          throw new Error(errors.join(" "));
        }
      }

      booking.status = nextStatus;
      addHistory(booking, "Admin", `Status changed to ${nextStatus}.`);
      Object.assign(booking, withBookingTotals(booking));
      return booking;
    }

    if (action === "booking.save") {
      const booking = getBooking(data, String(payload.bookingId));
      const fields = payload.fields as Partial<Booking>;

      Object.assign(booking, {
        eventType: fields.eventType ?? booking.eventType,
        eventDate: fields.eventDate ?? booking.eventDate,
        eventStartTime: fields.eventStartTime ?? booking.eventStartTime,
        eventEndTime: fields.eventEndTime ?? booking.eventEndTime,
        venue: fields.venue ?? booking.venue,
        venueAddress: fields.venueAddress ?? booking.venueAddress,
        setupSchedule: fields.setupSchedule ?? booking.setupSchedule,
        pullOutSchedule: fields.pullOutSchedule ?? booking.pullOutSchedule,
        specialRequests: fields.specialRequests ?? booking.specialRequests,
        internalNotes: fields.internalNotes ?? booking.internalNotes,
      });

      if (fields.items) {
        booking.items = fields.items;
      }

      const errors = validateAvailability(booking, data);
      if (errors.length > 0) {
        throw new Error(errors.join(" "));
      }

      addHistory(booking, "Admin", "Booking details updated.");
      Object.assign(booking, withBookingTotals(booking));
      return booking;
    }

    if (action === "payment.record") {
      const booking = getBooking(data, String(payload.bookingId));
      const amount = Number(payload.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      const payment: BookingPayment = {
        id: createId("pay"),
        bookingId: booking.id,
        type: String(payload.type || "Partial Payment") as BookingPayment["type"],
        amount,
        method: String(payload.method || "Cash"),
        reference: String(payload.reference || ""),
        notes: String(payload.notes || ""),
        paidAt: String(payload.paidAt || new Date().toISOString().slice(0, 10)),
        createdAt: now(),
      };

      booking.payments.unshift(payment);
      addHistory(booking, "Admin", `Recorded ${payment.type} payment of PHP ${amount}.`);
      Object.assign(booking, withBookingTotals(booking));
      return payment;
    }

    if (action === "inventory.save") {
      const item = payload.item as InventoryItem;
      const existing = data.inventory.find((candidate) => candidate.id === item.id);
      const saved: InventoryItem = {
        ...item,
        id: item.id || createId("item"),
        updatedAt: now(),
      };

      if (existing) {
        Object.assign(existing, saved);
      } else {
        data.inventory.unshift(saved);
      }

      return saved;
    }

    if (action === "service.save") {
      const service = payload.service as RentalService;
      const existing = data.services.find((candidate) => candidate.id === service.id);
      const saved: RentalService = {
        ...service,
        id: service.id || createId("svc"),
        updatedAt: now(),
      };

      if (existing) {
        Object.assign(existing, saved);
      } else {
        data.services.unshift(saved);
      }

      return saved;
    }

    if (action === "quotation.generate") {
      const booking = getBooking(data, String(payload.bookingId));
      const quotation: Quotation = {
        id: createId("quote"),
        reference: createReference("QTN"),
        bookingId: booking.id,
        status: "Draft",
        expiresAt: String(payload.expiresAt || ""),
        notes: String(payload.notes || ""),
        totalAmount: Number(payload.totalAmount || booking.totalAmount),
        discount: Number(payload.discount || 0),
        createdAt: now(),
        updatedAt: now(),
      };
      data.quotations.unshift(quotation);
      addHistory(booking, "Admin", `Quotation ${quotation.reference} generated.`);
      return quotation;
    }

    if (action === "quotation.status") {
      const quotation = data.quotations.find((candidate) => candidate.id === payload.quotationId);
      if (!quotation) {
        throw new Error("Quotation not found.");
      }
      quotation.status = String(payload.status) as QuotationStatus;
      quotation.updatedAt = now();

      if (quotation.status === "Accepted") {
        const booking = getBooking(data, quotation.bookingId);
        booking.status = "Confirmed";
        addHistory(booking, "Admin", `Accepted quotation ${quotation.reference}; booking confirmed.`);
      }

      return quotation;
    }

    if (action === "contract.generate") {
      const booking = getBooking(data, String(payload.bookingId));
      const existing = data.contracts.find((candidate) => candidate.bookingId === booking.id);
      const contentSnapshot = JSON.stringify(booking, null, 2);

      if (existing && ["Signed", "Generated", "Sent"].includes(existing.status)) {
        existing.versions.unshift({
          id: createId("cver"),
          version: existing.versions.length + 1,
          status: "Draft",
          contentSnapshot,
          createdAt: now(),
        });
        existing.status = "Draft";
        existing.updatedAt = now();
        addHistory(booking, "Admin", `New contract version created for ${existing.reference}.`);
        return existing;
      }

      const contract: Contract = {
        id: createId("contract"),
        reference: createReference("CTR"),
        bookingId: booking.id,
        quotationId: String(payload.quotationId || ""),
        status: "Draft",
        versions: [
          {
            id: createId("cver"),
            version: 1,
            status: "Draft",
            contentSnapshot,
            createdAt: now(),
          },
        ],
        createdAt: now(),
        updatedAt: now(),
      };
      data.contracts.unshift(contract);
      addHistory(booking, "Admin", `Contract ${contract.reference} generated.`);
      return contract;
    }

    if (action === "contract.status") {
      const contract = data.contracts.find((candidate) => candidate.id === payload.contractId);
      if (!contract) {
        throw new Error("Contract not found.");
      }

      const status = String(payload.status) as ContractStatus;
      contract.status = status;
      contract.updatedAt = now();

      if (contract.versions[0]) {
        contract.versions[0].status = status;
      }

      return contract;
    }

    if (action === "contract.signedCopy") {
      const contract = data.contracts.find((candidate) => candidate.id === payload.contractId);
      if (!contract || !contract.versions[0]) {
        throw new Error("Contract not found.");
      }

      contract.status = "Signed";
      contract.versions[0].status = "Signed";
      contract.versions[0].signedCopyName = String(payload.signedCopyName || "");
      contract.versions[0].signedDate = String(payload.signedDate || new Date().toISOString().slice(0, 10));
      contract.updatedAt = now();
      return contract;
    }

    throw new Error(`Unsupported admin action: ${action}`);
  });
}

export async function getBookingDocument(type: "quotation" | "contract", id: string) {
  const data = await readData();

  if (type === "quotation") {
    const quotation = data.quotations.find((candidate) => candidate.id === id);
    if (!quotation) {
      throw new Error("Quotation not found.");
    }
    const booking = getBooking(data, quotation.bookingId);
    return { booking, quotation };
  }

  const contract = data.contracts.find((candidate) => candidate.id === id);
  if (!contract) {
    throw new Error("Contract not found.");
  }
  const booking = getBooking(data, contract.bookingId);
  const quotation = contract.quotationId
    ? data.quotations.find((candidate) => candidate.id === contract.quotationId)
    : undefined;
  return { booking, quotation, contract };
}
