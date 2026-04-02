// RHINO KYDEX — Mock Data Layer
// All production data is mocked for frontend demonstration
import type { Pedido, KanbanStatus } from "@/components/kanban/types";
import type { ItemEstoque, LogEntry } from "@/components/estoque/types";

export type { Pedido, KanbanStatus, ItemEstoque, LogEntry };

// === OPERADORES ===
export const operadores = [
  {
    id: 1,
    nome: "Jorge",
    sobrenome: "Matos",
    nivel: "Sênior",
    avatar: "JM",
    coldres: 45,
    eficiencia: 94,
  },
  {
    id: 2,
    nome: "Ricardo",
    sobrenome: "Ferreira",
    nivel: "Pleno",
    avatar: "RF",
    coldres: 38,
    eficiencia: 82,
  },
  {
    id: 3,
    nome: "Marcos",
    sobrenome: "Oliveira",
    nivel: "Junior",
    avatar: "MO",
    coldres: 22,
    eficiencia: 71,
  },
];

export const operadorAtivo = operadores[0];

// === KPIs DASHBOARD ===
export const kpis = {
  pedidosMes: 127,
  metaMensal: 150,
  pedidosMesAnterior: 109,
  itensEmProducao: 34,
  alertasAtivos: 3,
  receitaMes: 48750,
  receitaMesAnterior: 41200,
  tempoMedioProducao: "2h 18min",
};

// === TENDÊNCIAS DE PRODUÇÃO — datasets por período ===
// 7D → diário (7 pontos)
export const dados7d = [
  { label: "Seg", moldagem: 4, acabamento: 3, expedicao: 2 },
  { label: "Ter", moldagem: 6, acabamento: 5, expedicao: 4 },
  { label: "Qua", moldagem: 5, acabamento: 6, expedicao: 5 },
  { label: "Qui", moldagem: 7, acabamento: 5, expedicao: 6 },
  { label: "Sex", moldagem: 8, acabamento: 7, expedicao: 6 },
  { label: "Sáb", moldagem: 3, acabamento: 4, expedicao: 3 },
  { label: "Dom", moldagem: 2, acabamento: 2, expedicao: 2 },
];

// 30D → semanal (4 semanas)
export const dados30d = [
  { label: "Sem 01", moldagem: 22, acabamento: 19, expedicao: 16 },
  { label: "Sem 02", moldagem: 26, acabamento: 22, expedicao: 18 },
  { label: "Sem 03", moldagem: 29, acabamento: 25, expedicao: 22 },
  { label: "Sem 04", moldagem: 35, acabamento: 32, expedicao: 28 },
];

// 90D → quinzenal (6 pontos)
export const dados90d = [
  { label: "Jan/1", moldagem: 18, acabamento: 15, expedicao: 12 },
  { label: "Jan/2", moldagem: 22, acabamento: 18, expedicao: 16 },
  { label: "Fev/1", moldagem: 25, acabamento: 22, expedicao: 19 },
  { label: "Fev/2", moldagem: 28, acabamento: 25, expedicao: 21 },
  { label: "Mar/1", moldagem: 31, acabamento: 28, expedicao: 25 },
  { label: "Mar/2", moldagem: 35, acabamento: 32, expedicao: 30 },
];

// YTD → mensal (12 meses)
export const dadosYtd = [
  { label: "Jan", moldagem: 82, acabamento: 74, expedicao: 65 },
  { label: "Fev", moldagem: 95, acabamento: 88, expedicao: 79 },
  { label: "Mar", moldagem: 110, acabamento: 99, expedicao: 91 },
  { label: "Abr", moldagem: 105, acabamento: 97, expedicao: 88 },
  { label: "Mai", moldagem: 118, acabamento: 108, expedicao: 97 },
  { label: "Jun", moldagem: 122, acabamento: 114, expedicao: 103 },
  { label: "Jul", moldagem: 130, acabamento: 121, expedicao: 112 },
  { label: "Ago", moldagem: 127, acabamento: 119, expedicao: 108 },
  { label: "Set", moldagem: 135, acabamento: 127, expedicao: 118 },
  { label: "Out", moldagem: 142, acabamento: 133, expedicao: 124 },
  { label: "Nov", moldagem: 138, acabamento: 130, expedicao: 121 },
  { label: "Dez", moldagem: 148, acabamento: 140, expedicao: 131 },
];

// Compat: mantido para imports existentes
export const vendasSemanais = dados30d.map((d) => ({ semana: d.label, ...d }));

// === KANBAN — PEDIDOS (types re-exported from @/components/kanban/types) ===

function toMockEmailBase(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
}

const pedidosBase: Pedido[] = [
  // Pedidos Abertos
  {
    id: "P-2401",
    ref: "PED-2401",
    cliente: "Sgto. Almeida",
    modelo: "IWB Tático",
    arma: "Glock G17 Gen5",
    cor: "Flat Dark Earth",
    prioridade: "alta",
    status: "aberto",
    hora: "09:15",
  },
  {
    id: "P-2402",
    ref: "PED-2402",
    cliente: "Det. Lima",
    modelo: "OWB Duty",
    arma: "Taurus PT92",
    cor: "Preto Fosco",
    prioridade: "media",
    status: "aberto",
    hora: "10:30",
  },
  {
    id: "P-2403",
    ref: "PED-2403",
    cliente: "Cel. Barros",
    modelo: "IWB Slim",
    arma: "Sig Sauer P320",
    cor: "Preto Fosco",
    prioridade: "normal",
    status: "aberto",
    hora: "11:00",
  },

  // Preparação
  {
    id: "P-2395",
    ref: "PED-2395",
    cliente: "INS. Costa",
    modelo: "OWB Tático",
    arma: "Glock G19",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "preparacao",
    hora: "08:00",
    operador: "Marcos",
  },
  {
    id: "P-2396",
    ref: "PED-2396",
    cliente: "Tte. Souza",
    modelo: "IWB Tático",
    arma: "Smith & Wesson M&P 9",
    cor: "Coyote",
    prioridade: "media",
    status: "preparacao",
    hora: "08:30",
    operador: "Ricardo",
  },

  // Moldagem
  {
    id: "P-2388",
    ref: "PED-2388",
    cliente: "Sgt. Pereira",
    modelo: "IWB Appendix",
    arma: "Glock G43X",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "moldagem",
    hora: "07:15",
    operador: "Jorge",
  },
  {
    id: "P-2389",
    ref: "PED-2389",
    cliente: "CB. Nunes",
    modelo: "OWB Duty",
    arma: "Beretta 92FS",
    cor: "Ranger Green",
    prioridade: "normal",
    status: "moldagem",
    hora: "07:45",
    operador: "Ricardo",
  },
  {
    id: "P-2390",
    ref: "PED-2390",
    cliente: "TC. Ramos",
    modelo: "IWB Tático",
    arma: "HK VP9",
    cor: "Flat Dark Earth",
    prioridade: "media",
    status: "moldagem",
    hora: "08:10",
    operador: "Marcos",
  },

  // Acabamento
  {
    id: "P-2380",
    ref: "PED-2380",
    cliente: "Maj. Ferreira",
    modelo: "OWB Competition",
    arma: "CZ Shadow 2",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "acabamento",
    hora: "06:00",
    operador: "Jorge",
  },
  {
    id: "P-2381",
    ref: "PED-2381",
    cliente: "Cap. Vieira",
    modelo: "IWB Slim",
    arma: "Walther PDP",
    cor: "Preto Fosco",
    prioridade: "media",
    status: "acabamento",
    hora: "06:30",
    operador: "Ricardo",
  },

  // Expedição
  {
    id: "P-2370",
    ref: "PED-2370",
    cliente: "Ten. Cardoso",
    modelo: "IWB Tático",
    arma: "Glock G17",
    cor: "Preto Fosco",
    prioridade: "normal",
    status: "expedicao",
    hora: "Concluído 10:15",
    operador: "Jorge",
  },
  {
    id: "P-2371",
    ref: "PED-2371",
    cliente: "Sgt. Dias",
    modelo: "OWB Duty",
    arma: "Taurus T9AF",
    cor: "Preto Fosco",
    prioridade: "media",
    status: "expedicao",
    hora: "Concluído 09:40",
    operador: "Marcos",
  },
];

export const pedidos: Pedido[] = pedidosBase.map((pedido, index) => {
  const vencimentos = [
    "2026-03-29",
    "2026-03-31",
    "2026-04-02",
    "2026-04-01",
    "2026-04-03",
    "2026-04-04",
    "2026-04-05",
    "2026-04-06",
    "2026-04-07",
    "2026-04-08",
    "2026-04-09",
    "2026-04-10",
  ];

  const emailBase = toMockEmailBase(pedido.cliente);

  return {
    ...pedido,
    revisor: index % 2 === 0 ? "Carla" : "Fernando",
    tempoGarantia: "12 meses",
    endereco: `Rua da Oficina Tática, bloco ${String.fromCharCode(65 + (index % 4))}`,
    numero: String(100 + index),
    email: `${emailBase || "cliente"}@example.com`,
    documento:
      index % 3 === 0
        ? `CNPJ 12.345.67${index}/0001-${String(10 + index).padStart(2, "0")}`
        : `CPF 123.456.78${index}-${String(10 + index).padStart(2, "0")}`,
    descricaoProduto: `${pedido.modelo} para ${pedido.arma} com acabamento ${pedido.cor}.`,
    foto: "/assets/mock_holster.png",
    dataVencimento: vencimentos[index] ?? "2026-04-12",
    logs: [
      {
        id: `SYS-INIT-${pedido.id}`,
        tipo: "sistema",
        autor: "Sistema",
        texto: `Pedido registrado na etapa ${pedido.status}`,
        hora: pedido.hora,
      },
    ],
  };
});

// === ESTOQUE (Inventory) ===
// Types imported from components/estoque/types.ts — no duplication
export const estoque: ItemEstoque[] = [
  {
    id: "1",
    ref: "KY-BLK-02",
    nome: "Kydex Sheet - Tactical Black 2mm",
    categoria: "material",
    quantidade: 8,
    unidade: "FLS",
    minimo: 20,
    localizacao: "A-01",
    status: "critico",
  },
  {
    id: "2",
    ref: "KY-FDE-02",
    nome: "Kydex Sheet - Flat Dark Earth 2mm",
    categoria: "material",
    quantidade: 45,
    unidade: "FLS",
    minimo: 20,
    localizacao: "A-02",
    status: "ok",
  },
  {
    id: "3",
    ref: "KY-COY-02",
    nome: "Kydex Sheet - Coyote Brown 2mm",
    categoria: "material",
    quantidade: 22,
    unidade: "FLS",
    minimo: 15,
    localizacao: "A-03",
    status: "ok",
  },
  {
    id: "4",
    ref: "KY-GRN-02",
    nome: "Kydex Sheet - Ranger Green 2mm",
    categoria: "material",
    quantidade: 14,
    unidade: "FLS",
    minimo: 15,
    localizacao: "A-04",
    status: "alerta",
  },
  {
    id: "5",
    ref: "HW-CHI-025",
    nome: 'Parafuso Chicago 1/4" Zincado',
    categoria: "hardware",
    quantidade: 2840,
    unidade: "UN",
    minimo: 500,
    localizacao: "B-01",
    status: "ok",
  },
  {
    id: "6",
    ref: "HW-EYE-88",
    nome: "Ilhós #88 Black Oxide",
    categoria: "hardware",
    quantidade: 1200,
    unidade: "UN",
    minimo: 300,
    localizacao: "B-02",
    status: "ok",
  },
  {
    id: "7",
    ref: "HW-RVT-04",
    nome: "Rebite 4mm Latão Preto",
    categoria: "hardware",
    quantidade: 180,
    unidade: "UN",
    minimo: 200,
    localizacao: "B-03",
    status: "alerta",
  },
  {
    id: "8",
    ref: "MAT-FOM-05",
    nome: "Foam Padding - Soft Touch 5mm",
    categoria: "material",
    quantidade: 35,
    unidade: "FLS",
    minimo: 10,
    localizacao: "C-01",
    status: "ok",
  },
  {
    id: "9",
    ref: "MAT-ELS-02",
    nome: "Elástico Tático 20mm Preto",
    categoria: "material",
    quantidade: 120,
    unidade: "MT",
    minimo: 50,
    localizacao: "C-02",
    status: "ok",
  },
  {
    id: "10",
    ref: "FIN-GLK-17",
    nome: "Rhino Holster IWB - Glock G17 Gen5",
    categoria: "produto_final",
    quantidade: 12,
    unidade: "UN",
    minimo: 5,
    localizacao: "D-01",
    status: "ok",
  },
  {
    id: "11",
    ref: "FIN-GLK-19",
    nome: "Rhino Holster IWB - Glock G19",
    categoria: "produto_final",
    quantidade: 3,
    unidade: "UN",
    minimo: 5,
    localizacao: "D-02",
    status: "alerta",
  },
  {
    id: "12",
    ref: "FIN-T92-01",
    nome: "Rhino Holster OWB - Taurus PT92",
    categoria: "produto_final",
    quantidade: 7,
    unidade: "UN",
    minimo: 3,
    localizacao: "D-03",
    status: "ok",
  },
];

// === LOG DE ATIVIDADES ===
// LogEntry type imported from components/estoque/types.ts

export const logAtividades: LogEntry[] = [
  {
    id: "1",
    hora: "14:32:18",
    tipo: "producao",
    mensagem: "Pedido PED-2380 concluído e enviado para expedição por Jorge.",
  },
  {
    id: "2",
    hora: "14:21:05",
    tipo: "saida",
    mensagem:
      "Retirada de 2 unidades do Rhino Holster IWB G17. Solicitado por: Jorge.",
  },
  {
    id: "3",
    hora: "14:18:22",
    tipo: "alerta",
    mensagem: "Estoque crítico: Kydex Tactical Black. Restam apenas 8 folhas.",
  },
  {
    id: "4",
    hora: "14:10:45",
    tipo: "entrada",
    mensagem: "Entrada de 1.000 Parafusos Chicago. Fornecedor: TAC SUPPLY.",
  },
  {
    id: "5",
    hora: "13:55:12",
    tipo: "auth",
    mensagem: "Login no sistema: Operador Jorge.",
  },
  {
    id: "6",
    hora: "13:40:30",
    tipo: "producao",
    mensagem: "Pedido PED-2381 iniciado na moldagem por Ricardo.",
  },
  {
    id: "7",
    hora: "13:22:10",
    tipo: "alerta",
    mensagem:
      "Atenção: Kydex Ranger Green próximo ao limite mínimo (14 folhas restantes).",
  },
  {
    id: "8",
    hora: "13:01:44",
    tipo: "saida",
    mensagem:
      "Retirada de 1 unidade do Rhino Holster IWB G19. Solicitado por: Marcos.",
  },
  {
    id: "9",
    hora: "12:45:00",
    tipo: "entrada",
    mensagem: "Entrada de 500 Ilhós Black Oxide. Fornecedor: HARDWARE TÁTICO.",
  },
  {
    id: "10",
    hora: "12:30:18",
    tipo: "producao",
    mensagem: "Pedido PED-2388 iniciado na moldagem por Jorge.",
  },
  {
    id: "11",
    hora: "11:55:02",
    tipo: "auth",
    mensagem: "Login no sistema: Operador Ricardo.",
  },
  {
    id: "12",
    hora: "11:20:35",
    tipo: "alerta",
    mensagem: "Estoque crítico: Rebite 4mm Latão. Restam apenas 180 unidades.",
  },
];

// === ALERTAS ===
export const alertas = [
  {
    id: 1,
    tipo: "critico",
    mensagem: "KY-BLK-02 abaixo do mínimo — Reposição imediata",
    ref: "KY-BLK-02",
  },
  {
    id: 2,
    tipo: "alerta",
    mensagem: "KY-GRN-02 próximo do mínimo",
    ref: "KY-GRN-02",
  },
  {
    id: 3,
    tipo: "alerta",
    mensagem: "HW-RVT-04 próximo do mínimo",
    ref: "HW-RVT-04",
  },
];
