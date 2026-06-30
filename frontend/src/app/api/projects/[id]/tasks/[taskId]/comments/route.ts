import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    console.log("[API comments POST] incoming", {
      projectId: resolvedParams.id,
      taskId: resolvedParams.taskId,
      hasToken: Boolean(token),
      body,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 },
      );
    }

    const [profileResponse, projectResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/projects/${resolvedParams.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
    ]);

    const profileData = await profileResponse.json().catch(() => null);
    const projectData = await projectResponse.json().catch(() => null);
    const debugContext = {
      profileStatus: profileResponse.status,
      profileUserId: profileData?.data?.user?.id ?? null,
      projectStatus: projectResponse.status,
      projectOwnerId: projectData?.data?.project?.owner?.id ?? null,
      projectMemberIds:
        projectData?.data?.project?.members?.map((m: any) => m.user?.id) ?? [],
      projectId: resolvedParams.id,
      taskId: resolvedParams.taskId,
    };

    console.log("[API comments POST] auth/project context", {
      ...debugContext,
    });

    const response = await fetch(
      `${API_BASE_URL}/projects/${resolvedParams.id}/tasks/${resolvedParams.taskId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json().catch(() => null);

    console.log("[API comments POST] backend response", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      const proxyDebugText = [
        `profileStatus=${debugContext.profileStatus}`,
        `profileUserId=${debugContext.profileUserId ?? "null"}`,
        `projectStatus=${debugContext.projectStatus}`,
        `projectOwnerId=${debugContext.projectOwnerId ?? "null"}`,
        `projectMemberIds=${debugContext.projectMemberIds.join(",") || "none"}`,
        `projectId=${debugContext.projectId}`,
        `taskId=${debugContext.taskId}`,
      ].join(" | ");

      const responseData =
        process.env.NODE_ENV === "development"
          ? {
              ...(data ?? {
                success: false,
                message: "Erreur lors de la création",
              }),
              proxyDebug: debugContext,
              proxyDebugText,
            }
          : (data ?? { success: false, message: "Erreur lors de la création" });

      return NextResponse.json(responseData, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[API comments POST] server error", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 },
    );
  }
}
