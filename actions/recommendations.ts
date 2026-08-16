"use server";
import { z } from "zod";
import {
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
} from "@/lib/db/queries/recommendations";
import { runValidatedAdminAction, runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";
import { DELETE_FAILED_MESSAGE } from "@/lib/utils";

const RecommendationSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().default(""),
  relationship: z.string().default(""),
  rec_date: z.string().min(1),
  text: z.string().min(1),
  sort_order: z.coerce.number().default(0),
});

const REVALIDATE_PATHS = ["/recommendations", "/admin/recommendations"] as const;

export async function createRecommendationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    RecommendationSchema,
    formData,
    async (data) => {
      await createRecommendation(data);
    },
    REVALIDATE_PATHS
  );
}

export async function updateRecommendationAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    RecommendationSchema,
    formData,
    async (data) => {
      await updateRecommendation(id, data);
    },
    REVALIDATE_PATHS
  );
}

export async function deleteRecommendationAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteRecommendation(id);
    },
    REVALIDATE_PATHS,
    DELETE_FAILED_MESSAGE
  );
}
