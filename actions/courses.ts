"use server";
import { z } from "zod";
import { createCourse, updateCourse, deleteCourse } from "@/lib/db/queries/courses";
import { COURSE_CATEGORIES } from "@/lib/constants/categories";
import { nullableNumberField, nullableStringField, nullableUrlField } from "@/lib/zod-fields";
import { runValidatedAdminAction, runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";
import { DELETE_FAILED_MESSAGE } from "@/lib/utils";

const CourseSchema = z.object({
  name_fi: z.string().min(1),
  name_en: z.string().min(1),
  institution_fi: z.string().min(1),
  institution_en: z.string().min(1),
  category: z.enum(
    COURSE_CATEGORIES.map((category) => category.value) as [
      (typeof COURSE_CATEGORIES)[number]["value"],
      ...(typeof COURSE_CATEGORIES)[number]["value"][],
    ]
  ),
  credits: nullableNumberField,
  year: nullableNumberField,
  description_fi: z.string().default(""),
  description_en: z.string().default(""),
  url: nullableUrlField,
  grade: nullableStringField,
  education_id: nullableNumberField,
  sort_order: z.coerce.number().default(0),
});

const REVALIDATE_PATHS = ["/courses", "/admin/courses"] as const;

export async function createCourseAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    CourseSchema,
    formData,
    async (data) => {
      await createCourse(data as Parameters<typeof createCourse>[0]);
    },
    REVALIDATE_PATHS
  );
}

export async function updateCourseAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  return runValidatedAdminAction(
    CourseSchema,
    formData,
    async (data) => {
      await updateCourse(id, data as Parameters<typeof updateCourse>[1]);
    },
    REVALIDATE_PATHS
  );
}

export async function deleteCourseAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteCourse(id);
    },
    REVALIDATE_PATHS,
    DELETE_FAILED_MESSAGE
  );
}
