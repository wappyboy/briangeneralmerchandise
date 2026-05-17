import {
  Armchair,
  AudioLines,
  CalendarCheck,
  Lightbulb,
  PackageCheck,
  Sparkles,
} from "lucide-react";

import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    title: "Sounds System Rental",
    description:
      "Clear and reliable audio setup for birthdays, weddings, school programs, corporate events, and community gatherings.",
    icon: AudioLines,
  },
  {
    title: "Lights Rental",
    description:
      "Clean lighting support to improve the mood, stage presence, and overall event experience.",
    icon: Lightbulb,
  },
  {
    title: "Tables Rental",
    description:
      "Practical and organized table rental options for small gatherings, celebrations, and formal events.",
    icon: PackageCheck,
  },
  {
    title: "Chairs Rental",
    description:
      "Comfortable chair rental support for guests, programs, receptions, and community occasions.",
    icon: Armchair,
  },
  {
    title: "Full Event Setup",
    description:
      "Setup assistance for sounds, lights, tables, chairs, and other event equipment needs.",
    icon: CalendarCheck,
  },
  {
    title: "Custom Event Packages",
    description:
      "Flexible rental combinations based on your event type, venue, guest count, and setup requirements.",
    icon: Sparkles,
  },
];