import { MotionSection } from "@/components/animations/MotionSection";
import { galleryItems } from "@/data/gallery";
import { GalleryCard } from "@/components/ui/GalleryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
    >
      <MotionSection>
        <SectionHeading
          eyebrow="Event Documentation"
          title="Previous Event Setups"
          description="Browse sample event documentation from birthdays, weddings, school events, corporate programs, and community gatherings."
        />
      </MotionSection>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, index) => (
          <MotionSection key={`${item.title}-${item.image}`} delay={index * 0.08}>
            <GalleryCard item={item} />
          </MotionSection>
        ))}
      </div>
    </section>
  );
}