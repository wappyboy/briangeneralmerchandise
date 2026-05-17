import type { PackageItem } from "@/types";

export const packages: PackageItem[] = [
  {
    name: "Basic Package",
    description:
      "A simple rental setup for small events, family gatherings, and community programs.",
    features: [
      "Basic sounds setup",
      "Tables and chairs support",
      "Setup assistance",
      "Contact us for quotation",
    ],
  },
  {
    name: "Standard Package",
    description:
      "A balanced setup for birthdays, school programs, and medium-sized celebrations.",
    features: [
      "Sounds system rental",
      "Basic lights setup",
      "Tables and chairs support",
      "Event setup assistance",
      "Contact us for quotation",
    ],
  },
  {
    name: "Premium Package",
    description:
      "A more complete event rental setup with sounds, lights, tables, chairs, and support.",
    features: [
      "Sounds system rental",
      "Lights rental",
      "Tables and chairs support",
      "Full setup assistance",
      "Recommended for bigger events",
      "Contact us for quotation",
    ],
    isFeatured: true,
  },
  {
    name: "Custom Package",
    description:
      "A flexible package for customers who need a setup based on their exact event needs.",
    features: [
      "Choose your rental needs",
      "Flexible equipment combination",
      "Good for unique event setups",
      "Quotation based on event details",
    ],
  },
];