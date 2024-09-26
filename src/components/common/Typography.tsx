import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: ReactNode;
}

export function TypographyH1({
  as: Comp = "h1",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Comp
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function TypographyH2({
  as: Component = "h2",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH3({
  as: Component = "h3",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH4({
  as: Component = "h4",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyParagraph({
  as: Component = "p",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyBlockquote({
  as: Component = "blockquote",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyList({
  as: Component = "ul",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyLead({
  as: Component = "ul",
  className = "",
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
