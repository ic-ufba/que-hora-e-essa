import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle,
  FileText,
  BookOpen,
  ExternalLink,
  Calculator,
  History,
} from "lucide-react";
import { parseSigaaText, turmaToDisciplina, Turma, parseHorarios, Disciplina } from "@/utils/sigaaParser";
import { GradeHoraria } from "@/components/GradeHoraria";
import { useToast } from "@/hooks/use-toast";
import { parseReservasPorCurso, AlocacaoTurma } from "@/utils/sigaaParser";

const PlanejadorSemestral = () => {
  const [inputText, setInputText] = useState("");
  const [turmasOrganizadas, setTurmasOrganizadas] = useState<Turma[]>([]);
  const [gradeAtual, setGradeAtual] = useState<Disciplina[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showAlocacaoTutorialModal, setShowAlocacaoTutorialModal] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  // 1. Adicione estados para filtro
  const [filtroModalOpen, setFiltroModalOpen] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState<string[]>([]);
  const [logicaFiltroDia, setLogicaFiltroDia] = useState<'OU' | 'E'>('OU');
  const [logicaFiltroHorario, setLogicaFiltroHorario] = useState<'OU' | 'E'>('OU');
  // Novo estado para restrições de horário
  const [diasRestritos, setDiasRestritos] = useState<string[]>([]);
  const [logicaRestricoes, setLogicaRestricoes] = useState<'OU' | 'E'>('OU');
  const [horariosRestritos, setHorariosRestritos] = useState<string[]>([]);
  const [logicaRestricoesHorario, setLogicaRestricoesHorario] = useState<'OU' | 'E'>('OU');
  
  // Estados para conversão simples
  const [modoConversao, setModoConversao] = useState<'individual' | 'grade' | 'alocacao'>('individual');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [historico, setHistorico] = useState<string[]>([]);
  const [historicoDisciplinas, setHistoricoDisciplinas] = useState<Disciplina[]>([]);
  const [showFormatoEsperado, setShowFormatoEsperado] = useState(false);
  const [showInstrucoes, setShowInstrucoes] = useState(false);
  const [showInputSection, setShowInputSection] = useState(true);
  
  // Estados para histórico de cursos consultados
  const [historicoCursos, setHistoricoCursos] = useState<string[]>([]);
  const [historicoCursosDisciplinas, setHistoricoCursosDisciplinas] = useState<{ [key: string]: Turma[] }>({});
  
  // Estados para histórico de grades salvas
  const [historicoGrades, setHistoricoGrades] = useState<{ [key: string]: Disciplina[] }>({});
  const [showHistoricoGrades, setShowHistoricoGrades] = useState(false);

  const [alocacoes, setAlocacoes] = useState<AlocacaoTurma[]>([]);
  // Histórico específico da Alocação
  const [historicoAlocacoesCursos, setHistoricoAlocacoesCursos] = useState<string[]>([]);
  const [historicoAlocacoesData, setHistoricoAlocacoesData] = useState<{ [key: string]: AlocacaoTurma[] }>({});
  const [selectedAlocacao, setSelectedAlocacao] = useState<{
    codigo: string;
    nome: string;
    turmas: AlocacaoTurma[];
  } | null>(null);

  const diasSemana = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  const mapSiglaParaNome = {
    SEG: "Segunda",
    TER: "Terça",
    QUA: "Quarta",
    QUI: "Quinta",
    SEX: "Sexta",
    SAB: "Sábado"
  };
  const horariosGrade = [
    "07:00", "07:55", "08:50", "09:45", "10:40", "11:35", "13:00", "13:55", "14:50", "15:45", "16:40", "17:35", "18:30", "19:25", "20:20", "21:15"
  ];

  const limparFiltro = () => {
    setDiasSelecionados([]);
    setHorariosSelecionados([]);
    setLogicaFiltroDia('OU');
    setLogicaFiltroHorario('OU');
    setDiasRestritos([]);
    setLogicaRestricoes('OU');
    setHorariosRestritos([]);
    setLogicaRestricoesHorario('OU');
  };

  const aplicarFiltro = () => {
    setFiltroModalOpen(false);
  };

  // Carrega a grade do localStorage ao inicializar
  useEffect(() => {
    const gradeSalva = localStorage.getItem('gradeHoraria');
    if (gradeSalva) {
      setGradeAtual(JSON.parse(gradeSalva));
    }
    
    // Carrega turmas organizadas do localStorage
    const turmasSalvas = localStorage.getItem('turmasOrganizadas');
    if (turmasSalvas) {
      setTurmasOrganizadas(JSON.parse(turmasSalvas));
    }
    
    // Carrega histórico da conversão simples
    const historicoSalvo = localStorage.getItem('historicoConversao');
    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }

    const historicoDisciplinasSalvo = localStorage.getItem('historicoDisciplinas');
    if (historicoDisciplinasSalvo) {
      setHistoricoDisciplinas(JSON.parse(historicoDisciplinasSalvo));
    }
    
    // Carrega histórico de cursos consultados
    const historicoCursosSalvo = localStorage.getItem('historicoCursos');
    if (historicoCursosSalvo) {
      setHistoricoCursos(JSON.parse(historicoCursosSalvo));
    }
    
    const historicoCursosDisciplinasSalvo = localStorage.getItem('historicoCursosDisciplinas');
    if (historicoCursosDisciplinasSalvo) {
      setHistoricoCursosDisciplinas(JSON.parse(historicoCursosDisciplinasSalvo));
    }
    
    // Carrega histórico de grades salvas
    const historicoGradesSalvo = localStorage.getItem('historicoGrades');
    if (historicoGradesSalvo) {
      setHistoricoGrades(JSON.parse(historicoGradesSalvo));
    }

    // Carrega histórico da Alocação
    const histAlocCursos = localStorage.getItem('historicoAlocacoesCursos');
    if (histAlocCursos) {
      setHistoricoAlocacoesCursos(JSON.parse(histAlocCursos));
    }
    const histAlocData = localStorage.getItem('historicoAlocacoesData');
    if (histAlocData) {
      setHistoricoAlocacoesData(JSON.parse(histAlocData));
    }
  }, []);

  // Restaura a última alocação feita (se existir)
  useEffect(() => {
    try {
      const ultimaAlocacaoStr = localStorage.getItem('ultimaAlocacao');
      if (ultimaAlocacaoStr) {
        const ultimaAlocacao = JSON.parse(ultimaAlocacaoStr);
        if (Array.isArray(ultimaAlocacao) && ultimaAlocacao.length > 0) {
          setAlocacoes(ultimaAlocacao);
          setModoConversao('alocacao');
          setShowInputSection(false);
        }
      }
    } catch (e) {
      console.warn('Falha ao restaurar ultimaAlocacao do localStorage', e);
    }
  }, []);

  // Salva a grade no localStorage sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('gradeHoraria', JSON.stringify(gradeAtual));
  }, [gradeAtual]);

  // Salva turmas organizadas no localStorage sempre que elas mudarem
  useEffect(() => {
    localStorage.setItem('turmasOrganizadas', JSON.stringify(turmasOrganizadas));
  }, [turmasOrganizadas]);

  // Salva o histórico no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoConversao', JSON.stringify(historico));
  }, [historico]);

  // Salva o histórico de disciplinas no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoDisciplinas', JSON.stringify(historicoDisciplinas));
  }, [historicoDisciplinas]);
  
  // Salva o histórico de cursos no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoCursos', JSON.stringify(historicoCursos));
  }, [historicoCursos]);
  
  // Salva o histórico de cursos disciplinas no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoCursosDisciplinas', JSON.stringify(historicoCursosDisciplinas));
  }, [historicoCursosDisciplinas]);
  
  // Salva o histórico de grades no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoGrades', JSON.stringify(historicoGrades));
  }, [historicoGrades]);

  // Salva histórico da Alocação
  useEffect(() => {
    localStorage.setItem('historicoAlocacoesCursos', JSON.stringify(historicoAlocacoesCursos));
  }, [historicoAlocacoesCursos]);
  useEffect(() => {
    localStorage.setItem('historicoAlocacoesData', JSON.stringify(historicoAlocacoesData));
  }, [historicoAlocacoesData]);

  const handleConverter = () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, cole o texto do SIGAA antes de converter.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Limpa o texto, extraindo apenas as disciplinas
      const textoLimpo = limparTextoSigaa(inputText);
      
      if (!textoLimpo.trim()) {
        toast({
          title: "Nenhuma disciplina encontrada",
          description: "Não foi possível identificar disciplinas no texto colado. Verifique se o formato está correto.",
          variant: "destructive",
        });
        return;
      }
      
      const turmas = parseSigaaText(textoLimpo);
      
      if (turmas.length === 0) {
        toast({
          title: "Nenhuma turma encontrada",
          description: "Verifique se o texto colado está no formato correto do SIGAA.",
          variant: "destructive",
        });
        return;
      }

      setTurmasOrganizadas(turmas);
      
      // Extrai nome do curso e adiciona ao histórico
      const nomeCurso = extrairNomeCurso(inputText);
      if (nomeCurso && !historicoCursos.includes(nomeCurso)) {
        setHistoricoCursos(prev => [nomeCurso, ...prev.slice(0, 9)]); // Mantém apenas os últimos 10
        setHistoricoCursosDisciplinas(prev => ({
          ...prev,
          [nomeCurso]: turmas
        }));
      }
      
      setInputText("");
      setShowInputSection(false); // Colapsa após organizar turmas
      toast({
        title: "Turmas organizadas!",
        description: `${turmas.length} turma(s) encontrada(s) de ${new Set(turmas.map(t => t.codigo)).size} disciplina(s).`,
      });
    } catch (error) {
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao processar o texto. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  const handleAdicionarTurma = (turma: Turma) => {
    // Converte para o formato Disciplina
    const disciplinaConvertida = turmaToDisciplina(turma);

    // Verifica se a disciplina já existe na grade (apenas se o código for exatamente igual)
    const disciplinaJaExiste = gradeAtual.find((d) => d.codigo === turma.codigo);
    
    if (disciplinaJaExiste) {
      toast({
        title: "Disciplina já existe na grade",
        description: `${turma.codigo} já foi adicionada à grade. Uma disciplina só pode ser adicionada uma vez (por código).`,
        variant: "destructive",
      });
      return;
    }

    setGradeAtual((prev) => [...prev, disciplinaConvertida]);
    toast({
      title: "Turma adicionada!",
      description: `${turma.codigo} - Turma ${turma.turma} foi adicionada à grade.`,
    });
  };

  const handleRemoverDisciplina = (codigo: string) => {
    setGradeAtual((prev) => prev.filter((d) => d.codigo !== codigo));
    toast({
      title: "Disciplina removida",
      description: "A disciplina foi removida da grade.",
    });
  };

  const handleLimparGrade = () => {
    setGradeAtual([]);
    localStorage.removeItem('gradeHoraria');
    toast({
      title: "Grade limpa",
      description: "Todas as disciplinas foram removidas.",
    });
  };

  const handleLimparTurmas = () => {
    setTurmasOrganizadas([]);
    localStorage.removeItem('turmasOrganizadas');
    setShowInputSection(true); // Expande ao limpar turmas
    toast({
      title: "Turmas limpas",
      description: "Todas as turmas organizadas foram removidas.",
    });
  };

  const limparTextoSigaa = (texto: string): string => {
    const lines = texto.split('\n');
    const disciplinasEncontradas: string[] = [];
    let currentDisciplina: string[] = [];
    let encontrouDisciplina = false;
    let encontrouCabecalho = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Identifica início de uma disciplina (código - nome)
      const disciplinaMatch = line.match(/^([^\s-]+)\s*-\s*(.+)$/);
      if (disciplinaMatch) {
        // Se já temos uma disciplina sendo processada e válida, salva ela
        if (encontrouDisciplina && encontrouCabecalho && currentDisciplina.length >= 3) {
          disciplinasEncontradas.push(currentDisciplina.join('\n'));
        }
        
        // Inicia nova disciplina
        currentDisciplina = [line];
        encontrouDisciplina = true;
        encontrouCabecalho = false;
        continue;
      }
      
      // Identifica cabeçalho da tabela
      if (encontrouDisciplina && line.includes('Período/ Ano') && line.includes('Turma') && line.includes('Docente') && line.includes('Vgs Reservadas') && line.includes('Horários')) {
        currentDisciplina.push(line);
        encontrouCabecalho = true;
        continue;
      }
      
      // Se encontrou uma disciplina e cabeçalho, coleta as linhas de dados até encontrar outra disciplina
      if (encontrouDisciplina && encontrouCabecalho) {
        // Para quando encontrar outra disciplina
        if (line.match(/^([A-Z]{3,4}\d{2,3}(?:\.\d+)?)\s*-\s*(.+)$/)) {
          // Salva disciplina atual se tiver dados válidos
          if (currentDisciplina.length >= 3) {
            disciplinasEncontradas.push(currentDisciplina.join('\n'));
          }
          // Inicia nova disciplina
          currentDisciplina = [line];
          encontrouCabecalho = false;
        } else if (line.trim() !== '') {
          // Adiciona linha de dados se não estiver vazia
          currentDisciplina.push(line);
        }
      }
    }
    
    // Adiciona última disciplina se for válida
    if (encontrouDisciplina && encontrouCabecalho && currentDisciplina.length >= 3) {
      disciplinasEncontradas.push(currentDisciplina.join('\n'));
    }
    
    return disciplinasEncontradas.join('\n\n');
  };

  // Função para extrair nome do curso do texto do SIGAA
  const extrairNomeCurso = (texto: string): string => {
    const lines = texto.split('\n');
    for (const line of lines) {
      const match = line.match(/CURSO DE (.+?)\s*\/\s*[A-Z]+/);
      if (match) {
        return match[1].trim();
      }
    }
    return "";
  };

  // Função para limpar texto do SIGAA para conversão individual - agora usa a mesma lógica da conversão completa
  const limparTextoSigaaIndividual = (texto: string): string => {
    const lines = texto.split('\n');
    const disciplinasEncontradas: string[] = [];
    let currentDisciplina: string[] = [];
    let encontrouDisciplina = false;
    let encontrouCabecalho = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Pula linhas vazias no início
      if (line === '' && !encontrouDisciplina) {
        continue;
      }
      
      // Identifica início de uma disciplina (código - nome) - regex mais flexível
      const disciplinaMatch = line.match(/^([A-Z]{3,8}\d{1,4}(?:\.\d+)?)\s*-\s*(.+)$/);
      if (disciplinaMatch) {
        // Se já temos uma disciplina sendo processada e válida, salva ela
        if (encontrouDisciplina && encontrouCabecalho && currentDisciplina.length >= 3) {
          disciplinasEncontradas.push(currentDisciplina.join('\n'));
        }
        
        // Inicia nova disciplina
        currentDisciplina = [line];
        encontrouDisciplina = true;
        encontrouCabecalho = false;
        continue;
      }
      
      // Identifica cabeçalho da tabela - mais flexível
      if (encontrouDisciplina && !encontrouCabecalho && 
          (line.includes('Período') || line.includes('Ano')) && 
          (line.includes('Turma') || line.includes('Docente') || line.includes('Vgs') || line.includes('Horários'))) {
        currentDisciplina.push(line);
        encontrouCabecalho = true;
        continue;
      }
      
      // Se encontrou uma disciplina e cabeçalho, coleta as linhas de dados até encontrar outra disciplina
      if (encontrouDisciplina && encontrouCabecalho) {
        // Para quando encontrar outra disciplina
        if (line.match(/^([A-Z]{3,8}\d{1,4}(?:\.\d+)?)\s*-\s*(.+)$/)) {
          // Salva disciplina atual se tiver dados válidos
          if (currentDisciplina.length >= 3) {
            disciplinasEncontradas.push(currentDisciplina.join('\n'));
          }
          // Inicia nova disciplina
          currentDisciplina = [line];
          encontrouCabecalho = false;
        } else if (line.trim() !== '') {
          // Adiciona linha de dados se não estiver vazia
          currentDisciplina.push(line);
        }
      }
    }
    
    // Adiciona última disciplina se for válida
    if (encontrouDisciplina && encontrouCabecalho && currentDisciplina.length >= 3) {
      disciplinasEncontradas.push(currentDisciplina.join('\n'));
    }
    
    // Se não encontrou cabeçalho mas tem disciplina e dados, tenta processar mesmo assim
    if (encontrouDisciplina && !encontrouCabecalho && currentDisciplina.length >= 2) {
      // Adiciona um cabeçalho padrão se não foi encontrado
      const disciplinaLine = currentDisciplina[0];
      const dataLine = currentDisciplina[1];
      
      // Verifica se a linha de dados tem formato de turma (período, turma, docente, vagas, horários)
      if (dataLine.match(/\d{4}\.\d\s+\w+\s+.*?\s+\d*\s+.*?\s*\(.*?\)/)) {
        const headerLine = "Período/ Ano\tTurma\tDocente\tVgs Reservadas\tHorários";
        disciplinasEncontradas.push([disciplinaLine, headerLine, dataLine].join('\n'));
      }
    }
    
    return disciplinasEncontradas.join('\n\n');
  };

  // Agrupa turmas por disciplina para exibição
  const turmasPorDisciplina = turmasOrganizadas.reduce((acc, turma) => {
    const key = turma.codigo;
    if (!acc[key]) {
      acc[key] = {
        codigo: turma.codigo,
        nome: turma.nome,
        turmas: []
      };
    }
    acc[key].turmas.push(turma);
    return acc;
  }, {} as { [key: string]: { codigo: string; nome: string; turmas: Turma[] } });

  // Funções para conversão individual
  const validarEntrada = (texto: string): boolean => {
    const lines = texto.split('\n');
    let temDisciplina = false;
    let temHorario = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Verifica se tem código de disciplina - regex mais flexível
      if (trimmedLine.match(/^[A-Z]{3,8}\d{1,4}(?:\.\d+)?\s*-\s*.+/)) {
        temDisciplina = true;
      }
      
      // Verifica se tem horário (formato 24T34, 7T123, 3N34 6N3, etc.) - mais flexível
      if (trimmedLine.match(/\d{1,3}[MTN]\d{1,4}(\s+\d{1,3}[MTN]\d{1,4})*/)) {
        temHorario = true;
      }
      
      // Verifica se tem período (formato 2025.2)
      if (trimmedLine.match(/\d{4}\.\d/)) {
        temHorario = true; // Se tem período, provavelmente tem horário também
      }
    }
    
    return temDisciplina && temHorario;
  };

  const handleConverterIndividual = () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, cole o texto do SIGAA antes de converter.",
        variant: "destructive",
      });
      return;
    }

    if (!validarEntrada(inputText)) {
      toast({
        title: "Formato inválido",
        description: "O texto não parece conter dados válidos do SIGAA. Verifique se inclui código da disciplina e horários.",
        variant: "destructive",
      });
      return;
    }

    try {
      const textoLimpo = limparTextoSigaaIndividual(inputText);
      const turmas = parseSigaaText(textoLimpo);
      
      if (turmas.length === 0) {
        toast({
          title: "Nenhuma turma encontrada",
          description: "Verifique se o texto colado está no formato correto do SIGAA.",
          variant: "destructive",
        });
        return;
      }

      // Converte para disciplinas
      const disciplinasConvertidas = turmas.map(turma => turmaToDisciplina(turma));
      
      setDisciplinas(disciplinasConvertidas);
      
      // Adiciona ao histórico
      const codigoDisciplina = turmas[0].codigo;
      if (!historico.includes(codigoDisciplina)) {
        setHistorico(prev => [codigoDisciplina, ...prev.slice(0, 9)]); // Mantém apenas os últimos 10
        setHistoricoDisciplinas(prev => [disciplinasConvertidas[0], ...prev.slice(0, 9)]);
      }
      
      setInputText("");
      toast({
        title: "Disciplina convertida!",
        description: `${turmas.length} turma(s) encontrada(s) para ${codigoDisciplina}.`,
      });
    } catch (error) {
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao processar o texto. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  const handleHistoricoClick = (codigo: string) => {
    const disciplina = historicoDisciplinas.find(d => d.codigo === codigo);
    if (disciplina) {
      setDisciplinas([disciplina]);
      toast({
        title: "Disciplina carregada",
        description: `${codigo} foi carregada do histórico.`,
      });
    }
  };

  const handleAdicionarAGrade = () => {
    if (disciplinas.length === 0) {
      toast({
        title: "Nenhuma disciplina para adicionar",
        description: "Converta uma disciplina primeiro.",
        variant: "destructive",
      });
      return;
    }

    const disciplina = disciplinas[0];
    const disciplinaJaExiste = gradeAtual.find((d) => d.codigo === disciplina.codigo);
    
    if (disciplinaJaExiste) {
      toast({
        title: "Disciplina já existe na grade",
        description: `${disciplina.codigo} já foi adicionada à grade.`,
        variant: "destructive",
      });
      return;
    }

    setGradeAtual((prev) => [...prev, disciplina]);
    toast({
      title: "Disciplina adicionada!",
      description: `${disciplina.codigo} foi adicionada à grade.`,
    });
  };

  const handleLimparHistorico = () => {
    setHistorico([]);
    setHistoricoDisciplinas([]);
    localStorage.removeItem('historicoConversao');
    localStorage.removeItem('historicoDisciplinas');
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico de conversões foi removido.",
    });
  };
  
  const handleLimparHistoricoCursos = () => {
    setHistoricoCursos([]);
    setHistoricoCursosDisciplinas({});
    localStorage.removeItem('historicoCursos');
    localStorage.removeItem('historicoCursosDisciplinas');
    toast({
      title: "Histórico de cursos limpo",
      description: "Todo o histórico de cursos consultados foi removido.",
    });
  };
  
  const handleHistoricoCursosClick = (nomeCurso: string) => {
    const turmas = historicoCursosDisciplinas[nomeCurso];
    if (turmas) {
      setTurmasOrganizadas(turmas);
      setShowInputSection(false);
      toast({
        title: "Curso carregado",
        description: `${nomeCurso} foi carregado do histórico.`,
      });
    }
  };
  
  const handleSalvarGrade = () => {
    if (gradeAtual.length === 0) {
      toast({
        title: "Grade vazia",
        description: "Adicione disciplinas à grade antes de salvar.",
        variant: "destructive",
      });
      return;
    }
    
    const nome = prompt("Digite um nome para salvar esta grade:");
    if (nome && nome.trim()) {
      const nomeTrim = nome.trim();
      setHistoricoGrades(prev => ({
        ...prev,
        [nomeTrim]: [...gradeAtual]
      }));
      toast({
        title: "Grade salva!",
        description: `Grade "${nomeTrim}" foi salva com sucesso.`,
      });
    }
  };
  
  const handleCarregarGrade = (nomeGrade: string) => {
    const grade = historicoGrades[nomeGrade];
    if (grade) {
      setGradeAtual(grade);
      setShowHistoricoGrades(false);
      toast({
        title: "Grade carregada!",
        description: `Grade "${nomeGrade}" foi carregada com sucesso.`,
      });
    }
  };
  
  const handleRemoverGrade = (nomeGrade: string) => {
    setHistoricoGrades(prev => {
      const novo = { ...prev };
      delete novo[nomeGrade];
      return novo;
    });
    toast({
      title: "Grade removida",
      description: `Grade "${nomeGrade}" foi removida do histórico.`,
    });
  };

  // Função para conversão de alocação
  const handleConverterAlocacao = () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, cole o texto do SIGAA antes de converter.",
        variant: "destructive",
      });
      return;
    }
    try {
      const alocacoesExtraidas = parseReservasPorCurso(inputText).filter(a => (a.vagasDisponiveis || 0) > 0);
      setAlocacoes(alocacoesExtraidas);
      // Salva última alocação
      try {
        localStorage.setItem('ultimaAlocacao', JSON.stringify(alocacoesExtraidas));
      } catch (e) {
        console.warn('Falha ao salvar ultimaAlocacao no localStorage', e);
      }
      setShowInputSection(false);

      // Extrai nome do curso a partir de "Ofertadas ao curso: ..."
      const nomeCursoOfertadas = (() => {
        const lines = inputText.split('\n');
        for (const raw of lines) {
          const line = raw.trim();
          const m = line.match(/Ofertadas ao curso:\s*(.+)/i);
          if (m) {
            const resto = m[1].trim();
            // pega o que vem antes do '/'
            const nome = resto.split('/')[0].trim();
            return nome;
          }
        }
        return '';
      })();
      if (nomeCursoOfertadas) {
        if (!historicoCursos.includes(nomeCursoOfertadas)) {
          setHistoricoCursos(prev => [nomeCursoOfertadas, ...prev.slice(0, 9)]);
        }
        try {
          localStorage.setItem('ultimaAlocacaoCurso', nomeCursoOfertadas);
        } catch (e) {
          console.warn('Falha ao salvar ultimaAlocacaoCurso no localStorage', e);
        }

        // Atualiza histórico da Alocação
        setHistoricoAlocacoesCursos(prev => {
          const novo = [nomeCursoOfertadas, ...prev.filter(n => n !== nomeCursoOfertadas)];
          return novo.slice(0, 10);
        });
        setHistoricoAlocacoesData(prev => ({
          ...prev,
          [nomeCursoOfertadas]: alocacoesExtraidas,
        }));
      }

      toast({
        title: "Alocação gerada!",
        description: `${alocacoesExtraidas.length} turma(s) com vagas disponíveis encontradas.`,
      });
    } catch (error) {
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao processar o texto. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  // Adicionar à grade a partir de uma turma de alocação
  const handleAdicionarAGradeFromAlocacao = (aloc: AlocacaoTurma) => {
    const turma: Turma = {
      codigo: aloc.codigo,
      nome: aloc.nome,
      periodo: aloc.periodo,
      turma: aloc.turma,
      docente: aloc.docente,
      vagas: aloc.capacidade,
      horarios: aloc.horarios || '(Sem informação)',
      dataInicio: '(Sem informação)',
      dataFim: '(Sem informação)'
    };
    handleAdicionarTurma(turma);
  };

  // Agrupa alocações por disciplina
  const alocacoesPorDisciplina = alocacoes.reduce((acc, a) => {
    const key = a.codigo;
    if (!acc[key]) {
      acc[key] = { codigo: a.codigo, nome: a.nome, turmas: [] as AlocacaoTurma[] };
    }
    acc[key].turmas.push(a);
    return acc;
  }, {} as { [key: string]: { codigo: string; nome: string; turmas: AlocacaoTurma[] } });

  // Adicione uma função para limpar as alocações e reabrir o campo de envio
  const handleLimparAlocacoes = () => {
    setAlocacoes([]);
    setShowInputSection(true);
    try {
      localStorage.removeItem('ultimaAlocacao');
      localStorage.removeItem('ultimaAlocacaoCurso');
    } catch (e) {
      console.warn('Falha ao limpar ultimaAlocacao do localStorage', e);
    }
  };

  // Histórico da Alocação - ações
  const handleHistoricoAlocacoesClick = (nomeCurso: string) => {
    const dados = historicoAlocacoesData[nomeCurso];
    if (dados && Array.isArray(dados)) {
      setAlocacoes(dados);
      setModoConversao('alocacao');
      setShowInputSection(false);
    }
  };
  const handleLimparHistoricoAlocacoes = () => {
    setHistoricoAlocacoesCursos([]);
    setHistoricoAlocacoesData({});
    localStorage.removeItem('historicoAlocacoesCursos');
    localStorage.removeItem('historicoAlocacoesData');
  };

  return (
    <> {/* Adicione um Fragment aqui */}
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {/* Título principal */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Planejamento Semestral</h1>
            {/* Descrição principal */}
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              {modoConversao === 'individual' 
                ? 'Converta as disciplinas desejadas e organize toda a sua grade curricular.'
                : 'Converta as disciplinas desejadas e organize toda a sua grade curricular.'
              }
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant={modoConversao === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setModoConversao('individual')}
              className="flex-1 md:flex-none"
            >
              <Calculator className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Individual</span>
              <span className="sm:hidden">Individual</span>
            </Button>
            <Button
              variant={modoConversao === 'grade' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setModoConversao('grade')}
              className="flex-1 md:flex-none"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Completa</span>
              <span className="sm:hidden">Completa</span>
            </Button>
              <Button
                variant={modoConversao === 'alocacao' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModoConversao('alocacao')}
                className="flex-1 md:flex-none"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Alocação</span>
                <span className="sm:hidden">Alocação</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-6">
              {modoConversao !== 'alocacao' && (
            <Card>
              <CardHeader 
                onClick={() => modoConversao === 'grade' && turmasOrganizadas.length > 0 && setShowInputSection(!showInputSection)} 
                className={`${modoConversao === 'grade' && turmasOrganizadas.length > 0 ? 'cursor-pointer' : ''} select-none`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-7 h-7 text-blue-700" />
                  {/* CardTitle */}
                  <CardTitle className="text-lg md:text-xl font-bold text-blue-900 flex items-center">
                    {modoConversao === 'individual' ? 'Conversão Individual' : 'Conversão Completa'}
                    {modoConversao === 'grade' && turmasOrganizadas.length > 0 && <span className="ml-2 text-blue-700 text-2xl">{showInputSection ? '−' : '+'}</span>}
                </CardTitle>
                </div>
                {/* CardDescription */}
                <CardDescription className="text-sm md:text-base text-gray-700">
                  {modoConversao === 'individual' 
                    ? 'Converta uma disciplina específica'
                    : 'Converta todas as disciplinas do semestre'
                  }
                </CardDescription>
              </CardHeader>
              {(modoConversao === 'individual' || showInputSection || (modoConversao === 'grade' && turmasOrganizadas.length === 0)) && (
              <CardContent className="space-y-4">
                  {modoConversao === 'individual' ? (
                    <>
                      {/* Formato esperado para conversão individual */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                        <button
                          onClick={() => setShowFormatoEsperado(!showFormatoEsperado)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h4 className="font-semibold text-blue-800 text-sm md:text-base">Formato esperado</h4>
                          <span className="text-blue-600">{showFormatoEsperado ? '−' : '+'}</span>
                        </button>
                        {showFormatoEsperado && (
                          <div className="text-xs md:text-sm text-blue-700 space-y-1 mt-3">
                            <div className="bg-white p-2 rounded border font-mono text-xs">
                              <div>MATA01 - GEOMETRIA ANALÍTICA</div>
                              <div>Período/ Ano Turma Docente Vgs Reservadas Horários</div>
                              <div>2025.2 03 JAIME LEONARDO ORJUELA CHAMORRO 5 24T34 (01/09/2025 - 10/01/2026)</div>
                            </div>
                            <p className="mt-2">
                              <button onClick={() => setShowTutorialModal(true)} className="text-blue-600 underline hover:text-blue-800">
                                Como acessar as turmas no SIGAA
                              </button>
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Instruções para conversão completa */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                        <button
                          onClick={() => setShowInstrucoes(!showInstrucoes)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h4 className="font-semibold text-blue-800 text-sm md:text-base">Instruções</h4>
                          <span className="text-blue-600">{showInstrucoes ? '−' : '+'}</span>
                        </button>
                        {showInstrucoes && (
                          <div className="text-xs md:text-sm text-blue-700 space-y-1 mt-3">
                            <p>1. Acesse a página de turmas no SIGAA (<button onClick={() => setShowTutorialModal(true)} className="text-blue-600 underline hover:text-blue-800">Como acessar as turmas no SIGAA</button>)</p>
                            <p>2. Pressione <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+A</kbd> para selecionar todo o conteúdo e pressione <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+C</kbd> para copiar (se tiver no Desktop) / Pressione em um texto da tela e pressione em <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Selecionar tudo</kbd> (se tiver no Mobile)</p>
                            <p>3. Cole o conteúdo no campo abaixo</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Texto do SIGAA</label>
                <Textarea
                      placeholder={modoConversao === 'individual' 
                        ? "Cole aqui o texto do SIGAA com uma disciplina..."
                        : "Cole aqui o texto do SIGAA..."
                      }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                      rows={6}
                      className="min-h-[120px]"
                  />
                  </div>
                  
                  <Button 
                    onClick={modoConversao === 'individual' ? handleConverterIndividual : handleConverter} 
                    className="w-full"
                  >
                    {modoConversao === 'individual' ? (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Converter Disciplina
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Organizar Turmas
                      </>
                    )}
                </Button>
              </CardContent>
              )}
            </Card>
              )}

              {/* Input Section para Alocação */}
              {modoConversao === 'alocacao' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader
                      onClick={() => alocacoes.length > 0 && setShowInputSection(!showInputSection)}
                      className={`${alocacoes.length > 0 ? 'cursor-pointer' : ''} select-none`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-7 h-7 text-blue-700" />
                        <CardTitle className="text-lg md:text-xl font-bold text-blue-900 flex items-center">
                          Alocação de Turma
                          {alocacoes.length > 0 && (
                            <span className="ml-2 text-blue-700 text-2xl">{showInputSection ? '−' : '+'}</span>
                          )}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm md:text-base text-gray-700">
                        Cole o relatório do SIGAA e veja as vagas disponíveis e reservas por curso.
                      </CardDescription>
                    </CardHeader>
                    {(showInputSection || alocacoes.length === 0) && (
                      <CardContent className="space-y-4">
                        {/* Instruções específicas para alocação */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-800">Instruções</span>
                          </div>
                          <div className="text-xs md:text-sm text-blue-700 space-y-1">
                            <p>1. Acesse a página de turmas no SIGAA (<button onClick={() => setShowAlocacaoTutorialModal(true)} className="text-blue-600 underline hover:text-blue-800">Como acessar as alocações no SIGAA</button>)</p>
                            <p>2. Pressione <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+A</kbd> para selecionar todo o conteúdo e pressione <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+C</kbd> para copiar (se tiver no Desktop) / Pressione em um texto da tela e pressione em <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Selecionar tudo</kbd> (se tiver no Mobile)</p>
                            <p>3. Cole o conteúdo no campo abaixo</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Texto do SIGAA</label>
                          <Textarea
                            placeholder="Cole aqui o texto do SIGAA..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={6}
                            className="min-h-[120px]"
                          />
                        </div>
                        <Button onClick={handleConverterAlocacao} className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Gerar Alocação
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                  {/* Exibição das alocações como cards por disciplina */}
                  {alocacoes.length > 0 && !showInputSection && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-7 h-7 text-green-700" />
                            <CardTitle className="text-xl font-bold text-green-900">Alocação de Turma</CardTitle>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleLimparAlocacoes}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpar
                          </Button>
                        </div>
                        <CardDescription className="text-base text-gray-700">
                          {Object.keys(alocacoesPorDisciplina).length} disciplina(s) com vagas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Campo de busca e filtro */}
                        <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
                          <input
                            type="text"
                            placeholder="Buscar disciplina..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300 md:w-auto"
                            style={{ minWidth: 0 }}
                          />
                          <button
                            type="button"
                            className="flex items-center gap-1 border rounded px-3 py-2 text-sm bg-muted hover:bg-muted/70 transition"
                            onClick={() => setFiltroModalOpen(true)}
                          >
                            <Filter className="w-4 h-4" />
                            Filtrar
                          </button>
                        </div>
                        {/* Modal de filtro customizado */}
                        {filtroModalOpen && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFiltroModalOpen(false)}>
                            <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-lg md:p-6 shadow border" onClick={e => e.stopPropagation()}>
                              {/* (Conteúdo do modal de filtro igual ao da conversão completa) */}
                              {/* ...copiar o mesmo modal de filtro... */}
                              <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <div className="flex items-center gap-2">
                                  <Filter className="w-5 h-5 text-blue-600" />
                                  <h3 className="text-lg font-bold text-gray-900">Filtro de matérias</h3>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setFiltroModalOpen(false)} className="hover:bg-gray-100">
                                  ✕
                                </Button>
                              </div>
                              <div className="space-y-4">
                                {/* Dias da semana */}
                                <div>
                                  <div className="font-semibold mb-2 text-sm text-gray-900">Dias da semana:</div>
                                  <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2">
                                    {diasSemana.map(dia => (
                                      <label key={dia} className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={diasSelecionados.includes(dia)}
                                          onChange={e => {
                                            if (e.target.checked) setDiasSelecionados([...diasSelecionados, dia]);
                                            else setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
                                          }}
                                          className="accent-blue-600"
                                        />
                                        <span className="text-sm font-medium">{dia}</span>
                                      </label>
                                    ))}
                                  </div>
                                  <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para dias:</div>
                                  <div className="space-y-2 md:flex md:gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaFiltroDia === 'OU'}
                                        onChange={() => setLogicaFiltroDia('OU')}
                                        className="accent-blue-600"
                                      />
                                      <span className="text-sm">OU (um dia ou outro)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaFiltroDia === 'E'}
                                        onChange={() => setLogicaFiltroDia('E')}
                                        className="accent-blue-600"
                                      />
                                      <span className="text-sm">E (um dia e outro)</span>
                                    </label>
                                  </div>
                                </div>
                                {/* Horários */}
                                <div>
                                  <div className="font-semibold mb-2 text-sm text-gray-900">Horários:</div>
                                  <div className="grid grid-cols-4 md:flex md:flex-wrap gap-1 md:gap-2 max-h-32 overflow-y-auto">
                                    {horariosGrade.map(horario => (
                                      <label key={horario} className="flex items-center gap-1 p-1 md:p-2 border rounded text-xs md:text-sm bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={horariosSelecionados.includes(horario)}
                                          onChange={e => {
                                            if (e.target.checked) setHorariosSelecionados([...horariosSelecionados, horario]);
                                            else setHorariosSelecionados(horariosSelecionados.filter(h => h !== horario));
                                          }}
                                          className="accent-blue-600"
                                        />
                                        <span className="font-medium">{horario}</span>
                                      </label>
                                    ))}
                                  </div>
                                  <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para horários:</div>
                                  <div className="space-y-2 md:flex md:gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaFiltroHorario === 'OU'}
                                        onChange={() => setLogicaFiltroHorario('OU')}
                                        className="accent-blue-600"
                                      />
                                      <span className="text-sm">OU (um horário ou outro)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaFiltroHorario === 'E'}
                                        onChange={() => setLogicaFiltroHorario('E')}
                                        className="accent-blue-600"
                                      />
                                      <span className="text-sm">E (um horário e outro)</span>
                                    </label>
                                  </div>
                                </div>
                                {/* Restrições de Dias */}
                                <div>
                                  <div className="font-semibold mb-2 text-sm text-gray-900">Restrições de Dias (dias que NÃO quer):</div>
                                  <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2">
                                    {diasSemana.map(dia => (
                                      <label key={dia} className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={diasRestritos.includes(dia)}
                                          onChange={e => {
                                            if (e.target.checked) setDiasRestritos([...diasRestritos, dia]);
                                            else setDiasRestritos(diasRestritos.filter(d => d !== dia));
                                          }}
                                          className="accent-red-600"
                                        />
                                        <span className="text-sm font-medium">{dia}</span>
                                      </label>
                                    ))}
                                  </div>
                                  <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para restrições de dias:</div>
                                  <div className="space-y-2 md:flex md:gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaRestricoes === 'OU'}
                                        onChange={() => setLogicaRestricoes('OU')}
                                        className="accent-red-600"
                                      />
                                      <span className="text-sm">OU (um dia restrito ou outro)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaRestricoes === 'E'}
                                        onChange={() => setLogicaRestricoes('E')}
                                        className="accent-red-600"
                                      />
                                      <span className="text-sm">E (um dia restrito e outro)</span>
                                    </label>
                                  </div>
                                </div>
                                {/* Restrições de Horário */}
                                <div>
                                  <div className="font-semibold mb-2 text-sm text-gray-900">Restrições de Horário (horários que NÃO quer):</div>
                                  <div className="grid grid-cols-4 md:flex md:flex-wrap gap-1 md:gap-2 max-h-32 overflow-y-auto">
                                    {horariosGrade.map(horario => (
                                      <label key={horario} className="flex items-center gap-1 p-1 md:p-2 border rounded text-xs md:text-sm bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={horariosRestritos.includes(horario)}
                                          onChange={e => {
                                            if (e.target.checked) setHorariosRestritos([...horariosRestritos, horario]);
                                            else setHorariosRestritos(horariosRestritos.filter(h => h !== horario));
                                          }}
                                          className="accent-red-600"
                                        />
                                        <span className="font-medium">{horario}</span>
                                      </label>
                                    ))}
                                  </div>
                                  <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para restrições de horário:</div>
                                  <div className="space-y-2 md:flex md:gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaRestricoesHorario === 'OU'}
                                        onChange={() => setLogicaRestricoesHorario('OU')}
                                        className="accent-red-600"
                                      />
                                      <span className="text-sm">OU (um horário restrito ou outro)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        checked={logicaRestricoesHorario === 'E'}
                                        onChange={() => setLogicaRestricoesHorario('E')}
                                        className="accent-red-600"
                                      />
                                      <span className="text-sm">E (um horário restrito e outro)</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t">
                                  <button
                                    type="button"
                                    className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-colors"
                                    onClick={limparFiltro}
                                  >
                                    Limpar
                                  </button>
                                  <button
                                    type="button"
                                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                                    onClick={aplicarFiltro}
                                  >
                                    Aplicar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Grade de cards filtrada */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                          {Object.values(alocacoesPorDisciplina)
                            .filter(disciplina =>
                              (disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase())) &&
                              (
                                (diasSelecionados.length === 0 && horariosSelecionados.length === 0 && diasRestritos.length === 0 && horariosRestritos.length === 0) ||
                                disciplina.turmas.some(turma => {
                                  const horarios = parseHorarios(turma.horarios);
                                  let diasOk = true;
                                  if (diasSelecionados.length > 0) {
                                    if (logicaFiltroDia === 'OU') {
                                      diasOk = horarios.some(h => diasSelecionados.includes(Object.keys(mapSiglaParaNome).find(sigla => mapSiglaParaNome[sigla] === h.dia)));
                                    } else {
                                      diasOk = diasSelecionados.every(diaSel => horarios.some(h => h.dia === mapSiglaParaNome[diaSel]));
                                    }
                                  }
                                  let horariosOk = true;
                                  if (horariosSelecionados.length > 0) {
                                    if (logicaFiltroHorario === 'OU') {
                                      horariosOk = horarios.some(h => horariosSelecionados.includes(h.horarioInicio));
                                    } else {
                                      horariosOk = horariosSelecionados.every(hSel => horarios.some(h => h.horarioInicio === hSel));
                                    }
                                  }
                                  let restricoesDiasOk = true;
                                  if (diasRestritos.length > 0) {
                                    const diasTurma = horarios.map(h => Object.keys(mapSiglaParaNome).find(sigla => mapSiglaParaNome[sigla] === h.dia));
                                    if (logicaRestricoes === 'OU') {
                                      restricoesDiasOk = !diasRestritos.some(diaRestrito => diasTurma.includes(diaRestrito));
                                    } else {
                                      restricoesDiasOk = !diasRestritos.every(diaRestrito => diasTurma.includes(diaRestrito));
                                    }
                                  }
                                  let restricoesHorariosOk = true;
                                  if (horariosRestritos.length > 0) {
                                    const horariosTurma = horarios.map(h => h.horarioInicio);
                                    if (logicaRestricoesHorario === 'OU') {
                                      restricoesHorariosOk = !horariosRestritos.some(horarioRestrito => horariosTurma.includes(horarioRestrito));
                                    } else {
                                      restricoesHorariosOk = !horariosRestritos.every(horarioRestrito => horariosTurma.includes(horarioRestrito));
                                    }
                                  }
                                  return diasOk && horariosOk && restricoesDiasOk && restricoesHorariosOk;
                                })
                              )
                            )
                            .map((disc, idx) => {
                              const totalVagas = disc.turmas.reduce((sum, t) => sum + t.vagasDisponiveis, 0);
                              const nome = disc.nome;
                              return (
                                <div
                                  key={idx}
                                  className="p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => setSelectedAlocacao(disc)}
                                >
                                  <div className="font-semibold text-sm md:text-base mb-1">{disc.codigo}</div>
                                  <div className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">{nome}</div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{disc.turmas.length} turma(s)</Badge>
                                    <Badge variant="outline" className="text-xs">{totalVagas} vaga(s) restante(s)</Badge>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Histórico de Cursos Consultados (Alocação) */}
                  {historicoAlocacoesCursos.length > 0 && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <History className="w-7 h-7 text-gray-700" />
                          <CardTitle className="text-xl font-bold text-gray-900">Histórico de Cursos Consultados</CardTitle>
                        </div>
                        <CardDescription className="text-base text-gray-700">
                          Clique em um curso para reabrir a última alocação
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {historicoAlocacoesCursos.map((nomeCurso, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleHistoricoAlocacoesClick(nomeCurso)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                            >
                              {nomeCurso}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm" onClick={handleLimparHistoricoAlocacoes}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpar Histórico
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

            {/* Seção de Conversão Individual */}
            {modoConversao === 'individual' && (
              <>
                {/* Disciplina Convertida */}
                {disciplinas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-7 h-7 text-green-700" />
                        <CardTitle className="text-xl font-bold text-green-900">Disciplina Convertida</CardTitle>
                      </div>
                      <CardDescription className="text-base text-gray-700">
                        Visualize a disciplina convertida e adicione à grade
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {disciplinas.map((disciplina, idx) => (
                        <div key={idx} className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{disciplina.codigo}</h3>
                              <p className="text-muted-foreground">{disciplina.nome}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{disciplina.turma}</Badge>
                              <Badge variant="outline">{disciplina.vagas === 0 ? 'Sem informação' : disciplina.vagas + ' vagas'}</Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold text-muted-foreground">Professor:</span>
                                <p className="mt-1">{disciplina.professor}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-muted-foreground">Período:</span>
                                <p className="mt-1">{disciplina.periodo}</p>
                              </div>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground">Horários:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {disciplina.horarios.map((horario, index) => (
                                  <span key={index} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-xs font-mono">
                                    {horario.dia} {horario.horarioInicio} - {horario.horarioFim}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
                            <Button
                              onClick={handleAdicionarAGrade}
                              className="flex-1"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar à Grade
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setDisciplinas([])}
                              className="flex-1"
                            >
                              Limpar Campo
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Histórico */}
                {historico.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <History className="w-7 h-7 text-gray-700" />
                        <CardTitle className="text-xl font-bold text-gray-900">Histórico de Conversões</CardTitle>
                      </div>
                      <CardDescription className="text-base text-gray-700">
                        Clique em uma disciplina para carregá-la novamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {historico.map((codigo, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleHistoricoClick(codigo)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                          >
                            {codigo}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" onClick={handleLimparHistorico}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Limpar Histórico
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Turmas Organizadas */}
            {modoConversao === 'grade' && turmasOrganizadas.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-7 h-7 text-green-700" />
                    <CardTitle className="text-xl font-bold text-green-900">Turmas Organizadas</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-700">
                    {turmasOrganizadas.length} turma(s) encontrada(s) de {Object.keys(turmasPorDisciplina).length} disciplina(s) - Clique para ver detalhes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {Object.keys(turmasPorDisciplina).length} disciplinas organizadas
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLimparTurmas}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                  </div>
                  {/* Campo de busca */}
                  <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
                    <input
                      type="text"
                      placeholder="Buscar disciplina..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300 md:w-auto"
                      style={{ minWidth: 0 }}
                    />
                    <button
                      type="button"
                      className="flex items-center gap-1 border rounded px-3 py-2 text-sm bg-muted hover:bg-muted/70 transition"
                      onClick={() => setFiltroModalOpen(true)}
                    >
                      <Filter className="w-4 h-4" />
                      Filtrar
                    </button>
                </div>
                
                  {/* Modal de filtro customizado */}
                  {filtroModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFiltroModalOpen(false)}>
                      <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-lg md:p-6 shadow border" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4 border-b pb-2">
                          <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">Filtro de matérias</h3>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setFiltroModalOpen(false)} className="hover:bg-gray-100">
                            ✕
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="font-semibold mb-2 text-sm text-gray-900">Dias da semana:</div>
                            <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2">
                              {diasSemana.map(dia => (
                                <label key={dia} className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={diasSelecionados.includes(dia)}
                                    onChange={e => {
                                      if (e.target.checked) setDiasSelecionados([...diasSelecionados, dia]);
                                      else setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
                                    }}
                                    className="accent-blue-600"
                                  />
                                  <span className="text-sm font-medium">{dia}</span>
                                </label>
                              ))}
                            </div>
                            <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para dias:</div>
                            <div className="space-y-2 md:flex md:gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaFiltroDia === 'OU'}
                                  onChange={() => setLogicaFiltroDia('OU')}
                                  className="accent-blue-600"
                                />
                                <span className="text-sm">OU (um dia ou outro)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaFiltroDia === 'E'}
                                  onChange={() => setLogicaFiltroDia('E')}
                                  className="accent-blue-600"
                                />
                                <span className="text-sm">E (um dia e outro)</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold mb-2 text-sm text-gray-900">Horários:</div>
                            <div className="grid grid-cols-4 md:flex md:flex-wrap gap-1 md:gap-2 max-h-32 overflow-y-auto">
                              {horariosGrade.map(horario => (
                                <label key={horario} className="flex items-center gap-1 p-1 md:p-2 border rounded text-xs md:text-sm bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={horariosSelecionados.includes(horario)}
                                    onChange={e => {
                                      if (e.target.checked) setHorariosSelecionados([...horariosSelecionados, horario]);
                                      else setHorariosSelecionados(horariosSelecionados.filter(h => h !== horario));
                                    }}
                                    className="accent-blue-600"
                                  />
                                  <span className="font-medium">{horario}</span>
                                </label>
                              ))}
                            </div>
                            <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para horários:</div>
                            <div className="space-y-2 md:flex md:gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaFiltroHorario === 'OU'}
                                  onChange={() => setLogicaFiltroHorario('OU')}
                                  className="accent-blue-600"
                                />
                                <span className="text-sm">OU (um horário ou outro)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaFiltroHorario === 'E'}
                                  onChange={() => setLogicaFiltroHorario('E')}
                                  className="accent-blue-600"
                                />
                                <span className="text-sm">E (um horário e outro)</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold mb-2 text-sm text-gray-900">Restrições de Dias (dias que NÃO quer):</div>
                            <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2">
                              {diasSemana.map(dia => (
                                <label key={dia} className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={diasRestritos.includes(dia)}
                                    onChange={e => {
                                      if (e.target.checked) setDiasRestritos([...diasRestritos, dia]);
                                      else setDiasRestritos(diasRestritos.filter(d => d !== dia));
                                    }}
                                    className="accent-red-600"
                                  />
                                  <span className="text-sm font-medium">{dia}</span>
                                </label>
                              ))}
                            </div>
                            <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para restrições de dias:</div>
                            <div className="space-y-2 md:flex md:gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaRestricoes === 'OU'}
                                  onChange={() => setLogicaRestricoes('OU')}
                                  className="accent-red-600"
                                />
                                <span className="text-sm">OU (um dia restrito ou outro)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaRestricoes === 'E'}
                                  onChange={() => setLogicaRestricoes('E')}
                                  className="accent-red-600"
                                />
                                <span className="text-sm">E (um dia restrito e outro)</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold mb-2 text-sm text-gray-900">Restrições de Horário (horários que NÃO quer):</div>
                            <div className="grid grid-cols-4 md:flex md:flex-wrap gap-1 md:gap-2 max-h-32 overflow-y-auto">
                              {horariosGrade.map(horario => (
                                <label key={horario} className="flex items-center gap-1 p-1 md:p-2 border rounded text-xs md:text-sm bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={horariosRestritos.includes(horario)}
                                    onChange={e => {
                                      if (e.target.checked) setHorariosRestritos([...horariosRestritos, horario]);
                                      else setHorariosRestritos(horariosRestritos.filter(h => h !== horario));
                                    }}
                                    className="accent-red-600"
                                  />
                                  <span className="font-medium">{horario}</span>
                                </label>
                              ))}
                            </div>
                            <div className="font-semibold mt-3 mb-2 text-sm text-gray-900">Lógica para restrições de horário:</div>
                            <div className="space-y-2 md:flex md:gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaRestricoesHorario === 'OU'}
                                  onChange={() => setLogicaRestricoesHorario('OU')}
                                  className="accent-red-600"
                                />
                                <span className="text-sm">OU (um horário restrito ou outro)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={logicaRestricoesHorario === 'E'}
                                  onChange={() => setLogicaRestricoesHorario('E')}
                                  className="accent-red-600"
                                />
                                <span className="text-sm">E (um horário restrito e outro)</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-4 border-t">
                            <button
                              type="button"
                              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-colors"
                              onClick={limparFiltro}
                            >
                              Limpar
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                              onClick={aplicarFiltro}
                            >
                              Aplicar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                      {Object.values(turmasPorDisciplina)
                        .filter(disciplina =>
                          (disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase())) &&
                          (
                            // Se não há filtro, mostra tudo
                            (diasSelecionados.length === 0 && horariosSelecionados.length === 0 && diasRestritos.length === 0 && horariosRestritos.length === 0) ||
                            disciplina.turmas.some(turma => {
                              const horarios = parseHorarios(turma.horarios);
                              
                              // Lógica para dias (filtro inclusivo)
                              let diasOk = true;
                              if (diasSelecionados.length > 0) {
                                if (logicaFiltroDia === 'OU') {
                                  diasOk = horarios.some(h => diasSelecionados.includes(Object.keys(mapSiglaParaNome).find(sigla => mapSiglaParaNome[sigla] === h.dia)));
                                } else {
                                  diasOk = diasSelecionados.every(diaSel => horarios.some(h => h.dia === mapSiglaParaNome[diaSel]));
                                }
                              }
                              
                              // Lógica para horários (filtro inclusivo)
                              let horariosOk = true;
                              if (horariosSelecionados.length > 0) {
                                if (logicaFiltroHorario === 'OU') {
                                  horariosOk = horarios.some(h => horariosSelecionados.includes(h.horarioInicio));
                                } else {
                                  horariosOk = horariosSelecionados.every(hSel => horarios.some(h => h.horarioInicio === hSel));
                                }
                              }
                              
                              // Lógica para restrições de dias (filtro exclusivo)
                              let restricoesDiasOk = true;
                              if (diasRestritos.length > 0) {
                                const diasTurma = horarios.map(h => Object.keys(mapSiglaParaNome).find(sigla => mapSiglaParaNome[sigla] === h.dia));
                                if (logicaRestricoes === 'OU') {
                                  // Se qualquer dia restrito está presente, exclui a turma
                                  restricoesDiasOk = !diasRestritos.some(diaRestrito => diasTurma.includes(diaRestrito));
                                } else {
                                  // Se todos os dias restritos estão presentes, exclui a turma
                                  restricoesDiasOk = !diasRestritos.every(diaRestrito => diasTurma.includes(diaRestrito));
                                }
                              }
                              
                              // Lógica para restrições de horários (filtro exclusivo)
                              let restricoesHorariosOk = true;
                              if (horariosRestritos.length > 0) {
                                const horariosTurma = horarios.map(h => h.horarioInicio);
                                if (logicaRestricoesHorario === 'OU') {
                                  // Se qualquer horário restrito está presente, exclui a turma
                                  restricoesHorariosOk = !horariosRestritos.some(horarioRestrito => horariosTurma.includes(horarioRestrito));
                                } else {
                                  // Se todos os horários restritos estão presentes, exclui a turma
                                  restricoesHorariosOk = !horariosRestritos.every(horarioRestrito => horariosTurma.includes(horarioRestrito));
                                }
                              }
                              
                              return diasOk && horariosOk && restricoesDiasOk && restricoesHorariosOk;
                            })
                          )
                        )
                        .map((disciplina, idx) => (
                          <div 
                            key={idx}
                            className="p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedTurma(disciplina.turmas[0])}
                          >
                            <div className="font-semibold text-xs md:text-sm mb-1">{disciplina.codigo}</div>
                            <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {disciplina.nome}
                            </div>
                            <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {disciplina.turmas.length} turma(s)
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {disciplina.turmas.reduce((total, t) => total + t.vagas, 0)} vagas
                            </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Histórico de Cursos Consultados */}
              {modoConversao === 'grade' && historicoCursos.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <History className="w-7 h-7 text-gray-700" />
                      <CardTitle className="text-xl font-bold text-gray-900">Histórico de Cursos Consultados</CardTitle>
                    </div>
                    <CardDescription className="text-base text-gray-700">
                      Clique em um curso para carregá-lo novamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {historicoCursos.map((nomeCurso, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleHistoricoCursosClick(nomeCurso)}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                        >
                          {nomeCurso}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" onClick={handleLimparHistoricoCursos}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar Histórico
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
                          </div>
                          
          {/* Grade Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-1">Grade Atual</h2>
                <p className="text-gray-600">
                  {modoConversao === 'individual' 
                    ? 'Visualize as disciplinas convertidas e organizadas'
                    : 'Visualize as disciplinas convertidas e organizadas'
                  }
                </p>
              </div>
              {gradeAtual.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleLimparGrade}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Grade
                </Button>
              )}
            </div>

            {gradeAtual.length === 0 ? (
              <Card>
                <CardContent className="p-8 md:p-12 text-center">
                  <Calendar className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">Grade vazia</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {modoConversao === 'individual' 
                      ? 'Converta uma disciplina e adicione à grade para visualizar.'
                      : 'Organize disciplinas e adicione turmas para visualizar a grade horária.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <GradeHoraria
                disciplinas={gradeAtual}
                onRemoverDisciplina={handleRemoverDisciplina}
                compact={false}
                showNames={false}
              />
            )}
          </div>
          </div>
        </div>

        {/* Dialog de Detalhes da Turma */}
        {selectedTurma && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTurma(null)}>
            <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedTurma.codigo}</h3>
                  <p className="text-muted-foreground">{selectedTurma.nome}</p>
                </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTurma(null)}>✕</Button>
                                        </div>
              
              <div className="space-y-6">
                {turmasPorDisciplina[selectedTurma.codigo]?.turmas.map((turma, index) => (
                  <div key={index} className="border rounded-lg p-4 md:p-6 bg-muted/30">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs md:text-sm px-3 py-1">Turma {turma.turma}</Badge>
                        <Badge variant="outline" className="text-xs md:text-sm px-3 py-1">{turma.vagas === 0 ? 'Sem informação' : turma.vagas + ' vagas'}</Badge>
                                      </div>
                                      <Button
                                        size="sm"
                        className="mt-2 md:mt-0 px-4 py-2 text-xs md:text-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                        onClick={() => {
                          handleAdicionarTurma(turma);
                          setSelectedTurma(null);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                                      </Button>
                                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold text-muted-foreground">Docente:</span>
                          <p className="mt-1">{turma.docente}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">Período:</span>
                          <p className="mt-1">{turma.periodo}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                                      <div>
                          <span className="font-semibold text-muted-foreground">Horários:</span>
                          <p className="mt-1">{turma.horarios}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {parseHorarios(turma.horarios).length > 0 ? (
                              parseHorarios(turma.horarios).map((h, idx) => (
                                <span key={idx} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-xs font-mono">
                                  {h.dia} {h.horarioInicio} - {h.horarioFim}
                                        </span>
                              ))
                            ) : (
                              <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Horário não informado</span>
                            )}
                          </div>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                </div>
              </div>
            )}

      {/* Modal de Detalhes da Alocação por Disciplina */}
      {selectedAlocacao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAlocacao(null)}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">{selectedAlocacao.codigo}</h3>
                <p className="text-muted-foreground">{selectedAlocacao.nome}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlocacao(null)}>✕</Button>
          </div>

            <div className="space-y-6">
              {selectedAlocacao.turmas.map((t, idx) => (
                <div key={idx} className="border rounded-lg p-4 md:p-6 bg-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div className="flex gap-2 flex-wrap items-center">
                      <span className="text-sm md:text-base font-medium">Turma {t.turma} (
                        <span className="font-normal">{t.vagasDisponiveis} vaga(s) restante(s)</span>
                      )</span>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 md:mt-0 px-4 py-2 text-xs md:text-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                      onClick={() => handleAdicionarAGradeFromAlocacao(t)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold text-muted-foreground">Docente:</span>
                        <p className="mt-1">{t.docente}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Período:</span>
                        <p className="mt-1">{t.periodo}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold text-muted-foreground">Horários:</span>
                        <p className="mt-1">{t.horarios || '(Sem informação)'}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {parseHorarios(t.horarios).length > 0 ? (
                            parseHorarios(t.horarios).map((h, idx2) => (
                              <span key={idx2} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-xs font-mono">
                                {h.dia} {h.horarioInicio} - {h.horarioFim}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Horário não informado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <span className="font-semibold text-muted-foreground">Reservado para:</span>
                    <div className="text-xs text-muted-foreground mb-2">
                      O número de vagas exibido abaixo refere-se à reserva inicial para cada curso. Para saber o saldo real de vagas para um curso específico, consulte o "Processamento da Matrícula" da matéria desejada.
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {t.reservas.length === 0 ? (
                        <span className="text-sm text-gray-500">Nenhuma reserva encontrada</span>
                      ) : (
                        t.reservas.map((res, i) => {
                          const nomeCurso = res.curso; // já inclui subáreas quando houver
                          return (
                            <div key={i} className="flex items-center border rounded px-3 py-2 bg-white">
                              <div className="text-sm">
                                <div className="font-medium">{nomeCurso} ({res.quantidade} vagas)</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de histórico de grades */}
      {showHistoricoGrades && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHistoricoGrades(false)}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Histórico de Grades Salvas</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowHistoricoGrades(false)} className="hover:bg-gray-100">
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {Object.keys(historicoGrades).length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhuma grade salva encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(historicoGrades).map(([nomeGrade, disciplinas]) => (
                    <div key={nomeGrade} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{nomeGrade}</h4>
                          <p className="text-sm text-muted-foreground">{disciplinas.length} disciplina(s)</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCarregarGrade(nomeGrade)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Carregar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoverGrade(nomeGrade)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {disciplinas.slice(0, 5).map((disciplina, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {disciplina.codigo}
                          </span>
                        ))}
                        {disciplinas.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{disciplinas.length - 5} mais
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de tutorial customizado */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTutorialModal(false)}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-3xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-bold">Como coletar dados no SIGAA</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTutorialModal(false)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Siga estes passos para extrair os dados corretamente do sistema da UFBA
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium text-sm">Acesse o SIGAA</p>
                    <a href="https://sigaa.ufba.br/sigaa/public/home.jsf" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      sigaa.ufba.br
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium text-sm">No menu lateral, clique em <strong>Graduação</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium text-sm">Clique em <strong>Cursos</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium text-sm">Pesquise pelo nome ou modalidade do curso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                  <div>
                    <p className="font-medium text-sm">Clique em <strong>Visualizar Página do Curso</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</div>
                  <div>
                    <p className="font-medium text-sm">No menu superior, vá em <strong>Ensino &gt; Turmas</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">7</div>
                  <div>
                    <p className="font-medium text-sm">Busque pelo <strong>Ano.Período</strong> ou <strong>Código da Disciplina</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">8</div>
                  <div>
                    <p className="font-medium text-sm">Clique em <strong>Buscar</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">9</div>
                  <div>
                    <p className="font-medium text-sm">Copie todo o <strong>bloco de informações</strong> da(s) matéria(s)</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm">Exemplo de dados copiados:</h4>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-xs font-mono space-y-1">
                    <div className="font-semibold">MATA01 - GEOMETRIA ANALÍTICA</div>
                    <div>Período/ Ano	Turma	Docente	Vgs Reservadas	Horários</div>
                    <div>2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanejadorSemestral;