"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/data-table";
import professionalPendingData from "@/lib/data/professional-pending.json";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionButtons } from "../../_components/action-buttons";
import { ViewDetailsModal } from "../../_components/view-details-modal";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { toast } from "sonner";

interface ProfessionalPending extends Record<string, unknown> {
  id: string;
  dateInscription: string;
  nomComplet: string;
  email: string;
  poste: string;
  entreprise: string;
  domaine: string;
  telephone: string;
  pays: string;
  logo: string | null;
}

const columns: Column<ProfessionalPending>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionButtons
        onView={() => console.log("View", row.id)}
        onValidate={() => console.log("Validate", row.id)}
        onCancel={() => console.log("Cancel", row.id)}
      />
    ),
    sortable: false,
  },
  {
    id: "proNumero",
    header: "Pro N°",
    cell: (row) => row.id,
    sortable: false,
  },
  {
    id: "dateInscription",
    header: "Date d'inscription",
    accessorKey: "dateInscription",
  },
  {
    id: "nomComplet",
    header: "Nom Complet",
    accessorKey: "nomComplet",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "poste",
    header: "Poste",
    accessorKey: "poste",
  },
  {
    id: "entreprise",
    header: "Entreprise",
    accessorKey: "entreprise",
  },
  {
    id: "domaine",
    header: "Domaine",
    accessorKey: "domaine",
  },
  {
    id: "telephone",
    header: "Téléphone",
    accessorKey: "telephone",
  },
  {
    id: "pays",
    header: "Pays",
    accessorKey: "pays",
  },
  {
    id: "logo",
    header: "Logo",
    cell: (row) => (
      <Avatar>
        <AvatarFallback className="bg-gray-200">
          {row.entreprise.charAt(0)}
        </AvatarFallback>
      </Avatar>
    ),
    sortable: false,
  },
];

export default function ProfessionalsPendingPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProfessionalPending | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "validate" | "cancel";
    item: ProfessionalPending | null;
  }>({ type: "validate", item: null });

  const handleView = (item: ProfessionalPending) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleValidate = (item: ProfessionalPending) => {
    setConfirmAction({ type: "validate", item });
    setConfirmDialogOpen(true);
  };

  const handleCancel = (item: ProfessionalPending) => {
    setConfirmAction({ type: "cancel", item });
    setConfirmDialogOpen(true);
  };

  const executeAction = () => {
    if (confirmAction.item) {
      if (confirmAction.type === "validate") {
        toast.success(`Inscription de ${confirmAction.item.nomComplet} validée`);
      } else {
        toast.success(`Inscription de ${confirmAction.item.nomComplet} annulée`);
      }
    }
  };

  const updatedColumns: Column<ProfessionalPending>[] = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: (row) => (
          <ActionButtons
            onView={() => handleView(row)}
            onValidate={() => handleValidate(row)}
            onCancel={() => handleCancel(row)}
          />
        ),
      };
    }
    return col;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des inscrits professionnels à valider
        </h1>
      </div>
      <DataTable
        data={professionalPendingData as ProfessionalPending[]}
        columns={updatedColumns}
        searchableColumns={[
          "nomComplet",
          "email",
          "poste",
          "entreprise",
          "domaine",
          "telephone",
          "pays",
        ]}
      />
      {selectedItem && (
        <ViewDetailsModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          title={`Détails - ${selectedItem.nomComplet}`}
          data={selectedItem}
        />
      )}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={
          confirmAction.type === "validate"
            ? "Valider l'inscription"
            : "Annuler l'inscription"
        }
        description={
          confirmAction.type === "validate"
            ? `Êtes-vous sûr de vouloir valider l'inscription de ${confirmAction.item?.nomComplet} ?`
            : `Êtes-vous sûr de vouloir annuler l'inscription de ${confirmAction.item?.nomComplet} ?`
        }
        onConfirm={executeAction}
        confirmLabel={confirmAction.type === "validate" ? "Valider" : "Annuler"}
        variant={confirmAction.type === "cancel" ? "destructive" : "default"}
      />
    </div>
  );
}

