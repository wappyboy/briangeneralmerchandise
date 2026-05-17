import { packages } from "@/data/packages";
import { PackageCard } from "@/components/ui/PackageCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PackagesSection() {
  return (
    <section
      id="packages"
      className="bg-neutral-100 px-4 py-20 text-black sm:px-6 lg:px-8 lg:py-28"
    >
      <SectionHeading
        eyebrow="Packages"
        title="Flexible Packages for Different Events"
        description="Choose a simple package or request a custom setup based on your event type, venue, guest count, and rental needs."
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((packageItem) => (
          <PackageCard key={packageItem.name} packageItem={packageItem} />
        ))}
      </div>
    </section>
  );
}