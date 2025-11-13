"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import jobSeekersPendingData from "@/lib/data/job-seekers-pending.json";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionButtons } from "../../_components/action-buttons";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, X } from "lucide-react";

interface JobSeekerPending extends Record<string, unknown> {
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
}

const columns: Column<JobSeekerPending>[] = [
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
    id: "photo",
    header: "Photo",
    cell: (row) => (
      <Avatar>
        <AvatarFallback className="bg-gray-200">
          {row.nomComplet.charAt(0)}
        </AvatarFallback>
      </Avatar>
    ),
    sortable: false,
  },
  {
    id: "documents",
    header: "Documents",
    cell: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <FileText className="h-4 w-4 text-blue-600" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ImageIcon className="h-4 w-4 text-green-600" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    ),
    sortable: false,
  },
];

export default function JobSeekersPendingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des inscriptions à modérer
        </h1>
      </div>
      <DataTable
        data={jobSeekersPendingData as JobSeekerPending[]}
        columns={columns}
        searchableColumns={[
          "nomComplet",
          "email",
          "telephone",
          "numeroPasseport",
          "pays",
        ]}
        initialState={{ pageSize: 100 }}
      />
    </div>
  );
}

