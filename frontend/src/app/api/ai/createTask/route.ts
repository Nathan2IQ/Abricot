import { Mistral } from "@mistralai/mistralai";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Initialize Mistral client
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const AGENT_ID =
  process.env.MISTRAL_AGENT_ID || "ag_019f1cd5db2c7055b6fb7d398c7d3f6c";

interface TaskData {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  assigneeIds?: string[];
}

interface GenerateRequestBody {
  prompt: string;
  projectId: string;
}

interface CreateRequestBody {
  tasks: TaskData[];
  projectId: string;
}

/**
 * POST /api/ai/createTask?action=generate
 * Generate tasks using Mistral AI without creating them
 *
 * POST /api/ai/createTask?action=create
 * Create multiple tasks in the backend
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "generate";

    console.log("[AI Route] POST request:", { action });

    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    console.log("[AI Route] Cookie store:", {
      hasToken: !!token,
      tokenLength: token?.length,
      allCookies: Array.from(cookieStore.getAll().map((c) => c.name)),
    });

    if (!token) {
      console.error("[AI Route] No token found in cookies");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.log("[AI Route] Token validated, proceeding with action:", action);

    if (action === "generate") {
      return handleGenerate(request);
    } else if (action === "create") {
      return handleCreate(request, token);
    } else {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }
  } catch (error) {
    console.error("[AI] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

/**
 * Generate tasks from user prompt using Mistral AI
 */
async function handleGenerate(request: NextRequest) {
  try {
    console.log("[AI Route] handleGenerate called");
    const body: GenerateRequestBody = await request.json();
    const { prompt, projectId } = body;

    console.log("[AI Route] handleGenerate params:", {
      promptLength: prompt?.length,
      projectId,
    });

    if (!prompt || typeof prompt !== "string") {
      console.error("[AI Route] Invalid prompt:", prompt);
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 },
      );
    }

    if (!projectId || typeof projectId !== "string") {
      console.error("[AI Route] Invalid projectId:", projectId);
      return NextResponse.json(
        { error: "L'ID du projet est requis" },
        { status: 400 },
      );
    }

    // Call Mistral AI agent (agent is already configured in AI Studio)
    console.log("[AI] Calling Mistral agent with prompt:", prompt);
    console.log("[AI] Using agent ID:", AGENT_ID);
    console.log("[AI] API key present:", !!process.env.MISTRAL_API_KEY);

    // Construct a detailed prompt to ensure JSON output
    const systemPrompt = `Tu es un assistant de gestion de projet. Ton rôle est d'analyser les demandes de l'utilisateur et de générer des tâches au format JSON strictement.

IMPORTANT : Tu dois TOUJOURS répondre UNIQUEMENT avec un tableau JSON valide, sans texte supplémentaire, sans markdown, sans explication.

Format de sortie OBLIGATOIRE (tableau JSON) :
[
  {
    "title": "Titre de la tâche",
    "description": "Description détaillée",
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    "dueDate": "YYYY-MM-DD" (optionnel, utilise une date dans le futur si mentionné)
  }
]

Règles :
- Si l'utilisateur mentionne une personne (ex: "assigne à Caroline"), ajoute-la dans la description car nous n'avons pas encore le système d'assignation
- Si l'utilisateur mentionne une urgence ou délai, déduis la priorité et calcule une dueDate appropriée
- Génère plusieurs tâches si le projet nécessite plusieurs étapes
- Ne génère QUE le JSON, rien d'autre

Demande de l'utilisateur : ${prompt}`;

    const response = await client.beta.conversations.start({
      agentId: AGENT_ID,
      agentVersion: 0,
      inputs: [
        {
          role: "user" as const,
          content: systemPrompt,
        },
      ],
    });

    console.log("[AI] Mistral response:", JSON.stringify(response, null, 2));

    // Extract the AI response from the conversation
    let aiResponse = "";

    // The response structure contains the agent's outputs
    if (
      response.outputs &&
      Array.isArray(response.outputs) &&
      response.outputs.length > 0
    ) {
      // Get the last output message
      const lastOutput = response.outputs[response.outputs.length - 1];
      if (
        lastOutput &&
        typeof lastOutput === "object" &&
        "content" in lastOutput
      ) {
        aiResponse = lastOutput.content as string;
      }
    }

    if (!aiResponse) {
      console.error("[AI] Unable to extract response from:", response);
      return NextResponse.json(
        { error: "Aucune réponse de l'agent" },
        { status: 500 },
      );
    }

    console.log("[AI] Extracted response:", aiResponse);

    // Parse JSON from AI response
    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = aiResponse.trim();

    // Try to extract JSON from markdown code blocks
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }

    // Try to find JSON array or object in the response
    const jsonArrayMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    const jsonObjectMatch = cleanedResponse.match(/\{[\s\S]*\}/);

    if (jsonArrayMatch) {
      cleanedResponse = jsonArrayMatch[0];
    } else if (jsonObjectMatch) {
      cleanedResponse = jsonObjectMatch[0];
    }

    console.log("[AI] Cleaned response for parsing:", cleanedResponse);

    let tasksData: TaskData | TaskData[];
    try {
      const parsed = JSON.parse(cleanedResponse);
      // Support both single task and array of tasks
      tasksData = Array.isArray(parsed) ? parsed : [parsed];
    } catch (parseError) {
      console.error("[AI] JSON parse error:", parseError);
      console.error("[AI] Response was:", cleanedResponse);
      return NextResponse.json(
        {
          error: "Impossible de parser la réponse de l'IA",
          details:
            "L'agent n'a pas retourné un JSON valide. Essayez de reformuler votre demande.",
        },
        { status: 500 },
      );
    }

    // Validate and normalize tasks
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    const validatedTasks = (Array.isArray(tasksData) ? tasksData : [tasksData])
      .filter((task) => task.title && typeof task.title === "string")
      .map((task) => ({
        title: task.title.trim(),
        description: task.description?.trim() || "",
        priority: validPriorities.includes(task.priority || "")
          ? task.priority
          : "MEDIUM",
        dueDate: task.dueDate || undefined,
        assigneeIds: task.assigneeIds || [],
      }));

    if (validatedTasks.length === 0) {
      console.error("[AI] No valid tasks generated");
      return NextResponse.json(
        { error: "L'IA n'a pas généré de tâches valides" },
        { status: 500 },
      );
    }

    console.log("[AI] Generated tasks:", validatedTasks);

    // Return generated tasks for user review
    return NextResponse.json({
      success: true,
      tasks: validatedTasks,
      message: `${validatedTasks.length} tâche(s) générée(s)`,
    });
  } catch (error) {
    console.error("[AI] handleGenerate error:", error);
    console.error(
      "[AI] Error stack:",
      error instanceof Error ? error.stack : undefined,
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
/**
 * Create multiple tasks in the backend
 */
async function handleCreate(request: NextRequest, token: string) {
  console.log(
    "[AI Route] handleCreate called with token length:",
    token?.length,
  );
  const body: CreateRequestBody = await request.json();
  const { tasks, projectId } = body;

  console.log("[AI Route] handleCreate params:", {
    tasksCount: tasks?.length,
    projectId,
  });

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return NextResponse.json(
      { error: "Aucune tâche à créer" },
      { status: 400 },
    );
  }

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json(
      { error: "L'ID du projet est requis" },
      { status: 400 },
    );
  }

  // Get backend URL from environment or use default
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  console.log("[AI] Creating tasks:", tasks);

  // Create all tasks
  const results = await Promise.allSettled(
    tasks.map(async (task) => {
      const response = await fetch(
        `${backendUrl}/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      return await response.json();
    }),
  );

  // Count successes and failures
  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log("[AI] Tasks created:", { succeeded, failed });

  if (failed > 0) {
    return NextResponse.json({
      success: false,
      message: `${succeeded} tâche(s) créée(s), ${failed} échouée(s)`,
      succeeded,
      failed,
    });
  }

  return NextResponse.json({
    success: true,
    message: `${succeeded} tâche(s) créée(s) avec succès`,
    created: succeeded,
  });
}
