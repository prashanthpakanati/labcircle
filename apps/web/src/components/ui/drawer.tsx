import React from "react";
import { cn } from "@/lib/utils";

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Drawer = ({ isOpen, onClose, children, ...props }: DrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Drawer Body (Slides up from the bottom) */}
      <div
        className="border-border animate-slide-up relative z-10 w-full max-w-lg rounded-t-xl border-t bg-white p-6 shadow-lg"
        {...props}
      >
        {/* Pull Bar indicator for accessibility/UX */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex flex-col space-y-1.5 text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-6 flex flex-col-reverse gap-2", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg leading-none font-semibold tracking-tight text-slate-900", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mt-1 text-sm text-slate-500", className)} {...props} />
));
DrawerDescription.displayName = "DrawerDescription";
