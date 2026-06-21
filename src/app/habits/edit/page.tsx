"use client";

import { useHabitStore } from "@/store/useHabitStore";
import { HabitForm } from "@/components/HabitForm";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function EditHabitContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { habits } = useHabitStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!id) {
    router.push("/");
    return null;
  }

  const habit = habits.find(h => h.id === id);

  if (!habit) {
    router.push("/");
    return null;
  }

  return (
    <div className="py-4">
      <HabitForm initialData={habit} />
    </div>
  );
}

export default function EditHabitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditHabitContent />
    </Suspense>
  );
}
