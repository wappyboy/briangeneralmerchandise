"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/90 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <a href="#home" onClick={closeMenu} className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-full border border-white/20 bg-white p-1 shadow-sm">
            <Image
              src="/brian-logo.jpg"
              alt="Brian's General Merchandise logo"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-white sm:text-base">
              Brian&apos;s General Merchandise
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400 sm:text-xs">
              Event Rental Services
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <ButtonLink
            href="#contact"
            className="border-white bg-white px-5 py-2.5 text-black hover:bg-neutral-200"
          >
            Book Event
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white hover:text-black lg:hidden"
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
          "grid overflow-hidden border-t border-white/10 bg-black transition-all duration-300 lg:hidden",
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
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <ButtonLink
              href="#contact"
              onClick={closeMenu}
              className="mt-4 w-full border-white bg-white text-black hover:bg-neutral-200"
            >
              Book Event
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}