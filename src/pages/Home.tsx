import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  BookOpen,
  ExternalLink,
  Calendar,
  Download,
  Clock,
  Filter,
  Users,
  CheckCircle,
  History,
  AlertTriangle,
  Minimize,
  Maximize
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/components/image/logo.png";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { parseHorarios } from "@/utils/sigaaParser";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Home = () => {
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showAvisoModal, setShowAvisoModal] = useState(false);
  const [showConversaoRapida, setShowConversaoRapida] = useState(false);
  const [codigosTexto, setCodigosTexto] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mostrarGrade, setMostrarGrade] = useState(false);

  // Verifica se é a primeira visita
  useEffect(() => {
    const avisoVisto = localStorage.getItem('avisoVisto');
    if (!avisoVisto) {
      setShowAvisoModal(true);
    }
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleFecharAviso = () => {
    setShowAvisoModal(false);
    localStorage.setItem('avisoVisto', 'true');
  };

  // Parser de códigos soltos: aceita separadores espaço, vírgula e barra
  // Exemplos: "24N12 4T12 7N34 246M1234"
  const codigosNormalizados = useMemo(() => {
    const texto = codigosTexto
      .replace(/\n/g, " ")
      .replace(/\s*\/\s*/g, " ")
      .trim();
    if (!texto) return [] as string[];
    return texto
      .split(/\s+/)
      .map((s) => s.trim())
      .filter((s) => /\d+[MTNmtn]\d+/.test(s));
  }, [codigosTexto]);

  type ItemResultado = {
    codigo: string;
    linhas: { dia: string; faixa: string }[];
    valido: boolean;
  };

  const resultados = useMemo<ItemResultado[]>(() => {
    return codigosNormalizados.map((codigo) => {
      // Normaliza para maiúsculas para o parser
      const codigoNormalizado = codigo.toUpperCase();
      const horarios = parseHorarios(codigoNormalizado);
      
      // Valida formato: dias 2-7, turnos M/T/N, horários válidos
      const match = codigo.match(/^(\d+)([MTNmtn])(\d+)$/);
      let valido = false;
      
      if (match) {
        const [, dias, turno, blocos] = match;
        const turnoUpper = turno.toUpperCase();
        
        // Valida dias (2-7)
        const diasValidos = dias.split('').every(d => /^[2-7]$/.test(d));
        
        // Valida turno (M, T, N)
        const turnoValido = /^[MTN]$/.test(turnoUpper);
        
        // Valida blocos de horário baseado no turno
        let blocosValidos = false;
        if (turnoUpper === 'M') {
          blocosValidos = blocos.split('').every(b => /^[1-6]$/.test(b));
        } else if (turnoUpper === 'T') {
          blocosValidos = blocos.split('').every(b => /^[1-6]$/.test(b));
        } else if (turnoUpper === 'N') {
          blocosValidos = blocos.split('').every(b => /^[1-4]$/.test(b));
        }
        
        valido = diasValidos && turnoValido && blocosValidos;
      }
      
      const linhas = horarios.map((h) => ({
        dia: h.dia,
        faixa: `${h.horarioInicio} às ${h.horarioFim}`,
      }));
      return { codigo, linhas, valido };
    });
  }, [codigosNormalizados]);

  // Organiza horários por dia da semana para a mini grade
  const horariosPorDia = useMemo(() => {
    const dias = {
      'Segunda': [],
      'Terça': [],
      'Quarta': [],
      'Quinta': [],
      'Sexta': [],
      'Sábado': []
    };
    
    resultados.forEach(res => {
      if (res.valido) {
        res.linhas.forEach(horario => {
          if (dias[horario.dia]) {
            dias[horario.dia].push({
              codigo: res.codigo,
              horario: horario.faixa,
              // Extrai turno e número do horário para ordenação
              turno: horario.faixa.includes('07:') || horario.faixa.includes('08:') || horario.faixa.includes('09:') || horario.faixa.includes('10:') || horario.faixa.includes('11:') ? 'M' :
                     horario.faixa.includes('13:') || horario.faixa.includes('14:') || horario.faixa.includes('15:') || horario.faixa.includes('16:') || horario.faixa.includes('17:') ? 'T' : 'N',
              numeroHorario: parseInt(horario.faixa.match(/(\d{1,2}):/)?.[1] || '0')
            });
          }
        });
      }
    });
    
    // Ordena os horários de cada dia: M (manhã) → T (tarde) → N (noite), e depois por horário
    Object.keys(dias).forEach(dia => {
      dias[dia].sort((a, b) => {
        // Primeiro ordena por turno: M (0) → T (1) → N (2)
        const turnoOrder = { 'M': 0, 'T': 1, 'N': 2 };
        const turnoDiff = turnoOrder[a.turno] - turnoOrder[b.turno];
        
        if (turnoDiff !== 0) return turnoDiff;
        
        // Se o turno for o mesmo, ordena por horário (menor para maior)
        return a.numeroHorario - b.numeroHorario;
      });
      
      // Remove as propriedades de ordenação, mantendo apenas o necessário para a grade
      dias[dia] = dias[dia].map(({ codigo, horario }) => ({ codigo, horario }));
    });
    
    return dias;
  }, [resultados]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-center mt-8 mb-4">
        <img src={logo} alt="Logo QueHoraÉEssa?" className="w-16 h-16 rounded-lg object-contain bg-white mb-2" />
        <span className="text-2xl md:text-3xl font-bold text-gray-900">QueHoraÉEssa?</span>
        </div>

      {/* Boas-vindas */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mt-10 mb-8 text-center">
        <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">Planeje seu semestre com facilidade</h1>
        <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto">Transforme códigos confusos do SIGAA em horários claros, organize sua grade personalizada e visualize conflitos de forma simples e moderna.</p>
      </section>

      {/* Botões de ação principais */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/planejador" className="w-full sm:w-auto">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full">
              <Calendar className="w-5 h-5 mr-2" />
              Começar a Planejar
            </Button>
          </Link>
          <Button 
            size="lg"
            onClick={() => setShowConversaoRapida(true)}
            className="px-8 py-3 text-lg w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Conversão Rápida
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => setShowTutorialModal(true)}
            className="px-8 py-3 text-lg w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Como Coletar Dados
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">Escolha entre conversão individual ou completa</p>
      </section>

      {/* Funcionalidades principais */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversão Individual */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Conversão Individual</h2>
            </div>
            <p className="text-gray-700 mb-4">Converta rapidamente o horário de uma disciplina específica do SIGAA em horários legíveis e organizados.</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Conversão instantânea de uma disciplina</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Histórico de conversões</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Visualize matérias fora da sua grade</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Foco total em uma única disciplina por vez</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Teste encaixes na sua grade em segundos</span>
              </div>
            </div>
            
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">Ideal para:</p>
              <p className="text-xs text-blue-800">Quando você quer saber o horário de uma matéria específica ou fazer uma consulta rápida.</p>
            </div>
          </div>

          {/* Conversão Completa */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h2 className="text-xl font-bold text-indigo-900">Conversão Completa</h2>
            </div>
            <p className="text-gray-700 mb-4">Organize sua grade personalizada convertendo todas as disciplinas do semestre e visualize conflitos de horários.</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Conversão de múltiplas disciplinas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Filtros avançados por dia e horário</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Detecção automática de conflitos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Sem precisar filtrar informações</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Informações de turmas e professores</span>
              </div>
            </div>
            
            <div className="bg-indigo-100 p-3 rounded-lg">
              <p className="text-sm text-indigo-900 font-medium mb-2">Ideal para:</p>
              <p className="text-xs text-indigo-800">Planejar todo o semestre, visualizar conflitos e organizar sua grade de forma eficiente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos do sistema */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Recursos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Conversão e Processamento */}
          <div className="text-center">
            <Calculator className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Conversão Rápida</h3>
            <p className="text-sm text-gray-600">Converta múltiplos códigos simultaneamente com validação automática</p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Conversão Inteligente</h3>
            <p className="text-sm text-gray-600">Converte automaticamente códigos do SIGAA em horários legíveis</p>
          </div>
          
          {/* Organização e Filtros */}
          <div className="text-center">
            <Filter className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Filtros Avançados</h3>
            <p className="text-sm text-gray-600">Filtre disciplinas por dia, horário e restrições personalizadas</p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Detecção de Conflitos</h3>
            <p className="text-sm text-gray-600">Identifique automaticamente conflitos de horários entre disciplinas</p>
          </div>
          
          {/* Persistência e Histórico */}
          <div className="text-center">
            <History className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Histórico de Cursos</h3>
            <p className="text-sm text-gray-600">Acesse rapidamente cursos consultados anteriormente</p>
          </div>
          <div className="text-center">
            <Download className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Salvar Grades</h3>
            <p className="text-sm text-gray-600">Salve e carregue suas grades personalizadas com nomes customizados</p>
          </div>
          
          {/* Exportação e Integração */}
          <div className="text-center">
            <Download className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Exportação</h3>
            <p className="text-sm text-gray-600">Exporte sua grade para calendários digitais (Google Calendar, Outlook, etc.)</p>
          </div>
          <div className="text-center">
            <Calendar className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Grade Visual</h3>
            <p className="text-sm text-gray-600">Visualize sua grade semanal em formato de calendário interativo</p>
          </div>
        </div>
      </section>

      {/* Modal de aviso */}
      {showAvisoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleFecharAviso}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">ATENÇÃO</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={handleFecharAviso}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                O <strong>QueHoraÉEssa?</strong> é uma ferramenta independente, criada para auxiliar estudantes no planejamento de horários.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <p className="text-sm text-gray-700">Não temos vínculo institucional com a UFBA ou com o SIGAA.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <p className="text-sm text-gray-700">Não operamos, gerenciamos ou decidimos nada sobre o sistema SIGAA.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <p className="text-sm text-gray-700">Nosso objetivo é apenas facilitar a visualização e organização de horários para o seu planejamento acadêmico.</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleFecharAviso}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entendi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de tutorial */}
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

      {/* Conversão Rápida - Modal Desktop / Drawer Mobile */}
      {showConversaoRapida && (
        isMobile ? (
          <Dialog open={showConversaoRapida} onOpenChange={setShowConversaoRapida}>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Conversão Rápida</h3>
                </div>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Ex.: 24N12 4T12 7N34 246M1234"
                  value={codigosTexto}
                  onChange={(e) => setCodigosTexto(e.target.value)}
                />
                <div className="flex gap-2">
                  <div className="flex-1"></div>
                  <Button variant="outline" size="sm" onClick={() => setCodigosTexto("")}>Limpar</Button>
                </div>
                <Separator />
                {/* Explicação só aparece quando não há resultados */}
                {resultados.length === 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="explicacao">
                      <AccordionTrigger className="text-sm text-gray-500 hover:text-gray-700">
                        Como funciona a conversão?
                      </AccordionTrigger>
                      <AccordionContent>
                        <Card>
                          <CardContent className="p-3 space-y-2 text-sm">
                            <p className="text-gray-700">Explicação do código:</p>
                            <p className="font-mono">24N12 → 2 e 4 / N / 1 e 2</p>
                            <p>Ordem: <strong>Dias da semana</strong> / <strong>Turno</strong> / <strong>Horários</strong></p>
                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <div className="font-medium">Dias</div>
                                <ul className="list-disc pl-4 text-gray-700 text-xs">
                                  <li>2 - Segunda</li>
                                  <li>3 - Terça</li>
                                  <li>4 - Quarta</li>
                                  <li>5 - Quinta</li>
                                  <li>6 - Sexta</li>
                                  <li>7 - Sábado</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium">Turnos</div>
                                <ul className="list-disc pl-4 text-gray-700 text-xs">
                                  <li>M - Manhã</li>
                                  <li>T - Tarde</li>
                                  <li>N - Noite</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium">Horários Manhã</div>
                                <ul className="list-disc pl-4 text-gray-700 text-xs">
                                  <li>1 - 07:00</li>
                                  <li>2 - 07:55</li>
                                  <li>3 - 08:50</li>
                                  <li>4 - 09:45</li>
                                  <li>5 - 10:40</li>
                                  <li>6 - 11:35</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium">Horários Tarde</div>
                                <ul className="list-disc pl-4 text-gray-700 text-xs">
                                  <li>1 - 13:00</li>
                                  <li>2 - 13:55</li>
                                  <li>3 - 14:50</li>
                                  <li>4 - 15:45</li>
                                  <li>5 - 16:40</li>
                                  <li>6 - 17:35</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium">Horários Noite</div>
                                <ul className="list-disc pl-4 text-gray-700 text-xs">
                                  <li>1 - 18:30</li>
                                  <li>2 - 19:25</li>
                                  <li>3 - 20:20</li>
                                  <li>4 - 21:15</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                <div className="space-y-2">
                  {resultados.length === 0 && (
                    <p className="text-sm text-muted-foreground">Digite um ou mais códigos para ver a conversão.</p>
                  )}
                  {resultados.map((res) => (
                    <Card key={res.codigo} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-base font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
                            {res.codigo}
                          </div>
                          {!res.valido && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                              Formato inválido
                            </span>
                          )}
                        </div>
                        {res.valido && res.linhas.length > 0 ? (
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-1">
                              Horários:
                            </div>
                            <ul className="space-y-1">
                              {res.linhas.map((l, idx) => (
                                <li key={idx} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs text-gray-700 font-medium">{l.dia}</span>
                                  <span className="text-xs text-gray-500">—</span>
                                  <span className="text-xs text-blue-700 font-mono">{l.faixa}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-xs text-red-700">
                              {!res.valido ? "Formato inválido: verifique dias (2-7), turnos (M/T/N) e horários válidos." : "Código inválido."}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Botão para mostrar/ocultar a mini grade */}
                  {resultados.some(r => r.valido) && (
                    <div className="pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarGrade(!mostrarGrade)}
                        className="w-full"
                      >
                        {mostrarGrade ? 'Ocultar Grade' : 'Visualizar Grade'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Mini Grade Semanal */}
                  {mostrarGrade && resultados.some(r => r.valido) && (
                    <Card>
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm mb-2 text-center">Grade Semanal</h4>
                        <div className="grid grid-cols-6 gap-1 text-xs">
                          {/* Cabeçalho dos dias */}
                          <div className="text-center font-medium text-gray-600 p-1 text-xs">Seg</div>
                          <div className="text-center font-medium text-gray-600 p-1 text-xs">Ter</div>
                          <div className="text-center font-medium text-gray-600 p-1 text-xs">Qua</div>
                          <div className="text-center font-medium text-xs">Qui</div>
                          <div className="text-center font-medium text-gray-600 p-1 text-xs">Sex</div>
                          <div className="text-center font-medium text-gray-600 p-1 text-xs">Sáb</div>
                          
                          {/* Quadrinhos dos horários */}
                          {Object.entries(horariosPorDia).map(([dia, horarios]) => (
                            <div key={dia} className="min-h-[50px] border rounded p-1 bg-gray-50">
                              {horarios.length > 0 ? (
                                <div className="space-y-0.5">
                                  {horarios.map((h, idx) => (
                                    <div key={idx} className="bg-blue-100 p-1 rounded text-[9px] leading-tight">
                                      <div className="text-blue-700">{h.horario}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-center text-[9px] leading-tight pt-1">-</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={showConversaoRapida} onOpenChange={setShowConversaoRapida}>
            <DialogContent className="w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Conversão Rápida</h3>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Ex.: 24N12 4T12 7N34 246M1234"
                  value={codigosTexto}
                  onChange={(e) => setCodigosTexto(e.target.value)}
                />
                <div className="flex gap-2">
                  <div className="flex-1"></div>
                  <Button variant="outline" size="sm" onClick={() => setCodigosTexto("")}>Limpar</Button>
                </div>
                <Separator />
                {/* Explicação só aparece quando não há resultados */}
                {resultados.length === 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="explicacao">
                      <AccordionTrigger className="text-sm text-gray-500 hover:text-gray-700">
                        Como funciona a conversão?
                      </AccordionTrigger>
                      <AccordionContent>
                        <Card>
                          <CardContent className="p-4 space-y-2 text-sm">
                            <p className="text-gray-700">Explicação do código:</p>
                            <p className="font-mono">24N12 → 2 e 4 / N / 1 e 2</p>
                            <p>Ordem: <strong>Dias da semana</strong> / <strong>Turno</strong> / <strong>Horários</strong></p>
                            <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
                              <div>
                                <div className="font-medium">Dias</div>
                                <ul className="list-disc pl-5 text-gray-700">
                                  <li>2 - Segunda</li>
                                  <li>3 - Terça</li>
                                  <li>4 - Quarta</li>
                                  <li>5 - Quinta</li>
                                  <li>6 - Sexta</li>
                                  <li>7 - Sábado</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium">Turnos</div>
                                <ul className="list-disc pl-5 text-gray-700">
                                  <li>M - Manhã</li>
                                  <li>T - Tarde</li>
                                  <li>N - Noite</li>
                                </ul>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <div className="font-medium">Horários Manhã</div>
                                  <ul className="list-disc pl-5 text-gray-700">
                                    <li>1 - 07:00</li>
                                    <li>2 - 07:55</li>
                                    <li>3 - 08:50</li>
                                    <li>4 - 09:45</li>
                                    <li>5 - 10:40</li>
                                    <li>6 - 11:35</li>
                                  </ul>
                                </div>
                                <div>
                                  <div className="font-medium">Horários Tarde</div>
                                  <ul className="list-disc pl-5 text-gray-700">
                                    <li>1 - 13:00</li>
                                    <li>2 - 13:55</li>
                                    <li>3 - 14:50</li>
                                    <li>4 - 15:45</li>
                                    <li>5 - 16:40</li>
                                    <li>6 - 17:35</li>
                                  </ul>
                                </div>
                                <div>
                                  <div className="font-medium">Horários Noite</div>
                                  <ul className="list-disc pl-5 text-gray-700">
                                    <li>1 - 18:30</li>
                                    <li>2 - 19:25</li>
                                    <li>3 - 20:20</li>
                                    <li>4 - 21:15</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                <div className="space-y-3">
                  {resultados.length === 0 && (
                    <p className="text-sm text-muted-foreground">Digite um ou mais códigos para ver a conversão.</p>
                  )}
                  {resultados.map((res) => (
                    <Card key={res.codigo} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-md">
                            {res.codigo}
                          </div>
                          {!res.valido && (
                            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                              Formato inválido
                            </span>
                          )}
                        </div>
                        {res.valido && res.linhas.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
                              Horários:
                            </div>
                            <ul className="space-y-2">
                              {res.linhas.map((l, idx) => (
                                <li key={idx} className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700 font-medium">{l.dia}</span>
                                  <span className="text-sm text-gray-500">—</span>
                                  <span className="text-sm text-blue-700 font-mono">{l.faixa}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">
                              {!res.valido ? "Formato inválido: verifique dias (2-7), turnos (M/T/N) e horários válidos." : "Código inválido."}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Botão para mostrar/ocultar a mini grade */}
                  {resultados.some(r => r.valido) && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarGrade(!mostrarGrade)}
                        className="w-full"
                      >
                        {mostrarGrade ? 'Ocultar Grade' : 'Visualizar Grade'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Mini Grade Semanal */}
                  {mostrarGrade && resultados.some(r => r.valido) && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-3 text-center">Grade Semanal</h4>
                        <div className="grid grid-cols-6 gap-1 text-xs">
                          {/* Cabeçalho dos dias */}
                          <div className="text-center font-medium text-gray-600 p-1">Seg</div>
                          <div className="text-center font-medium text-gray-600 p-1">Ter</div>
                          <div className="text-center font-medium text-gray-600 p-1">Qua</div>
                          <div className="text-center font-medium text-gray-600 p-1">Qui</div>
                          <div className="text-center font-medium text-gray-600 p-1">Sex</div>
                          <div className="text-center font-medium text-gray-600 p-1">Sáb</div>
                          
                          {/* Quadrinhos dos horários */}
                          {Object.entries(horariosPorDia).map(([dia, horarios]) => (
                            <div key={dia} className="min-h-[60px] border rounded p-1 bg-gray-50">
                              {horarios.length > 0 ? (
                                <div className="space-y-1">
                                  {horarios.map((h, idx) => (
                                    <div key={idx} className="bg-blue-100 p-1 rounded text-[10px] leading-tight">
                                      <div className="text-blue-700">{h.horario}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-center text-[10px] leading-tight pt-2">-</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
};

export default Home;