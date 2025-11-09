import { NextResponse } from "next/server";
import { z } from "zod";
import { runNewsAgent } from "@/lib/agent";
import type { AgentResponse } from "@/types/agent";
import { AgentConfigError, AgentRunError } from "@/lib/errors";

const payloadSchema = z.object({
  topic: z.string().min(3, "Pick a topic with at least 3 characters."),
  platform: z.enum(["buffer", "x", "none"]).default("buffer"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { topic, platform } = payloadSchema.parse(json);
    const result = await runNewsAgent({ topic, platform });

    const body: AgentResponse = {
      success: true,
      result,
    };

    return NextResponse.json(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message ?? "Invalid request payload.",
          logs: [],
        } satisfies AgentResponse,
        { status: 422 }
      );
    }

    if (error instanceof AgentRunError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          logs: error.logs,
        } satisfies AgentResponse,
        { status: 502 }
      );
    }

    if (error instanceof AgentConfigError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          logs: [],
        } satisfies AgentResponse,
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          logs: [],
        } satisfies AgentResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown server error",
        logs: [],
      } satisfies AgentResponse,
      { status: 500 }
    );
  }
}
