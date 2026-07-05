export const SKILL_CATEGORY_KEYS = [
  "frontend",
  "backend",
  "databases",
  "tools",
  "methods",
] as const;

export type SkillCategoryKey = (typeof SKILL_CATEGORY_KEYS)[number];

export const SKILL_CATEGORY_LABELS: Record<SkillCategoryKey, { fi: string; en: string }> = {
  frontend: { fi: "Frontend", en: "Frontend" },
  backend: { fi: "Backend", en: "Backend" },
  databases: { fi: "Tietokannat", en: "Databases" },
  tools: { fi: "Tyokalut", en: "Tools" },
  methods: { fi: "Tyotavat", en: "Methods" },
};

export const PROJECT_CATEGORIES = [
  { value: "personal", labelFi: "Oma projekti", labelEn: "Personal Project" },
  {
    value: "university_solo",
    labelFi: "Opiskeluprojekti - yksin",
    labelEn: "University Project - Solo",
  },
  {
    value: "university_group",
    labelFi: "Opiskeluprojekti - ryhma",
    labelEn: "University Project - Group Work",
  },
  { value: "hackathon", labelFi: "Hackathon", labelEn: "Hackathon" },
] as const;

export const PROJECT_CATEGORY_KEYS = PROJECT_CATEGORIES.map((category) => category.value) as [
  (typeof PROJECT_CATEGORIES)[number]["value"],
  ...(typeof PROJECT_CATEGORIES)[number]["value"][],
];

export const COURSE_CATEGORIES = [
  { value: "web_dev", labelFi: "Web-kehitys", labelEn: "Web Development" },
  { value: "programming", labelFi: "Ohjelmointi", labelEn: "Programming" },
  {
    value: "sw_engineering",
    labelFi: "Ohjelmistotuotanto & arkkitehtuuri",
    labelEn: "Software Engineering & Architecture",
  },
  { value: "databases", labelFi: "Tietokannat", labelEn: "Databases" },
  { value: "design", labelFi: "Suunnittelu & UX", labelEn: "Design & UX" },
  { value: "ai_data", labelFi: "Tekoaly & data", labelEn: "AI & Data" },
  {
    value: "systems",
    labelFi: "Jarjestelmat & verkot",
    labelEn: "Systems & Networks",
  },
  { value: "math", labelFi: "Matematiikka", labelEn: "Mathematics" },
  { value: "other", labelFi: "Muut", labelEn: "Other" },
] as const;

export const COURSE_CATEGORY_ORDER = COURSE_CATEGORIES.map((category) => category.value);

export const COURSE_CATEGORY_LABELS = COURSE_CATEGORIES.reduce<
  Record<string, { fi: string; en: string }>
>((acc, category) => {
  acc[category.value] = { fi: category.labelFi, en: category.labelEn };
  return acc;
}, {});
