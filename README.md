# QueHoraÉEssa?

Sistema web moderno para conversão automática dos códigos de horários do SIGAA UFBA em horários legíveis, planejamento semestral e visualização de grade horária.

## ✨ Visão Geral

O **QueHoraÉEssa?** facilita a vida do estudante da UFBA ao transformar códigos como `46N12` ou `25M45` em horários reais, permitindo o planejamento do semestre, detecção de conflitos e visualização interativa da grade.

## Criação e Desenvolvimento
- **Criadora e desenvolvedora: Eduarda Almeida
  - [Linkedin](https://www.linkedin.com/in/eduarda-s-almeida)**
- **Iniciativa: IdeaLab.ic**

---

## 🚀 Funcionalidades Principais

### 🔄 Conversão e Visualização
- **Conversão Simples**: Cole o texto de uma disciplina do SIGAA e veja o horário convertido de forma clara.
- **Planejamento Semestral**: Cole todas as disciplinas do semestre, organize, visualize conflitos e monte sua grade personalizada.
- **Grade Horária Visual**: Veja sua grade semanal em um planner colorido, com detecção automática de conflitos.
- **Visualização Flexível**: Alternância entre visualização simples (apenas códigos) e detalhada (códigos + nomes das disciplinas).

### 🔍 Filtros Avançados
- **Filtro por Dias da Semana**: Selecione dias específicos (SEG, TER, QUA, QUI, SEX, SAB) para filtrar disciplinas.
- **Filtro por Horários**: Filtre por horários específicos (07:00, 07:55, 08:50, etc.).
- **Lógica de Filtros**: Configure filtros com lógica "OU" (um dia/horário ou outro) ou "E" (um dia/horário e outro).
- **Busca por Texto**: Pesquise disciplinas por código ou nome.

### 📱 Interface Responsiva
- **Modais Otimizados para Mobile**: Todos os modais (tutorial, filtros, detalhes) adaptados para telas pequenas.
- **Layout Proporcional**: Modais com tamanho adequado e margens laterais em dispositivos móveis.
- **Interação Intuitiva**: Clique fora dos modais para fechá-los automaticamente.
- **Design Adaptativo**: Interface que se ajusta perfeitamente a desktop e mobile.

### 💾 Persistência e Histórico
- **Histórico de Conversões**: Mantém as últimas 10 disciplinas convertidas para reutilização.
- **Persistência Automática**: Suas conversões e grade são salvas automaticamente no navegador.
- **Sincronização**: Dados mantidos entre sessões e páginas.

### ⚠️ Detecção de Conflitos
- **Conflitos Automáticos**: Identifica automaticamente disciplinas com horários sobrepostos.
- **Alertas Visuais**: Conflitos destacados com bordas vermelhas e ícones de alerta.
- **Lista de Conflitos**: Visualização detalhada de todos os conflitos encontrados.

---

## 🖥️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilo**: Tailwind CSS + Shadcn/ui
- **Roteamento**: React Router DOM
- **Validação**: Zod
- **Gerenciamento de Estado**: TanStack Query (mínimo)
- **Persistência**: localStorage

---

## 📋 Como Usar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ic-ufba/que-hora-e-essa.git
   cd que-hora-e-essa
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Rode o projeto:**
   ```bash
   npm run dev
   ```
4. **Acesse no navegador:**
   - http://localhost:5173

---

## 📝 Estrutura das Páginas

### 🏠 Home
- Tutorial visual de coleta de dados do SIGAA
- Links para as principais funções
- Exemplos de uso

### 🔄 Conversão Simples
- Área para colar o texto de uma disciplina e converter rapidamente
- Histórico das últimas conversões
- Visualização da disciplina convertida
- Adição direta à grade horária

### 📅 Planejamento Semestral
- Área para colar todas as disciplinas do semestre
- **Filtros avançados** por dias e horários
- Busca por texto (código ou nome)
- Organização visual das turmas por disciplina
- Detalhes completos de cada turma
- Adição seletiva à grade

### 📊 Grade Horária
- Visualização detalhada da grade semanal
- Detecção automática de conflitos
- Alternância entre visualizações simples/detalhadas
- Remoção de disciplinas
- Cores distintas para cada disciplina

### ❓ FAQ
- Perguntas frequentes e links úteis

---

## 🔍 Como Usar os Filtros

### Filtro por Dias
1. Clique no botão "Filtrar" na seção de turmas organizadas
2. Selecione os dias da semana desejados
3. Escolha a lógica: "OU" (um dia ou outro) ou "E" (um dia e outro)
4. Aplique o filtro

### Filtro por Horários
1. No mesmo modal de filtro, selecione os horários específicos
2. Configure a lógica de horários
3. Combine com filtros de dias se necessário

### Busca por Texto
- Digite no campo de busca para filtrar por código ou nome da disciplina
- Funciona em conjunto com os filtros de dias e horários

---

## 📦 Exemplo de Entrada Esperada

```
MATA01 - GEOMETRIA ANALÍTICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)
```

---

## 🎨 Visual e UX

### Design Responsivo
- Layout adaptativo para desktop e mobile
- Modais otimizados para cada dispositivo
- Navegação intuitiva

### Grade Horária
- Cores distintas para cada disciplina
- Detecção visual de conflitos
- Alternância entre visualizações simples e detalhadas
- Interação por clique para ver detalhes

### Modais Mobile
- Tamanho proporcional à tela
- Margens laterais adequadas
- Scroll controlado para conteúdo extenso
- Fechamento por clique fora do modal

---

## 👨‍💻 Contribuição

Pull requests são bem-vindos! Siga o padrão do projeto e descreva bem suas alterações.

---

## 📄 Licença

MIT. Veja o arquivo LICENSE.

---

## 🔗 Links Úteis

- [SIGAA UFBA](https://sigaa.ufba.br/sigaa/public/home.jsf)
- [Meu Horário UFBA](https://www.meuhorarioufba.com.br/)
- [FAQ do Projeto](https://quehoraeessa.netlify.app/faq)
- [Repositório no GitHub](https://github.com/ic-ufba/que-hora-e-essa.git)
