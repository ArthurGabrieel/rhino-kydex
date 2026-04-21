// RHINO KYDEX — Mock Data Layer
// Source: Planilha real "VENDAS FEVEREIRO - 2026.xlsx" (236 pedidos, fev/2026)
import type { Pedido, KanbanStatus } from "@/components/kanban/types";
import type { ItemEstoque, LogEntry } from "@/components/estoque/types";

export type { Pedido, KanbanStatus, ItemEstoque, LogEntry };

// === OPERADORES (vendedores reais da planilha) ===
export const operadores = [
  {
    id: 1,
    nome: "Jucimar",
    sobrenome: "Nascimento",
    sigla: "JU",
    nivel: "Sênior",
    avatar: "JU",
    coldres: 82,
    eficiencia: 94,
  },
  {
    id: 2,
    nome: "Guilherme",
    sobrenome: "Andrade",
    sigla: "GUI",
    nivel: "Sênior",
    avatar: "GU",
    coldres: 71,
    eficiencia: 91,
  },
  {
    id: 3,
    nome: "Bianca",
    sobrenome: "Santos",
    sigla: "BIA",
    nivel: "Pleno",
    avatar: "BI",
    coldres: 60,
    eficiencia: 87,
  },
  {
    id: 4,
    nome: "Paloma",
    sobrenome: "Ferreira",
    sigla: "PA",
    nivel: "Pleno",
    avatar: "PA",
    coldres: 38,
    eficiencia: 82,
  },
];

export const operadorAtivo = operadores[0];

// === KPIs DASHBOARD (baseados nos dados reais de fevereiro/2026) ===
// 236 pedidos únicos | 311 coldres | receita R$ 166.656,89 | ticket médio R$ 734
export const kpis = {
  pedidosMes: 236,
  metaMensal: 280,
  pedidosMesAnterior: 198,
  itensEmProducao: 47,
  alertasAtivos: 3,
  receitaMes: 166656,
  receitaMesAnterior: 138200,
  tempoMedioProducao: "1h 52min",
};

// === METAS — por pessoa e por equipe (baseadas nos dados reais de fev/2026) ===
// Fevereiro teve 20 dias úteis. Distribuição real: JU=82, GUI=71, BIA=60, PA=38 coldres
// Meta mensal individual proporcional à capacidade de cada operador
// Meta diária = metaMensal / 20 dias úteis

export const metasPorPessoa = [
  {
    operadorId: 1, // JU — Jucimar
    nome: "Jucimar",
    sigla: "JU",
    avatar: "JU",
    nivel: "Sênior",
    // Metas
    metaMensal: 120, // coldres/mês
    metaDiaria: 6, // coldres/dia (120 ÷ 20)
    // Realizado fev/2026
    realizadoMes: 82,
    realizadoHoje: 5,
    // Receita gerada (ticket médio ~R$ 734)
    receitaMes: 60188,
    receitaHoje: 3670,
    // Tendência última semana (coldres/dia)
    tendenciaSemana: [5, 6, 7, 4, 6, 5, 0],
  },
  {
    operadorId: 2, // GUI — Guilherme
    nome: "Guilherme",
    sigla: "GUI",
    avatar: "GU",
    nivel: "Sênior",
    metaMensal: 100,
    metaDiaria: 5,
    realizadoMes: 71,
    realizadoHoje: 4,
    receitaMes: 52114,
    receitaHoje: 2936,
    tendenciaSemana: [4, 5, 3, 5, 4, 4, 0],
  },
  {
    operadorId: 3, // BIA — Bianca
    nome: "Bianca",
    sigla: "BIA",
    avatar: "BI",
    nivel: "Pleno",
    metaMensal: 80,
    metaDiaria: 4,
    realizadoMes: 60,
    realizadoHoje: 3,
    receitaMes: 44040,
    receitaHoje: 2202,
    tendenciaSemana: [3, 4, 4, 3, 3, 4, 0],
  },
  {
    operadorId: 4, // PA — Paloma
    nome: "Paloma",
    sigla: "PA",
    avatar: "PA",
    nivel: "Pleno",
    metaMensal: 60,
    metaDiaria: 3,
    realizadoMes: 38,
    realizadoHoje: 2,
    receitaMes: 27894,
    receitaHoje: 1468,
    tendenciaSemana: [2, 3, 2, 3, 2, 3, 0],
  },
];

// Meta da equipe toda (soma das metas individuais = 360 total, meta mensal = 280 coldres)
export const metasEquipe = {
  metaMensal: 280, // meta total do mês
  metaDiaria: 18, // meta total/dia (approx. 280 ÷ 20 dias – arredondado para operação)
  realizadoMes: 251, // soma real: 82 + 71 + 60 + 38
  realizadoHoje: 14, // coldres já produzidos hoje (soma dos operadores)
  receitaMes: 166656, // real da planilha
  receitaHoje: 10276, // estimativa do dia atual
  // Comparativo por dia da última semana (equipe completa)
  tendenciaSemana: [
    { label: "Seg", realizado: 14, meta: 18 },
    { label: "Ter", realizado: 18, meta: 18 },
    { label: "Qua", realizado: 16, meta: 18 },
    { label: "Qui", realizado: 15, meta: 18 },
    { label: "Sex", realizado: 15, meta: 18 },
    { label: "Sáb", realizado: 16, meta: 18 },
    { label: "Hoje", realizado: 14, meta: 18 },
  ],
};

// === LEAD FLOW (Demanda vs. Produzido vs. Capacidade) ===
// 7D → últimos 7 dias
export const leadFlow7d = [
  { label: "Seg", recebidos: 12, expedidos: 10, capacidade: 15 },
  { label: "Ter", recebidos: 18, expedidos: 15, capacidade: 18 },
  { label: "Qua", recebidos: 14, expedidos: 16, capacidade: 18 },
  { label: "Qui", recebidos: 22, expedidos: 18, capacidade: 20 },
  { label: "Sex", recebidos: 20, expedidos: 19, capacidade: 20 },
  { label: "Sáb", recebidos: 10, expedidos: 12, capacidade: 15 },
  { label: "Dom", recebidos: 5, expedidos: 4, capacidade: 10 },
];

// 30D → semanal
export const leadFlow30d = [
  { label: "Sem 01", recebidos: 58, expedidos: 52, capacidade: 60 },
  { label: "Sem 02", recebidos: 65, expedidos: 58, capacidade: 65 },
  { label: "Sem 03", recebidos: 72, expedidos: 60, capacidade: 65 }, // Gargalo
  { label: "Sem 04", recebidos: 81, expedidos: 68, capacidade: 70 }, // Gargalo
];

// 90D → quinzenal
export const leadFlow90d = [
  { label: "Jan/1", recebidos: 110, expedidos: 105, capacidade: 120 },
  { label: "Jan/2", recebidos: 115, expedidos: 112, capacidade: 120 },
  { label: "Fev/1", recebidos: 123, expedidos: 110, capacidade: 125 },
  { label: "Fev/2", recebidos: 153, expedidos: 128, capacidade: 135 }, // Gargalo
  { label: "Mar/1", recebidos: 160, expedidos: 140, capacidade: 145 }, // Gargalo
  { label: "Mar/2", recebidos: 165, expedidos: 152, capacidade: 150 },
];

// YTD → mensal
export const leadFlowYtd = [
  { label: "Jan", recebidos: 225, expedidos: 217, capacidade: 240 },
  { label: "Fev", recebidos: 276, expedidos: 238, capacidade: 260 }, // Gargalo
  { label: "Mar", recebidos: 325, expedidos: 292, capacidade: 295 }, // Gargalo
  { label: "Abr", recebidos: 310, expedidos: 300, capacidade: 320 },
  { label: "Mai", recebidos: 335, expedidos: 320, capacidade: 340 },
  { label: "Jun", recebidos: 350, expedidos: 345, capacidade: 360 },
  { label: "Jul", recebidos: 365, expedidos: 358, capacidade: 380 },
  { label: "Ago", recebidos: 355, expedidos: 340, capacidade: 380 },
  { label: "Set", recebidos: 380, expedidos: 375, capacidade: 400 },
  { label: "Out", recebidos: 405, expedidos: 390, capacidade: 420 },
  { label: "Nov", recebidos: 395, expedidos: 385, capacidade: 420 },
  { label: "Dez", recebidos: 420, expedidos: 410, capacidade: 440 },
];

// === SLA (Tempo de ciclo por fase produtivo) ===
export const slaData = [
  { label: "Preparação", tempoMedio: 2.1, meta: 3.0 },
  { label: "Moldagem", tempoMedio: 4.5, meta: 5.0 },
  { label: "Acabamento", tempoMedio: 14.8, meta: 8.0 }, // Gargalo Crítico!
  { label: "Faturamento", tempoMedio: 1.2, meta: 2.0 },
];

// Compat: mantido para imports existentes (apenas tipagem antiga de vendas, que deixava a compilação feliz)
export const vendasSemanais = leadFlow30d.map((d) => ({
  semana: d.label,
  moldagem: d.expedidos,
  acabamento: d.expedidos,
  expedido: d.expedidos,
}));

// === KANBAN — PEDIDOS REAIS (extraídos da planilha fev/2026) ===
// Modelos reais: TRADICIONAL (79), COLDRE NEW (48), SLIM (36), TRAD.LANTERNA (20), RAPTOR.LANTERNA (13)
// Armas mais vendidas: G19 (28), GX4 CARRY (15), APX (9), G3 TORO (8), G25 (7)
// Vendedores: JU (Jucimar), GUI (Guilherme), BIA (Bianca), PALOMA

const OPERADOR_MAP: Record<string, string> = {
  JU: "Jucimar",
  GUI: "Guilherme",
  BIA: "Bianca",
  PALOMA: "Paloma",
  BIANCA: "Bianca",
};

const pedidosBase: Pedido[] = [
  // === ABERTO — pedidos recém-chegados aguardando alocação ===
  {
    id: "P-0241",
    ref: "PED-241",
    cliente: "Willian de Oliveira Gimenes",
    modelo: "TRADICIONAL",
    arma: "MD1",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "aberto",
    hora: "08:12",
    operador: OPERADOR_MAP["JU"],
  },
  {
    id: "P-0242",
    ref: "PED-242",
    cliente: "PEDRO PAPA YUNES",
    modelo: "RAPTOR. LANTERNA",
    arma: "CZ P10C C/ BALDR S",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "aberto",
    hora: "08:45",
    operador: OPERADOR_MAP["PALOMA"],
  },
  {
    id: "P-0243",
    ref: "PED-243",
    cliente: "Antejufran Lima De Sousa",
    modelo: "TRAD.02 CLIP",
    arma: "TS9",
    cor: "Preto Fosco",
    prioridade: "media",
    status: "aberto",
    hora: "09:20",
    operador: OPERADOR_MAP["GUI"],
  },
  {
    id: "P-0244",
    ref: "PED-244",
    cliente: "REGINALDO DE JESUS DOS SANTOS",
    modelo: "MINI",
    arma: "G2C",
    cor: "Preto Fosco",
    prioridade: "normal",
    status: "aberto",
    hora: "10:05",
    operador: OPERADOR_MAP["PALOMA"],
  },

  // === PREPARAÇÃO — material separado, aguardando moldagem ===
  {
    id: "P-0228",
    ref: "PED-228",
    cliente: "JANDERLON BALBOA MARTINS CUNHA",
    modelo: "TRADICIONAL",
    arma: "938",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "preparacao",
    hora: "07:30",
    operador: OPERADOR_MAP["BIA"],
  },
  {
    id: "P-0229",
    ref: "PED-229",
    cliente: "Anderson de Sousa Barbosa",
    modelo: "TRADICIONAL",
    arma: "G19",
    cor: "Preto Fosco",
    prioridade: "media",
    status: "preparacao",
    hora: "07:55",
    operador: OPERADOR_MAP["JU"],
  },
  {
    id: "P-0230",
    ref: "PED-230",
    cliente: "Élcio Corrêa",
    modelo: "SLIM",
    arma: "MD2",
    cor: "Flat Dark Earth",
    prioridade: "normal",
    status: "preparacao",
    hora: "08:10",
    operador: OPERADOR_MAP["JU"],
  },

  // === MOLDAGEM — em prensa/vácuo ===
  {
    id: "P-0215",
    ref: "PED-215",
    cliente: "José Carlos Dias de Souza Junior",
    modelo: "TRADICIONAL",
    arma: "G19",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "moldagem",
    hora: "06:45",
    operador: OPERADOR_MAP["JU"],
  },
  {
    id: "P-0216",
    ref: "PED-216",
    cliente: "Gabriel Galvão Sarzedas",
    modelo: "RAPTOR. LANTERNA",
    arma: "G19 C/ GM23",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "moldagem",
    hora: "07:00",
    operador: OPERADOR_MAP["GUI"],
  },
  {
    id: "P-0217",
    ref: "PED-217",
    cliente: "Maicon pereira",
    modelo: "SLIM",
    arma: "TH40",
    cor: "Flat Dark Earth",
    prioridade: "media",
    status: "moldagem",
    hora: "07:18",
    operador: OPERADOR_MAP["JU"],
  },
  {
    id: "P-0218",
    ref: "PED-218",
    cliente: "Leonardo Silva de Menezes",
    modelo: "SLIM",
    arma: "P320",
    cor: "Preto Fosco",
    prioridade: "normal",
    status: "moldagem",
    hora: "07:35",
    operador: OPERADOR_MAP["JU"],
  },

  // === ACABAMENTO — rebarbação, furação, verniz ===
  {
    id: "P-0200",
    ref: "PED-200",
    cliente: "Carlos Eduardo Lima de Paiva",
    modelo: "SLIM",
    arma: "GX4",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "acabamento",
    hora: "05:50",
    operador: OPERADOR_MAP["JU"],
  },
  {
    id: "P-0201",
    ref: "PED-201",
    cliente: "Davi Rebello Brito",
    modelo: "TRADICIONAL",
    arma: "GX4 XL",
    cor: "Coyote",
    prioridade: "media",
    status: "acabamento",
    hora: "06:10",
    operador: OPERADOR_MAP["BIA"],
  },
  {
    id: "P-0202",
    ref: "PED-202",
    cliente: "GUILHERME SILVA",
    modelo: "TRAD.LANTERNA",
    arma: "G17",
    cor: "Preto Fosco",
    prioridade: "alta",
    status: "acabamento",
    hora: "06:25",
    operador: OPERADOR_MAP["BIA"],
  },

  // === FATURAMENTO — pronto, aguardando emissão NF-e no Bling ===
  {
    id: "P-0185",
    ref: "PED-185",
    cliente: "JOÃO VICTOR MENEZES MARTINS",
    modelo: "TRADICIONAL",
    arma: "G2C",
    cor: "Preto Fosco",
    prioridade: "normal",
    status: "faturamento",
    hora: "Pronto 09:30",
    operador: OPERADOR_MAP["BIA"],
    nfEmitida: false,
  },
  {
    id: "P-0186",
    ref: "PED-186",
    cliente: "Daniel Morais Alves",
    modelo: "COLDRE NEW",
    arma: "CZ P10C",
    cor: "Preto Fosco",
    prioridade: "media",
    status: "faturamento",
    hora: "Pronto 10:15",
    operador: OPERADOR_MAP["PALOMA"],
    nfEmitida: false,
  },
  // === EXPEDIDO — NF emitida, saiu para transportadora ===
  {
    id: "P-0187",
    ref: "PED-187",
    cliente: "José Luis Siscato",
    modelo: "COLDRE NEW",
    arma: "G17",
    cor: "Flat Dark Earth",
    prioridade: "alta",
    status: "expedido",
    hora: "Expedido 10:45",
    operador: OPERADOR_MAP["BIA"],
    nfEmitida: true,
    nfNumero: "NF-000341",
  },
];

// Dados complementares por pedido (endereço, email, etc.)
const EXTRA_DATA: Record<
  string,
  {
    uf: string;
    tipoEntrega: string;
    pagamento: string;
    total: number;
    policial: boolean;
  }
> = {
  "P-0241": {
    uf: "SP",
    tipoEntrega: "PAC",
    pagamento: "PIX",
    total: 739,
    policial: false,
  },
  "P-0242": {
    uf: "SP",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 1189,
    policial: false,
  },
  "P-0243": {
    uf: "MG",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 450,
    policial: false,
  },
  "P-0244": {
    uf: "SP",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 305,
    policial: false,
  },
  "P-0228": {
    uf: "AM",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 630,
    policial: false,
  },
  "P-0229": {
    uf: "DF",
    tipoEntrega: "RETIRADA",
    pagamento: "PIX",
    total: 270,
    policial: false,
  },
  "P-0230": {
    uf: "SP",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 379,
    policial: false,
  },
  "P-0215": {
    uf: "DF",
    tipoEntrega: "RETIRADA",
    pagamento: "PIX",
    total: 270,
    policial: false,
  },
  "P-0216": {
    uf: "DF",
    tipoEntrega: "RETIRADA",
    pagamento: "CREDITO",
    total: 783,
    policial: false,
  },
  "P-0217": {
    uf: "BA",
    tipoEntrega: "PAC",
    pagamento: "PIX",
    total: 379,
    policial: false,
  },
  "P-0218": {
    uf: "RS",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 479,
    policial: false,
  },
  "P-0200": {
    uf: "GO",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 1074,
    policial: false,
  },
  "P-0201": {
    uf: "GO",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 630,
    policial: false,
  },
  "P-0202": {
    uf: "SP",
    tipoEntrega: "PAC",
    pagamento: "PIX",
    total: 879,
    policial: false,
  },
  "P-0185": {
    uf: "DF",
    tipoEntrega: "PAC",
    pagamento: "PIX",
    total: 460,
    policial: false,
  },
  "P-0186": {
    uf: "SP",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 470,
    policial: false,
  },
  "P-0187": {
    uf: "PA",
    tipoEntrega: "PAC",
    pagamento: "CREDITO",
    total: 1029,
    policial: false,
  },
};

function toMockEmail(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
}

// Datas de entrega prevista escalonadas (pedidos mais antigos → mais urgentes)
const VENCIMENTOS = [
  "2026-02-28",
  "2026-03-02",
  "2026-03-05",
  "2026-03-07",
  "2026-03-03",
  "2026-03-04",
  "2026-03-06",
  "2026-02-25",
  "2026-02-26",
  "2026-02-27",
  "2026-02-28",
  "2026-02-20",
  "2026-02-21",
  "2026-02-22",
  "2026-02-10",
  "2026-02-12",
  "2026-02-14",
];

export const pedidos: Pedido[] = pedidosBase.map((pedido, index) => {
  const extra = EXTRA_DATA[pedido.id] ?? {
    uf: "DF",
    tipoEntrega: "PAC",
    pagamento: "PIX",
    total: 500,
    policial: false,
  };

  const emailBase = toMockEmail(pedido.cliente);
  const numPedido = parseInt(pedido.id.replace("P-0", ""), 10);
  const horaInicial =
    pedido.hora.startsWith("Pronto") || pedido.hora.startsWith("Expedido")
      ? "09:00"
      : pedido.hora;

  return {
    ...pedido,
    valor: extra.total,
    revisor: index % 2 === 0 ? "Ana Carla" : "Fernando",
    tempoGarantia: "12 meses",
    endereco: `${extra.tipoEntrega === "RETIRADA" ? "Loja Rhino – SIG QL 6 Lt 785 Lj 01" : `Rua dos Expedicionários, ${100 + numPedido}`}`,
    numero: String(numPedido),
    email: `${emailBase || "cliente"}@gmail.com`,
    documento: `CPF ${String(100 + numPedido * 7).padStart(3, "0")}.${String(400 + numPedido).padStart(3, "0")}.${String(600 + numPedido).padStart(3, "0")}-${String(10 + (numPedido % 90)).padStart(2, "0")}`,
    descricaoProduto: `Coldre ${pedido.modelo} para ${pedido.arma} – acabamento ${pedido.cor}. Ref: ${pedido.ref}. Entrega: ${extra.tipoEntrega} / ${extra.uf}.`,
    foto: "/assets/mock_holster.png",
    dataVencimento: VENCIMENTOS[index] ?? "2026-03-10",
    logs: [
      {
        id: `SYS-INIT-${pedido.id}`,
        tipo: "sistema" as const,
        autor: "Sistema",
        texto: `Pedido ${pedido.ref} registrado. Valor: R$ ${extra.total.toLocaleString("pt-BR")}. Pagamento: ${extra.pagamento}.`,
        hora: horaInicial,
      },
    ],
  };
});

// === ESTOQUE (materiais reais que a Rhino usa) ===
export const estoque: ItemEstoque[] = [
  {
    id: "1",
    ref: "KY-BLK-20",
    nome: "Kydex Sheet 2mm — Preto Fosco",
    categoria: "material",
    quantidade: 14,
    unidade: "FLS",
    minimo: 30,
    localizacao: "A-01",
    status: "critico",
  },
  {
    id: "2",
    ref: "KY-FDE-20",
    nome: "Kydex Sheet 2mm — Flat Dark Earth",
    categoria: "material",
    quantidade: 52,
    unidade: "FLS",
    minimo: 20,
    localizacao: "A-02",
    status: "ok",
  },
  {
    id: "3",
    ref: "KY-COY-20",
    nome: "Kydex Sheet 2mm — Coyote Brown",
    categoria: "material",
    quantidade: 28,
    unidade: "FLS",
    minimo: 15,
    localizacao: "A-03",
    status: "ok",
  },
  {
    id: "4",
    ref: "KY-COL-20",
    nome: "Kydex Sheet 2mm — Colorido (Camuflado)",
    categoria: "material",
    quantidade: 18,
    unidade: "FLS",
    minimo: 15,
    localizacao: "A-04",
    status: "alerta",
  },
  {
    id: "5",
    ref: "HW-CHI-025",
    nome: 'Parafuso Chicago 1/4" Preto',
    categoria: "hardware",
    quantidade: 3200,
    unidade: "UN",
    minimo: 500,
    localizacao: "B-01",
    status: "ok",
  },
  {
    id: "6",
    ref: "HW-ILH-88",
    nome: "Ilhós #88 Black Oxide",
    categoria: "hardware",
    quantidade: 1850,
    unidade: "UN",
    minimo: 300,
    localizacao: "B-02",
    status: "ok",
  },
  {
    id: "7",
    ref: "HW-CLIP-K",
    nome: "Clip Kydex — Preto",
    categoria: "hardware",
    quantidade: 240,
    unidade: "UN",
    minimo: 100,
    localizacao: "B-03",
    status: "ok",
  },
  {
    id: "8",
    ref: "HW-CLIP-DUPLO",
    nome: "Clip Duplo Kydex — Preto",
    categoria: "hardware",
    quantidade: 85,
    unidade: "UN",
    minimo: 80,
    localizacao: "B-04",
    status: "alerta",
  },
  {
    id: "9",
    ref: "LUZ-BALDR-S",
    nome: "Lanterna BALDR S (compatível G17/G19)",
    categoria: "material",
    quantidade: 12,
    unidade: "UN",
    minimo: 10,
    localizacao: "C-01",
    status: "ok",
  },
  {
    id: "10",
    ref: "LUZ-GM23",
    nome: "Lanterna Rhino GM23",
    categoria: "material",
    quantidade: 8,
    unidade: "UN",
    minimo: 10,
    localizacao: "C-02",
    status: "alerta",
  },
  {
    id: "11",
    ref: "FIN-TRAD-G19",
    nome: "Coldre TRADICIONAL — Glock G19 (estoque pronto)",
    categoria: "produto_final",
    quantidade: 6,
    unidade: "UN",
    minimo: 5,
    localizacao: "D-01",
    status: "ok",
  },
  {
    id: "12",
    ref: "FIN-SLIM-GX4",
    nome: "Coldre SLIM — Taurus GX4 Carry (estoque pronto)",
    categoria: "produto_final",
    quantidade: 4,
    unidade: "UN",
    minimo: 3,
    localizacao: "D-02",
    status: "ok",
  },
  {
    id: "13",
    ref: "FIN-NEW-APX",
    nome: "Coldre NEW — Beretta APX (estoque pronto)",
    categoria: "produto_final",
    quantidade: 2,
    unidade: "UN",
    minimo: 3,
    localizacao: "D-03",
    status: "alerta",
  },
];

// === LOG DE ATIVIDADES (baseado nos pedidos reais) ===
export const logAtividades: LogEntry[] = [
  {
    id: "1",
    hora: "10:45:00",
    tipo: "producao",
    mensagem:
      "Pedido PED-187 (G17 Coldre NEW) concluído → Expedição. Op: Bianca.",
  },
  {
    id: "2",
    hora: "10:20:18",
    tipo: "saida",
    mensagem:
      "Coldre NEW G17 — 1 un. retirada do estoque D-01. Solicitado por: Bianca.",
  },
  {
    id: "3",
    hora: "10:15:00",
    tipo: "producao",
    mensagem:
      "Pedido PED-186 (CZ P10C Coldre NEW) concluído → Expedição. Op: Paloma.",
  },
  {
    id: "4",
    hora: "09:55:42",
    tipo: "alerta",
    mensagem:
      "Estoque crítico: Kydex Preto Fosco — apenas 14 folhas. Mínimo: 30.",
  },
  {
    id: "5",
    hora: "09:30:00",
    tipo: "producao",
    mensagem:
      "Pedido PED-185 (G2C Tradicional) concluído → Expedição. Op: Bianca.",
  },
  {
    id: "6",
    hora: "09:10:11",
    tipo: "entrada",
    mensagem:
      "Entrada de 500 Clips Duplos Kydex. Fornecedor: TACTIC DISTRIBUIDORA.",
  },
  {
    id: "7",
    hora: "08:45:00",
    tipo: "auth",
    mensagem: "Login no sistema: Operador Jucimar.",
  },
  {
    id: "8",
    hora: "08:30:20",
    tipo: "producao",
    mensagem: "Pedido PED-200 (GX4 Slim) iniciado no acabamento por Jucimar.",
  },
  {
    id: "9",
    hora: "08:10:05",
    tipo: "producao",
    mensagem:
      "Pedido PED-215 (G19 Tradicional) iniciado na moldagem por Jucimar.",
  },
  {
    id: "10",
    hora: "08:00:00",
    tipo: "auth",
    mensagem: "Login no sistema: Operador Guilherme.",
  },
  {
    id: "11",
    hora: "07:45:30",
    tipo: "alerta",
    mensagem:
      "Lanterna Rhino GM23 abaixo do mínimo — 8 unidades restantes (mín: 10).",
  },
  {
    id: "12",
    hora: "07:30:00",
    tipo: "entrada",
    mensagem:
      'Lote de 2.000 Parafusos Chicago 1/4" recebido. Fornecedor: FIX TÁTICO.',
  },
];

// === ALERTAS ===
export const alertas = [
  {
    id: 1,
    tipo: "critico",
    mensagem: "Estoque Baixo: Kydex Preto",
    subtexto: "Restam apenas 14 folhas. Reposição recomendada.",
    ref: "KY-BLK-20",
  },
  {
    id: 2,
    tipo: "gargalo",
    mensagem: "Lentidão no Acabamento",
    subtexto: "Tempo de produção está 40% acima da média normal hoje.",
    ref: "Setor A",
  },
  {
    id: 3,
    tipo: "alerta",
    mensagem: "Entrega de Material Atrasada",
    subtexto: "Fornecedor de lanternas não entregou o pedido de ontem.",
    ref: "LUZ-GM23",
  },
];
