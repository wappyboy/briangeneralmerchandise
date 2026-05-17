import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { PackageItem } from "@/types";

type PackageCardProps = {
  packageItem: PackageItem;
};

export function PackageCard({ packageItem }: PackageCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        packageItem.isFeatured
          ? "border-black bg-black text-white"
          : "border-neutral-200 bg-white text-neutral-950"
      )}
    >
      {packageItem.isFeatured ? (
        <p className="mb-4 w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
          Popular
        </p>
      ) : null}

      <h3 className="text-2xl font-bold tracking-tight">
        {packageItem.name}
      </h3>

      <p
        className={cn(
          "mt-3 text-sm leading-6",
          packageItem.isFeatured ? "text-neutral-300" : "text-neutral-600"
        )}
      >
        {packageItem.description}
      </p>

      <ul className="mt-6 space-y-3">
        {packageItem.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6">
            <Check
              className={cn(
                "mt-0.5 size-5 shrink-0",
                packageItem.isFeatured ? "text-white" : "text-black"
              )}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <ButtonLink
          href="#contact"
          variant={packageItem.isFeatured ? "primary" : "secondary"}
          className="w-full"
        >
          Contact us for quotation
        </ButtonLink>
      </div>
    </article>
  );
}