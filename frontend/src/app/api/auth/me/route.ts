import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = "http://localhost:8000";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const data = await response.json();

    if (!response.ok) {
      cookieStore.delete("auth_token");
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Erreur" + (error instanceof Error ? error.message : ""),
      },
      { status: 500 },
    );
  }
}
