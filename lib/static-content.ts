export interface Certification {
  title_fi: string;
  title_en: string;
  issuer_fi: string;
  issuer_en: string;
  description_fi: string;
  description_en: string;
  year: string;
  technologies: string[];
  imageUrl: string;
  credentialUrl?: string;
}

export const certifications: Certification[] = [
  {
    title_fi: "Claude Code: A Highly Agentic Coding Assistant",
    title_en: "Claude Code: A Highly Agentic Coding Assistant",
    issuer_fi: "DeepLearning.AI",
    issuer_en: "DeepLearning.AI",
    description_fi:
      "Kurssi kattaa Claude Coden käytön tekoälyavusteisessa ohjelmistokehityksessä: agenttiset työnkulut, MCP-integraatiot, hookit ja automaatio.",
    description_en:
      "Course covering Claude Code for AI-assisted software development: agentic workflows, MCP integrations, hooks, and automation.",
    year: "2026",
    technologies: ["Claude Code", "AI", "MCP", "Agentic Workflows"],
    imageUrl: "/images/certificate-claudecode.png",
    credentialUrl:
      "https://learn.deeplearning.ai/accomplishments/dd8f1d3e-9145-4828-973f-409bf6c7ee92",
  },
  {
    title_fi: "Full Stack Open",
    title_en: "Full Stack Open",
    issuer_fi: "Helsingin yliopisto",
    issuer_en: "University of Helsinki",
    description_fi:
      "Avoin verkkokurssi modernista JavaScript-pohjaisesta web-sovelluskehityksestä. Sisältää React-, Redux-, Node.js-, Express-, MongoDB-, GraphQL- ja TypeScript-osiot.",
    description_en:
      "Open online course on modern JavaScript-based web application development. Covers React, Redux, Node.js, Express, MongoDB, GraphQL, and TypeScript.",
    year: "2024",
    technologies: ["React", "Node.js", "TypeScript", "GraphQL", "MongoDB"],
    imageUrl: "/images/certificate-fullstackopen.png",
  },
  {
    title_fi: "Honours Programme Diploma",
    title_en: "Honours Programme Diploma",
    issuer_fi: "Helsingin yliopisto, Matemaattis-luonnontieteellinen tiedekunta",
    issuer_en: "University of Helsinki, Faculty of Science",
    description_fi:
      "Kandidaatintutkinto suoritettu kolmessa lukuvuodessa hyväksytyn Honours Programme -ohjelman kautta tietojenkäsittelytieteessä hyvin arvosanoin.",
    description_en:
      "Bachelor of Science degree completed in three academic years through an approved Honours Programme in Computer Science with good average grades.",
    year: "2019",
    technologies: [],
    imageUrl: "/images/diploma-honours.jpeg",
  },
  {
    title_fi: "Graffathon 2019 – 2. sija, Beginner Compo",
    title_en: "Graffathon 2019 – 2nd Place, Beginner Compo",
    issuer_fi: "Aalto-yliopiston Digital Media Club (DOT)",
    issuer_en: "Aalto University Digital Media Club (DOT)",
    description_fi:
      "Teos: Mandaloid / Vadod. Graffathon on Aalto-yliopiston Digital Media Clubin järjestämä demoskene-tapahtuma.",
    description_en:
      "Entry: Mandaloid / Vadod. Graffathon is a demoscene event organised by Aalto University's Digital Media Club.",
    year: "2019",
    technologies: [],
    imageUrl: "/images/certificate-graffathon.jpeg",
  },
];
