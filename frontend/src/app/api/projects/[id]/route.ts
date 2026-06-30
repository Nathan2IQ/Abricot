import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function getAuthenticatedUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data?.user ?? null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    console.log("[API project PUT] incoming", {
      projectId: resolvedParams.id,
      hasToken: Boolean(token),
      body,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 },
      );
    }

    const [user, projectResponse] = await Promise.all([
      getAuthenticatedUser(token),
      fetch(`${API_BASE_URL}/projects/${resolvedParams.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 },
      );
    }

    if (!projectResponse.ok) {
      const data = await projectResponse.json().catch(() => null);
      return NextResponse.json(
        data ?? { success: false, message: "Projet introuvable" },
        { status: projectResponse.status },
      );
    }

    const projectData = await projectResponse.json();
    const project = projectData.data?.project;

    if (!project || project.owner?.id !== user.id) {
      console.log("[API project PUT] denied: not owner", {
        projectId: resolvedParams.id,
        userId: user.id,
        ownerId: project?.owner?.id,
      });
      return NextResponse.json(
        { success: false, message: "Réservé au propriétaire du projet" },
        { status: 403 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/projects/${resolvedParams.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    console.log("[API project PUT] backend response", {
      projectId: resolvedParams.id,
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API project PUT] server error", {
      projectId: resolvedParams.id,
      error,
    });
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 },
    );
  }
}
