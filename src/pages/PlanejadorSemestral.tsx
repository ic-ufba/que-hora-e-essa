import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle,
  FileText,
  Users,
  Clock,
  BookOpen,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { parseSigaaText, turmaToDisciplina, Turma, parseHorarios, Disciplina } from "@/utils/sigaaParser";
import { GradeHoraria } from "@/components/GradeHoraria";
import { useToast } from "@/hooks/use-toast";

const PlanejadorSemestral = () => {
  const [inputText, setInputText] = useState("");
  const [turmasOrganizadas, setTurmasOrganizadas] = useState<Turma[]>([]);
  const [gradeAtual, setGradeAtual] = useState<Disciplina[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

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
  }, []);

  // Salva a grade no localStorage sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('gradeHoraria', JSON.stringify(gradeAtual));
  }, [gradeAtual]);

  // Salva turmas organizadas no localStorage sempre que elas mudarem
  useEffect(() => {
    localStorage.setItem('turmasOrganizadas', JSON.stringify(turmasOrganizadas));
  }, [turmasOrganizadas]);

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
      setInputText("");
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

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planejamento Semestral</h1>
            <p className="text-muted-foreground mt-1">
              Organize todas as suas disciplinas e visualize conflitos
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Converter Disciplinas
                </CardTitle>
                <CardDescription>
                  Cole o texto completo do SIGAA com todas as disciplinas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">Instruções:</h4>
                  <div className="text-xs md:text-sm text-blue-700 space-y-1">
                    <p>1. Acesse a página de turmas no SIGAA (<button onClick={() => setShowTutorialModal(true)} className="text-blue-600 underline hover:text-blue-800">Como acessar as informações no SIGAA</button>)</p>
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
                
                <Button onClick={handleConverter} className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Organizar Turmas
                </Button>
              </CardContent>
            </Card>

            {/* Turmas Organizadas */}
            {turmasOrganizadas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Turmas Organizadas
                  </CardTitle>
                  <CardDescription>
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
                      Limpar Turmas
                    </Button>
                  </div>
                  {/* Campo de busca */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Buscar disciplina..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {Object.values(turmasPorDisciplina)
                      .filter(disciplina =>
                        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((disciplina) => (
                        <div 
                          key={disciplina.codigo}
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
                          </div>
                          
          {/* Grade Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">Grade Atual</h2>
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
                    Organize disciplinas e adicione turmas para visualizar a grade horária.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <GradeHoraria
                disciplinas={gradeAtual}
                onRemoverDisciplina={handleRemoverDisciplina}
                compact={true}
              />
            )}
                                        </div>
        </div>

        {/* Dialog de Detalhes da Turma */}
        {selectedTurma && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedTurma.codigo}</h3>
                  <p className="text-muted-foreground">{selectedTurma.nome}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTurma(null)}>
                  ✕
                </Button>
              </div>
                          
              <div className="space-y-6">
                {/* Lista todas as turmas da disciplina */}
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
                          {/* Horários convertidos */}
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
          </div>

      {/* Tutorial Modal */}
      <Dialog open={showTutorialModal} onOpenChange={setShowTutorialModal}>
        <DialogContent className="max-w-xs w-full mx-auto md:mx-0 p-3 md:p-4 rounded-xl !left-1/2 !-translate-x-1/2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-lg font-bold">Como coletar os dados no SIGAA?</span>
            </DialogTitle>
            <DialogDescription className="mb-4">
              Siga estes passos para extrair os dados corretamente do sistema da UFBA
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">Acesse o SIGAA</p>
                      <a href="https://sigaa.ufba.br/sigaa/public/home.jsf" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1">
                        https://sigaa.ufba.br/sigaa/public/home.jsf
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">No menu lateral, clique em <strong>Graduação</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">Clique em <strong>Cursos</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">Pesquise pelo nome ou modalidade do curso</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">Clique em <strong>Visualizar Página do Curso</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">6</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">No menu superior, vá em <strong>Ensino &gt; Turmas</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">7</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">Busque pelo <strong>Ano.Período</strong> ou <strong>Código da Disciplina</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">8</div>
                    <div>
                      <p className="font-medium text-sm md:text-base">Clique em <strong>Buscar</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">9</div>
                  <div>
                      <p className="font-medium text-sm md:text-base">Copie todo o <strong>bloco de informações</strong> da(s) matéria(s)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Exemplo de Dados */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm md:text-base">Exemplo de dados copiados:</h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border">
                  <div className="text-xs md:text-sm font-mono space-y-1">
                    <div className="font-semibold">MATA01 - GEOMETRIA ANALÍTICA</div>
                    <div>Período/ Ano	Turma	Docente	Vgs Reservadas	Horários</div>
                    <div>2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)</div>
                  </div>
          </div>
        </div>
      </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanejadorSemestral;