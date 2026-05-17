import { MotionSection } from "@/components/animations/MotionSection";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white px-4 py-20 text-black sm:px-6 lg:px-8 lg:py-28"
    >
      <MotionSection>
        <SectionHeading
          eyebrow="Our Services"
          title="Everything You Need for a Clean Event Setup"
          description="From sounds and lights to tables and chairs, Brian's General Merchandise provides reliable rental options for different occasions."
        />
      </MotionSection>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <MotionSection key={service.title} delay={index * 0.08}>
            <ServiceCard service={service} />
          </MotionSection>
        ))}
      </div>
    </section>
  );
}