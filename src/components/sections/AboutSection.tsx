import { CheckCircle2 } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  "Reliable equipment for different event needs",
  "Clean and organized setup",
  "On-time service and coordination",
  "Affordable package options",
  "Professional event support",
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-white px-4 py-20 text-black sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          align="left"
          eyebrow="About Us"
          title="Practical Event Rental Support You Can Rely On"
          description="Brian's General Merchandise helps customers prepare clean and reliable event setups through sounds, lights, tables, chairs, and equipment rental support."
        />

        <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 shadow-sm sm:p-8">
          <h3 className="text-2xl font-bold tracking-tight">
            Why choose Brian&apos;s General Merchandise?
          </h3>

          <p className="mt-4 text-base leading-7 text-neutral-600">
            The business focuses on giving customers a convenient way to rent
            event equipment and request setup assistance for different
            occasions. Whether it is a small family celebration or a larger
            community event, the goal is to provide reliable support from
            inquiry to setup.
          </p>

          <ul className="mt-8 space-y-4">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex gap-3 text-sm leading-6 text-neutral-700"
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-black"
                  aria-hidden="true"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}