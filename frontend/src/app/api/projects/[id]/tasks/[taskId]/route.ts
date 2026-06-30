import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function forwardTaskRequest(
  request: Request,
  params: { id: string; taskId: string },
  method: "PUT" | "DELETE",
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const rawBody = method === "PUT" ? await request.text() : undefined;

    console.log("[API task route] incoming", {
      method,
      projectId: params.id,
      taskId: params.taskId,
      hasToken: Boolean(token),
      body: rawBody,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/projects/${params.id}/tasks/${params.taskId}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: rawBody,
      },
    );

    if (response.status === 204) {
      console.log("[API task route] backend response", {
        method,
        status: response.status,
        ok: response.ok,
      });
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => null);

    console.log("[API task route] backend response", {
      method,
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Erreur lors de la requête" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API task route] server error", {
      method,
      projectId: params.id,
      taskId: params.taskId,
      error,
    });
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  const resolvedParams = await params;
  return forwardTaskRequest(request, resolvedParams, "PUT");
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  const resolvedParams = await params;
  return forwardTaskRequest(request, resolvedParams, "DELETE");
}
