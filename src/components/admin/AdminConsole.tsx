"use client";

import {
  Archive,
  ArrowUpRight,
  BadgeDollarSign,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import type {
  AdminSnapshot,
  Booking,
  BookingLineItem,
  BookingStatus,
  Contract,
  ContractStatus,
  InventoryItem,
  QuotationStatus,
  RentalService,
} from "@/types/admin";

type Tab =
  | "dashboard"
  | "bookings"
  | "calendar"
  | "inventory"
  | "services"
  | "customers"
  | "documents"
  | "reports";

const tabs: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "services", label: "Services", icon: Archive },
  { id: "customers", label: "Customers", icon: Users },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "reports", label: "Reports", icon: Receipt },
];

const statuses: BookingStatus[] = [
  "Pending",
  "For Review",
  "Confirmed",
  "Scheduled",
  "Ongoing",
  "Completed",
  "Cancelled",
];

const fieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";

const cardClass = "rounded-lg border border-neutral-200 bg-white shadow-sm shadow-neutral-950/[0.03]";

function money(value: number) {
  return `PHP ${Math.round(value || 0).toLocaleString()}`;
}

function statusClass(status: string) {
  if (["Confirmed", "Scheduled", "Ongoing", "Accepted", "Signed", "Generated", "Sent", "Paid"].includes(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (["Cancelled", "Rejected", "Expired", "Damaged"].includes(status)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (["Pending", "For Review", "Draft", "Partial", "Reserved"].includes(status)) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-neutral-200 bg-neutral-100 text-neutral-700";
}

function tabDescription(tab: Tab) {
  const descriptions: Record<Tab, string> = {
    dashboard: "Live business snapshot, cash flow, operations alerts, and recent activity.",
    bookings: "Review requests, manage schedules, update items, and record customer payments.",
    calendar: "Scan event schedules, day/week/month bookings, and overlapping reservations.",
    inventory: "Track rental stock, reservations, maintenance, damaged units, and availability.",
    services: "Manage services, setup offerings, rental bundles, packages, and active pricing.",
    customers: "View customer profiles, spending, booking history, and outstanding balances.",
    documents: "Generate and manage quotations, contracts, PDFs, signed copies, and versions.",
    reports: "Export operational CSV reports for bookings, revenue, stock, documents, and customers.",
  };

  return descriptions[tab];
}

export function AdminConsole({ initialData }: { initialData: AdminSnapshot }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function runAction(action: string, payload: Record<string, unknown>) {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/state", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const body = (await response.json()) as { error?: string; snapshot?: AdminSnapshot };

      if (!response.ok || !body.snapshot) {
        throw new Error(body.error || "Admin action failed.");
      }

      setData(body.snapshot);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Admin action failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[#f5f3ef] text-neutral-950">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-neutral-200 bg-neutral-950 p-5 text-white lg:block">
          <div className="sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-white text-neutral-950">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-black leading-tight">Brian&apos;s General</p>
                <p className="text-xs font-medium text-neutral-400">Rental operations</p>
              </div>
            </div>

            <div className="mt-7 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Owner workspace
              </div>
              <p className="mt-3 text-2xl font-black">{data.stats.upcomingEvents}</p>
              <p className="text-sm text-neutral-400">upcoming event{data.stats.upcomingEvents === 1 ? "" : "s"}</p>
            </div>

            <nav className="mt-6 space-y-1">
              {tabs.map((item) => {
                const Icon = item.icon;
                const isActive = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-white text-neutral-950 shadow-lg shadow-black/20"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </span>
                    {isActive ? <ChevronRight className="size-4" aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-3 text-sm font-bold text-neutral-300 transition hover:bg-white hover:text-neutral-950"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-neutral-200 bg-[#f5f3ef]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
                  Brian&apos;s General Merchandise
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                  {tabs.find((item) => item.id === tab)?.label}
                </h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral-600">{tabDescription(tab)}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-600 sm:block">
                  {new Date(data.generatedAt).toLocaleString()}
                </div>
                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="grid size-10 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm lg:hidden"
                  aria-label="Logout"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {tabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                      tab === item.id ? "bg-neutral-950 text-white" : "bg-white text-neutral-600"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {error ? (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}
            {isSaving ? (
              <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm font-semibold text-sky-700">
                Saving latest changes...
              </div>
            ) : null}

            {tab === "dashboard" ? <DashboardView data={data} /> : null}
            {tab === "bookings" ? <BookingsView data={data} runAction={runAction} /> : null}
            {tab === "calendar" ? <CalendarView bookings={data.bookings} /> : null}
            {tab === "inventory" ? <InventoryView data={data} runAction={runAction} /> : null}
            {tab === "services" ? <ServicesView data={data} runAction={runAction} /> : null}
            {tab === "customers" ? <CustomersView data={data} /> : null}
            {tab === "documents" ? <DocumentsView data={data} runAction={runAction} /> : null}
            {tab === "reports" ? <ReportsView data={data} /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardView({ data }: { data: AdminSnapshot }) {
  const stats = [
    {
      label: "Total bookings",
      value: data.stats.totalBookings,
      detail: `${data.stats.upcomingEvents} upcoming`,
      icon: ClipboardList,
      tone: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      label: "Revenue collected",
      value: money(data.stats.totalRevenue),
      detail: `${money(data.stats.outstandingBalances)} outstanding`,
      icon: BadgeDollarSign,
      tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      label: "Pending review",
      value: data.stats.pendingBookings,
      detail: "requests waiting",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      label: "Confirmed active",
      value: data.stats.confirmedBookings,
      detail: "confirmed/scheduled",
      icon: CheckCircle2,
      tone: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      label: "Low stock",
      value: data.stats.lowStockItems,
      detail: "items need attention",
      icon: Boxes,
      tone: "bg-rose-50 text-rose-700 border-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg bg-neutral-950 p-6 text-white shadow-xl shadow-neutral-950/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase text-neutral-300">
                <TrendingUp className="size-3.5" aria-hidden="true" />
                Operations overview
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                {data.stats.pendingBookings > 0
                  ? `${data.stats.pendingBookings} booking request${data.stats.pendingBookings === 1 ? "" : "s"} need review`
                  : "All booking requests are reviewed"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300">
                Track cash collected, outstanding balances, upcoming event work, and rental stock from one control room.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-bold uppercase text-neutral-400">Completed</p>
                <p className="mt-2 text-2xl font-black">{data.stats.completedBookings}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-bold uppercase text-neutral-400">Cancelled</p>
                <p className="mt-2 text-2xl font-black">{data.stats.cancelledBookings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-5`}>
          <p className="text-sm font-bold text-neutral-500">Balance health</p>
          <p className="mt-3 text-3xl font-black">{money(data.stats.outstandingBalances)}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Collect remaining balances before setup day and keep payment records current.
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${Math.min(
                  100,
                  data.stats.totalRevenue + data.stats.outstandingBalances === 0
                    ? 0
                    : (data.stats.totalRevenue /
                        (data.stats.totalRevenue + data.stats.outstandingBalances)) *
                        100
                )}%`,
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${cardClass} p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-neutral-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight">{stat.value}</p>
                </div>
                <div className={`grid size-10 place-items-center rounded-lg border ${stat.tone}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-500">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <SectionTitle title="Recent bookings" action="Open Bookings" />
          <div className="mt-4 space-y-3">
            {data.recentBookings.length === 0 ? <EmptyLine text="No bookings yet." /> : null}
            {data.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 p-3">
                <div className="min-w-0">
                  <p className="truncate font-black">{booking.reference}</p>
                  <p className="truncate text-sm text-neutral-500">{booking.customer.fullName} - {booking.eventDate}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cardClass} p-5`}>
          <SectionTitle title="Recent payments" action="Review Cashflow" />
          <div className="mt-4 space-y-3">
            {data.recentPayments.length === 0 ? <EmptyLine text="No payments recorded yet." /> : null}
            {data.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 p-3">
                <div>
                  <p className="font-bold">{payment.type}</p>
                  <p className="text-sm text-neutral-500">{payment.method} - {payment.paidAt}</p>
                </div>
                <p className="font-black">{money(payment.amount)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BookingsView({
  data,
  runAction,
}: {
  data: AdminSnapshot;
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("date");
  const [selectedId, setSelectedId] = useState(data.bookings[0]?.id || "");
  const selected = data.bookings.find((booking) => booking.id === selectedId) || data.bookings[0];

  const filtered = useMemo(() => {
    const needle = search.toLowerCase();
    return [...data.bookings]
      .filter((booking) => status === "All" || booking.status === status)
      .filter(
        (booking) =>
          booking.reference.toLowerCase().includes(needle) ||
          booking.customer.fullName.toLowerCase().includes(needle) ||
          booking.venue.toLowerCase().includes(needle)
      )
      .sort((a, b) =>
        sort === "amount"
          ? b.totalAmount - a.totalAmount
          : sort === "created"
            ? b.createdAt.localeCompare(a.createdAt)
            : a.eventDate.localeCompare(b.eventDate)
      );
  }, [data.bookings, search, sort, status]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-neutral-200 p-5">
          <SectionTitle title="Booking queue" action={`${filtered.length} result${filtered.length === 1 ? "" : "s"}`} />
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_150px_150px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-neutral-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={`${fieldClass} pl-9`}
              placeholder="Search bookings"
            />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}>
            <option>All</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className={fieldClass}>
            <option value="date">Event date</option>
            <option value="created">Newest</option>
            <option value="amount">Amount</option>
          </select>
          </div>
        </div>

        <div className="max-h-[740px] overflow-auto p-3">
          {filtered.length === 0 ? <EmptyLine text="No bookings match your filters." /> : null}
          {filtered.map((booking) => (
            <button
              type="button"
              key={booking.id}
              onClick={() => setSelectedId(booking.id)}
              className={`mb-3 block w-full rounded-lg border p-4 text-left transition ${
                selected?.id === booking.id
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-lg shadow-neutral-950/15"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black">{booking.reference}</p>
                  <p className={`truncate text-sm ${selected?.id === booking.id ? "text-neutral-300" : "text-neutral-500"}`}>
                    {booking.customer.fullName}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <p className="mt-3 text-sm">{booking.eventType} - {booking.eventDate}</p>
              <p className={`truncate text-sm ${selected?.id === booking.id ? "text-neutral-300" : "text-neutral-500"}`}>
                {booking.venue}
              </p>
              <div className="mt-3 flex justify-between text-sm font-bold">
                <span>{booking.paymentStatus}</span>
                <span>{money(booking.remainingBalance)} balance</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected ? (
        <BookingEditor
          key={`${selected.id}-${selected.updatedAt}`}
          booking={selected}
          inventory={data.inventory}
          services={data.services}
          runAction={runAction}
        />
      ) : (
        <section className={`${cardClass} p-5`}>
          <EmptyLine text="Select a booking to manage." />
        </section>
      )}
    </div>
  );
}

function BookingEditor({
  booking,
  inventory,
  services,
  runAction,
}: {
  booking: Booking;
  inventory: InventoryItem[];
  services: RentalService[];
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState(booking);

  function updateLine(id: string, patch: Partial<BookingLineItem>) {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function addCatalogItem(kind: "item" | "service", id: string) {
    const inventoryItem = inventory.find((item) => item.id === id);
    const service = services.find((item) => item.id === id);
    const source = kind === "item" ? inventoryItem : service;

    if (!source) {
      return;
    }

    setDraft((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: `line_${Date.now()}`,
          itemId: kind === "item" ? source.id : undefined,
          serviceId: kind === "service" ? source.id : undefined,
          name: source.name,
          category: source.category,
          quantity: 1,
          unitPrice: kind === "item" ? (source as InventoryItem).rentalPrice : (source as RentalService).price,
          discount: 0,
          additionalCharge: 0,
        },
      ],
    }));
  }

  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="border-b border-neutral-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black">{booking.reference}</h2>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">{booking.customer.fullName} - {booking.customer.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => runAction("booking.status", { bookingId: booking.id, status: item })}
              className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                booking.status === item
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <Input label="Event type" value={draft.eventType} onChange={(value) => setDraft({ ...draft, eventType: value })} />
        <Input label="Event date" type="date" value={draft.eventDate} onChange={(value) => setDraft({ ...draft, eventDate: value })} />
        <Input label="Start time" type="time" value={draft.eventStartTime} onChange={(value) => setDraft({ ...draft, eventStartTime: value })} />
        <Input label="End time" type="time" value={draft.eventEndTime} onChange={(value) => setDraft({ ...draft, eventEndTime: value })} />
        <Input label="Venue" value={draft.venue} onChange={(value) => setDraft({ ...draft, venue: value })} />
        <Input label="Venue address" value={draft.venueAddress} onChange={(value) => setDraft({ ...draft, venueAddress: value })} />
        <Input label="Setup schedule" value={draft.setupSchedule} onChange={(value) => setDraft({ ...draft, setupSchedule: value })} />
        <Input label="Pull-out schedule" value={draft.pullOutSchedule} onChange={(value) => setDraft({ ...draft, pullOutSchedule: value })} />
      </div>

      <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
        <Textarea label="Special requests" value={draft.specialRequests || ""} onChange={(value) => setDraft({ ...draft, specialRequests: value })} />
        <Textarea label="Internal notes" value={draft.internalNotes || ""} onChange={(value) => setDraft({ ...draft, internalNotes: value })} />
      </div>

      <div className="mx-5 rounded-lg border border-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/80 p-4">
          <h3 className="font-black">Services and rental items</h3>
          <div className="flex flex-wrap gap-2">
            <select className={fieldClass} defaultValue="" onChange={(event) => { addCatalogItem("item", event.target.value); event.target.value = ""; }}>
              <option value="">Add item</option>
              {inventory.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className={fieldClass} defaultValue="" onChange={(event) => { addCatalogItem("service", event.target.value); event.target.value = ""; }}>
              <option value="">Add service</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-white text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Charge</th>
                <th className="p-3">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {draft.items.map((item) => (
                <tr key={item.id} className="border-t border-neutral-100 hover:bg-neutral-50/70">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3"><NumberInput value={item.quantity} onChange={(value) => updateLine(item.id, { quantity: value })} /></td>
                  <td className="p-3"><NumberInput value={item.unitPrice} onChange={(value) => updateLine(item.id, { unitPrice: value })} /></td>
                  <td className="p-3"><NumberInput value={item.discount} onChange={(value) => updateLine(item.id, { discount: value })} /></td>
                  <td className="p-3"><NumberInput value={item.additionalCharge} onChange={(value) => updateLine(item.id, { additionalCharge: value })} /></td>
                  <td className="p-3 font-bold">{money(item.quantity * item.unitPrice - item.discount + item.additionalCharge)}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      className="text-sm font-bold text-red-600"
                      onClick={() => setDraft((current) => ({ ...current, items: current.items.filter((line) => line.id !== item.id) }))}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-5 mt-5 grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50/80 p-4 sm:grid-cols-4">
        <Metric label="Total" value={money(booking.totalAmount)} />
        <Metric label="Paid" value={money(booking.amountPaid)} />
        <Metric label="Balance" value={money(booking.remainingBalance)} />
        <Metric label="Payment" value={booking.paymentStatus} />
      </div>

      <div className="flex flex-wrap gap-3 p-5">
        <Button onClick={() => runAction("booking.save", { bookingId: booking.id, fields: draft })}>
          <Save className="size-4" aria-hidden="true" />
          Save Booking
        </Button>
        <Button variant="outline" onClick={() => runAction("quotation.generate", { bookingId: booking.id, expiresAt: "", notes: "" })}>
          Generate Quotation
        </Button>
        <Button variant="outline" onClick={() => runAction("contract.generate", { bookingId: booking.id })}>
          Generate Contract
        </Button>
      </div>

      <PaymentForm booking={booking} runAction={runAction} />

      <div className="border-t border-neutral-200 p-5">
        <h3 className="font-black">Booking history</h3>
        <div className="mt-3 space-y-2">
          {booking.history.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-sm">
              <p className="font-bold">{entry.message}</p>
              <p className="text-neutral-500">{entry.actor} - {new Date(entry.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PaymentForm({
  booking,
  runAction,
}: {
  booking: Booking;
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  async function record(formData: FormData) {
    await runAction("payment.record", {
      bookingId: booking.id,
      type: formData.get("type"),
      amount: formData.get("amount"),
      method: formData.get("method"),
      reference: formData.get("reference"),
      notes: formData.get("notes"),
      paidAt: formData.get("paidAt"),
    });
  }

  return (
    <form action={record} className="mx-5 mb-5 rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 flex items-center gap-2 font-black">
        <WalletCards className="size-4" aria-hidden="true" />
        Record payment
      </h3>
      <div className="grid gap-3 md:grid-cols-3">
        <select name="type" className={fieldClass}>
          <option>Down Payment</option>
          <option>Partial Payment</option>
          <option>Full Payment</option>
          <option>Security Deposit</option>
        </select>
        <input name="amount" required type="number" min="1" placeholder="Amount" className={fieldClass} />
        <input name="method" required placeholder="Cash, GCash, bank transfer" className={fieldClass} />
        <input name="reference" placeholder="Payment reference" className={fieldClass} />
        <input name="paidAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={fieldClass} />
        <input name="notes" placeholder="Payment notes" className={fieldClass} />
      </div>
      <Button type="submit" className="mt-3">
        Record Payment
      </Button>
    </form>
  );
}

function CalendarView({ bookings }: { bookings: Booking[] }) {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const conflicts = bookings.filter((booking) =>
    bookings.some(
      (other) =>
        other.id !== booking.id &&
        other.eventDate === booking.eventDate &&
        booking.eventStartTime < other.eventEndTime &&
        other.eventStartTime < booking.eventEndTime &&
        booking.status !== "Cancelled" &&
        other.status !== "Cancelled"
    )
  );
  const visible = bookings.filter((booking) =>
    view === "day"
      ? booking.eventDate === date
      : view === "week"
        ? Math.abs(new Date(booking.eventDate).getTime() - new Date(date).getTime()) <= 1000 * 60 * 60 * 24 * 7
        : booking.eventDate.slice(0, 7) === date.slice(0, 7)
  );

  return (
    <section className={`${cardClass} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">Booking Calendar</h2>
        <div className="flex gap-2">
          {["day", "week", "month"].map((item) => (
            <button key={item} type="button" onClick={() => setView(item)} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === item ? "bg-black text-white" : "bg-neutral-100"}`}>
              {item}
            </button>
          ))}
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} />
        </div>
      </div>
      {conflicts.length > 0 ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          {conflicts.length} overlapping event record{conflicts.length === 1 ? "" : "s"} detected.
        </div>
      ) : null}
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visible.length === 0 ? <EmptyLine text="No bookings in this calendar range." /> : null}
        {visible.map((booking) => (
          <div key={booking.id} className="rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">{booking.reference}</p>
                <p className="text-sm text-neutral-500">{booking.eventDate} {booking.eventStartTime}-{booking.eventEndTime}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(booking.status)}`}>{booking.status}</span>
            </div>
            <p className="mt-3 text-sm">{booking.eventType}</p>
            <p className="text-sm text-neutral-500">{booking.venue}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InventoryView({
  data,
  runAction,
}: {
  data: AdminSnapshot;
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState<InventoryItem>(blankInventory());

  async function save(formData: FormData) {
    await runAction("inventory.save", {
      item: {
        ...draft,
        name: String(formData.get("name")),
        category: String(formData.get("category")),
        rentalPrice: Number(formData.get("rentalPrice")),
        totalQuantity: Number(formData.get("totalQuantity")),
        damagedQuantity: Number(formData.get("damagedQuantity")),
        maintenanceQuantity: Number(formData.get("maintenanceQuantity")),
        status: String(formData.get("status")),
        image: String(formData.get("image")),
        notes: String(formData.get("notes")),
      },
    });
    setDraft(blankInventory());
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-neutral-200 p-5">
          <SectionTitle title="Inventory" action={`${data.inventory.length} item${data.inventory.length === 1 ? "" : "s"}`} />
        </div>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total</th>
                <th className="p-3">Available</th>
                <th className="p-3">Reserved</th>
                <th className="p-3">Damaged</th>
                <th className="p-3">Maintenance</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.inventory.map((item) => (
                <tr key={item.id} className="cursor-pointer border-t border-neutral-100 hover:bg-neutral-50" onClick={() => setDraft(item)}>
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{money(item.rentalPrice)}</td>
                  <td className="p-3">{item.totalQuantity}</td>
                  <td className="p-3">{item.availableQuantity}</td>
                  <td className="p-3">{item.reservedQuantity}</td>
                  <td className="p-3">{item.damagedQuantity}</td>
                  <td className="p-3">{item.maintenanceQuantity}</td>
                  <td className="p-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <form key={draft.id || "new-inventory"} action={save} className={`${cardClass} p-5`}>
        <h3 className="text-lg font-black">{draft.id ? "Edit item" : "Add item"}</h3>
        <FormStack>
          <input name="name" defaultValue={draft.name} required placeholder="Item name" className={fieldClass} />
          <input name="category" defaultValue={draft.category} required placeholder="Category" className={fieldClass} />
          <input name="rentalPrice" defaultValue={draft.rentalPrice} type="number" min="0" placeholder="Rental price" className={fieldClass} />
          <input name="totalQuantity" defaultValue={draft.totalQuantity} type="number" min="0" placeholder="Total quantity" className={fieldClass} />
          <input name="damagedQuantity" defaultValue={draft.damagedQuantity} type="number" min="0" placeholder="Damaged quantity" className={fieldClass} />
          <input name="maintenanceQuantity" defaultValue={draft.maintenanceQuantity} type="number" min="0" placeholder="Maintenance quantity" className={fieldClass} />
          <select name="status" defaultValue={draft.status} className={fieldClass}>
            {["Available", "Reserved", "In Use", "Under Maintenance", "Damaged", "Inactive"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input name="image" defaultValue={draft.image} placeholder="Image path" className={fieldClass} />
          <textarea name="notes" defaultValue={draft.notes} placeholder="Notes" className={fieldClass} />
        </FormStack>
        <div className="mt-4 flex gap-2">
          <Button type="submit"><Save className="size-4" aria-hidden="true" />Save</Button>
          <Button type="button" variant="outline" onClick={() => setDraft(blankInventory())}>New</Button>
        </div>
      </form>
    </div>
  );
}

function ServicesView({
  data,
  runAction,
}: {
  data: AdminSnapshot;
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState<RentalService>(blankService());

  async function save(formData: FormData) {
    await runAction("service.save", {
      service: {
        ...draft,
        name: String(formData.get("name")),
        category: String(formData.get("category")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        image: String(formData.get("image")),
        status: String(formData.get("status")),
        inclusions: String(formData.get("inclusions") || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [name, quantity] = line.split(":");
            return { name: name.trim(), quantity: Number(quantity || 1) };
          }),
      },
    });
    setDraft(blankService());
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className={`${cardClass} p-5`}>
        <SectionTitle title="Services and Packages" action={`${data.services.length} catalog entries`} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.services.map((service) => (
            <button key={service.id} type="button" onClick={() => setDraft(service)} className="rounded-lg border border-neutral-200 p-4 text-left transition hover:border-neutral-300 hover:bg-neutral-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black">{service.name}</p>
                  <p className="text-sm text-neutral-500">{service.category}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(service.status)}`}>{service.status}</span>
              </div>
              <p className="mt-3 text-sm text-neutral-600">{service.description}</p>
              <p className="mt-3 font-black">{money(service.price)}</p>
            </button>
          ))}
        </div>
      </section>
      <form key={draft.id || "new-service"} action={save} className={`${cardClass} p-5`}>
        <h3 className="text-lg font-black">{draft.id ? "Edit service" : "Add service"}</h3>
        <FormStack>
          <input name="name" required defaultValue={draft.name} placeholder="Service or package name" className={fieldClass} />
          <input name="category" required defaultValue={draft.category} placeholder="Sounds, Lights, Tables, Packages" className={fieldClass} />
          <input name="price" defaultValue={draft.price} type="number" min="0" placeholder="Price" className={fieldClass} />
          <input name="image" defaultValue={draft.image} placeholder="Image path" className={fieldClass} />
          <textarea name="description" defaultValue={draft.description} placeholder="Description" className={fieldClass} />
          <textarea name="inclusions" defaultValue={draft.inclusions.map((item) => `${item.name}:${item.quantity}`).join("\n")} placeholder="Inclusions, one per line: Name:Quantity" className={fieldClass} />
          <select name="status" defaultValue={draft.status} className={fieldClass}>
            <option>Active</option>
            <option>Archived</option>
          </select>
        </FormStack>
        <div className="mt-4 flex gap-2">
          <Button type="submit"><Save className="size-4" aria-hidden="true" />Save</Button>
          <Button type="button" variant="outline" onClick={() => setDraft(blankService())}>New</Button>
        </div>
      </form>
    </div>
  );
}

function CustomersView({ data }: { data: AdminSnapshot }) {
  const [search, setSearch] = useState("");
  const customers = data.customers.filter((customer) =>
    [customer.fullName, customer.email, customer.phone].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={`${cardClass} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title="Customers" action={`${customers.length} shown`} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className={fieldClass} />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {customers.length === 0 ? <EmptyLine text="No customers found." /> : null}
        {customers.map((customer) => {
          const bookings = data.bookings.filter((booking) => booking.customerId === customer.id);
          const spending = bookings.reduce((sum, booking) => sum + booking.amountPaid, 0);
          const balance = bookings.reduce((sum, booking) => sum + booking.remainingBalance, 0);
          return (
            <div key={customer.id} className="rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50">
              <p className="font-black">{customer.fullName}</p>
              <p className="text-sm text-neutral-500">{customer.phone}</p>
              <p className="text-sm text-neutral-500">{customer.email}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <Metric label="Bookings" value={String(bookings.length)} />
                <Metric label="Spent" value={money(spending)} />
                <Metric label="Balance" value={money(balance)} />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {bookings.map((booking) => (
                  <p key={booking.id} className="rounded-lg border border-neutral-100 bg-white p-2">{booking.reference} - {booking.status}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DocumentsView({
  data,
  runAction,
}: {
  data: AdminSnapshot;
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <DocumentPanel
        title="Quotations"
        empty="No quotations generated yet."
        items={data.quotations}
        render={(quotation) => {
          const booking = data.bookings.find((item) => item.id === quotation.bookingId);
          return (
            <DocumentRow key={quotation.id} title={quotation.reference} subtitle={booking?.reference || ""} status={quotation.status}>
              {(["Draft", "Sent", "Accepted", "Rejected", "Expired"] as QuotationStatus[]).map((status) => (
                <button key={status} type="button" onClick={() => runAction("quotation.status", { quotationId: quotation.id, status })} className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-bold">
                  {status}
                </button>
              ))}
              <a href={`/api/admin/documents/quotation/${quotation.id}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-xs font-bold text-white">
                <Download className="size-3" aria-hidden="true" />PDF
              </a>
            </DocumentRow>
          );
        }}
      />
      <DocumentPanel
        title="Contracts"
        empty="No contracts generated yet."
        items={data.contracts}
        render={(contract) => {
          const booking = data.bookings.find((item) => item.id === contract.bookingId);
          return (
            <DocumentRow key={contract.id} title={contract.reference} subtitle={`${booking?.reference || ""} - ${contract.versions.length} version(s)`} status={contract.status}>
              {(["Draft", "Generated", "Sent", "Signed", "Cancelled", "Expired"] as ContractStatus[]).map((status) => (
                <button key={status} type="button" onClick={() => runAction("contract.status", { contractId: contract.id, status })} className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-bold">
                  {status}
                </button>
              ))}
              <SignedCopyForm contract={contract} runAction={runAction} />
              <a href={`/api/admin/documents/contract/${contract.id}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-xs font-bold text-white">
                <Download className="size-3" aria-hidden="true" />PDF
              </a>
            </DocumentRow>
          );
        }}
      />
    </div>
  );
}

function ReportsView({ data }: { data: AdminSnapshot }) {
  const reportRows = [
    ["Bookings by date", data.bookings.map((booking) => `${booking.eventDate},${booking.reference},${booking.status}`).join("\n")],
    ["Revenue", `Total revenue,${data.stats.totalRevenue}`],
    ["Outstanding balances", data.bookings.map((booking) => `${booking.reference},${booking.remainingBalance}`).join("\n")],
    ["Most-booked services", countBy(data.bookings.flatMap((booking) => booking.items.map((item) => item.name)))],
    ["Most-rented items", countBy(data.bookings.flatMap((booking) => booking.items.filter((item) => item.itemId).map((item) => item.name)))],
    ["Cancelled bookings", data.bookings.filter((booking) => booking.status === "Cancelled").map((booking) => booking.reference).join("\n")],
    ["Inventory usage", data.inventory.map((item) => `${item.name},${item.reservedQuantity},${item.availableQuantity}`).join("\n")],
    ["Customer booking history", data.customers.map((customer) => `${customer.fullName},${data.bookings.filter((booking) => booking.customerId === customer.id).length}`).join("\n")],
    ["Contract status", countBy(data.contracts.map((contract) => contract.status))],
    ["Quotation status", countBy(data.quotations.map((quotation) => quotation.status))],
  ];

  function exportCsv(title: string, content: string) {
    const blob = new Blob([content || title], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className={`${cardClass} p-5`}>
      <h2 className="text-xl font-black">Reports</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {reportRows.map(([title, content]) => (
          <div key={title} className="rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black">{title}</h3>
              <button type="button" onClick={() => exportCsv(title, content)} className="inline-flex items-center gap-1 rounded-lg bg-black px-3 py-2 text-sm font-bold text-white">
                <Download className="size-4" aria-hidden="true" />
                CSV
              </button>
            </div>
            <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg border border-neutral-100 bg-white p-3 text-xs text-neutral-600">{content || "No data yet."}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-sm font-bold text-neutral-700">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} mt-2`} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-bold text-neutral-700">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} mt-2 min-h-24`} />
    </label>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <input type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-24 rounded-lg border border-neutral-200 px-2 py-1.5 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10" />;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-4 text-sm font-medium text-neutral-500">{text}</p>;
}

function FormStack({ children }: { children: ReactNode }) {
  return <div className="mt-4 space-y-3">{children}</div>;
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <h2 className="truncate text-lg font-black tracking-tight">{title}</h2>
      {action ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-bold text-neutral-500">
          {action}
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );
}

function DocumentPanel<T>({ title, empty, items, render }: { title: string; empty: string; items: T[]; render: (item: T) => ReactNode }) {
  return (
    <section className={`${cardClass} p-5`}>
      <SectionTitle title={title} action={`${items.length} record${items.length === 1 ? "" : "s"}`} />
      <div className="mt-4 space-y-3">{items.length === 0 ? <EmptyLine text={empty} /> : items.map(render)}</div>
    </section>
  );
}

function DocumentRow({ title, subtitle, status, children }: { title: string; subtitle: string; status: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black">{title}</p>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(status)}`}>{status}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SignedCopyForm({
  contract,
  runAction,
}: {
  contract: Contract;
  runAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  async function save(formData: FormData) {
    await runAction("contract.signedCopy", {
      contractId: contract.id,
      signedCopyName: formData.get("signedCopyName"),
      signedDate: formData.get("signedDate"),
    });
  }

  return (
    <form action={save} className="flex flex-wrap gap-2">
      <input name="signedCopyName" placeholder="Signed copy filename" className="w-40 rounded-lg border border-neutral-200 px-2 py-1 text-xs" />
      <input name="signedDate" type="date" className="rounded-lg border border-neutral-200 px-2 py-1 text-xs" />
      <button type="submit" className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
        <CheckCircle2 className="size-3" aria-hidden="true" />
        Signed
      </button>
    </form>
  );
}

function blankInventory(): InventoryItem {
  return {
    id: "",
    name: "",
    category: "",
    rentalPrice: 0,
    totalQuantity: 0,
    availableQuantity: 0,
    reservedQuantity: 0,
    damagedQuantity: 0,
    maintenanceQuantity: 0,
    status: "Available",
    image: "",
    notes: "",
    updatedAt: "",
  };
}

function blankService(): RentalService {
  return {
    id: "",
    name: "",
    category: "",
    description: "",
    price: 0,
    image: "",
    inclusions: [],
    status: "Active",
    updatedAt: "",
  };
}

function countBy(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key},${value}`)
    .join("\n");
}
