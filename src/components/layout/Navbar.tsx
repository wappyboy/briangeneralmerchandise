"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Packages", href: "#packages" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a href="#home" onClick={closeMenu} className="flex items-center gap-3">
            <div className="relative size-12 overflow-hidden rounded-full border border-neutral-200 bg-white">
                <Image
                src="/images/brian-logo.jpg"
                alt="Brian's General Merchandise logo"
                fill
                className="object-cover"
                priority
                />
            </div>

            <div className="leading-tight">
                <p className="text-base font-bold tracking-tight text-black">
                Brian&apos;s General Merchandise
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Event Rental Services
                </p>
            </div>
            </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <ButtonLink href="#contact" variant="secondary" className="px-5 py-2.5">
            Book Event
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-300 text-black lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden border-t border-neutral-200 bg-white transition-all duration-300 lg:hidden",
          isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-black"
              >
                {link.label}
              </a>
            ))}

            <ButtonLink
              href="#contact"
              variant="secondary"
              onClick={closeMenu}
              className="mt-4 w-full"
            >
              Book Event
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}