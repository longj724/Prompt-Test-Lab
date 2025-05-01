// External Dependencies
import Link from "next/link";
import Image from "next/image";

// InternalDependencies
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/prompt-test-lab-icon.svg"
              alt="Prompt Test Lab Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">Prompt Test Lab</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="hover:cursor-pointer hover:bg-gray-300 hover:text-black"
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="hover:cursor-pointer">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto grid min-h-[600px] grid-cols-2 items-center gap-8 py-16">
          <div className="space-y-8">
            <h1 className="text-5xl leading-tight font-bold tracking-tighter">
              Test & Optimize Your System Prompts
            </h1>
            <p className="text-muted-foreground text-xl">
              Use AI to generate responses and test them across multiple models
              to analyze how your system prompts performs.
            </p>
            <div className="flex gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="cursor-pointer">
                  Get Started
                </Button>
              </Link>
              {/* <Button
                size="lg"
                variant="outline"
                className="cursor-pointer hover:bg-gray-300 hover:text-black"
              >
                Watch Demo
              </Button> */}
            </div>
          </div>
          <div className="relative aspect-[18/10] rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 p-4">
            <img
              src="/demo-screenshot.png"
              alt="Prompt Test Lab Dashboard"
              className="object-contain p-2"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Powerful Features for Prompt Testing
            </h2>
            <p className="text-muted-foreground mt-4">
              Everything you need to test, analyze, and optimize your AI system
              prompts in one place.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Automated Testing</h3>
              <p className="text-muted-foreground">
                Generate and test potential user interactions based on your
                system prompt.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Response Comparisons</h3>
              <p className="text-muted-foreground">
                Compare and analyze responses across different prompt
                variations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Performance Metrics</h3>
              <p className="text-muted-foreground">
                Track response quality, consistency, and performance metrics.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-20">
          <h2 className="text-center text-3xl font-bold">Simple Pricing</h2>
          <p className="text-muted-foreground mt-4 text-center">
            Access all features by bringing your own API key
          </p>
          <div className="mt-16 flex justify-center">
            <div className="w-[400px] rounded-xl border border-blue-500 bg-blue-50 p-8">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">
                  Bring Your Own API Key
                </h3>
                <div className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  Free
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                Get access to all features by using your own API keys from:
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  OpenAI API Key
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Anthropic API Key
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Google AI API Key
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Unlimited tests and comparisons
                </li>
              </ul>
              <Button className="mt-8 w-full cursor-pointer">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <p className="text-muted-foreground mt-4 text-center text-sm">
                No credit card required. Just bring your API keys.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#6366f1] py-20">
          <div className="container mx-auto text-center text-white">
            <h2 className="text-3xl font-bold">
              Ready to Optimize Your AI Prompts?
            </h2>
            <p className="mt-4 text-lg">
              Join other engineers who are already using Prompt Test Lab to
              build better AI systems.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="cursor-pointer">
                <Link href="/sign-up">Start</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
