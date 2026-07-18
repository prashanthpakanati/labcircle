import React from "react";
import { cn } from "@/lib/utils";

// CONTAINER Component
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";

// SECTION Component
export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}
export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, as: Component = "section", ...props }, ref) => {
    return <Component ref={ref} className={cn("py-8 sm:py-12 md:py-16", className)} {...props} />;
  },
);
Section.displayName = "Section";

// STACK Component
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: number; // Mapped to tailwind gap (e.g. 2, 4, 6)
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { className, direction = "column", gap = 4, align = "stretch", justify = "start", ...props },
    ref,
  ) => {
    const directionClass = direction === "row" ? "flex-row" : "flex-col";
    const gapMap: Record<number, string> = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    };
    const alignMap = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };
    const justifyMap = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClass,
          gapMap[gap] || "gap-4",
          alignMap[align],
          justifyMap[justify],
          className,
        )}
        {...props}
      />
    );
  },
);
Stack.displayName = "Stack";

// GRID Component
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  colsSm?: 1 | 2 | 3 | 4 | 6;
  colsMd?: 1 | 2 | 3 | 4 | 6 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: number;
}
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, colsSm, colsMd, colsLg, gap = 4, ...props }, ref) => {
    const colMap = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };
    const colSmMap = colsSm
      ? {
          1: "sm:grid-cols-1",
          2: "sm:grid-cols-2",
          3: "sm:grid-cols-3",
          4: "sm:grid-cols-4",
          6: "sm:grid-cols-6",
        }[colsSm]
      : "";
    const colMdMap = colsMd
      ? {
          1: "md:grid-cols-1",
          2: "md:grid-cols-2",
          3: "md:grid-cols-3",
          4: "md:grid-cols-4",
          6: "md:grid-cols-6",
          12: "md:grid-cols-12",
        }[colsMd]
      : "";
    const colLgMap = colsLg
      ? {
          1: "lg:grid-cols-1",
          2: "lg:grid-cols-2",
          3: "lg:grid-cols-3",
          4: "lg:grid-cols-4",
          6: "lg:grid-cols-6",
          12: "lg:grid-cols-12",
        }[colsLg]
      : "";

    const gapMap: Record<number, string> = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colMap[cols],
          colSmMap,
          colMdMap,
          colLgMap,
          gapMap[gap] || "gap-4",
          className,
        )}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";

// SIDEBAR Component
export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "border-border bg-surface fixed inset-y-0 left-0 z-20 flex hidden w-64 flex-col border-r px-4 py-6 shadow-sm md:flex",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

// TOP NAVIGATION Component
export const TopNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "border-border sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6",
          className,
        )}
        {...props}
      >
        {children}
      </header>
    );
  },
);
TopNav.displayName = "TopNav";

// DASHBOARD SHELL Component
export const DashboardShell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-background text-foreground min-h-screen md:pl-64", className)}
      {...props}
    >
      {children}
    </div>
  );
});
DashboardShell.displayName = "DashboardShell";
