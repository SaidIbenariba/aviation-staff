"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import inspirationsRejectedData from "@/lib/data/inspirations-rejected.json";
import { StatusBadge } from "../_components/status-badge";
import { ImagePreview } from "../_components/image-preview";
import { ActionButtons } from "../../_components/action-buttons";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../_components/empty-state";
import { useState } from "react";
import { ViewDetailsModal } from "../../_components/view-details-modal";

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
        showValidate={false}
        showCancel={false}
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
    id: "updatedAt",
    header: "Date de refus",
    cell: (row) => {
      const date = new Date(row.updatedAt);
      return (
        <span className="text-sm">
          {date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
];

export default function InspirationsRejectedPage() {
  const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleView = (inspiration: Inspiration) => {
    setSelectedInspiration(inspiration);
    setIsViewModalOpen(true);
  };

  const columnsWithHandlers: Column<Inspiration>[] = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: (row) => (
          <ActionButtons
            onView={() => handleView(row)}
            onValidate={() => {}}
            onCancel={() => {}}
            showView={true}
            showValidate={false}
            showCancel={false}
          />
        ),
      };
    }
    return col;
  });

  if (inspirationsRejectedData.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Inspirations refusées
          </h1>
        </div>
        <EmptyState
          title="Aucune inspiration refusée"
          description="Il n'y a actuellement aucune inspiration refusée."
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Inspirations refusées
        </h1>
      </div>
      <DataTable
        data={inspirationsRejectedData as Inspiration[]}
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

