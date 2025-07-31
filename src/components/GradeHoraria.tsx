import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Disciplina } from "@/utils/sigaaParser";
import { detectConflicts } from "@/utils/sigaaParser";
import { Trash2, AlertTriangle, Clock, User, BookOpen, Calendar, ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { HORARIOS_BLOCOS } from "@/types/schedule";

interface GradeHorariaProps {
  disciplinas: Disciplina[];
  onRemoverDisciplina?: (codigo: string) => void;
  compact?: boolean;
  showNames?: boolean;
}

// Definição dos horários específicos da grade (baseado na tabela UFBA)
const HORARIOS_GRADE = [
  '07:00', '07:55', '08:50', '09:45', '10:40', '11:35', '13:00', '13:55', '14:50', '15:45', '16:40', '17:35', '18:30', '19:25', '20:20', '21:15'
];

const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

// Função para converter dia do SIGAA para formato iCal
const getDiaSigaaParaICal = (dia: string): string => {
  const mapeamento = {
    'Segunda': 'MO',
    'Terça': 'TU', 
    'Quarta': 'WE',
    'Quinta': 'TH',
    'Sexta': 'FR',
    'Sábado': 'SA'
  };
  return mapeamento[dia] || 'MO';
};

// Função para converter horário para formato iCal
const converterHorarioParaICal = (horario: string): string => {
  const [hora, minuto] = horario.split(':');
  return `${hora.padStart(2, '0')}${minuto.padStart(2, '0')}`;
};

// Função para calcular horário de fim baseado no início
const calcularHorarioFim = (horarioInicio: string): string => {
  const horarios = HORARIOS_GRADE;
  const index = horarios.indexOf(horarioInicio);
  if (index !== -1 && index < horarios.length - 1) {
    return horarios[index + 1];
  }
  // Se for o último horário, adiciona 55 minutos
  const [hora, minuto] = horarioInicio.split(':').map(Number);
  const novaHora = hora + Math.floor((minuto + 55) / 60);
  const novoMinuto = (minuto + 55) % 60;
  return `${novaHora.toString().padStart(2, '0')}:${novoMinuto.toString().padStart(2, '0')}`;
};

// Função para agrupar horários consecutivos da mesma disciplina
const agruparHorariosConsecutivos = (disciplinas: Disciplina[]) => {
  const eventosAgrupados: Array<{
    disciplina: Disciplina;
    dia: string;
    horarioInicio: string;
    horarioFim: string;
    blocos: number;
  }> = [];

  // Processa cada disciplina separadamente
  disciplinas.forEach((disciplina) => {
    // Agrupa horários por dia para esta disciplina específica
    const horariosPorDia: { [dia: string]: string[] } = {};
    
    // Coleta todos os horários desta disciplina
    disciplina.horarios.forEach((horario) => {
      if (horario.horarioInicio) {
        const dia = horario.dia;
        if (!horariosPorDia[dia]) {
          horariosPorDia[dia] = [];
        }
        horariosPorDia[dia].push(horario.horarioInicio);
      }
    });

    // Para cada dia desta disciplina, cria um único evento
    Object.entries(horariosPorDia).forEach(([dia, horarios]) => {
      // Ordena horários cronologicamente
      horarios.sort((a, b) => {
        const indexA = HORARIOS_GRADE.indexOf(a);
        const indexB = HORARIOS_GRADE.indexOf(b);
        return indexA - indexB;
      });

      // Como os horários sempre são consecutivos, cria um único evento
      if (horarios.length > 0) {
        const horarioInicio = horarios[0];
        const horarioFim = calcularHorarioFim(horarios[horarios.length - 1]);
        
        eventosAgrupados.push({
          disciplina,
          dia,
          horarioInicio,
          horarioFim,
          blocos: horarios.length
        });
      }
    });
  });

  return eventosAgrupados;
};

// Função para gerar arquivo iCal
const gerarArquivoICal = (disciplinas: Disciplina[]): string => {
  let icalContent = 'BEGIN:VCALENDAR\r\n';
  icalContent += 'VERSION:2.0\r\n';
  icalContent += 'CALSCALE:GREGORIAN\r\n';
  icalContent += 'PRODID:-//Horario Facil//Horario UFBA//PT\r\n';
  
  // Data de início do semestre (ajuste conforme necessário)
  const dataInicio = new Date('2025-09-01');
  const dataFim = new Date('2026-01-10');
  
  // Timestamp atual para DTSTAMP
  const now = new Date();
  const dtstamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}Z`;
  
  // Agrupa horários consecutivos
  const eventosAgrupados = agruparHorariosConsecutivos(disciplinas);
  
  eventosAgrupados.forEach((evento, index) => {
    const uid = `disciplina-${evento.disciplina.codigo}-${index}-${Date.now()}@horariofacil.com`;
    const summary = `${evento.disciplina.codigo} - ${evento.disciplina.nome}`;
    const description = `Professor: ${evento.disciplina.professor}\nBlocos: ${evento.blocos}`;
    
    // Converter horário para formato iCal
    const horarioInicio = converterHorarioParaICal(evento.horarioInicio);
    const horarioFim = converterHorarioParaICal(evento.horarioFim);
    const diaSemana = getDiaSigaaParaICal(evento.dia);
    
    // Data de início do evento (primeira ocorrência)
    const dataEvento = new Date(dataInicio);
    const diasSemana = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const diaIndex = diasSemana.indexOf(diaSemana);
    if (diaIndex !== -1) {
      const diasParaAdicionar = (diaIndex - dataEvento.getDay() + 7) % 7;
      dataEvento.setDate(dataEvento.getDate() + diasParaAdicionar);
    }
    
    // Formato de data/hora com TZID para compatibilidade com Google Calendar
    const dtstart = `${dataEvento.getFullYear()}${(dataEvento.getMonth() + 1).toString().padStart(2, '0')}${dataEvento.getDate().toString().padStart(2, '0')}T${horarioInicio}00`;
    const dtend = `${dataEvento.getFullYear()}${(dataEvento.getMonth() + 1).toString().padStart(2, '0')}${dataEvento.getDate().toString().padStart(2, '0')}T${horarioFim}00`;
    const until = `${dataFim.getFullYear()}${(dataFim.getMonth() + 1).toString().padStart(2, '0')}${dataFim.getDate().toString().padStart(2, '0')}T235959Z`;
    
    icalContent += 'BEGIN:VEVENT\r\n';
    icalContent += `UID:${uid}\r\n`;
    icalContent += `DTSTAMP:${dtstamp}\r\n`;
    icalContent += `SUMMARY:${summary}\r\n`;
    icalContent += `DESCRIPTION:${description}\r\n`;
    icalContent += `DTSTART;TZID=America/Bahia:${dtstart}\r\n`;
    icalContent += `DTEND;TZID=America/Bahia:${dtend}\r\n`;
    icalContent += `RRULE:FREQ=WEEKLY;BYDAY=${diaSemana};UNTIL=${until}\r\n`;
    icalContent += 'END:VEVENT\r\n';
  });
  
  icalContent += 'END:VCALENDAR\r\n';
  return icalContent;
};

// Função para baixar arquivo
const baixarArquivo = (conteudo: string, nomeArquivo: string) => {
  const blob = new Blob([conteudo], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const GradeHoraria = ({ disciplinas, onRemoverDisciplina, compact = false, showNames = true }: GradeHorariaProps) => {
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [conflictsOpen, setConflictsOpen] = useState(false);
  const [showDetailed, setShowDetailed] = useState(compact ? false : !compact);
  
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
      'bg-amber-500 text-black',
      'bg-fuchsia-500 text-white',
      'bg-rose-500 text-white',
      'bg-violet-500 text-white',
      'bg-sky-500 text-white',
      'bg-emerald-500 text-white',
      'bg-zinc-500 text-white',
      'bg-gray-500 text-white',
      'bg-stone-500 text-white',
      'bg-orange-700 text-white',
      'bg-blue-700 text-white',
      'bg-green-700 text-white',
      'bg-purple-700 text-white',
      'bg-pink-700 text-white',
      'bg-indigo-700 text-white',
      'bg-yellow-700 text-black',
      'bg-cyan-700 text-white',
      'bg-lime-700 text-black',
      'bg-amber-700 text-black',
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
            {showDetailed && showNames && (
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
            <span>Conflito de Horários Detectado</span>
            {conflictsOpen ? <ArrowUp className="h-5 w-5 cursor-pointer" onClick={() => setConflictsOpen(false)}/> : <ArrowDown className="h-5 w-5 cursor-pointer" onClick={() => setConflictsOpen(true)} />}
          </div>
          {conflictsOpen && (
            <div className="pt-1 pb-2">
              <div className="space-y-1">
              {Object.entries(conflicts).map(([key, disciplinasCodigos]) => {
                const [dia, bloco] = key.split('-');
                return (
                    <div key={key} className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-red-700 text-xs">{dia} {bloco} ({HORARIOS_BLOCOS[bloco]}):</span>
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
        {!compact && showNames && (
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
            <div className="responsive-text-sm font-semibold md:block hidden">Período</div>
            <div className="text-xs text-muted-foreground md:block hidden">Horário</div>
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

      {/* Botão Exportar para Calendário */}
      {!compact && disciplinas.length > 0 && onRemoverDisciplina && showNames && (
        <div className="flex flex-col items-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const icalContent = gerarArquivoICal(disciplinas);
              const nomeArquivo = `horario-ufba-${new Date().toISOString().split('T')[0]}.ics`;
              baixarArquivo(icalContent, nomeArquivo);
            }}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Exportar para Calendário
          </Button>
          <span className="text-xs text-gray-500 mt-1">*Compatível com Google Calendar, Outlook e outros calendários</span>
        </div>
      )}

      {/* Disciplina Details Dialog - Removido para evitar conflitos */}
      
      {/* Modal de detalhes da disciplina customizado */}
          {selectedDisciplina && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDisciplina(null)}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-bold">Detalhes da Disciplina</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDisciplina(null)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`text-sm px-3 py-1 ${getEventColor(selectedDisciplina)}`}>
                  {selectedDisciplina.codigo}
                </Badge>
                <span className="font-semibold text-base">{selectedDisciplina.nome}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Professor:</span>
                  <span className="font-medium text-sm">{selectedDisciplina.professor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Turma:</span>
                  <span className="font-medium text-sm">{selectedDisciplina.turma}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Vagas:</span>
                  <span className="font-medium text-sm">{selectedDisciplina.vagas === 0 ? 'Sem informação' : selectedDisciplina.vagas}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Período:</span>
                  <span className="font-medium text-sm">{selectedDisciplina.periodo}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-semibold text-sm">Horários:</h4>
                <div className="space-y-2">
                  {selectedDisciplina.horarios.map((horario, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                      <span>{horario.dia}</span>
                      <Badge variant="outline" className="text-xs">
                        {horario.bloco} ({horario.horarioInicio} - {horario.horarioFim})
                    </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {onRemoverDisciplina && (
                <div className="pt-2 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onRemoverDisciplina(selectedDisciplina.codigo);
                      setSelectedDisciplina(null);
                    }}
                    className="w-full text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover Disciplina
                  </Button>
                </div>
              )}
            </div>
          </div>
            </div>
          )}

      {/* Tutorial Modal - Removido para evitar conflitos */}
    </div>
  );
};