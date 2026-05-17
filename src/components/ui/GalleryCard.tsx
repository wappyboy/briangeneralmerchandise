import Image from "next/image";

import type { GalleryItem } from "@/types";

type GalleryCardProps = {
  item: GalleryItem;
};

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-neutral-900">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-300">
          {item.category}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight">
          {item.title}
        </h3>
      </div>
    </article>
  );
}