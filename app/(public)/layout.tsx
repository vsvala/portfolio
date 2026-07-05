import { cookies } from "next/headers";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as "fi" | "en";

  return (
    <>
      <Nav lang={lang} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}
