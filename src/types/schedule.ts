export interface HorarioBloco {
  dia: string;
  bloco: string;
  horarioInicio?: string;
  horarioFim?: string;
}

export interface Disciplina {
  codigo: string;
  nome: string;
  turma: string;
  professor: string;
  vagas: number;
  horarios: HorarioBloco[];
  periodo: string;
}

export interface ConflictoHorario {
  bloco: string;
  dia: string;
  disciplinas: string[];
}

export interface GradeHoraria {
  [key: string]: {
    [key: string]: Disciplina | null;
  };
}

// Definição dos blocos de horário do SIGAA UFBA (55 minutos por aula)
export const BLOCOS_HORARIO = {
  M: ['M1', 'M2', 'M3', 'M4', 'M5'],
  T: ['T1', 'T2', 'T3', 'T4', 'T5'],
  N: ['N1', 'N2', 'N3', 'N4']
};

export const DIAS_SEMANA = [
  'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export const HORARIOS_BLOCOS = {
  M1: '07:00 - 07:55',
  M2: '07:55 - 08:50',
  M3: '08:50 - 09:45',
  M4: '09:45 - 10:40',
  M5: '10:40 - 11:35',
  T1: '13:00 - 13:55',
  T2: '13:55 - 14:50',
  T3: '14:50 - 15:45',
  T4: '15:45 - 16:40',
  T5: '16:40 - 17:35',
  N1: '18:30 - 19:25',
  N2: '19:25 - 20:20',
  N3: '20:20 - 21:15',
  N4: '21:15 - 22:10'
};