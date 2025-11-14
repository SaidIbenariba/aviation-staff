"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/data-table";
import jobOffersData from "@/lib/data/job-offers.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV, generateFilenameWithDate } from "@/lib/utils/csv-export";
import { toast } from "sonner";

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
  const [isExporting, setIsExporting] = useState(false);

  const handleExportList = () => {
    try {
      setIsExporting(true);

      const headers = [
        "Offre N°",
        "Date de publication",
        "Titre de l'offre",
        "Entreprise",
        "Etat",
        "Contenu",
      ];

      const fields: (keyof JobOffer)[] = [
        "offreNumero",
        "datePublication",
        "titre",
        "entreprise",
        "etat",
        "contenu",
      ];

      const filename = generateFilenameWithDate("offres-emploi");

      exportToCSV(jobOffersData as JobOffer[], headers, fields, filename);

      toast.success("Liste exportée avec succès");
    } catch (error) {
      console.error("Error exporting list:", error);
      toast.error("Erreur lors de l'export de la liste");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des offres d&apos;emploi
        </h1>
        <Button
          variant="outline"
          onClick={handleExportList}
          disabled={isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Export en cours..." : "Exporter la liste"}
        </Button>
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

