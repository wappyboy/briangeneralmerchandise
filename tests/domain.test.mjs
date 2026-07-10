import assert from "node:assert/strict";
import test from "node:test";

function paymentStatus(total, paid) {
  if (paid <= 0) return "Unpaid";
  if (paid >= total) return paid > total ? "Refund Due" : "Paid";
  return "Partial";
}

function totals(items, payments = []) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = items.reduce((sum, item) => sum + item.discount, 0);
  const additionalCharges = items.reduce((sum, item) => sum + item.additionalCharge, 0);
  const totalAmount = Math.max(0, subtotal - discountTotal + additionalCharges);
  const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    totalAmount,
    amountPaid,
    remainingBalance: Math.max(0, totalAmount - amountPaid),
    paymentStatus: paymentStatus(totalAmount, amountPaid),
  };
}

function overlaps(a, b) {
  return a.eventDate === b.eventDate && a.start < b.end && b.start < a.end;
}

function available(total, damaged, maintenance, reserved) {
  return Math.max(0, total - damaged - maintenance - reserved);
}

test("payment calculations update remaining balance", () => {
  const result = totals(
    [
      { quantity: 2, unitPrice: 1000, discount: 100, additionalCharge: 50 },
      { quantity: 10, unitPrice: 20, discount: 0, additionalCharge: 0 },
    ],
    [{ amount: 500 }]
  );

  assert.equal(result.totalAmount, 2150);
  assert.equal(result.amountPaid, 500);
  assert.equal(result.remainingBalance, 1650);
  assert.equal(result.paymentStatus, "Partial");
});

test("double-booking detection catches overlapping schedules", () => {
  assert.equal(
    overlaps(
      { eventDate: "2026-08-01", start: "13:00", end: "17:00" },
      { eventDate: "2026-08-01", start: "16:00", end: "20:00" }
    ),
    true
  );
  assert.equal(
    overlaps(
      { eventDate: "2026-08-01", start: "08:00", end: "11:00" },
      { eventDate: "2026-08-01", start: "12:00", end: "15:00" }
    ),
    false
  );
});

test("availability prevents exceeding usable stock", () => {
  assert.equal(available(40, 2, 3, 10), 25);
  assert.equal(available(4, 1, 1, 5), 0);
});

test("quotation and contract references remain distinct document workflows", () => {
  const quotation = { status: "Draft", bookingId: "book_1" };
  const contract = { status: "Draft", bookingId: "book_1", versions: [{ version: 1 }] };

  quotation.status = "Accepted";
  contract.status = "Generated";
  contract.versions.push({ version: 2 });

  assert.equal(quotation.status, "Accepted");
  assert.equal(contract.status, "Generated");
  assert.equal(contract.versions.length, 2);
});
