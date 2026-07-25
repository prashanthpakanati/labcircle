// apps/web/lib/analytics/components/ExportButton.tsx

import React from "react";
import { Download } from "lucide-react";
import { ExportFormat } from "../models/enums";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void;
  loading?: boolean;
}

export default function ExportButton({ onExport, loading = false }: ExportButtonProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onExport(ExportFormat.CSV)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5" />
        {loading ? "Exporting..." : "Export CSV"}
      </button>
    </div>
  );
}
