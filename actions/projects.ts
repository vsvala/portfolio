"use server";
import { z } from "zod";
import { createProject, updateProject, deleteProject } from "@/lib/db/queries/projects";
import { technologiesField, nullableStringField, nullableUrlField } from "@/lib/zod-fields";
import { PROJECT_CATEGORY_KEYS } from "@/lib/constants/categories";
import { runValidatedAdminAction, runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";

const ProjectSchema = z.object({
  title_fi: z.string().min(1),
  title_en: z.string().min(1),
  description_fi: z.string().default(""),
  description_en: z.string().default(""),
  long_description_fi: z.string().default(""),
  long_description_en: z.string().default(""),
  technologies: technologiesField,
  url: nullableUrlField,
  repo_url: nullableUrlField,
  category: z.enum(PROJECT_CATEGORY_KEYS).default("hackathon"),
  status: nullableStringField,
  document_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
});

const REVALIDATE_PATHS = ["/projects", "/admin/projects"] as const;

export async function createProjectAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    ProjectSchema,
    formData,
    async (data) => {
      await createProject(data as Parameters<typeof createProject>[0]);
    },
    REVALIDATE_PATHS
  );
}

export async function updateProjectAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    ProjectSchema,
    formData,
    async (data) => {
      await updateProject(id, data);
    },
    REVALIDATE_PATHS
  );
}

export async function deleteProjectAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteProject(id);
    },
    REVALIDATE_PATHS,
    "Poisto epaonnistui / Delete failed. Please try again."
  );
}
