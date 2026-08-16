export const DELETE_FAILED_MESSAGE = "Poisto epäonnistui / Delete failed. Please try again.";

export function parseTechnologies(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
