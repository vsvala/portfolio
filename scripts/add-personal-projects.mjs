import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}

const db = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH_TOKEN });

// Update existing portfolio project (id=5) description
await db.execute({
  sql: `UPDATE projects SET description_fi = ?, description_en = ?, sort_order = 1 WHERE id = 5`,
  args: [
    "Henkilökohtainen portfolio-sivusto. Rakennettu Next.js 16:lla, Material UI:lla ja SQLite-tietokannalla. Agenttiohjelmoinnin harjoitusprojekti Claude Codella.",
    "Personal portfolio website built with Next.js 16, MUI, and SQLite. Agentic coding exercise with Claude Code.",
  ],
});
console.log("Updated portfolio project (id=5)");

const projects = [
  {
    title_fi: "RAG Chatbot — DeepLearning.AI",
    title_en: "RAG Chatbot — DeepLearning.AI",
    description_fi:
      'Haarautuma DeepLearning.AI:n "Claude Code: A Highly Agentic Coding Assistant" -kurssin RAG-chatbot-koodipohjaksi.',
    description_en:
      'Fork of the DeepLearning.AI "Claude Code: A Highly Agentic Coding Assistant" course RAG chatbot starter codebase.',
    technologies: '["Python","RAG","Claude Code","DeepLearning.AI"]',
    repo_url: "https://github.com/vsvala/starting-ragchatbot-codebase",
    sort_order: 2,
  },
  {
    title_fi: "KnowWine-AI",
    title_en: "KnowWine-AI",
    description_fi: "Tekoälypohjainen viinisovellus.",
    description_en: "AI-powered wine knowledge application.",
    technologies: '["JavaScript","AI"]',
    repo_url: "https://github.com/vsvala/KnowWine-AI",
    sort_order: 3,
  },
  {
    title_fi: "Wine Recommendation RAG App",
    title_en: "Wine Recommendation RAG App",
    description_fi:
      "Viinisuositusten RAG-sovellus, joka käyttää OpenAI-upotuksia, FAISS-vektorihakua, hybridirankkausta ja GPT-4o-mini-selityksiä. Node.js + React.",
    description_en:
      "Wine recommendation RAG app using OpenAI embeddings, FAISS vector search, hybrid ranking, and GPT-4o-mini LLM explanations. Node.js + React.",
    technologies: '["Node.js","React","OpenAI","FAISS","RAG","JavaScript"]',
    repo_url: "https://github.com/vsvala/Wine-Recommendation-RAG-Fullstack-App",
    sort_order: 4,
  },
  {
    title_fi: "Open-Meteo API Demo",
    title_en: "Open-Meteo API Demo",
    description_fi: "Demosovelluks, joka hyödyntää Open-Meteo-säärajapintaa.",
    description_en: "Demo application using the Open-Meteo weather API.",
    technologies: '["JavaScript","Open-Meteo","Weather API"]',
    repo_url: "https://github.com/vsvala/Open-Meteo-API-demo",
    sort_order: 5,
  },
  {
    title_fi: "Generative AI Chatbot",
    title_en: "Generative AI Chatbot",
    description_fi:
      "Full Stack -chatbot-sovellus, joka on rakennettu Google Gemini 2.5 Flash -rajapinnan päälle. Kehitetty Claude Codella agenttilähtöisellä lähestymistavalla.",
    description_en:
      "A fullstack chatbot application built on generative AI using the Google Gemini 2.5 Flash API. Built with Claude Code using an AI agent-driven development approach.",
    technologies: '["JavaScript","Google Gemini","AI","Claude Code"]',
    repo_url: "https://github.com/vsvala/Generative-AI-Chatbot",
    sort_order: 6,
  },
];

for (const p of projects) {
  await db.execute({
    sql: `INSERT INTO projects
      (title_fi, title_en, description_fi, description_en,
       long_description_fi, long_description_en, technologies,
       url, repo_url, category, document_id, sort_order)
      VALUES (?, ?, ?, ?, '', '', ?, NULL, ?, 'personal', NULL, ?)`,
    args: [
      p.title_fi,
      p.title_en,
      p.description_fi,
      p.description_en,
      p.technologies,
      p.repo_url,
      p.sort_order,
    ],
  });
  console.log("Inserted:", p.title_en);
}

await db.close();
console.log("Done.");
