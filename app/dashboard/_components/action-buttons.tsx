"use client";

import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onValidate?: () => void;
  onCancel?: () => void;
  showView?: boolean;
  showValidate?: boolean;
  showCancel?: boolean;
}

export function ActionButtons({
  onView,
  onValidate,
  onCancel,
  showView = true,
  showValidate = true,
  showCancel = true,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {showView && (
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          <Eye className="h-4 w-4" />
          Afficher
        </Button>
      )}
      {showValidate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onValidate}
          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
        >
          <Check className="h-4 w-4" />
          Valider
        </Button>
      )}
      {showCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
        >
          <X className="h-4 w-4" />
          Annuler
        </Button>
      )}
    </div>
  );
}

