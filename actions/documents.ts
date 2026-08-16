"use server";
import { deleteDocument } from "@/lib/db/queries/documents";
import { runAdminTaskAction } from "@/lib/server-action-utils";
import type { ActionState } from "@/lib/types";
import { DELETE_FAILED_MESSAGE } from "@/lib/utils";

export async function deleteDocumentAction(id: number): Promise<ActionState> {
  return runAdminTaskAction(
    async () => {
      await deleteDocument(id);
    },
    ["/admin/documents"],
    DELETE_FAILED_MESSAGE
  );
}
