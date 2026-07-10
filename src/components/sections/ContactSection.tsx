import { Mail, MessageCircle, Phone } from "lucide-react";

import { BookingRequestForm } from "@/components/booking/BookingRequestForm";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const contactActions = [
  {
    label: "Call Owner",
    description: "Tap to call directly",
    href: "tel:+630000000000",
    icon: Phone,
  },
  {
    label: "Send SMS",
    description: "Send a quick text inquiry",
    href: "sms:+630000000000",
    icon: MessageCircle,
  },
  {
    label: "Send Email",
    description: "Request a quotation by email",
    href: "mailto:business@email.com",
    icon: Mail,
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
    >
      <SectionHeading
        eyebrow="Contact"
        title="Book Your Event or Request a Quotation"
        description="Send your event details and rental needs. Your request is saved with a booking reference and appears in the admin dashboard for review."
      />

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {contactActions.map((action) => {
          const Icon = action.icon;

          return (
            <a
              key={action.label}
              href={action.href}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white transition hover:-translate-y-1 hover:bg-white hover:text-black"
            >
              <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Icon className="size-6" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-semibold">{action.label}</h3>

              <p className="mt-2 text-sm text-neutral-400">
                {action.description}
              </p>
            </a>
          );
        })}
      </div>

      <BookingRequestForm />

      <div className="mx-auto mt-8 max-w-xl text-center">
        <ButtonLink href="mailto:business@email.com">Send Inquiry by Email</ButtonLink>
      </div>
    </section>
  );
}
