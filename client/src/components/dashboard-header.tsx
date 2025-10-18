import { Sprout } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight" data-testid="text-app-title">
              Fertilizer Supply Chain
            </h1>
            <p className="text-xs text-muted-foreground">
              Dashboard Analytics
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
