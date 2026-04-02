### **1\. Introdução**

Gestão empresarial que contempla controle de usuários, Kanban, estoque, produção e relatório.

---

### **2\. Requisitos Funcionais**

#### **2.1 Autenticação e Autorização**

O sistema deve permitir a autenticação de usuários por meio de email e senha, implementando controle de acesso baseado em perfis. As funcionalidades disponíveis devem variar conforme o perfil do usuário. Usuários não autenticados não devem ter acesso ao sistema.

##### **2.1.1 Perfis de Usuário**

O sistema deve possuir três perfis de usuário:

**Administrador (Admin):**  
 Possui acesso total a todas as funcionalidades do sistema. É o único responsável pela criação de usuários, não sendo permitido auto-cadastro. Pode criar, editar, visualizar e remover usuários, além de gerenciar todos os módulos do sistema, incluindo estoque, Kanban, produção e relatórios.

**Gerente:**  
 Pode visualizar todos os módulos do sistema, acompanhar produção e movimentações, interagir com o Kanban conforme permissões operacionais e acessar relatórios, dashboards e históricos. Não possui permissão para editar o estoque.

**Colaborador (Operador):**  
 Possui acesso limitado ao sistema. Pode visualizar e interagir com o Kanban, além de visualizar o estoque. Não pode editar o estoque nem gerenciar usuários.

##### **2.1.2 Cadastro e Gestão de Usuários**

Apenas administradores podem criar usuários, sendo proibido o cadastro público. O administrador deve informar email, senha inicial e perfil (admin, gerente ou colaborador) no momento da criação. O sistema deve permitir login com as credenciais cadastradas, além de possibilitar ao administrador visualizar, ativar, desativar, editar e remover usuários, bem como alterar suas credenciais e permissões.

---

#### **2.2 Gestão de Kanban**

O sistema deve permitir a criação de quadros Kanban, colunas (etapas) e cards. Cada card deve conter informações detalhadas como nome do cliente, número do pedido, nome do revisor, data, tempo de garantia, endereço, número, email, CPF ou CNPJ, descrição do produto e foto enviada pelo cliente.

Deve ser possível movimentar cards entre colunas, registrando histórico de movimentações, incluindo quem realizou a ação e quando.

##### **2.2.1 Filtragem e Prioridade**

O sistema deve permitir filtragem de cards por palavras-chave e prioridade (baixa, média e alta). Cards com data de entrega ultrapassada devem ser marcados como atrasados e exibidos com maior prioridade.

---

#### **2.3 Comentários e Auditoria**

O sistema deve permitir a adição de comentários nos cards, registrando autor e data. Todas as alterações realizadas devem ser registradas, mantendo um histórico completo de edição e movimentação. Exemplo prático: um card está atrasado, o colaborador abre o card e comenta o por que está atrasado, como falta de placas para fazer o coldre.

---

#### **2.4 Controle de Estoque**

O sistema deve permitir o cadastro de produtos, cada um com unidade de medida definida. Deve possibilitar o registro de entradas e saídas de estoque, bem como a definição de estoque mínimo por produto. Quando o estoque estiver abaixo do mínimo, o sistema deve emitir alertas.

O sistema deve suportar diferentes unidades de medida (como gramas, unidades e frações) e permitir regras específicas de medição por produto.

---

#### **2.5 Produção**

O sistema deve permitir o registro da produção, associando-a aos usuários responsáveis. Deve registrar as quantidades produzidas por item e vincular a produção aos produtos cadastrados no estoque.

---

#### 

#### 

### **2.6 Dashboard e Relatórios (Não é certeza \- exemplo do entendido)**

O sistema deve apresentar um dashboard dividido em diferentes visões para facilitar o acompanhamento estratégico e operacional do negócio. O dashboard deve conter quatro áreas principais: **estoque, vendas, produção e visão geral**.

#### **Dashboard de Estoque**

A tela de estoque deve exibir todos os produtos cadastrados no sistema, apresentando:

* Nome do produto  
* Quantidade atual em estoque  
* Quantidade de saídas no mês  
* Quantidade total de saídas acumuladas

Essa visão deve permitir ao usuário entender rapidamente o giro de estoque e identificar produtos com maior movimentação.

---

#### **Dashboard de Vendas**

A tela de vendas deve apresentar informações detalhadas por produto, incluindo:

* Nome do produto  
* Quantidade vendida no mês  
* Valor total de vendas no mês  
* Quantidade total vendida (acumulado)  
* Valor total de vendas (acumulado)

Exemplo:

* Produto: Calça Tática  
* Vendas no mês: 20 unidades  
* Valor no mês: R$ 1.000  
* Total vendido: 120 unidades  
* Valor total: R$ 6.000

Essas informações devem ser exibidas para todos os produtos cadastrados.

Além disso, o sistema deve apresentar:

* Valor total arrecadado no mês (somando todos os produtos)  
* Valor total arrecadado geral  
* Valor total com desconto de custos operacionais (lucro líquido)  
* Valor total sem desconto de custos operacionais (faturamento bruto)

---

#### 

#### **Dashboard de Produção(provavelmente seá apenas de coldre, unica parte inteiramente fabricada la dentro)**

A tela de produção deve apresentar:

* Quantidade produzida por produto no mês  
* Quantidade total produzida por produto  
* Produção por usuário (quem produziu; exemplo jorge produziu 20 coldres esse mês)  
* Histórico de produção

Essa visão deve permitir o acompanhamento da produtividade e desempenho da equipe.

---

#### **Dashboard Geral**

A tela de dashboard geral deve consolidar as principais informações do sistema em uma única visão resumida, incluindo:

* Resumo de estoque (produtos com menor quantidade, alertas de mínimo)  
* Resumo de vendas (faturamento mensal e total)  
* Resumo de produção  
* Indicadores principais (KPIs) do sistema

* ### **Diferencial do Sistema:** Um diferencial é a implementação de uma funcionalidade que permita a **comparação de lucros mensais**, exibindo de forma clara o crescimento ou decrescimento ao longo dos períodos.Essa ideia foi inicialmente sugerida pelos clientes, que buscavam no dashboard uma forma de obter essa visão de desempenho.


O objetivo dessa tela é fornecer uma visão rápida e estratégica do negócio, reunindo dados essenciais de todas as áreas.

---

### **3\. Regras de Negócio**

Os cards atrasados devem possuir prioridade na exibição. Toda alteração em cards deve ser registrada em histórico. O sistema deve gerar alertas quando o estoque estiver abaixo do mínimo. Cada produto deve possuir unidade de medida definida.

O acesso às funcionalidades deve depender do perfil do usuário. Apenas administradores podem gerenciar usuários.

Gerentes não podem editar estoque, enquanto colaboradores possuem acesso limitado ao sistema. Usuários não autenticados não devem ter acesso. Todos os usuários devem ser cadastrados por um administrador, sendo proibido o auto-registro. Cada usuário deve possuir um perfil definido no momento da criação.

---

### **4\. Histórias de Usuário**

As histórias de usuário descrevem as principais interações dos diferentes perfis do sistema, considerando suas permissões e objetivos.

---

#### **Administrador (Admin)**

Como **Administrador**, desejo acessar o sistema com minhas credenciais para ter controle total das funcionalidades, garantindo a gestão completa da operação.

Após o login, o administrador deve:

* Acessar e gerenciar o quadro Kanban, podendo visualizar, criar, editar e mover cards  
* Visualizar e editar o estoque, incluindo cadastro de produtos e movimentações  
* Acessar todos os dashboards (estoque, vendas, produção e geral)  
* Acessar a tela de gestão de usuários

Na gestão de usuários, o administrador deve poder:

* Criar novos usuários  
* Definir e alterar perfis (admin, gerente, colaborador)  
* Editar permissões  
* Ativar, desativar e excluir usuários

O administrador é o único responsável pela criação e gerenciamento de usuários no sistema.

---

#### **Gerente**

Como **Gerente**, desejo acessar o sistema com uma conta criada pelo administrador para acompanhar a operação e tomar decisões com base nos dados disponíveis.

Após o login, o gerente deve:

* Acessar o quadro Kanban para visualizar e interagir com os processos operacionais  
* Visualizar o estoque, sem permissão de edição  
* Acessar dashboards (estoque, vendas, produção e geral) para análise de dados  
* Acompanhar produção e movimentações do sistema

O gerente não deve ter permissão para editar o estoque nem gerenciar usuários.

---

#### **Colaborador (Operador)**

Como **Colaborador**, desejo acessar o sistema com uma conta fornecida pelo administrador para executar minhas atividades operacionais no dia a dia.

Após o login, o colaborador deve:

* Acessar o quadro Kanban  
* Visualizar e interagir com os cards conforme suas tarefas

O colaborador não deve ter acesso ao estoque, dashboards ou gestão de usuários, mantendo seu acesso restrito às funcionalidades operacionais.

