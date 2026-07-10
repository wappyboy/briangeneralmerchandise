import { NextResponse } from "next/server";

import { createId, normalizeQuantity, parseMoney } from "@/lib/domain";
import { createBookingRequest, readData } from "@/lib/server/store";
import type { BookingLineItem } from "@/types/admin";

export async function GET() {
  const data = await readData();
  return NextResponse.json({
    inventory: data.inventory.filter((item) => item.status !== "Inactive"),
    services: data.services.filter((service) => service.status === "Active"),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customer?: {
        fullName?: string;
        email?: string;
        phone?: string;
        address?: string;
      };
      eventType?: string;
      eventDate?: string;
      eventStartTime?: string;
      eventEndTime?: string;
      venue?: string;
      venueAddress?: string;
      setupSchedule?: string;
      pullOutSchedule?: string;
      specialRequests?: string;
      selections?: {
        itemId?: string;
        serviceId?: string;
        name: string;
        category: string;
        quantity: number;
        unitPrice: number;
      }[];
    };

    const requiredFields = [
      body.customer?.fullName,
      body.customer?.email,
      body.customer?.phone,
      body.eventType,
      body.eventDate,
      body.eventStartTime,
      body.eventEndTime,
      body.venue,
      body.venueAddress,
    ];

    if (requiredFields.some((field) => !field)) {
      return NextResponse.json({ error: "Please complete all required booking fields." }, { status: 400 });
    }

    const items: BookingLineItem[] = (body.selections || [])
      .map((selection) => ({
        id: createId("line"),
        itemId: selection.itemId,
        serviceId: selection.serviceId,
        name: selection.name,
        category: selection.category,
        quantity: normalizeQuantity(selection.quantity),
        unitPrice: parseMoney(selection.unitPrice),
        discount: 0,
        additionalCharge: 0,
      }))
      .filter((item) => item.quantity > 0);

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Select at least one service, package, or rental item." },
        { status: 400 }
      );
    }

    const booking = await createBookingRequest({
      customer: {
        fullName: body.customer!.fullName!,
        email: body.customer!.email!,
        phone: body.customer!.phone!,
        address: body.customer!.address,
      },
      eventType: body.eventType!,
      eventDate: body.eventDate!,
      eventStartTime: body.eventStartTime!,
      eventEndTime: body.eventEndTime!,
      venue: body.venue!,
      venueAddress: body.venueAddress!,
      setupSchedule: body.setupSchedule,
      pullOutSchedule: body.pullOutSchedule,
      specialRequests: body.specialRequests,
      items,
    });

    return NextResponse.json({
      reference: booking.reference,
      status: booking.status,
      totalAmount: booking.totalAmount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking." },
      { status: 400 }
    );
  }
}
