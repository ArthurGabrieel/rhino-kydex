export interface OperadorConfig {
  id: number;
  email: string;
  nome: string;
  sobrenome: string;
  nivel: "Júnior" | "Pleno" | "Sênior";
  avatar: string;
  ativo: boolean;
  funcao: string;
  turno: string;
  role: "Administrador" | "Gerente" | "Colaborador";
  modulos: string[];
}

export interface AlertaConfig {
  id: string;
  categoria: string;
  label: string;
  limiteMinimo: number;
  emailAtivo: boolean;
  sobreAviso: number; // % acima do mínimo que já avisa
}

export type ConfigTab = "perfil" | "operadores" | "alertas" | "auditoria";
