import { Mistral } from "@mistralai/mistralai";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "generate";

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

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
 * Génère des tâches depuis un prompt utilisateur via Mistral AI.
 * Cette fonction effectue :
 * 1. Validation des paramètres d'entrée
 * 2. Appel à l'API Mistral avec un prompt système structuré
 * 3. Extraction et nettoyage de la réponse JSON (gestion des markdown code blocks)
 * 4. Validation et normalisation des données (priorités, dates)
 */
async function handleGenerate(request: NextRequest) {
  try {
    const body: GenerateRequestBody = await request.json();
    const { prompt, projectId } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 },
      );
    }

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        { error: "L'ID du projet est requis" },
        { status: 400 },
      );
    }

    // Construire un prompt système détaillé pour forcer le format JSON
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

    // Appel à l'API Mistral
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

    // Extraire la réponse textuelle de l'agent
    let aiResponse = "";

    if (
      response.outputs &&
      Array.isArray(response.outputs) &&
      response.outputs.length > 0
    ) {
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
      return NextResponse.json(
        { error: "Aucune réponse de l'agent" },
        { status: 500 },
      );
    }

    /**
     * Nettoyage de la réponse : l'IA peut retourner du JSON enveloppé dans des code blocks markdown
     * On essaie de supprimer ces délimiteurs (```json ... ``` ou ``` ... ```)
     */
    let cleanedResponse = aiResponse.trim();

    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }

    /**
     * Extraction du JSON avec regex :
     * - Cherche d'abord un tableau JSON complet [...]
     * - Sinon cherche un objet JSON {...} et on le transformera en tableau
     * Ceci permet de gérer les cas où l'IA retourne du texte avant/après le JSON
     */
    const jsonArrayMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    const jsonObjectMatch = cleanedResponse.match(/\{[\s\S]*\}/);

    if (jsonArrayMatch) {
      cleanedResponse = jsonArrayMatch[0];
    } else if (jsonObjectMatch) {
      cleanedResponse = jsonObjectMatch[0];
    }

    let tasksData: TaskData | TaskData[];
    try {
      const parsed = JSON.parse(cleanedResponse);
      // Normaliser en tableau : l'IA peut retourner un seul objet ou un tableau
      tasksData = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      console.error("[AI] JSON parse error:", cleanedResponse);
      return NextResponse.json(
        {
          error: "Impossible de parser la réponse de l'IA",
          details:
            "L'agent n'a pas retourné un JSON valide. Essayez de reformuler votre demande.",
        },
        { status: 500 },
      );
    }

    /**
     * Validation et normalisation des tâches générées :
     * - Filtre les tâches sans titre (invalides)
     * - Valide les priorités (LOW, MEDIUM, HIGH, URGENT) avec fallback sur MEDIUM
     * - Nettoie les espaces superflus dans les chaînes
     * - Assure la présence de tous les champs obligatoires
     */
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
      return NextResponse.json(
        { error: "L'IA n'a pas généré de tâches valides" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      tasks: validatedTasks,
      message: `${validatedTasks.length} tâche(s) générée(s)`,
    });
  } catch (error) {
    console.error("[AI] handleGenerate error:", error);
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
 * Crée plusieurs tâches dans le backend
 */
async function handleCreate(request: NextRequest, token: string) {
  const body: CreateRequestBody = await request.json();
  const { tasks, projectId } = body;

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

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

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
