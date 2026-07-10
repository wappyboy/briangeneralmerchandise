"use client";

import { CalendarDays, Loader2, MapPin, PackagePlus, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { InventoryItem, RentalService } from "@/types/admin";

type Catalog = {
  inventory: InventoryItem[];
  services: RentalService[];
};

type Selection = {
  key: string;
  itemId?: string;
  serviceId?: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-white focus:ring-2 focus:ring-white/30";

const selectClass =
  "w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-white focus:ring-2 focus:ring-white/30";

export function BookingRequestForm() {
  const [catalog, setCatalog] = useState<Catalog>({ inventory: [], services: [] });
  const [selections, setSelections] = useState<Selection[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ reference: string; totalAmount: number } | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await fetch("/api/bookings");
        const data = (await response.json()) as Catalog;
        setCatalog(data);
      } catch {
        setError("Unable to load rental items right now.");
      } finally {
        setIsLoadingCatalog(false);
      }
    }

    loadCatalog();
  }, []);

  const catalogOptions = useMemo(
    () => [
      ...catalog.services.map((service) => ({
        key: service.id,
        serviceId: service.id,
        name: service.name,
        category: service.category,
        unitPrice: service.price,
        availableQuantity: 1,
      })),
      ...catalog.inventory.map((item) => ({
        key: item.id,
        itemId: item.id,
        name: item.name,
        category: item.category,
        unitPrice: item.rentalPrice,
        availableQuantity: item.availableQuantity,
      })),
    ],
    [catalog]
  );

  const estimate = selections.reduce(
    (sum, selection) => sum + selection.quantity * selection.unitPrice,
    0
  );

  function addSelection(key: string) {
    const option = catalogOptions.find((candidate) => candidate.key === key);

    if (!option || selections.some((selection) => selection.key === key)) {
      return;
    }

    setSelections((current) => [...current, { ...option, quantity: 1 }]);
  }

  async function submitBooking(formData: FormData) {
    setIsSubmitting(true);
    setError("");
    setSuccess(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            address: formData.get("address"),
          },
          eventType: formData.get("eventType"),
          eventDate: formData.get("eventDate"),
          eventStartTime: formData.get("eventStartTime"),
          eventEndTime: formData.get("eventEndTime"),
          venue: formData.get("venue"),
          venueAddress: formData.get("venueAddress"),
          setupSchedule: formData.get("setupSchedule"),
          pullOutSchedule: formData.get("pullOutSchedule"),
          specialRequests: formData.get("specialRequests"),
          selections,
        }),
      });

      const data = (await response.json()) as {
        reference?: string;
        totalAmount?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Booking request failed.");
      }

      setSuccess({
        reference: data.reference || "",
        totalAmount: data.totalAmount || 0,
      });
      setSelections([]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Booking request failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      action={submitBooking}
      className="mx-auto mt-12 grid max-w-6xl gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-left shadow-2xl shadow-black/30 sm:p-6 lg:grid-cols-[1fr_0.9fr]"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-white">
            Full name
            <input name="fullName" required className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Contact number
            <input name="phone" required className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Email
            <input name="email" required type="email" className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Address
            <input name="address" className={inputClass} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-white">
            Event type
            <input name="eventType" required placeholder="Birthday, wedding, corporate event" className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Event date
            <input name="eventDate" required type="date" className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Start time
            <input name="eventStartTime" required type="time" className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            End time
            <input name="eventEndTime" required type="time" className={inputClass} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-white">
            Venue
            <input name="venue" required className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Venue address
            <input name="venueAddress" required className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Setup schedule
            <input name="setupSchedule" className={inputClass} />
          </label>
          <label className="space-y-2 text-sm font-medium text-white">
            Pull-out schedule
            <input name="pullOutSchedule" className={inputClass} />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-white">
          Special requests
          <textarea name="specialRequests" rows={4} className={inputClass} />
        </label>
      </div>

      <div className="space-y-5 rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center gap-3">
          <PackagePlus className="size-5 text-white" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-white">Rental selections</h3>
        </div>

        <label className="space-y-2 text-sm font-medium text-white">
          Add service or item
          <select
            className={selectClass}
            disabled={isLoadingCatalog}
            defaultValue=""
            onChange={(event) => {
              addSelection(event.target.value);
              event.target.value = "";
            }}
          >
            <option value="">Select from catalog</option>
            {catalogOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name} - PHP {option.unitPrice.toLocaleString()}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-3">
          {selections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/20 p-4 text-sm text-neutral-300">
              Select sounds, lights, tables, chairs, tents, stage setup, or packages.
            </div>
          ) : (
            selections.map((selection) => (
              <div key={selection.key} className="rounded-xl bg-white p-4 text-black">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{selection.name}</p>
                    <p className="text-sm text-neutral-500">{selection.category}</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600"
                    onClick={() =>
                      setSelections((current) =>
                        current.filter((candidate) => candidate.key !== selection.key)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
                <label className="mt-3 block text-sm font-medium">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    value={selection.quantity}
                    className="mt-2 w-28 rounded-lg border border-neutral-300 px-3 py-2"
                    onChange={(event) =>
                      setSelections((current) =>
                        current.map((candidate) =>
                          candidate.key === selection.key
                            ? { ...candidate, quantity: Number(event.target.value) }
                            : candidate
                        )
                      )
                    }
                  />
                </label>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-3 rounded-xl border border-white/10 p-4 text-sm text-neutral-200 sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            Admin review
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" />
            Availability check
          </span>
        </div>

        <div className="rounded-xl bg-white p-4 text-black">
          <p className="text-sm text-neutral-500">Estimated total</p>
          <p className="text-3xl font-black">PHP {estimate.toLocaleString()}</p>
        </div>

        {error ? <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{error}</p> : null}
        {success ? (
          <div className="rounded-xl bg-emerald-100 p-4 text-sm text-emerald-800">
            <p className="font-bold">Booking request received: {success.reference}</p>
            <p>Estimated total: PHP {success.totalAmount.toLocaleString()}</p>
          </div>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          Submit Booking Request
        </Button>
      </div>
    </form>
  );
}
