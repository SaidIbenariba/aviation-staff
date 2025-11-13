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
  requestId?: string;
  timestamp?: string;
}

const updateInspirationSchema = z.object({
  titre: z.string().min(1).optional(),
  description: z.string().optional(),
  contenu: z.string().optional(),
  image: z.string().nullable().optional(),
  categorie: z.string().nullable().optional(),
  statut: z.enum(["pending", "approved", "rejected", "archived"]).optional(),
  auteur: z.string().nullable().optional(),
  datePublication: z.string().nullable().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(inspiration)
      .where(eq(inspiration.id, id))
      .limit(1);

    if (result.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Inspiration non trouvée",
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof result[0]> = {
      success: true,
      data: result[0],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching inspiration:", error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "Échec de la récupération de l'inspiration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateInspirationSchema.parse(body);

    const existing = await db
      .select()
      .from(inspiration)
      .where(eq(inspiration.id, id))
      .limit(1);

    if (existing.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Inspiration non trouvée",
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Convert datePublication string to Date if provided
    const { datePublication, ...restData } = validatedData;
    
    const updatedData: {
      titre?: string;
      description?: string;
      contenu?: string;
      image?: string | null;
      categorie?: string | null;
      statut?: "pending" | "approved" | "rejected" | "archived";
      auteur?: string | null;
      datePublication?: Date | null;
      updatedAt: Date;
    } = {
      ...restData,
      updatedAt: new Date(),
    };

    if (datePublication !== undefined) {
      updatedData.datePublication = datePublication
        ? new Date(datePublication)
        : null;
    }

    await db
      .update(inspiration)
      .set(updatedData)
      .where(eq(inspiration.id, id));

    const updated = await db
      .select()
      .from(inspiration)
      .where(eq(inspiration.id, id))
      .limit(1);

    const response: ApiResponse<typeof updated[0]> = {
      success: true,
      data: updated[0],
      message: "Inspiration mise à jour avec succès",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
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

    console.error("Error updating inspiration:", error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: "UPDATE_ERROR",
        message: "Échec de la mise à jour de l'inspiration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db
      .select()
      .from(inspiration)
      .where(eq(inspiration.id, id))
      .limit(1);

    if (existing.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Inspiration non trouvée",
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    await db.delete(inspiration).where(eq(inspiration.id, id));

    const response: ApiResponse = {
      success: true,
      message: "Inspiration supprimée avec succès",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting inspiration:", error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: "DELETE_ERROR",
        message: "Échec de la suppression de l'inspiration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

