import Link from "next/link";
import { Scissors } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          <span className="text-xl font-bold">Mustafa Soylu</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/hakkinda"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Hakkında
          </Link>
          <Link
            href="/randevu"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Randevu Al
          </Link>
        </nav>
      </div>
    </header>
  );
}
