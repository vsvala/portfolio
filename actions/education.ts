"use server";
import { z } from "zod";
import { createEducation, updateEducation, deleteEducation } from "@/lib/db/queries/education";
import { nullableStringField, nullableUrlField } from "@/lib/zod-fields";
import { runValidatedAdminAction, runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";

const EducationSchema = z.object({
  institution_fi: z.string().min(1),
  institution_en: z.string().min(1),
  degree_fi: z.string().min(1),
  degree_en: z.string().min(1),
  description_fi: z.string().default(""),
  description_en: z.string().default(""),
  start_date: z.string().min(1),
  end_date: nullableStringField,
  thesis_url: nullableUrlField,
  document_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
});

const REVALIDATE_PATHS = ["/education", "/admin/education"] as const;

export async function createEducationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    EducationSchema,
    formData,
    async (data) => {
      await createEducation(data as Parameters<typeof createEducation>[0]);
    },
    REVALIDATE_PATHS
  );
}

export async function updateEducationAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    EducationSchema,
    formData,
    async (data) => {
      await updateEducation(id, data);
    },
    REVALIDATE_PATHS
  );
}

export async function deleteEducationAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteEducation(id);
    },
    REVALIDATE_PATHS,
    "Poisto epaonnistui / Delete failed. Please try again."
  );
}
