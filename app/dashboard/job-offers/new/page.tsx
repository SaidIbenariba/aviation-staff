"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const jobOfferSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  dateOffre: z.string().min(1, "La date est requise"),
  contenu: z.string().min(1, "Le contenu est requis"),
  entreprise: z.string().min(1, "L'entreprise est requise"),
  pays: z.string().min(1, "Le pays est requis"),
  photo: z.instanceof(File).optional(),
});

type JobOfferFormValues = z.infer<typeof jobOfferSchema>;

const countries = [
  "France",
  "Luxembourg",
  "Belgique",
  "Suisse",
  "Allemagne",
  "Espagne",
  "Italie",
  "Royaume-Uni",
];

export default function NewJobOfferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobOfferFormValues>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      titre: "",
      dateOffre: "",
      contenu: "",
      entreprise: "",
      pays: "",
    },
  });

  const onSubmit = async (data: JobOfferFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Job offer data:", data);
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/job-offers");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ajouter une nouvelle Offre
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'offre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'offre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOffre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de l'offre</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="date"
                        {...field}
                        className="pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contenu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contenu de l'offre..."
                    className="min-h-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="entreprise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choix du Pays" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      {...field}
                      className="cursor-pointer"
                    />
                    {value && (
                      <span className="text-sm text-gray-600">
                        {value.name}
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Validation..." : "Valider"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

