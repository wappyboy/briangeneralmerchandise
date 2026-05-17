import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type PackageItem = {
  name: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
};

export type GalleryItem = {
  title: string;
  category: string;
  image: string;
  alt: string;
};