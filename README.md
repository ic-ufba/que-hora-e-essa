# QueHoraÉEssa?

Sistema web moderno para conversão automática dos códigos de horários do SIGAA UFBA em horários legíveis, planejamento semestral e visualização de grade horária.

## ✨ Visão Geral

O **QueHoraÉEssa?** facilita a vida do estudante da UFBA ao transformar códigos como `46N12` ou `25M45` em horários reais, permitindo o planejamento do semestre, detecção de conflitos e visualização interativa da grade.

---

## 🚀 Funcionalidades Principais

- **Conversão Simples**: Cole o texto de uma disciplina do SIGAA e veja o horário convertido de forma clara.
- **Planejamento Semestral**: Cole todas as disciplinas do semestre, organize, visualize conflitos e monte sua grade personalizada.
- **Grade Horária Visual**: Veja sua grade semanal em um planner colorido, com detecção automática de conflitos.
- **Histórico e Persistência**: Suas conversões e grade são salvas automaticamente no navegador.
- **Exportação**: Pronto para exportação de dados (PDF, Excel, JSON - em breve).
- **Interface Moderna**: UI responsiva, intuitiva e bonita, baseada em React, Tailwind e Shadcn/ui.

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

- **Home**: Tutorial visual de coleta de dados do SIGAA, links para as principais funções.
- **Conversão Simples**: Área para colar o texto de uma disciplina e converter rapidamente.
- **Planejamento Semestral**: Área para colar todas as disciplinas, buscar, filtrar e montar a grade.
- **Grade Horária**: Visualização detalhada da grade semanal, com conflitos destacados.
- **FAQ**: Perguntas frequentes e links úteis.

---

## 📦 Exemplo de Entrada Esperada

```
MATA01 - GEOMETRIA ANALÍTICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)
```

---

## 🎨 Visual

- Layout responsivo, com grade semanal colorida
- Detecção de conflitos de horário (alerta com ícone)
- Modal de tutorial e exemplos visuais
- Rodapé institucional com links úteis

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
- [FAQ do Projeto](/faq)
- [Repositório no GitHub](https://github.com/ic-ufba/que-hora-e-essa.git)
