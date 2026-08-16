"use server";
import { z } from "zod";
import { createWork, updateWork, deleteWork } from "@/lib/db/queries/work";
import { technologiesField, nullableStringField } from "@/lib/zod-fields";
import { runValidatedAdminAction, runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";
import { DELETE_FAILED_MESSAGE } from "@/lib/utils";

const WorkSchema = z.object({
  company_name_fi: z.string().min(1),
  company_name_en: z.string().min(1),
  role_fi: z.string().min(1),
  role_en: z.string().min(1),
  description_fi: z.string().default(""),
  description_en: z.string().default(""),
  start_date: z.string().min(1),
  end_date: nullableStringField,
  technologies: technologiesField,
  certificate_document_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
});

const REVALIDATE_PATHS = ["/work", "/admin/work"] as const;

export async function createWorkAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    WorkSchema,
    formData,
    async (data) => createWork(data as Parameters<typeof createWork>[0]).then(() => undefined),
    REVALIDATE_PATHS
  );
}

export async function updateWorkAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    WorkSchema,
    formData,
    async (data) => {
      await updateWork(id, data);
    },
    REVALIDATE_PATHS
  );
}

export async function deleteWorkAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteWork(id);
    },
    REVALIDATE_PATHS,
    DELETE_FAILED_MESSAGE
  );
}
