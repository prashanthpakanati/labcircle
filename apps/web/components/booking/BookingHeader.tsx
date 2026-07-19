/*
  BookingHeader component – renders a page header with title and optional actions.
*/

import React from "react";

interface BookingHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({ title, children }) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </header>
  );
};
