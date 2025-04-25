import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <main className="w-full flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  PromptTestLab
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your AI prompt testing and evaluation. Test,
                  analyze, and optimize your prompts at scale.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button className="cursor-pointer" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-white p-4 shadow-sm dark:bg-gray-800">
                  <svg
                    className="h-6 w-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M12 8V2" />
                    <path d="M12 16v6" />
                    <path d="m16 12 6-3" />
                    <path d="m2 9 6 3" />
                    <path d="m2 15 6-3" />
                    <path d="m22 15-6-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">AI-Powered Testing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Generate plausible user messages and test your prompts
                  automatically
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-white p-4 shadow-sm dark:bg-gray-800">
                  <svg
                    className="h-6 w-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Analytics & Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Compare responses across different models and analyze
                  performance
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-white p-4 shadow-sm dark:bg-gray-800">
                  <svg
                    className="h-6 w-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                    <path d="M7 7h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Prompt Management</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Save, organize, and version control your system prompts
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
