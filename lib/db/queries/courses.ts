import "server-only";
import db from "@/lib/db";
import { mapRows, mapRow } from "@/lib/db/utils";
import type { Course } from "@/lib/types";

export async function getAllCourses(): Promise<Course[]> {
  const result = await db.execute(
    "SELECT * FROM courses ORDER BY sort_order ASC, year DESC, created_at DESC"
  );
  return mapRows<Course>(result.rows);
}

export async function getCoursesByEducationId(educationId: number): Promise<Course[]> {
  const result = await db.execute({
    sql: "SELECT * FROM courses WHERE education_id = ? ORDER BY sort_order ASC, year DESC",
    args: [educationId],
  });
  return mapRows<Course>(result.rows);
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const result = await db.execute({
    sql: "SELECT * FROM courses WHERE id = ?",
    args: [id],
  });
  return mapRow<Course | undefined>(result.rows[0]);
}

export async function createCourse(
  data: Omit<Course, "id" | "created_at" | "updated_at">
): Promise<{ id: number }> {
  const result = await db.execute({
    sql: `INSERT INTO courses (name_fi, name_en, institution_fi, institution_en, category, credits, year, description_fi, description_en, url, grade, education_id, sort_order)
          VALUES (:name_fi, :name_en, :institution_fi, :institution_en, :category, :credits, :year, :description_fi, :description_en, :url, :grade, :education_id, :sort_order)`,
    args: {
      ...data,
      credits: data.credits ?? null,
      year: data.year ?? null,
      url: data.url ?? null,
      grade: data.grade ?? null,
      education_id: data.education_id ?? null,
    },
  });
  return { id: Number(result.lastInsertRowid) };
}

export async function updateCourse(
  id: number,
  data: Omit<Course, "id" | "created_at" | "updated_at">
): Promise<void> {
  await db.execute({
    sql: `UPDATE courses SET name_fi=:name_fi, name_en=:name_en, institution_fi=:institution_fi, institution_en=:institution_en,
          category=:category, credits=:credits, year=:year, description_fi=:description_fi, description_en=:description_en,
          url=:url, grade=:grade, education_id=:education_id, sort_order=:sort_order, updated_at=datetime('now') WHERE id=:id`,
    args: {
      ...data,
      id,
      credits: data.credits ?? null,
      year: data.year ?? null,
      url: data.url ?? null,
      grade: data.grade ?? null,
      education_id: data.education_id ?? null,
    },
  });
}

export async function deleteCourse(id: number): Promise<void> {
  await db.execute({ sql: "DELETE FROM courses WHERE id = ?", args: [id] });
}
