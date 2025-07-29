import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Disciplina } from "@/utils/sigaaParser";
import { detectConflicts } from "@/utils/sigaaParser";
import { Trash2, Info, AlertTriangle, Clock, User, BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";

interface GradeHorariaProps {
  disciplinas: Disciplina[];
  onRemoverDisciplina?: (codigo: string) => void;
  compact?: boolean;
}

// Definição dos horários específicos da grade (baseado na tabela UFBA)
const HORARIOS_GRADE = [
  '07:00', '07:55', '08:50', '09:45', '10:40', '11:35', '13:00', '13:55', '14:50', '15:45', '16:40', '17:35', '18:30', '19:25', '20:20', '21:15'
];

const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

// Mapeamento de horários para blocos do SIGAA (baseado na tabela UFBA)
const HORARIO_PARA_BLOCO: { [key: string]: string } = {
  '07:00': 'M1', '07:55': 'M2', '08:50': 'M3', '09:45': 'M4', '10:40': 'M5', '11:35': 'M6',
  '13:00': 'T1', '13:55': 'T2', '14:50': 'T3', '15:45': 'T4', '16:40': 'T5', '17:35': 'T6',
  '18:30': 'N1', '19:25': 'N2', '20:20': 'N3', '21:15': 'N4'
};

export const GradeHoraria = ({ disciplinas, onRemoverDisciplina, compact = false }: GradeHorariaProps) => {
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [selectedConflictCell, setSelectedConflictCell] = useState<string | null>(null);
  const [conflictsOpen, setConflictsOpen] = useState(false);
  const [showDetailed, setShowDetailed] = useState(!compact);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  
  const conflicts = detectConflicts(disciplinas);
  
  // Função para converter dia do SIGAA para formato da grade
  const getDiaSigaa = (dia: string): string => {
    const mapeamento = {
      'Segunda': 'SEG',
      'Terça': 'TER', 
      'Quarta': 'QUA',
      'Quinta': 'QUI',
      'Sexta': 'SEX',
      'Sábado': 'SAB'
    };
    return mapeamento[dia] || 'SEG';
  };
  
  // Cria uma matriz para representar a grade
  const createGrade = () => {
    const grade: { [key: string]: { [key: string]: Disciplina[] } } = {};
    
    DIAS_SEMANA.forEach(dia => {
      grade[dia] = {};
      HORARIOS_GRADE.forEach(horario => {
        grade[dia][horario] = [];
      });
    });
    
    // Preenche a grade com as disciplinas
    disciplinas.forEach(disciplina => {
      disciplina.horarios.forEach(horario => {
        if (horario.horarioInicio) {
          const diaSigaa = getDiaSigaa(horario.dia);
          
          if (grade[diaSigaa] && grade[diaSigaa][horario.horarioInicio]) {
            grade[diaSigaa][horario.horarioInicio].push(disciplina);
          }
        }
      });
    });
    
    return grade;
  };

  const grade = createGrade();
  
  const isConflict = (dia: string, horario: string) => {
    const disciplinasNaCell = grade[dia][horario];
    return disciplinasNaCell.length > 1;
  };

  const getEventColor = (disciplina: Disciplina, conflict = false) => {
    // Cores predefinidas para as disciplinas
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white', 
      'bg-purple-500 text-white',
      'bg-orange-500 text-white',
      'bg-red-500 text-white',
      'bg-teal-500 text-white',
      'bg-pink-500 text-white',
      'bg-indigo-500 text-white',
      'bg-yellow-500 text-black',
      'bg-cyan-500 text-white',
      'bg-lime-500 text-black',
      'bg-amber-500 text-black'
    ];
    
    // Gera um índice baseado no código da disciplina para manter consistência
    let hash = 0;
    for (let i = 0; i < disciplina.codigo.length; i++) {
      const char = disciplina.codigo.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Converte para 32bit integer
    }
    
    const index = Math.abs(hash) % colors.length;
    // Adiciona borda vermelha se for conflito
    return `${colors[index]} ${conflict ? 'border-2 border-red-500' : ''}`;
  };

  const getCellContent = (dia: string, horario: string) => {
    const disciplinasNaCell = grade[dia][horario];
    if (disciplinasNaCell.length === 0) return null;
    const isConflicted = isConflict(dia, horario);
    // Versão simples: só código, detalhada: código + nome
    return (
      <div className="flex flex-col gap-1 w-full h-full">
        {disciplinasNaCell.map((disciplina) => (
          <div
            key={disciplina.codigo}
            className={`event-block ${getEventColor(disciplina, isConflicted)} cursor-pointer mb-1`}
            onClick={() => setSelectedDisciplina(disciplina)}
      >
            <div className="font-semibold text-xs truncate text-center">{disciplina.codigo}</div>
            {showDetailed && !compact && (
              <div className="text-[10px] md:text-xs opacity-90 truncate text-center">{disciplina.nome}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Conflitos Alert - agora como accordion */}
      {Object.keys(conflicts).length > 0 && (
        <div className="flex flex-col items-center justify-center w-full my-2">
          <div className="flex items-center gap-1 text-red-800 font-bold text-xs md:text-base">
            <AlertTriangle className="h-5 w-5 mr-1 text-red-500" />
            <span>Conflito de Horários Detectados</span>
          </div>
          {conflictsOpen && (
            <div className="pt-1 pb-2">
              <div className="space-y-1">
              {Object.entries(conflicts).map(([key, disciplinasCodigos]) => {
                const [dia, bloco] = key.split('-');
                return (
                    <div key={key} className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-red-700 text-xs">{dia} {bloco}:</span>
                      {disciplinasCodigos.map((codigo) => {
                        const disciplina = disciplinas.find(d => d.codigo === codigo);
                        if (!disciplina) return null;
                        return (
                          <div
                            key={codigo}
                            className={`px-2 py-0.5 rounded-lg cursor-pointer text-xs font-semibold ${getEventColor(disciplina, true)} hover:scale-105 transition-transform`}
                            onClick={() => setSelectedDisciplina(disciplina)}
                          >
                            {disciplina.codigo}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
            </div>
          )}
        </div>
      )}

      {/* Grade Horária */}
      <div className="w-full">
        {/* Botão de alternância de visualização - só na tela de grade */}
        {!compact && (
          <div className="flex items-center justify-end mb-2 gap-2">
            <span className="text-xs font-medium text-muted-foreground">Simples</span>
            <Switch checked={showDetailed} onCheckedChange={setShowDetailed} />
            <span className="text-xs font-medium text-muted-foreground">Detalhada</span>
          </div>
        )}
        <div className={`calendar-grid mobile-compact responsive-grade max-w-full md:max-w-4xl mx-auto`}>
          {/* Headers */}
          {/* 1. Inverter posição de Horário e Período no cabeçalho */}
          <div className="day-header bg-muted/50">
            <div className="responsive-text-sm font-semibold">Período</div>
            <div className="text-xs text-muted-foreground">Horário</div>
          </div>
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="day-header">
              <div className="responsive-text-sm font-semibold">{dia}</div>
            </div>
              ))}
          
          {/* Time slots - cada linha é um horário */}
          {HORARIOS_GRADE.map((horario) => (
            <React.Fragment key={horario}>
              {/* Célula do horário */}
              <div className={`calendar-cell border-r bg-muted/30 ${compact ? 'compact' : ''}`}>
                <div className="time-slot text-center responsive-text-sm font-medium">
                  {horario}
                </div>
              </div>
              {/* Células dos dias para este horário */}
              {DIAS_SEMANA.map((dia) => (
                <div key={`${dia}-${horario}`} className={`calendar-cell ${compact ? 'compact' : ''}`}>
                  {getCellContent(dia, horario)}
                </div>
              ))}
            </React.Fragment>
          ))}
                    </div>
      </div>

      {/* Disciplina Details Dialog */}
      <Dialog open={!!selectedDisciplina} onOpenChange={() => setSelectedDisciplina(null)}>
        <DialogContent className="max-w-sm w-full mx-auto md:mx-0 p-4 md:p-8 rounded-xl !left-1/2 !-translate-x-1/2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg font-bold">Detalhes da Disciplina</span>
            </DialogTitle>
            <DialogDescription className="mb-3 md:mb-4 text-xs md:text-sm">
              Informações completas sobre a disciplina selecionada
            </DialogDescription>
          </DialogHeader>
          {selectedDisciplina && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Badge variant="secondary" className={`text-sm md:text-base px-2 md:px-3 py-1 ${getEventColor(selectedDisciplina)}`}>{selectedDisciplina.codigo}</Badge>
                  <span className="font-semibold text-base md:text-lg">{selectedDisciplina.nome}</span>
                </div>
                <div className="flex gap-2">
                  {onRemoverDisciplina && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        onRemoverDisciplina(selectedDisciplina.codigo);
                        setSelectedDisciplina(null);
                      }}
                      className="flex-1 text-xs md:text-sm"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Professor:</span>
                  <span className="font-medium">{selectedDisciplina.professor}</span>
                </div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Turma:</span>
                  <span className="font-medium">{selectedDisciplina.turma}</span>
                </div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Vagas:</span>
                  <span className="font-medium">{selectedDisciplina.vagas === 0 ? 'Sem informação' : selectedDisciplina.vagas}</span>
                </div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-medium">{selectedDisciplina.periodo}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-xs md:text-sm mb-1">Horários:</h4>
                <div className="space-y-1">
                  {selectedDisciplina.horarios.map((horario, index) => (
                    <div key={index} className="flex items-center justify-between p-1.5 md:p-2 bg-muted/50 rounded text-xs md:text-sm">
                      <span>{horario.dia}</span>
                      <Badge variant="outline" className="text-xs">
                        {horario.bloco} ({horario.horarioInicio} - {horario.horarioFim})
                    </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tutorial Modal */}
      <Dialog open={showTutorialModal} onOpenChange={setShowTutorialModal}>
        <DialogContent className="max-w-2xl w-full mx-auto md:mx-0 p-6 md:p-10 rounded-xl !left-1/2 !-translate-x-1/2">
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
                    <div>Período/ Ano\tTurma\tDocente\tVgs Reservadas\tHorários</div>
                    <div>2025.2\t03\tJAIME LEONARDO ORJUELA CHAMORRO\t5\t24T34 (01/09/2025 - 10/01/2026)</div>
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