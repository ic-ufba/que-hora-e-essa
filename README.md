# QueHoraÉEssa?

Sistema web moderno para conversão automática dos códigos de horários do SIGAA UFBA em horários legíveis, planejamento semestral e visualização de grade horária.

## ✨ Visão Geral

O **QueHoraÉEssa?** facilita a vida do estudante da UFBA ao transformar códigos como `46N12` ou `25M45` em horários reais, permitindo o planejamento do semestre, detecção de conflitos e visualização interativa da grade.

## 🏢 Sobre o Projeto
- **Iniciativa**: IdeaLab.ic - Laboratório de Ideias do Instituto de Computação da UFBA
- **Criadora e Desenvolvedora**: Eduarda Almeida
- **LinkedIn**: [Eduarda Almeida](https://www.linkedin.com/in/eduarda-s-almeida)
- **Status**: Projeto ativo e em desenvolvimento

---

## 🚀 Funcionalidades Principais

### 📋 Conversão e Planejamento
- **Conversão Individual**: Converta uma disciplina específica do SIGAA em horários legíveis e organizados
- **Planejamento Completo**: Organize todas as disciplinas do semestre e visualize conflitos
- **Grade Horária Visual**: Visualize sua grade semanal em um planner colorido e interativo
- **Histórico de Conversões**: Mantém as últimas 10 disciplinas convertidas para reutilização
- **Histórico de Cursos**: Acesse rapidamente cursos consultados anteriormente na conversão completa
- **Salvamento de Grades**: Salve e carregue suas grades personalizadas com nomes customizados

### 🔍 Sistema de Filtros Avançados
- **Filtro por Dias da Semana**: Selecione dias específicos (SEG, TER, QUA, QUI, SEX, SAB)
- **Filtro por Horários**: Filtre por horários específicos (07:00, 07:55, 08:50, etc.)
- **Restrições de Dias**: Exclua dias que você não quer ter aulas
- **Restrições de Horários**: Exclua horários que você não quer ter aulas
- **Lógica Flexível**: Configure filtros com lógica "OU" (um dia/horário ou outro) ou "E" (um dia/horário e outro)
- **Busca por Texto**: Pesquise disciplinas por código ou nome

### 📱 Interface Responsiva e Moderna
- **Design Adaptativo**: Interface que se ajusta perfeitamente a desktop e mobile
- **Modais Otimizados**: Todos os modais (tutorial, filtros, detalhes) adaptados para cada dispositivo
- **Navegação Intuitiva**: Sistema de navegação simplificado e eficiente
- **Visualização Flexível**: Alternância entre visualização simples (apenas códigos) e detalhada

### ⚠️ Detecção de Conflitos
- **Conflitos Automáticos**: Identifica automaticamente disciplinas com horários sobrepostos
- **Alertas Visuais**: Conflitos destacados com bordas vermelhas e ícones de alerta
- **Lista de Conflitos**: Visualização detalhada de todos os conflitos encontrados

### 📅 Exportação para Calendário
- **Compatibilidade Total**: Exportação para Google Calendar, Outlook e outros calendários
- **Formato iCalendar (.ics)**: Arquivo padrão compatível com todos os calendários digitais
- **Eventos Recorrentes**: Configuração automática de repetição semanal
- **Informações Completas**: Inclui código da disciplina, nome, professor e horários

### 💾 Persistência e Sincronização
- **Persistência Automática**: Suas conversões e grade são salvas automaticamente no navegador
- **Sincronização**: Dados mantidos entre sessões e páginas
- **Histórico Persistente**: Conversões anteriores sempre disponíveis
- **Histórico de Cursos**: Cursos consultados são salvos para acesso rápido
- **Grades Personalizadas**: Salve múltiplas versões da sua grade com nomes customizados

---

## 🖥️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilo**: Tailwind CSS + Shadcn/ui
- **Roteamento**: React Router DOM
- **Validação**: Zod
- **Gerenciamento de Estado**: React Hooks (useState, useEffect)
- **Persistência**: localStorage
- **Ícones**: Lucide React
- **Componentes UI**: Shadcn/ui

---

## 📋 Como Usar

### 🚀 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ic-ufba/que-hora-e-essa.git
   cd que-hora-e-essa
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   - http://localhost:5173

### 📖 Como Coletar Dados do SIGAA

1. Acesse o [SIGAA UFBA](https://sigaa.ufba.br/sigaa/public/home.jsf)
2. Navegue até **Graduação > Cursos**
3. Selecione seu curso
4. Vá em **Ensino > Turmas**
5. Busque pelo período ou código da disciplina
6. Copie todo o bloco de informações da disciplina

### 📝 Formato de Entrada Esperado

```
MATA01 - GEOMETRIA ANALÍTICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)
```

---

## 📱 Estrutura das Páginas

### 🏠 Página Inicial
- **Apresentação do Sistema**: Descrição das funcionalidades principais
- **Botões de Ação**: Acesso direto ao planejamento e tutorial
- **Recursos Destacados**: Conversão individual e conversão completa

### 📅 Página de Planejamento
- **Conversão Individual**: Converta uma disciplina específica
  - Formato esperado com exemplo
  - Histórico de conversões
  - Visualização da disciplina convertida
  - Adição à grade

- **Conversão Completa**: Organize todo o semestre
  - Conversão de múltiplas disciplinas
  - Filtros avançados por dia e horário
  - Busca por texto
  - Organização visual das turmas
  - Detalhes completos de cada turma

### 📊 Página de Grade Horária
- **Visualização Completa**: Grade semanal com todos os detalhes
- **Detecção de Conflitos**: Alertas visuais para horários sobrepostos
- **Exportação**: Botão para exportar para calendários digitais
- **Gerenciamento**: Remoção de disciplinas e limpeza da grade
- **Salvamento de Grades**: Salve a grade atual com um nome personalizado
- **Histórico de Grades**: Acesse e carregue grades salvas anteriormente

### ❓ Página de Perguntas Frequentes
- **FAQ Completo**: Respostas para dúvidas comuns
- **Links Úteis**: Contato e recursos adicionais
- **Navegação**: Botão para voltar à página inicial

### 📞 Página de Contato
- **Informações de Contato**: Email e formulário
- **Canais de Comunicação**: Múltiplas formas de contato
- **Navegação**: Botão para voltar à página inicial

---

## 🔍 Como Usar os Filtros

### Filtro Inclusivo (Dias/Horários que você QUER)
1. Clique no botão "Filtrar" na seção de turmas organizadas
2. Selecione os dias da semana desejados
3. Selecione os horários específicos
4. Escolha a lógica: "OU" (um dia/horário ou outro) ou "E" (um dia/horário e outro)
5. Aplique o filtro

### Filtro Exclusivo (Restrições - Dias/Horários que você NÃO quer)
1. No mesmo modal de filtro, vá para a seção "Restrições"
2. Selecione os dias que você não quer ter aulas
3. Selecione os horários que você não quer ter aulas
4. Configure a lógica de restrições
5. Aplique o filtro

### Busca por Texto
- Digite no campo de busca para filtrar por código ou nome da disciplina
- Funciona em conjunto com todos os outros filtros

### Histórico de Cursos
- Após converter um curso completo, ele é automaticamente salvo no histórico
- Clique em qualquer curso do histórico para carregá-lo novamente
- Use o botão "Limpar Histórico" para remover todos os cursos salvos

### Salvamento de Grades
- Na página de Grade Horária, clique em "Salvar Grade" para salvar a grade atual
- Digite um nome personalizado para identificar a grade
- Use o botão "Histórico" para ver todas as grades salvas
- Clique em "Carregar" para restaurar uma grade específica
- Use o botão de lixeira para remover grades do histórico

---

## 📅 Exportação para Calendário

### Funcionalidades
- **Compatibilidade Total**: Funciona com Google Calendar, Outlook, Apple Calendar e outros
- **Eventos Recorrentes**: Configuração automática de repetição semanal
- **Informações Completas**: Código da disciplina, nome, professor e horários
- **Fuso Horário**: Configurado para America/Bahia (horário de Brasília)

### Como Exportar
1. Acesse a página de Grade Horária
2. Adicione disciplinas à sua grade
3. Clique em "Exportar para Calendário"
4. O arquivo .ics será baixado automaticamente
5. Importe o arquivo no seu calendário preferido

---

## 🎨 Design e Experiência do Usuário

### Interface Responsiva
- **Desktop**: Layout otimizado para telas grandes
- **Mobile**: Interface adaptada para dispositivos móveis
- **Tablet**: Experiência intermediária otimizada

### Grade Horária
- **Cores Distintas**: Cada disciplina tem uma cor única
- **Detecção Visual**: Conflitos destacados automaticamente
- **Interação**: Clique para ver detalhes da disciplina
- **Flexibilidade**: Alternância entre visualizações simples e detalhadas

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/ColabDEV`)
3. Commit suas mudanças (`git commit -m 'Add some Colaboração DEV'`)
4. Push para a branch (`git push origin feature/ColabDEV`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para todo o código
- Siga as convenções do ESLint configurado
- Mantenha a estrutura de pastas existente
- Documente funções complexas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🔗 Links Úteis

- **[SIGAA UFBA](https://sigaa.ufba.br/sigaa/public/home.jsf)** - Sistema acadêmico da UFBA
- **[Meu Horário UFBA](https://www.meuhorarioufba.com.br/)** - Projeto inspirador
- **[IdeaLab.ic](https://github.com/ic-ufba)** - Laboratório de Ideias do IC/UFBA
- **[Repositório no GitHub](https://github.com/ic-ufba/que-hora-e-essa.git)**

---

## 📞 Suporte

- **Email**: idealab.ic.ufba@gmail.com
- **Formulário de Contato**: [Link para formulário](https://docs.google.com/forms/d/e/1FAIpQLSeJmzlN7bj6AOlwBqZbcQcw7NRcnsXs2Hay4q4rlzS-yOdijQ/viewform)
- **FAQ**: [Perguntas Frequentes](/faq)

---

**Nota**: Este projeto não possui nenhuma relação oficial com a UFBA ou o SIGAA. É uma iniciativa independente do IdeaLab.ic para facilitar a vida dos estudantes.
