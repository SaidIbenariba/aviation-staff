import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { inspiration } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [k: string]: unknown;
  };
  requestId?: string;
  timestamp?: string;
}

const createInspirationSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  contenu: z.string().optional(),
  image: z.string().nullable().optional(),
  categorie: z.string().nullable().optional(),
  statut: z.enum(["pending", "approved", "rejected", "archived"]).default("pending"),
  auteur: z.string().nullable().optional(),
  datePublication: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statut = searchParams.get("statut");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = db.select().from(inspiration);

    if (statut) {
      query = query.where(eq(inspiration.statut, statut)) as typeof query;
    }

    const allInspirations = await query;
    const total = allInspirations.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const inspirations = allInspirations.slice(offset, offset + limit);

    const response: ApiResponse<typeof inspirations> = {
      success: true,
      data: inspirations,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching inspirations:", error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "Failed to fetch inspirations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createInspirationSchema.parse(body);

    const newInspiration = {
      id: `insp${Date.now()}`,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(inspiration).values(newInspiration);

    const response: ApiResponse<typeof newInspiration> = {
      success: true,
      data: newInspiration,
      message: "Inspiration créée avec succès",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Données invalides",
          details: error.errors,
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.error("Error creating inspiration:", error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: "CREATE_ERROR",
        message: "Échec de la création de l'inspiration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

