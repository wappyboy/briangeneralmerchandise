import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Gallery",
    href: "#gallery",
  },
  {
    label: "Packages",
    href: "#packages",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

const contactLinks = [
  {
    label: "Call us",
    value: "Add owner mobile number",
    href: "tel:+630000000000",
    icon: Phone,
  },
  {
    label: "Email us",
    value: "Add business email",
    href: "mailto:business@email.com",
    icon: Mail,
  },
  {
    label: "Facebook page",
    value: "Add Facebook page link",
    href: "https://facebook.com",
    icon: ExternalLink,
  },
  {
    label: "Service area",
    value: "Add business location/service area",
    href: "#contact",
    icon: MapPin,
  },

];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Brian&apos;s General Merchandise
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-400">
            Sounds, lights, tables, chairs, event equipment rental, and setup
            services for birthdays, weddings, school programs, corporate
            events, and community gatherings.
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Sounds • Lights • Tables • Chairs
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-neutral-300 transition hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Contact
          </h3>

          <ul className="mt-5 space-y-4">
            {contactLinks.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex gap-3 text-sm text-neutral-300 transition hover:text-white"
                    target={
                      item.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      item.href.startsWith("http")
                        ? "noreferrer"
                        : undefined
                    }
                  >
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition group-hover:border-white/30 group-hover:text-white">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>

                    <span>
                      <span className="block font-medium text-white">
                        {item.label}
                      </span>
                      <span className="block text-neutral-400">
                        {item.value}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Brian&apos;s General Merchandise. All rights
            reserved.
          </p>

          <p>Designed for modern event rental inquiries.</p>
        </div>
      </div>
    </footer>
  );
}