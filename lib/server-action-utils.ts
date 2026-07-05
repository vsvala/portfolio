import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { validationError } from "@/lib/action-utils";
import { logger } from "@/lib/logger";
import type { ActionState } from "@/lib/types";

const SAVE_FAILED_MESSAGE = "Tallennus epaonnistui / Save failed. Please try again.";
const ACTION_FAILED_MESSAGE = "Toiminto epaonnistui / Action failed. Please try again.";

export function revalidatePaths(paths: readonly string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function runValidatedAdminAction<T>(
  schema: z.ZodType<T>,
  formData: FormData,
  handler: (data: T) => Promise<void>,
  pathsToRevalidate: readonly string[],
  failureMessage: string = SAVE_FAILED_MESSAGE
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    await handler(parsed.data);
    revalidatePaths(pathsToRevalidate);
    return { success: true };
  } catch (err) {
    logger.error("Admin action failed", { error: String(err) });
    return { success: false, errors: {}, message: failureMessage };
  }
}

export async function runAdminTaskAction(
  task: () => Promise<void>,
  pathsToRevalidate: readonly string[],
  failureMessage: string = ACTION_FAILED_MESSAGE
): Promise<ActionState> {
  await requireAdmin();

  try {
    await task();
    revalidatePaths(pathsToRevalidate);
    return { success: true };
  } catch (err) {
    logger.error("Admin task action failed", { error: String(err) });
    return { success: false, errors: {}, message: failureMessage };
  }
}
