"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import professionalData from "@/lib/data/professionals.json";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionButtons } from "../_components/action-buttons";

interface Professional extends Record<string, unknown> {
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

const columns: Column<Professional>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionButtons
        onView={() => console.log("View", row.id)}
        onValidate={() => console.log("Validate", row.id)}
        onCancel={() => console.log("Cancel", row.id)}
        showView={false}
      />
    ),
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

export default function ProfessionalsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des professionnels inscrits sur le site
        </h1>
      </div>
      <DataTable
        data={professionalData as Professional[]}
        columns={columns}
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
    </div>
  );
}

