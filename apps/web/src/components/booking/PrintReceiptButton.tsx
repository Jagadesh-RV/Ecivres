"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintReceiptButtonProps {
  onPrint?: () => void;
}

export function PrintReceiptButton({ onPrint }: PrintReceiptButtonProps) {
  const handleClick = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5 text-xs">
      <Printer className="h-3.5 w-3.5" /> Receipt
    </Button>
  );
}
