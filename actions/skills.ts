"use server";
import { z } from "zod";
import { createSkill, updateSkill, deleteSkill } from "@/lib/db/queries/skills";
import { SKILL_CATEGORY_KEYS } from "@/lib/constants/categories";
import { runValidatedAdminAction, runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";

const SkillSchema = z.object({
  category: z.enum(SKILL_CATEGORY_KEYS),
  name: z.string().min(1),
  sort_order: z.coerce.number().default(0),
});

const REVALIDATE_PATHS = ["/", "/cv", "/admin/skills"] as const;

export async function createSkillAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    SkillSchema,
    formData,
    async (data) => {
      await createSkill(data);
    },
    REVALIDATE_PATHS
  );
}

export async function updateSkillAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    SkillSchema,
    formData,
    async (data) => {
      await updateSkill(id, data);
    },
    REVALIDATE_PATHS
  );
}

export async function deleteSkillAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteSkill(id);
    },
    REVALIDATE_PATHS,
    "Poisto epaonnistui / Delete failed. Please try again."
  );
}
