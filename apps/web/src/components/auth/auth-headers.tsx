import React from "react";
import Link from "next/link";

interface FormHeaderProps {
  title: string;
  description: string;
}

export const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <div className="flex flex-col gap-1.5 text-center md:text-left select-none">
      <h2 className="font-outfit text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="text-sm text-slate-500 font-medium">
        {description}
      </p>
    </div>
  );
};

interface FormFooterProps {
  linkText: string;
  href: string;
  prefixText?: string;
}

export const FormFooter = ({ linkText, href, prefixText }: FormFooterProps) => {
  return (
    <div className="text-center text-sm text-slate-500 font-medium mt-2">
      {prefixText && <span>{prefixText} </span>}
      <Link
        href={href}
        className="text-amber-600 hover:text-amber-500 font-semibold underline-offset-4 hover:underline transition-colors"
      >
        {linkText}
      </Link>
    </div>
  );
};
