"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/types";

export type FormAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;

export function useAdminForm(action: FormAction, redirectPath: string) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {
    success: false,
    errors: {},
  } as ActionState);
  useEffect(() => {
    if (state?.success) router.push(redirectPath);
  }, [state, router, redirectPath]);
  return { state, formAction, pending };
}
