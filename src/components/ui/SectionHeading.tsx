import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-3xl font-bold tracking-tight text-current md:text-5xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-5 text-base leading-7 text-neutral-500 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}