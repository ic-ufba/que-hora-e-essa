import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  History,
  FileText,
  BookOpen,
  ExternalLink,
  Info
} from "lucide-react";
import { parseSigaaText, turmaToDisciplina, Turma, Disciplina } from "@/utils/sigaaParser";
import { GradeHoraria } from "@/components/GradeHoraria";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ConversaoSimples = () => {
  const [inputText, setInputText] = useState("");
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [gradeAtual, setGradeAtual] = useState<Disciplina[]>([]);
  const [historico, setHistorico] = useState<string[]>([]);
  const [historicoDisciplinas, setHistoricoDisciplinas] = useState<Disciplina[]>([]);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const { toast } = useToast();

  // Carrega a grade do localStorage ao inicializar
  useEffect(() => {
    const gradeSalva = localStorage.getItem('gradeHoraria');
    if (gradeSalva) {
      setGradeAtual(JSON.parse(gradeSalva));
    }
    
    const historicoSalvo = localStorage.getItem('historicoConversao');
    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }

    const historicoDisciplinasSalvo = localStorage.getItem('historicoDisciplinas');
    if (historicoDisciplinasSalvo) {
      setHistoricoDisciplinas(JSON.parse(historicoDisciplinasSalvo));
    }
  }, []);

  // Salva a grade no localStorage sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('gradeHoraria', JSON.stringify(gradeAtual));
  }, [gradeAtual]);

  // Salva o histórico no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoConversao', JSON.stringify(historico));
  }, [historico]);

  // Salva o histórico de disciplinas no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoDisciplinas', JSON.stringify(historicoDisciplinas));
  }, [historicoDisciplinas]);

  const limparTextoSigaa = (texto: string): string => {
    const lines = texto.split('\n');
    const disciplinasEncontradas: string[] = [];
    let currentDisciplina: string[] = [];
    let encontrouDisciplina = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Identifica início de uma disciplina - regex mais flexível
      const disciplinaMatch = line.match(/^([^\s-]+)\s*-\s*(.+)$/);
      if (disciplinaMatch) {
        // Se já temos uma disciplina sendo processada, salva ela
        if (encontrouDisciplina && currentDisciplina.length > 0) {
          disciplinasEncontradas.push(currentDisciplina.join('\n'));
        }
        
        // Inicia nova disciplina
        currentDisciplina = [line];
        encontrouDisciplina = true;
        continue;
      }
      
      // Se encontrou uma disciplina, coleta as linhas seguintes até encontrar outra disciplina
      if (encontrouDisciplina) {
        // Para quando encontrar outra disciplina ou linha vazia
        if (line === '' || line.match(/^([A-Z]{3,4}\d{2,3}(?:\.\d+)?)\s*-\s*(.+)$/)) {
          if (currentDisciplina.length > 0) {
            disciplinasEncontradas.push(currentDisciplina.join('\n'));
          }
          if (line.match(/^([A-Z]{3,4}\d{2,3}(?:\.\d+)?)\s*-\s*(.+)$/)) {
            currentDisciplina = [line];
          } else {
            encontrouDisciplina = false;
            currentDisciplina = [];
          }
        } else {
          currentDisciplina.push(line);
        }
      }
    }
    
    // Adiciona última disciplina se existir
    if (encontrouDisciplina && currentDisciplina.length > 0) {
      disciplinasEncontradas.push(currentDisciplina.join('\n'));
    }
    
    return disciplinasEncontradas.join('\n\n');
  };

  const validarEntrada = (texto: string): boolean => {
    const linhas = texto.trim().split('\n').filter(linha => linha.trim() !== '');
    
    if (linhas.length < 3) {
      toast({
        title: "Informação insuficiente",
        description: "É necessário pelo menos: código e nome da disciplina, cabeçalho da tabela e dados da turma.",
        variant: "destructive",
      });
      return false;
    }

    // Verifica se tem código e nome da disciplina - regex mais flexível
    const primeiraLinha = linhas[0];
    if (!primeiraLinha.match(/^[^\s-]+\s*-\s*.+$/)) {
      toast({
        title: "Formato inválido",
        description: "A primeira linha deve conter o código e nome da disciplina (ex: MATA01 - GEOMETRIA ANALÍTICA, GMAT0002 - ESTÁGIO SUPERVISIONADO I).",
        variant: "destructive",
      });
      return false;
    }

    // Verifica se tem horário
    const ultimaLinha = linhas[linhas.length - 1];
    if (!ultimaLinha.match(/\d+[MTN]\d+/)) {
      toast({
        title: "Horário não encontrado",
        description: "Não foi possível encontrar um horário válido (ex: 24T34, 7M456). Verifique se o horário está no formato correto.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleConverter = () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, cole o texto do SIGAA antes de converter.",
        variant: "destructive",
      });
      return;
    }

    if (!validarEntrada(inputText)) {
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
          title: "Nenhuma disciplina encontrada",
          description: "Verifique se o texto colado está no formato correto do SIGAA.",
          variant: "destructive",
        });
        return;
      }

      // Na conversão simples, aceita apenas a primeira turma
      const turmaUnica = turmas[0];
      const disciplinaConvertida = turmaToDisciplina(turmaUnica);
      setDisciplinas([disciplinaConvertida]);
      
      // Adiciona ao histórico
      const novoHistorico = [turmaUnica.codigo, ...historico.filter(h => h !== turmaUnica.codigo)].slice(0, 10);
      setHistorico(novoHistorico);
      
      // Adiciona a disciplina completa ao histórico
      const novoHistoricoDisciplinas = [disciplinaConvertida, ...historicoDisciplinas.filter(h => h.codigo !== turmaUnica.codigo)].slice(0, 10);
      setHistoricoDisciplinas(novoHistoricoDisciplinas);
      
      // Limpa o campo de texto
      setInputText("");
      
      toast({
        title: "Conversão realizada!",
        description: `Disciplina ${turmaUnica.codigo} convertida com sucesso.`,
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
        description: `${disciplina.codigo} carregada do histórico.`,
      });
    }
  };

  const handleAdicionarAGrade = () => {
    if (disciplinas.length === 0) {
      toast({
        title: "Nenhuma disciplina para adicionar",
        description: "Converta uma disciplina primeiro antes de adicionar à grade.",
        variant: "destructive",
      });
      return;
    }

    const disciplina = disciplinas[0];
    const disciplinaJaExiste = gradeAtual.find((d) => d.codigo === disciplina.codigo);

    if (disciplinaJaExiste) {
      toast({
        title: "Disciplina já existe na grade",
        description: "Esta disciplina já foi adicionada à grade (por código).",
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

  const handleLimparHistorico = () => {
    setHistorico([]);
    setHistoricoDisciplinas([]);
    localStorage.removeItem('historicoConversao');
    localStorage.removeItem('historicoDisciplinas');
    toast({
      title: "Histórico limpo",
      description: "O histórico de conversões foi limpo.",
    });
  };

  return (
    <div className="space-y-6">
        {/* Header */}
      <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold text-foreground">Conversão Simples</h1>
          <p className="text-muted-foreground mt-1">
            Converta códigos do SIGAA em horários legíveis
            </p>
          </div>
        </div>

      <div className="space-y-6">
          {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-4 md:space-y-6">
            {/* Campo de Conversão */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Converter Disciplina
                </CardTitle>
                <CardDescription>
                  Cole o texto de uma disciplina do SIGAA para converter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Texto do SIGAA</label>
                  <Textarea
                    placeholder="Cole aqui o texto de uma disciplina do SIGAA..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                    className="min-h-[120px]"
                  />
                </div>

                <Button onClick={handleConverter} className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Converter Disciplina
                </Button>
              </CardContent>
            </Card>

            {/* Formato Esperado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Formato Esperado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-3 md:p-4 rounded-lg">
                  <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <div>MATA01 - GEOMETRIA ANALÍTICA</div>
                    <div>Período/ Ano	Turma	Docente	Vgs Reservadas	Horários</div>
                    <div>2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)</div>
                  </div>
                  <div className="mt-2">
                    <button onClick={() => setShowTutorialModal(true)} className="text-blue-600 underline hover:text-blue-800 text-xs md:text-sm">Como acessar as informações no SIGAA</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-4 md:space-y-6">
            {/* Results */}
              <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Resultado da Conversão
                </CardTitle>
                <CardDescription>
                  {/* Mensagem removida, só aparece toast */}
                </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-3">
                  {disciplinas.length > 0 ? (
                    disciplinas.map((disciplina) => (
                      <div key={disciplina.codigo} className="p-3 md:p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm md:text-base">{disciplina.codigo}</span>
                          <Badge variant="secondary" className="text-xs">Turma {disciplina.turma}</Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-3">{disciplina.nome}</p>
                        <div className="text-xs md:text-sm">
                          <span className="font-medium">Horários:</span>
                          <div className="mt-1 space-y-1">
                            {disciplina.horarios.map((horario, index) => (
                              <div key={index} className="bg-background px-2 py-1 rounded text-xs">
                                {horario.dia} {horario.horarioInicio} - {horario.horarioFim}
                              </div>
                            ))}
                        </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 md:p-8 text-center text-muted-foreground">
                      <Calculator className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm md:text-base">Converta uma disciplina para ver o resultado</p>
                  </div>
            )}
          </div>

                {disciplinas.length > 0 && (
                  <Button onClick={handleAdicionarAGrade} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar à Grade
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Últimas Pesquisadas
                </CardTitle>
                <CardDescription>
                  Histórico das últimas disciplinas convertidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historico.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {historico.map((codigo, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted text-xs"
                          onClick={() => handleHistoricoClick(codigo)}
                        >
                          {codigo}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLimparHistorico}
                      className="mt-3"
                    >
                      Limpar Histórico
                    </Button>
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <History className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs md:text-sm">Nenhuma disciplina pesquisada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                <Calculator className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-base md:text-lg font-semibold mb-2">Grade vazia</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Converta disciplinas e adicione-as aqui para visualizar a grade horária.
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

export default ConversaoSimples;