// External Dependencies
import Link from "next/link";
import Image from "next/image";

// Relative Dependencies
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="PromptTestLab Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold">Prompt Test Lab</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="hover:cursor-pointer hover:bg-white hover:text-black"
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
              Test & Optimize Your AI Prompts at Scale
            </h1>
            <p className="text-muted-foreground text-xl">
              Streamline your prompt engineering workflow with automated
              testing, evaluation, and optimization tools designed for AI
              systems.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="cursor-pointer">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative aspect-[16/10] rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 p-8">
            <Image
              src="/dashboard.png"
              alt="PromptTestLab Dashboard"
              fill
              className="object-contain p-4"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-24">
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
                Generate and test thousands of potential user interactions based
                on your system prompt.
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
              <h3 className="text-xl font-semibold">Response Analytics</h3>
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

        {/* Pricing Section */}
        <section className="container mx-auto py-24">
          <h2 className="text-center text-3xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="rounded-xl border p-8">
              <h3 className="text-xl font-semibold">Basic</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
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
                  100 tests/month
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
                  Basic analytics
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
                  Single AI model
                </li>
              </ul>
              <Button className="mt-8 w-full cursor-pointer">Start Free</Button>
            </div>
            <div className="rounded-xl border border-blue-500 bg-blue-50 p-8">
              <h3 className="text-xl font-semibold">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
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
                  Unlimited tests
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
                  Advanced analytics
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
                  Multiple AI models
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
                  API access
                </li>
              </ul>
              <Button className="mt-8 w-full cursor-pointer">
                Get Started
              </Button>
            </div>
            <div className="rounded-xl border p-8">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
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
                  Custom solutions
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
                  Dedicated support
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
                  SLA guarantee
                </li>
              </ul>
              <Button variant="outline" className="mt-8 w-full cursor-pointer">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-24">
          <div className="container mx-auto text-center text-white">
            <h2 className="text-3xl font-bold">
              Ready to Optimize Your AI Prompts?
            </h2>
            <p className="mt-4 text-lg">
              Join thousands of developers and AI engineers who are already
              using PromptTestLab to build better AI systems.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="cursor-pointer">
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
