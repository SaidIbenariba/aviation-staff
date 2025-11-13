"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

const inspirationSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  contenu: z.string().optional(),
  image: z.string().nullable().optional(),
  categorie: z.string().nullable().optional(),
  statut: z.enum(["pending", "approved", "rejected", "archived"]),
  auteur: z.string().nullable().optional(),
});

type InspirationFormValues = z.infer<typeof inspirationSchema>;

const categories = [
  "Carrière",
  "Réseautage",
  "Bien-être",
  "Compétences",
  "Productivité",
  "Recrutement",
  "Divers",
];

export default function NewInspirationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<InspirationFormValues>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: {
      titre: "",
      description: "",
      contenu: "",
      image: null,
      categorie: null,
      statut: "pending",
      auteur: null,
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 10MB)");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      form.setValue("image", url);
      setImagePreview(url);
      toast.success("Image uploadée avec succès");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [form]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    },
    [handleImageUpload]
  );

  const removeImage = () => {
    form.setValue("image", null);
    setImagePreview(null);
  };

  const onSubmit = async (data: InspirationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inspirations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create inspiration");
      }

      toast.success("Inspiration créée avec succès");
      router.push("/dashboard/inspirations");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur lors de la création de l'inspiration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Nouvelle inspiration
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Titre de l'inspiration"
                    {...field}
                    className="bg-input border-border focus:ring-ring"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description courte de l'inspiration..."
                    className="min-h-[100px] bg-input border-border focus:ring-ring"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contenu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contenu complet de l'inspiration..."
                    className="min-h-[300px] bg-input border-border focus:ring-ring"
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
              name="categorie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:ring-ring">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de l'auteur"
                      {...field}
                      value={field.value || ""}
                      className="bg-input border-border focus:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                          ${
                            dragActive
                              ? "border-primary bg-primary/5"
                              : "border-border bg-muted/50 hover:bg-muted"
                          }
                        `}
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Glissez-déposez une image ici ou
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          Sélectionner un fichier
                        </Button>
                      </div>
                    )}
                    {uploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">
                          Upload en cours... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Création..." : "Créer l'inspiration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

