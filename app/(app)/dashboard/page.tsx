import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-stone-800">
        Welcome to Folia{user?.firstName ? `, ${user.firstName}` : ""}
      </h1>
      <p className="mt-2 text-stone-500">Your plant collection will live here.</p>
    </main>
  );
}
