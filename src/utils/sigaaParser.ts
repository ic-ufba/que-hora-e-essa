export interface Turma {
  codigo: string;
  nome: string;
  periodo: string;
  turma: string;
  docente: string;
  vagas: number;
  horarios: string;
  dataInicio: string;
  dataFim: string;
}

export interface Disciplina {
  codigo: string;
  nome: string;
  turma: string;
  professor: string;
  vagas: number;
  periodo: string;
  horarios: Horario[];
}

export interface Horario {
  dia: string;
  bloco: string;
  horarioInicio: string;
  horarioFim: string;
}

// Mapeamento de dias do SIGAA para nomes completos
const DIAS_SIGAA: { [key: string]: string } = {
  '2': 'Segunda',
  '3': 'Terça', 
  '4': 'Quarta',
  '5': 'Quinta',
  '6': 'Sexta',
  '7': 'Sábado'
};

// Mapeamento de horários específicos da UFBA
const HORARIOS_UFBA: { [key: string]: { inicio: string, fim: string } } = {
  'M1': { inicio: '07:00', fim: '07:55' },
  'M2': { inicio: '07:55', fim: '08:50' },
  'M3': { inicio: '08:50', fim: '09:45' },
  'M4': { inicio: '09:45', fim: '10:40' },
  'M5': { inicio: '10:40', fim: '11:35' },
  'M6': { inicio: '11:35', fim: '12:30' },
  'T1': { inicio: '13:00', fim: '13:55' },
  'T2': { inicio: '13:55', fim: '14:50' },
  'T3': { inicio: '14:50', fim: '15:45' },
  'T4': { inicio: '15:45', fim: '16:40' },
  'T5': { inicio: '16:40', fim: '17:35' },
  'T6': { inicio: '17:35', fim: '18:30' },
  'N1': { inicio: '18:30', fim: '19:25' },
  'N2': { inicio: '19:25', fim: '20:20' },
  'N3': { inicio: '20:20', fim: '21:15' },
  'N4': { inicio: '21:15', fim: '22:10' }
};

export function parseSigaaText(text: string): Turma[] {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const turmas: Turma[] = [];
  
  let currentDisciplina: { codigo: string; nome: string } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    // Sanitiza a linha para evitar problemas com espaços/tabs extras
    const rawLine = lines[i];
    const line = rawLine.replace(/\s+/g, ' ').trim();
    
    // Identifica início de uma disciplina (código - nome) - regex mais tolerante
    // Aceita códigos como: MATA01, GMAT0002, MATB59.1, etc.
    const disciplinaMatch = line.match(/^([^-\s]+)\s*-\s*(.+)$/);
    if (disciplinaMatch) {
      currentDisciplina = {
        codigo: disciplinaMatch[1],
        nome: disciplinaMatch[2]
      };
      continue;
    }
    
    // Pula linha de cabeçalho
    if (line.includes('Período/ Ano') && line.includes('Turma') && line.includes('Docente')) {
      continue;
    }
    
    // Parseia dados da turma apenas se temos uma disciplina sendo processada
    if (currentDisciplina) {
      // Regex para capturar os dados da turma
    const turmaMatch = line.match(/^(\d{4}\.\d)\s+(\w+)\s+(.*?)\s+(\d+)\s+(.+?)\s+\((.+?)\)$/);
      if (turmaMatch) {
        const periodo = turmaMatch[1];
        let turma = turmaMatch[2];
        let docente = turmaMatch[3];
        let vagas = turmaMatch[4];
        const horariosStr = turmaMatch[5];
        const datas = turmaMatch[6];
        turma = turma && turma.trim() ? turma : '(Sem informação)';
        docente = docente && docente.trim() ? docente : '(Sem informação)';
        vagas = vagas && !isNaN(Number(vagas)) ? parseInt(vagas) : 0;
        
        // Valida se o horário está no formato correto (deve conter códigos como 24T34, 7M456, etc.)
        if (horariosStr.match(/\d+[MTN]\d+/)) {
          const [dataInicio, dataFim] = datas.split(' - ');
          
          turmas.push({
            codigo: currentDisciplina.codigo,
            nome: currentDisciplina.nome,
            periodo: periodo,
            turma: turma,
            docente: docente,
            vagas: vagas,
            horarios: horariosStr || '(Sem informação)',
            dataInicio: dataInicio || '(Sem informação)',
            dataFim: dataFim || '(Sem informação)'
          });
        }
      } else {
        // Fallback: tentar parsing manual se o regex não funcionar
        const parts = line.split(/\s+/);
        if (parts.length >= 6) {
          const periodo = parts[0];
          let turma = parts[1];
          let vagas = parts[parts.length - 3];
          const horariosStr = parts[parts.length - 2];
          const datas = parts[parts.length - 1];
          let docente = parts.slice(2, parts.length - 3).join(' ');
          turma = turma && turma.trim() ? turma : '(Sem informação)';
          docente = docente && docente.trim() ? docente : '(Sem informação)';
          vagas = vagas && !isNaN(Number(vagas)) ? parseInt(vagas) : 0;
          
          // Valida se o horário está no formato correto
          if (horariosStr.match(/\d+[MTN]\d+/) && datas.includes('(') && datas.includes(')')) {
            const [dataInicio, dataFim] = datas.replace(/[()]/g, '').split(' - ');
            
            turmas.push({
              codigo: currentDisciplina.codigo,
              nome: currentDisciplina.nome,
              periodo: periodo || '(Sem informação)',
              turma: turma,
              docente: docente,
              vagas: vagas,
              horarios: horariosStr || '(Sem informação)',
              dataInicio: dataInicio || '(Sem informação)',
              dataFim: dataFim || '(Sem informação)'
            });
          }
        }
      }
    }
  }
  
  return turmas;
}

// Função para converter horários SIGAA em formato legível
export function parseHorarios(horariosStr: string): Horario[] {
  if (!horariosStr || horariosStr === '(Sem informação)' || !horariosStr.match(/\d+[MTN]\d+/)) {
    return [];
  }
  
  const horarios: Horario[] = [];
  
  // Processa múltiplos horários separados por espaço
  const horariosArray = horariosStr.split(/\s+/);
  
  horariosArray.forEach(horario => {
    if (horario.match(/\d+[MTN]\d+/)) {
      // Extrai dias, turno e blocos
      // Exemplo: 35N12 -> dias: 3,5, turno: N, blocos: 1,2
      const match = horario.match(/(\d+)([MTN])(\d+)/);
    if (match) {
        const [, dias, turno, blocos] = match;
        const turnoCompleto = turno;
        
        // Processa cada dia individualmente
        for (let i = 0; i < dias.length; i++) {
          const dia = dias[i];
          const diaNome = DIAS_SIGAA[dia] || 'Segunda';
      
          // Processa cada bloco individualmente
          for (let j = 0; j < blocos.length; j++) {
            const blocoNum = blocos[j];
            const blocoCompleto = `${turnoCompleto}${blocoNum}`;
            
            // Verifica se o bloco existe no mapeamento
            if (HORARIOS_UFBA[blocoCompleto]) {
        horarios.push({
                dia: diaNome,
                bloco: blocoCompleto,
                horarioInicio: HORARIOS_UFBA[blocoCompleto].inicio,
                horarioFim: HORARIOS_UFBA[blocoCompleto].fim
              });
            }
          }
        }
      }
    }
  });
  
  return horarios;
}

// Função para converter Turma em Disciplina (formato antigo para compatibilidade)
export function turmaToDisciplina(turma: Turma): Disciplina {
  const horariosConvertidos = parseHorarios(turma.horarios);
  
  return {
    codigo: turma.codigo,
    nome: turma.nome,
    turma: turma.turma,
    professor: turma.docente,
    vagas: turma.vagas,
    periodo: turma.periodo,
    horarios: horariosConvertidos
  };
}

// Função para detectar conflitos
export function detectConflicts(disciplinas: Disciplina[]): { [key: string]: string[] } {
  const conflicts: { [key: string]: string[] } = {};
  
  // Cria uma matriz de horários
  const horarios: { [key: string]: { [key: string]: string[] } } = {};
  
  disciplinas.forEach(disciplina => {
    disciplina.horarios.forEach(horario => {
      const key = `${horario.dia}-${horario.bloco}`;
      if (!horarios[horario.dia]) {
        horarios[horario.dia] = {};
      }
      if (!horarios[horario.dia][horario.bloco]) {
        horarios[horario.dia][horario.bloco] = [];
      }
      horarios[horario.dia][horario.bloco].push(disciplina.codigo);
    });
  });
  
  // Verifica conflitos
  Object.keys(horarios).forEach(dia => {
    Object.keys(horarios[dia]).forEach(bloco => {
      if (horarios[dia][bloco].length > 1) {
        conflicts[`${dia}-${bloco}`] = horarios[dia][bloco];
    }
    });
  });
  
  return conflicts;
}

export function gerarHorariosLegiveis(disciplina: Disciplina): string {
  const horariosPorDia: { [dia: string]: Array<{ horarioInicio: string; horarioFim: string }> } = {};
  
  // Agrupa horários por dia
  disciplina.horarios.forEach(horario => {
    if (!horariosPorDia[horario.dia]) {
      horariosPorDia[horario.dia] = [];
    }
    horariosPorDia[horario.dia].push({
      horarioInicio: horario.horarioInicio || '',
      horarioFim: horario.horarioFim || ''
    });
  });
  
  // Gera texto legível
  const dias = Object.keys(horariosPorDia);
  if (dias.length === 0) return 'Horários não definidos';
  
  // Formata cada dia com seus horários
  const diasFormatados = dias.map(dia => {
    const horarios = horariosPorDia[dia];
    const horario = horarios[0]; // Pega o primeiro horário do dia
    return `${dia} ${horario.horarioInicio} às ${horario.horarioFim}`;
  });
  
  return diasFormatados.join('\n');
}