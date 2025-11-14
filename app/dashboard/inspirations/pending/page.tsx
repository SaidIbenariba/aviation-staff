"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import inspirationsPendingData from "@/lib/data/inspirations-pending.json";
import { ImagePreview } from "../_components/image-preview";
import { ActionButtons } from "../../_components/action-buttons";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../_components/empty-state";
import { useState } from "react";
import { ViewDetailsModal } from "../../_components/view-details-modal";
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
        showValidate={true}
        showCancel={true}
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
    id: "auteur",
    header: "Auteur",
    accessorKey: "auteur",
    cell: (row) => (
      <span className="text-sm">{row.auteur || "—"}</span>
    ),
  },
  {
    id: "createdAt",
    header: "Date de soumission",
    cell: (row) => {
      const date = new Date(row.createdAt);
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

export default function InspirationsPendingPage() {
  const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleView = (inspiration: Inspiration) => {
    setSelectedInspiration(inspiration);
    setIsViewModalOpen(true);
  };

  const handleValidate = async (id: string) => {
    try {
      const response = await fetch(`/api/inspirations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: "approved" }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate inspiration");
      }

      toast.success("Inspiration validée avec succès");
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error validating inspiration:", error);
      toast.error("Erreur lors de la validation");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`/api/inspirations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: "rejected" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject inspiration");
      }

      toast.success("Inspiration refusée");
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting inspiration:", error);
      toast.error("Erreur lors du refus");
    }
  };

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
            showValidate={true}
            showCancel={true}
          />
        ),
      };
    }
    return col;
  });

  if (inspirationsPendingData.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Inspirations en attente
          </h1>
        </div>
        <EmptyState
          title="Aucune inspiration en attente"
          description="Il n'y a actuellement aucune inspiration en attente de validation."
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Inspirations en attente
        </h1>
      </div>
      <DataTable
        data={inspirationsPendingData as Inspiration[]}
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

