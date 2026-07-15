export interface Step {
  id: string;
  title: string;
  description: string;
  promptText?: string;
  actionLink?: string;
  linkText?: string;
}

export interface Method {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: "Fácil" | "Médio" | "Avançado";
  estimatedIncome: string; // e.g. "R$ 500 - R$ 2.500/mês"
  duration: string; // e.g. "2-3 horas"
  iconName: string; // Lucide icon identifier
  description: string;
  steps: Step[];
  tips: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  completedSteps: { [methodId: string]: string[] }; // lists of completed step IDs per method
}
