import type { ServiceItem } from "@/types";

type ServiceCardProps = {
  service: ServiceItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <article className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-xl">
      <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-black text-white transition duration-300 group-hover:scale-110">
        <Icon className="size-6" aria-hidden="true" />
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-neutral-950">
        {service.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        {service.description}
      </p>
    </article>
  );
}