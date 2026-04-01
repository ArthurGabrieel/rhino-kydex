// Configurações — Tipos de domínio
export interface Empresa {
  nome: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  site: string;
}

export interface OperadorConfig {
  id: number;
  nome: string;
  sobrenome: string;
  nivel: "Júnior" | "Pleno" | "Sênior";
  avatar: string;
  ativo: boolean;
  funcao: string;
  turno: string;
}

export interface AlertaConfig {
  id: string;
  categoria: string;
  label: string;
  limiteMinimo: number;
  emailAtivo: boolean;
  sobreAviso: number; // % acima do mínimo que já avisa
}

export type ConfigTab = "empresa" | "operadores" | "alertas" | "sistema";
