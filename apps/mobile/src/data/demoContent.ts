import type { Folder, Note, Recording } from "../types";

const FOLDERS: Omit<Folder, "userId" | "createdAt">[] = [
  { id: "folder-cs", name: "Computer Science", color: "#6C63FF", icon: "laptop", noteCount: 5 },
  { id: "folder-chem", name: "Chemistry", color: "#A78BFA", icon: "flask", noteCount: 3 },
  { id: "folder-math", name: "Mathematics", color: "#4F46E5", icon: "ruler", noteCount: 3 },
  { id: "folder-bio", name: "Biology", color: "#10B981", icon: "dna", noteCount: 2 },
  { id: "folder-hist", name: "History", color: "#1A1A2E", icon: "scroll", noteCount: 2 },
];

type DemoEntry = {
  title: string;
  folderId: string;
  duration: number;
  daysAgo: number;
  summary: string;
  keyPoints: string[];
  keywords: string[];
  chapterHeadline: string;
};

const ENTRIES: DemoEntry[] = [
  {
    title: "Introduction to Machine Learning",
    folderId: "folder-cs",
    duration: 1842,
    daysAgo: 0,
    summary:
      "Supervised vs unsupervised learning, linear regression, gradient descent, and how to evaluate models without overfitting.",
    keyPoints: [
      "Supervised learning uses labeled data",
      "Gradient descent minimizes cost iteratively",
      "Cross-validation estimates real-world performance",
      "Regularization reduces overfitting",
      "Feature scaling speeds up training",
    ],
    keywords: ["ML", "Regression", "Gradient Descent", "Overfitting"],
    chapterHeadline: "Model evaluation & validation",
  },
  {
    title: "Organic Chemistry — Alkanes",
    folderId: "folder-chem",
    duration: 2105,
    daysAgo: 1,
    summary:
      "Structure and naming of alkanes, conformations, radical halogenation, and stability of carbocations in substitution reactions.",
    keyPoints: [
      "IUPAC naming follows longest carbon chain",
      "Newman projections show staggered vs eclipsed",
      "Radical halogenation is chain reaction",
      "3° carbocations are most stable",
    ],
    keywords: ["Alkanes", "IUPAC", "Radicals", "Conformations"],
    chapterHeadline: "Radical halogenation mechanism",
  },
  {
    title: "Calculus II — Integration Techniques",
    folderId: "folder-math",
    duration: 1920,
    daysAgo: 2,
    summary:
      "Integration by parts, trigonometric integrals, partial fractions, and improper integrals with convergence tests.",
    keyPoints: [
      "LIATE rule picks u in integration by parts",
      "Trig identities simplify powers of sin/cos",
      "Partial fractions decompose rational functions",
      "Improper integrals need limit comparison",
    ],
    keywords: ["Integration", "Partial Fractions", "Improper Integrals"],
    chapterHeadline: "Integration by parts",
  },
  {
    title: "Cell Biology — Mitosis & Meiosis",
    folderId: "folder-bio",
    duration: 1650,
    daysAgo: 3,
    summary:
      "Phases of mitosis and meiosis, chromosome behavior, and how errors lead to aneuploidy and genetic diversity.",
    keyPoints: [
      "Mitosis produces identical daughter cells",
      "Meiosis halves chromosome number",
      "Crossing over increases genetic variation",
      "Spindle fibers align chromosomes",
    ],
    keywords: ["Mitosis", "Meiosis", "Chromosomes", "Cell Cycle"],
    chapterHeadline: "Meiosis I vs Meiosis II",
  },
  {
    title: "World War II — Causes & Consequences",
    folderId: "folder-hist",
    duration: 2400,
    daysAgo: 4,
    summary:
      "Treaty of Versailles fallout, rise of totalitarian regimes, key battles, Holocaust, and post-war order shaping the UN.",
    keyPoints: [
      "Versailles left Germany economically unstable",
      "Appeasement failed to stop expansion",
      "D-Day opened Western front in Europe",
      "Yalta shaped post-war spheres",
    ],
    keywords: ["WWII", "Versailles", "Holocaust", "Cold War origins"],
    chapterHeadline: "Post-war settlement",
  },
  {
    title: "Data Structures — Trees & Graphs",
    folderId: "folder-cs",
    duration: 1780,
    daysAgo: 5,
    summary:
      "Binary search trees, balancing, BFS/DFS traversals, shortest path intuition, and when to pick each structure.",
    keyPoints: [
      "BST average search is O(log n)",
      "AVL trees stay balanced via rotations",
      "BFS finds shortest unweighted paths",
      "DFS suits topological sorting",
    ],
    keywords: ["BST", "Graphs", "BFS", "DFS"],
    chapterHeadline: "Graph traversal algorithms",
  },
  {
    title: "Thermodynamics — Enthalpy & Entropy",
    folderId: "folder-chem",
    duration: 1980,
    daysAgo: 6,
    summary:
      "First and second laws, Gibbs free energy, spontaneity criteria, and coupling endergonic reactions in biochemistry.",
    keyPoints: [
      "ΔG < 0 means spontaneous at constant T,P",
      "Entropy increases in isolated systems",
      "Hess's law sums reaction enthalpies",
      "Equilibrium links ΔG° and K",
    ],
    keywords: ["Enthalpy", "Entropy", "Gibbs", "Spontaneity"],
    chapterHeadline: "Gibbs free energy",
  },
  {
    title: "Linear Algebra — Eigenvalues",
    folderId: "folder-math",
    duration: 1710,
    daysAgo: 7,
    summary:
      "Characteristic polynomials, diagonalization, geometric meaning of eigenvectors, and applications in PCA.",
    keyPoints: [
      "Eigenvectors stay on same line under transform",
      "Diagonalization simplifies matrix powers",
      "Repeated eigenvalues may lack full basis",
      "PCA uses largest eigenvalues of covariance",
    ],
    keywords: ["Eigenvalues", "Diagonalization", "PCA", "Vectors"],
    chapterHeadline: "Diagonalization criteria",
  },
  {
    title: "Genetics — Mendelian Inheritance",
    folderId: "folder-bio",
    duration: 1540,
    daysAgo: 8,
    summary:
      "Dominant/recessive alleles, Punnett squares, test crosses, and extensions including codominance and linkage.",
    keyPoints: [
      "Law of segregation applies to gametes",
      "Test cross reveals hidden genotype",
      "Linkage reduces independent assortment",
      "Codominance shows both phenotypes",
    ],
    keywords: ["Genetics", "Alleles", "Punnett", "Linkage"],
    chapterHeadline: "Extensions to Mendel",
  },
  {
    title: "Cold War — Ideology & Proxy Wars",
    folderId: "folder-hist",
    duration: 2250,
    daysAgo: 9,
    summary:
      "Containment doctrine, NATO vs Warsaw Pact, nuclear deterrence, decolonization tensions, and Vietnam as proxy conflict.",
    keyPoints: [
      "Containment guided US foreign policy",
      "Mutually assured destruction prevented direct war",
      "Decolonization created new alliance pressures",
      "Proxy wars spread ideological competition",
    ],
    keywords: ["Cold War", "NATO", "Containment", "Proxy War"],
    chapterHeadline: "Nuclear deterrence",
  },
  {
    title: "Operating Systems — Scheduling",
    folderId: "folder-cs",
    duration: 1890,
    daysAgo: 10,
    summary:
      "CPU scheduling algorithms, context switching cost, preemptive vs non-preemptive policies, and real-time constraints.",
    keyPoints: [
      "Round-robin prevents starvation with time slices",
      "SJF minimizes average wait time",
      "Priority inversion needs inheritance fix",
      "Context switches have measurable overhead",
    ],
    keywords: ["Scheduling", "Round Robin", "SJF", "Preemption"],
    chapterHeadline: "Preemptive scheduling",
  },
  {
    title: "Electrochemistry — Redox & Cells",
    folderId: "folder-chem",
    duration: 1820,
    daysAgo: 11,
    summary:
      "Oxidation numbers, galvanic vs electrolytic cells, standard potentials, Nernst equation, and battery fundamentals.",
    keyPoints: [
      "Anode is oxidation site",
      "Cell potential sums half-reactions",
      "Nernst adjusts E for non-standard conditions",
      "Electrolysis requires external voltage",
    ],
    keywords: ["Redox", "Nernst", "Galvanic", "Electrolysis"],
    chapterHeadline: "Standard cell potentials",
  },
  {
    title: "Probability — Bayes' Theorem",
    folderId: "folder-math",
    duration: 1680,
    daysAgo: 12,
    summary:
      "Conditional probability, independence, law of total probability, Bayes updates beliefs with new evidence.",
    keyPoints: [
      "P(A|B) differs from P(B|A)",
      "Bayes combines prior and likelihood",
      "Total probability partitions sample space",
      "Base rate neglect is common error",
    ],
    keywords: ["Bayes", "Conditional", "Prior", "Likelihood"],
    chapterHeadline: "Updating with evidence",
  },
  {
    title: "Neural Networks — Backpropagation",
    folderId: "folder-cs",
    duration: 2040,
    daysAgo: 13,
    summary:
      "Forward pass, loss functions, chain rule in computational graphs, vanishing gradients, and practical training tips.",
    keyPoints: [
      "Backprop applies chain rule layer by layer",
      "ReLU reduces vanishing gradient vs sigmoid",
      "Learning rate dominates convergence",
      "Batch norm stabilizes activations",
    ],
    keywords: ["Backprop", "Gradient", "ReLU", "Loss"],
    chapterHeadline: "Chain rule in graphs",
  },
  {
    title: "Database Systems — SQL & Indexing",
    folderId: "folder-cs",
    duration: 1760,
    daysAgo: 14,
    summary:
      "Relational model, JOIN types, normalization goals, B-tree indexes, and query planning trade-offs.",
    keyPoints: [
      "Normalization reduces update anomalies",
      "B-tree indexes speed range queries",
      "JOIN cardinality affects performance",
      "EXPLAIN shows planner decisions",
    ],
    keywords: ["SQL", "Indexes", "Normalization", "JOIN"],
    chapterHeadline: "Index selection",
  },
];

function flashcardsFor(entry: DemoEntry) {
  return entry.keyPoints.slice(0, 6).map((point) => ({
    question: `Review: ${point}`,
    answer: point,
  }));
}

export function buildDemoRecordings(userId: string): Recording[] {
  return ENTRIES.map((entry, i) => ({
    id: `rec-demo-${i + 1}`,
    userId,
    title: entry.title,
    duration: entry.duration,
    audioUri: "",
    language: "en" as const,
    status: "done" as const,
    folderId: entry.folderId,
    createdAt: new Date(Date.now() - entry.daysAgo * 86400000).toISOString(),
  }));
}

export function buildDemoNotes(): Note[] {
  return ENTRIES.map((entry, i) => ({
    id: `note-demo-${i + 1}`,
    recordingId: `rec-demo-${i + 1}`,
    summary: entry.summary,
    keyPoints: entry.keyPoints,
    keywords: entry.keywords,
    chapters: [
      {
        start: 0,
        end: Math.floor(entry.duration / 3),
        headline: entry.chapterHeadline,
        summary: entry.summary.slice(0, 80),
        gist: entry.chapterHeadline,
      },
      {
        start: Math.floor(entry.duration / 3),
        end: Math.floor((entry.duration * 2) / 3),
        headline: "Core concepts",
        summary: entry.keyPoints[0],
        gist: "Core",
      },
      {
        start: Math.floor((entry.duration * 2) / 3),
        end: entry.duration,
        headline: "Review & Q&A",
        summary: entry.keyPoints[1] ?? entry.summary.slice(0, 60),
        gist: "Review",
      },
    ],
    transcript: [
      {
        speaker: "A",
        text: `Today we cover ${entry.title.toLowerCase()}.`,
        start: 0,
        end: 6,
      },
      ...entry.keyPoints.map((point, i) => ({
        speaker: i % 2 === 0 ? "B" : "A",
        text: point,
        start: 6 + i * 14,
        end: 18 + i * 14,
      })),
    ],
    flashcards: flashcardsFor(entry),
    teacherSpeaker: "A",
    createdAt: new Date(Date.now() - entry.daysAgo * 86400000).toISOString(),
  }));
}

export function buildDemoFolders(userId: string): Folder[] {
  const now = new Date().toISOString();
  return FOLDERS.map((f) => ({
    ...f,
    userId,
    createdAt: now,
  }));
}
