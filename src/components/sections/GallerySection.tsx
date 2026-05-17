import { galleryItems } from "@/data/gallery";
import { GalleryCard } from "@/components/ui/GalleryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
    >
      <SectionHeading
        eyebrow="Event Documentation"
        title="Previous Event Setups"
        description="Browse sample event documentation from birthdays, weddings, school events, corporate programs, and community gatherings."
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <GalleryCard key={`${item.title}-${item.image}`} item={item} />
        ))}
      </div>
    </section>
  );
}