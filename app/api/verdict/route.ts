import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { query, results } = await request.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `I searched for "${query}" and got these price results:
${results.map((r: any, i: number) => `${i + 1}. ${r.title} — ${r.price} at ${r.source}`).join("\n")}

In 2-3 sentences, give me a direct best-pick recommendation. Which one is the best value and why? Be specific and concise.`,
      },
    ],
  });

  const verdict = (message.content[0] as any).text;
  return NextResponse.json({ verdict });
}