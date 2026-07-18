import React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<{
  selectedValue: string;
  setSelectedValue: (value: string) => void;
} | null>(null);

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) => {
  const [localValue, setLocalValue] = React.useState(defaultValue);
  const selectedValue = value !== undefined ? value : localValue;
  const setSelectedValue = React.useCallback(
    (val: string) => {
      if (value === undefined) setLocalValue(val);
      if (onValueChange) onValueChange(val);
    },
    [value, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ selectedValue, setSelectedValue }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isSelected = context.selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.setSelectedValue(value)}
        className={cn(
          "focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all select-none focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
          isSelected ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    const isSelected = context.selectedValue === value;
    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "ring-offset-background focus-visible:ring-ring animate-fade-in mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = "TabsContent";
