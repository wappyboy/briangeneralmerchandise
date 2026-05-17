import { ArrowRight, CheckCircle2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";

const highlights = [
  "Sounds system rental",
  "Lights rental",
  "Tables and chairs rental",
  "Event setup support",
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="bg-white px-4 pb-20 pt-32 text-black sm:px-6 lg:px-8 lg:pb-28 lg:pt-40"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
            Sounds • Lights • Tables • Chairs
          </p>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            Event rental services for clean and reliable setups.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
            Brian&apos;s General Merchandise provides sounds, lights, tables,
            chairs, event equipment rental, and setup support for birthdays,
            weddings, school programs, corporate events, and community
            gatherings.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="#contact" variant="secondary">
              Book an Event
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>

            <ButtonLink href="#gallery" variant="outline">
              View Gallery
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                <CheckCircle2 className="size-5 text-black" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-neutral-100 p-4">
          <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-black px-6 text-center text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                Brian&apos;s General Merchandise
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Reliable Event Equipment Rental
              </h2>

              <p className="mt-4 text-sm leading-6 text-neutral-300">
                Add a real event setup photo here later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}