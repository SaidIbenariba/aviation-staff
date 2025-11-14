"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/data-table";
import jobSeekersData from "@/lib/data/job-seekers.json";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionButtons } from "../_components/action-buttons";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCSV, generateFilenameWithDate } from "@/lib/utils/csv-export";
import { toast } from "sonner";

interface JobSeeker extends Record<string, unknown> {
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

const columns: Column<JobSeeker>[] = [
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
          <FileText className="h-4 w-4 text-green-600" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <FileText className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    ),
    sortable: false,
  },
];

export default function JobSeekersPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportList = () => {
    try {
      setIsExporting(true);

      const headers = [
        "Date d'inscription",
        "Nom Complet",
        "Date de naissance",
        "Email",
        "Téléphone",
        "N° de Passeport",
        "Pays",
      ];

      const fields: (keyof JobSeeker)[] = [
        "dateInscription",
        "nomComplet",
        "dateNaissance",
        "email",
        "telephone",
        "numeroPasseport",
        "pays",
      ];

      const filename = generateFilenameWithDate("demandeurs-emploi");

      exportToCSV(jobSeekersData as JobSeeker[], headers, fields, filename);

      toast.success("Liste exportée avec succès");
    } catch (error) {
      console.error("Error exporting list:", error);
      toast.error("Erreur lors de l'export de la liste");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExtractCVs = () => {
    try {
      // Check if any job seeker has documents
      const hasDocuments = jobSeekersData.some(
        (seeker) => Array.isArray(seeker.documents) && seeker.documents.length > 0
      );

      if (!hasDocuments) {
        toast.info(
          "Aucun CV disponible pour le moment. Les CVs seront disponibles une fois que les candidats auront téléchargé leurs documents."
        );
        return;
      }

      // In demo mode, show message about feature
      // In production, this would create a ZIP file with all CVs
      toast.info(
        "Fonctionnalité d'extraction des CVs en cours de développement. Cette fonctionnalité permettra de télécharger tous les CVs en un fichier ZIP."
      );
    } catch (error) {
      console.error("Error extracting CVs:", error);
      toast.error("Erreur lors de l'extraction des CVs");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des utilisateurs inscrits sur le site
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportList}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export en cours..." : "Exporter la liste"}
          </Button>
          <Button variant="outline" onClick={handleExtractCVs}>
            <FileText className="h-4 w-4 mr-2" />
            Extraire les CVs
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Pays:</span>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="luxembourg">Luxembourg</SelectItem>
              <SelectItem value="belgique">Belgique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={jobSeekersData as JobSeeker[]}
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

