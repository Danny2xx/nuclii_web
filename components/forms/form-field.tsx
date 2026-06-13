import React from "react";

import { Label } from "@/components/ui/label";

function FormField({
  children,
  id,
  label,
  optional,
  required,
}: {
  children: React.ReactNode;
  id: string;
  label: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-primary"> *</span>}
        {optional && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            Optional
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

export { FormField };
