"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import inspirationsData from "@/lib/data/inspirations.json";
import { StatusBadge } from "./_components/status-badge";
import { ImagePreview } from "./_components/image-preview";
import { ActionButtons } from "../_components/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ViewDetailsModal } from "../_components/view-details-modal";
import { toast } from "sonner";

interface Inspiration extends Record<string, unknown> {
  id: string;
  titre: string;
  description?: string;
  contenu?: string;
  image?: string | null;
  categorie?: string | null;
  statut: "pending" | "approved" | "rejected" | "archived";
  auteur?: string | null;
  datePublication?: string | null;
  createdAt: string;
  updatedAt: string;
}

const columns: Column<Inspiration>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionButtons
        onView={() => console.log("View", row.id)}
        onValidate={() => console.log("Validate", row.id)}
        onCancel={() => console.log("Cancel", row.id)}
        showView={true}
        showValidate={row.statut === "pending"}
        showCancel={row.statut === "pending"}
      />
    ),
    sortable: false,
  },
  {
    id: "image",
    header: "Image",
    cell: (row) => (
      <ImagePreview
        src={row.image}
        alt={row.titre}
        size="sm"
        fallbackText={row.titre}
      />
    ),
    sortable: false,
  },
  {
    id: "titre",
    header: "Titre",
    accessorKey: "titre",
  },
  {
    id: "description",
    header: "Description",
    accessorKey: "description",
    cell: (row) => (
      <span className="text-sm text-muted-foreground line-clamp-2 max-w-md">
        {row.description || "—"}
      </span>
    ),
  },
  {
    id: "categorie",
    header: "Catégorie",
    cell: (row) =>
      row.categorie ? (
        <Badge variant="outline" className="bg-muted">
          {row.categorie}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "statut",
    header: "Statut",
    cell: (row) => <StatusBadge status={row.statut} />,
  },
  {
    id: "auteur",
    header: "Auteur",
    accessorKey: "auteur",
    cell: (row) => (
      <span className="text-sm">{row.auteur || "—"}</span>
    ),
  },
  {
    id: "datePublication",
    header: "Date de publication",
    cell: (row) => {
      if (!row.datePublication) return <span className="text-muted-foreground">—</span>;
      const date = new Date(row.datePublication);
      return (
        <span className="text-sm">
          {date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      );
    },
  },
];

export default function InspirationsPage() {
  const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleView = (inspiration: Inspiration) => {
    setSelectedInspiration(inspiration);
    setIsViewModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleValidate = async (_id: string) => {
    try {
      // TODO: Call API to validate
      toast.success("Inspiration validée avec succès");
    } catch {
      toast.error("Erreur lors de la validation");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancel = async (_id: string) => {
    try {
      // TODO: Call API to reject
      toast.success("Inspiration refusée");
    } catch {
      toast.error("Erreur lors du refus");
    }
  };

  // Update columns with handlers
  const columnsWithHandlers: Column<Inspiration>[] = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: (row) => (
          <ActionButtons
            onView={() => handleView(row)}
            onValidate={() => handleValidate(row.id)}
            onCancel={() => handleCancel(row.id)}
            showView={true}
            showValidate={row.statut === "pending"}
            showCancel={row.statut === "pending"}
          />
        ),
      };
    }
    return col;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Liste des inspirations
        </h1>
        <Button asChild>
          <Link href="/dashboard/inspirations/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle inspiration
          </Link>
        </Button>
      </div>
      <DataTable
        data={inspirationsData as Inspiration[]}
        columns={columnsWithHandlers}
        searchableColumns={["titre", "description", "categorie", "auteur"]}
        initialState={{ pageSize: 10 }}
      />
      {selectedInspiration && (
        <ViewDetailsModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          title={selectedInspiration.titre}
          data={selectedInspiration}
        />
      )}
    </div>
  );
}

