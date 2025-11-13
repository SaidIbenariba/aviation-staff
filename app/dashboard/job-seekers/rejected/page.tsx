"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import jobSeekersRejectedData from "@/lib/data/job-seekers-rejected.json";
import { ActionButtons } from "../../_components/action-buttons";

interface JobSeekerRejected extends Record<string, unknown> {
  id: string;
  dateInscription: string;
  nomComplet: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  numeroPasseport: string;
  pays: string;
  photo: string | null;
  documents: unknown[];
  dateRejet?: string;
  raisonRejet?: string;
}

const columns: Column<JobSeekerRejected>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionButtons
        onView={() => console.log("View", row.id)}
        onValidate={() => console.log("Validate", row.id)}
        onCancel={() => console.log("Cancel", row.id)}
        showView={false}
        showValidate={false}
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
    id: "dateNaissance",
    header: "Date de naissance",
    accessorKey: "dateNaissance",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "telephone",
    header: "Téléphone",
    accessorKey: "telephone",
  },
  {
    id: "numeroPasseport",
    header: "N° de Passeport",
    accessorKey: "numeroPasseport",
  },
  {
    id: "pays",
    header: "Pays",
    accessorKey: "pays",
  },
  {
    id: "dateRejet",
    header: "Date de rejet",
    accessorKey: "dateRejet",
  },
  {
    id: "raisonRejet",
    header: "Raison du rejet",
    accessorKey: "raisonRejet",
  },
];

export default function JobSeekersRejectedPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Inscriptions refusées
        </h1>
      </div>
      <DataTable
        data={jobSeekersRejectedData as JobSeekerRejected[]}
        columns={columns}
        searchableColumns={[
          "nomComplet",
          "email",
          "telephone",
          "numeroPasseport",
          "pays",
          "raisonRejet",
        ]}
      />
    </div>
  );
}

