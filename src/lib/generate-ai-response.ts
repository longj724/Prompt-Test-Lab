// External Dependencies
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { modelToProviderMap } from "./utils";
import { db } from "@/server/db";
import { apiKeys } from "@/server/db/schema";
import { decrypt } from "./encryption";

interface GenerateAIResponseArgs {
  model: string;
  message: string;
  systemPrompt: string;
  userId: string;
  temperature: number;
  responseFormat?: { type: "json_object" };
}

export async function generateAIResponse({
  model,
  message,
  systemPrompt,
  userId,
  temperature,
  responseFormat,
}: GenerateAIResponseArgs) {
  const userApiKeys = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.userId, userId),
  });

  const provider = modelToProviderMap[model as keyof typeof modelToProviderMap];

  let text = null;

  switch (provider) {
    case "openai":
      const openai = new OpenAI({
        apiKey: decrypt(userApiKeys?.encryptedOpenAIKey ?? ""),
      });

      const openAIResponse = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature,
        response_format: responseFormat,
      });

      if (openAIResponse?.choices[0]?.message?.content) {
        text = openAIResponse.choices[0].message.content;
      }

      break;
    case "anthropic":
      const client = new Anthropic({
        apiKey: decrypt(userApiKeys?.encryptedAnthropicKey ?? ""),
      });

      const anthropicResponse = await client.messages.create({
        system: systemPrompt,
        model: model,
        messages: [{ role: "user", content: message }],
        max_tokens: 4096, // May want to change this at some point
        temperature,
      });

      if (anthropicResponse?.content?.[0]?.type === "text") {
        text = anthropicResponse.content[0].text;
      }

      break;
    case "google":
      const google = new GoogleGenAI({
        apiKey: decrypt(userApiKeys?.encryptedGoogleKey ?? ""),
      });

      const googleResponse = await google.models.generateContent({
        model: model,
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature,
        },
      });

      if (googleResponse?.candidates?.[0]?.content) {
        text = googleResponse.text;
      }

      break;
  }

  return text;
}
