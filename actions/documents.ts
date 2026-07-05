"use server";
import { deleteDocument } from "@/lib/db/queries/documents";
import { runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";

export async function deleteDocumentAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteDocument(id);
    },
    ["/admin/documents"],
    "Poisto epaonnistui / Delete failed. Please try again."
  );
}
