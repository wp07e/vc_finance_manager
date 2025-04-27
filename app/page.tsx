import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="container flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
          Take Control of Your Finances
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Track expenses, manage budgets, and achieve your financial goals with
          our intuitive dashboard.
        </p>
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <Button asChild size="lg">
            <p>
              <Link href="/auth/register">Get Started</Link>
            </p>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
