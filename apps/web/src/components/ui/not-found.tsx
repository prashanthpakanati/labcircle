// Use client component for UI
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NotFoundProps {
  title?: string;
  description?: string;
}

export function NotFound({ title = "Not Found", description = "The requested resource was not found." }: NotFoundProps) {
  return (
    <Card className="mx-auto mt-20 max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  );
}

export default NotFound;
