import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-green-800 font-semibold text-lg tracking-tight">
          Folia
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
