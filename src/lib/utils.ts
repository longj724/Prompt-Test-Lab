// External Dependencies
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const modelToProviderMap = {
  "gpt-4o-mini-2024-07-18": "openai",
  "gpt-4.1-nano-2025-04-14": "openai",
  "gpt-4o-2024-08-06": "openai",
  "o4-mini-2025-04-16": "openai",
  "gpt-4.1-2025-04-14": "openai",
  "o3-2025-04-16": "openai",
  "claude-3-7-sonnet-latest": "anthropic",
  "claude-3-5-sonnet-latest": "anthropic",
  "claude-3-5-haiku-latest": "anthropic",
  "claude-3-opus-latest": "anthropic",
};

export const modelApiNameToDisplayName: Record<string, string> = {
  "gpt-4o-mini-2024-07-18": "GPT-4o mini",
  "gpt-4.1-nano-2025-04-14": "GPT-4.1 nano",
  "gpt-4o-2024-08-06": "GPT-4o",
  "o4-mini-2025-04-16": "o4-mini",
  "gpt-4.1-2025-04-14": "GPT-4.1",
  "o3-2025-04-16": "o3",
  "claude-3-7-sonnet-latest": "Claude 3.7 Sonnet",
  "claude-3-5-sonnet-latest": "Claude 3.5 Sonnet",
  "claude-3-5-haiku-latest": "Claude 3.5 Haiku",
  "claude-3-opus-latest": "Claude 3.5 Opus",
};
