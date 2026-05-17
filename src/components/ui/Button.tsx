import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ButtonVariant } from "@/types";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  className?: string;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-white bg-white text-black shadow-sm hover:bg-neutral-200",
  secondary:
    "border border-black bg-black text-white shadow-sm hover:bg-neutral-900",
  outline:
    "border border-current/20 bg-transparent text-current hover:bg-current/10",
  ghost:
    "border border-transparent bg-transparent text-current hover:bg-current/10",
};

function getButtonClassName({
  variant = "primary",
  className,
}: ButtonStyleProps) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60",
    buttonVariants[variant],
    className
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  ButtonStyleProps & {
    children: ReactNode;
  };

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassName({ variant, className })}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> &
  ButtonStyleProps & {
    children: ReactNode;
  };

export function ButtonLink({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={getButtonClassName({ variant, className })}
      {...props}
    >
      {children}
    </Link>
  );
}