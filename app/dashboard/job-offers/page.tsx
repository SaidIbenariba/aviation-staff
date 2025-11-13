"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import jobOffersData from "@/lib/data/job-offers.json";
import { Badge } from "@/components/ui/badge";

interface JobOffer extends Record<string, unknown> {
  id: string;
  offreNumero: number;
  datePublication: string;
  titre: string;
  entreprise: string;
  etat: string;
  contenu: string;
}

const columns: Column<JobOffer>[] = [
  {
    id: "offreNumero",
    header: "Offre N°",
    accessorKey: "offreNumero",
  },
  {
    id: "datePublication",
    header: "Date de publication",
    accessorKey: "datePublication",
  },
  {
    id: "titre",
    header: "Titre de l'offre",
    accessorKey: "titre",
  },
  {
    id: "entreprise",
    header: "Entreprise",
    accessorKey: "entreprise",
  },
  {
    id: "etat",
    header: "Etat",
    cell: (row) => (
      <Badge
        variant={row.etat === "En ligne" ? "default" : "secondary"}
        className="bg-green-100 text-green-800 hover:bg-green-100"
      >
        {row.etat}
      </Badge>
    ),
  },
];

export default function JobOffersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des offres d'emploi
        </h1>
      </div>
      <DataTable
        data={jobOffersData as JobOffer[]}
        columns={columns}
        searchableColumns={["titre", "entreprise", "etat"]}
        initialState={{ pageSize: 10 }}
      />
    </div>
  );
}

