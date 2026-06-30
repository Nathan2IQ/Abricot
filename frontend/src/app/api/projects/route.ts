import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    console.log("[API projects POST] incoming", {
      hasToken: Boolean(token),
      body,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    console.log("[API projects POST] backend response", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Erreur lors de la création" },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[API projects POST] server error", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 },
    );
  }
}
