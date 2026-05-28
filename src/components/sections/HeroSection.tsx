"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
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
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
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
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-neutral-700"
              >
                <CheckCircle2 className="size-5 text-black" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-[2rem] border border-neutral-200 bg-neutral-100 p-4"
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
                <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] transition-all duration-500 hover:scale-[1.02]">
        <Image
          src="/bday.jpg"
          alt="Event setup"
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/70" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="transform transition-all duration-500 group-hover:-translate-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300 opacity-80 transition-opacity duration-500 group-hover:opacity-100">
              Brian&apos;s General Merchandise
            </p>

            <h2 className="mt-4 text-3xl font-bold transition-all duration-500 group-hover:text-white">
              Reliable Event Equipment Rental
            </h2>
          </div>
        </div>
      </div>
        </motion.div>
      </div>
    </section>
  );
}