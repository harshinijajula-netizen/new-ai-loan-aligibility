import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const systemPrompt = `You are LoanIQ's AI Loan Assistant, a helpful and knowledgeable financial guide. You answer questions about loans, eligibility, interest rates, EMIs, required documents, and banking in India.

Rules:
- Be concise but thorough. Keep answers under 150 words unless asked for detail.
- Use simple, clear language.
- For eligibility questions, explain the key factors (credit score, income, DTI ratio, employment).
- For document questions, list the common documents needed.
- For EMI questions, explain the formula briefly: EMI = P x r x (1+r)^n / ((1+r)^n - 1).
- If asked about a specific loan type, give relevant details about that category.
- Be encouraging but realistic about loan eligibility.
- If you don't know something specific, say so honestly.
- Support English, Hindi, and Telugu. Respond in the same language the user writes in.
- Never provide specific bank names as recommendations unless asked.
- Always remind users that results are informational, not financial advice.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const zai = await ZAI.create();

    const messages: Array<{ role: string; content: string }> = [
      { role: "assistant", content: systemPrompt },
    ];

    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-10)) {
        messages.push({ role: msg.role === "user" ? "user" : "assistant", content: msg.content });
      }
    }

    messages.push({ role: "user", content: message });

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
