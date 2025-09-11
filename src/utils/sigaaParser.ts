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
    const turmaMatch = line.match(/^(\d{4}\.\d)\s+(\w+)\s+(.*?)\s+(\d*)\s+(.+?)\s+\((.+?)\)$/);
      if (turmaMatch) {
        const periodo = turmaMatch[1];
        let turma = turmaMatch[2];
        let docente = turmaMatch[3];
        let vagas = turmaMatch[4];
        const horariosStr = turmaMatch[5];
        const datas = turmaMatch[6];
        turma = turma ? turma.replace(/\s+/g, ' ').trim() : '';
        docente = docente ? docente.replace(/\s+/g, ' ').trim() : '';
        vagas = vagas ? vagas.replace(/\s+/g, ' ').trim() : '';
        turma = turma ? turma : '(Sem informação)';
        docente = docente ? docente : '(Sem informação)';
        const vagasNum = vagas && !isNaN(Number(vagas)) ? parseInt(vagas) : 0;
        
        // Valida se o horário está no formato correto (deve conter códigos como 24T34, 7M456, etc.)
        if (horariosStr.match(/\d+[MTN]\d+/)) {
          const [dataInicio, dataFim] = datas.split(' - ');
          
          turmas.push({
            codigo: currentDisciplina.codigo,
            nome: currentDisciplina.nome,
            periodo: periodo,
            turma: turma,
            docente: docente,
            vagas: vagasNum,
            horarios: horariosStr || '(Sem informação)',
            dataInicio: dataInicio || '(Sem informação)',
            dataFim: dataFim || '(Sem informação)'
          });
        }
      } else {
        // Fallback: tentar parsing manual se o regex não funcionar
        // 1. Tenta split por tabulação (SIGAA padrão)
        const tabParts = rawLine.split('\t');
        if (tabParts.length >= 5) {
          const periodo = tabParts[0].trim();
          const turma = tabParts[1].trim() || '(Sem informação)';
          const docente = tabParts[2].trim() || '(Sem informação)';
          const vagas = tabParts[3].trim() ? parseInt(tabParts[3].trim()) : 0;
          const horariosRaw = tabParts[4].trim();
          let horarios = '(Sem informação)';
          let dataInicio = '(Sem informação)';
          let dataFim = '(Sem informação)';
          const horariosMatch = horariosRaw.match(/^(.+?)\s*\((.+?)\)$/);
          if (horariosMatch) {
            horarios = horariosMatch[1];
            const datasSplit = horariosMatch[2].split(' - ');
            dataInicio = datasSplit[0] || '(Sem informação)';
            dataFim = datasSplit[1] || '(Sem informação)';
          }
          // Só adiciona se tiver código, nome e horário
          if (currentDisciplina && horarios && horarios.match(/\d+[MTN]\d+/)) {
            turmas.push({
              codigo: currentDisciplina.codigo,
              nome: currentDisciplina.nome,
              periodo: periodo || '(Sem informação)',
              turma,
              docente,
              vagas,
              horarios,
              dataInicio,
              dataFim
            });
    }
        } else {
          // Fallback antigo (split por espaço)
          const parts = line.split(/\s+/);
          if (parts.length >= 6) {
            const periodo = parts[0];
            let turma = parts[1];
            let vagasStr = parts[parts.length - 3];
            const horariosStr = parts[parts.length - 2];
            const datas = parts[parts.length - 1];
            let docente = parts.slice(2, parts.length - 3).join(' ');
            turma = turma ? turma.replace(/\s+/g, ' ').trim() : '';
            docente = docente ? docente.replace(/\s+/g, ' ').trim() : '';
            vagasStr = vagasStr ? vagasStr.replace(/\s+/g, ' ').trim() : '';
            turma = turma ? turma : '(Sem informação)';
            docente = docente ? docente : '(Sem informação)';
            const vagasNum = vagasStr && !isNaN(Number(vagasStr)) ? parseInt(vagasStr) : 0;
            // Valida se o horário está no formato correto
            if (horariosStr.match(/\d+[MTN]\d+/) && datas.includes('(') && datas.includes(')')) {
              const [dataInicio, dataFim] = datas.replace(/[()]/g, '').split(' - ');
              turmas.push({
                codigo: currentDisciplina.codigo,
                nome: currentDisciplina.nome,
                periodo: periodo || '(Sem informação)',
                turma: turma,
                docente: docente,
                vagas: vagasNum,
                horarios: horariosStr || '(Sem informação)',
                dataInicio: dataInicio || '(Sem informação)',
                dataFim: dataFim || '(Sem informação)'
              });
            }
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

// Função para extrair reservas de vagas por curso a partir do texto do SIGAA
export interface ReservaCurso {
  curso: string;
  modalidade: string;
  tipo: string;
  quantidade: number;
}

export interface AlocacaoTurma {
  codigo: string;
  nome: string;
  turma: string;
  periodo: string;
  docente: string;
  horarios: string;
  matriculados: number;
  capacidade: number;
  vagasDisponiveis: number;
  reservas: ReservaCurso[];
}

/**
 * Extrai as reservas de vagas por curso do texto do SIGAA.
 * Retorna apenas turmas que ainda têm vagas disponíveis (matriculados < capacidade).
 */
export function parseReservasPorCurso(text: string): AlocacaoTurma[] {
  const linhas = text.split(/\r?\n/);
  const resultado: AlocacaoTurma[] = [];
  let disciplinaAtual: { codigo: string; nome: string } | null = null;
  let periodo = '';
  let turma = '';
  let docente = '';
  let matriculados = 0;
  let capacidade = 0;
  let reservas: ReservaCurso[] = [];
  let linhaReserva = '';
  let horariosStr = '';
  let aguardandoCabecalho = false;

  for (let i = 0; i < linhas.length; i++) {
    const rawLine = linhas[i];
    const linha = rawLine.trim();
    // Detecta início de disciplina: "CÓDIGO - NOME" (código com letras+digitos, opcional ponto)
    // Evita confundir com linhas de cabeçalho como "COORDENAÇÃO ..."
    const matchDisciplina = linha.match(/^([A-Z]{3,}[A-Z0-9]*\d{1,4}(?:\.\d+)?)\s*-\s+(.+)$/i);
    if (matchDisciplina) {
      disciplinaAtual = { codigo: matchDisciplina[1], nome: matchDisciplina[2] };
      aguardandoCabecalho = true;
      continue;
    }
    // Cabeçalho da tabela
    if (aguardandoCabecalho && /Ano-Per\./.test(linha) && /Reservas \(Cap\./.test(linha)) {
      aguardandoCabecalho = false;
      continue;
    }
    if (!disciplinaAtual || aguardandoCabecalho) continue;

    // 1) Tentativa com regex livre (com espaços/tabs)
    // Captura: periodo, turma, docente, horarios(códigos tipo 35N12 ...), matriculados, capacidade
    // Não depende do literal "alunos" e tolera colunas intermediárias (Local, datas, etc.)
    // Docente: captura nome completo antes de "(XXh)"; depois vem status (ABERTA, etc.)
    let m = linha.match(/^(\d{4}\.\d)\s+\S+\s+Turma\s+(\S+)\s+(.+?)\s*\(\d+h\)\s+\S+\s+.*?(\d+[MTN]\d+(?:\s+\d+[MTN]\d+)*)[\s\S]*?(\d+)\/(\d+)\s*alunos?/i);
    // 2) Se falhar, tenta parsing por tabulação (relatório tabulado)
    if (!m && rawLine.includes('\t')) {
      const cols = rawLine.split('\t');
      if (cols.length >= 8 && /\d{4}\.\d/.test(cols[0]) && /Turma/.test(cols[2])) {
        const periodoCol = cols[0].trim();
        const turmaCol = cols[2].trim().replace(/^Turma\s+/i, '');
        const docenteCol = (cols[3] || '').replace(/\(\d+h\)/, '').trim();
        const horarioCol = (cols[5] || '').trim();
        const matCapCol = (cols[7] || '').trim();
        const capMatch = matCapCol.match(/(\d+)\/(\d+)/);
        m = [''] as unknown as RegExpMatchArray;
        (m as any)[1] = periodoCol;
        (m as any)[2] = turmaCol;
        (m as any)[3] = docenteCol;
        (m as any)[4] = capMatch ? capMatch[1] : '0';
        (m as any)[5] = capMatch ? capMatch[2] : '0';
        horariosStr = '';
        const hInline = horarioCol.match(/(\d+[MTN]\d+(?:\s+\d+[MTN]\d+)*)/);
        if (hInline) horariosStr = hInline[1];
      }
    }
    // 3) Se ainda falhar, tenta split por 2+ espaços (colunas alinhadas por espaços)
    if (!m && /\d{4}\.\d/.test(linha) && /Turma\s+\S+/.test(linha)) {
      const cols = linha.split(/\s{2,}/).map(s => s.trim());
      // Esperado: [Ano-Per., Nível, Código, Docente(s), Situação, Horário (...), Local, Mat./Cap., Reservas]
      if (cols.length >= 7) {
        const periodoCol = cols[0];
        const codigoCol = cols[2]; // "Turma NN"
        const docenteCol = cols[3] ? cols[3].replace(/\(\d+h\)/, '').trim() : '';
        const horarioCand = cols[5] || '';
        const localOuMatCap = cols[6] || '';
        let matCapCol = localOuMatCap;
        // Se a 7a coluna não for Mat/Cap, tenta 8a
        if (!/(\d+)\/(\d+)/.test(matCapCol) && cols[7]) matCapCol = cols[7];
        const capMatch = matCapCol.match(/(\d+)\/(\d+)/);
        m = [''] as unknown as RegExpMatchArray;
        (m as any)[1] = periodoCol;
        (m as any)[2] = codigoCol.replace(/^Turma\s+/i, '');
        (m as any)[3] = docenteCol;
        // Guardar matriculados/capacidade nos índices 5/6 para unificar com regex principal
        (m as any)[5] = capMatch ? capMatch[1] : '0';
        (m as any)[6] = capMatch ? capMatch[2] : '0';
        horariosStr = '';
        const hInline = horarioCand.match(/(\d+[MTN]\d+(?:\s+\d+[MTN]\d+)*)/);
        if (hInline) horariosStr = hInline[1];
      }
    }

    if (m) {
      // Quando veio do regex direto
      if (!horariosStr) {
        const hMatch = linha.match(/(\d+[MTN]\d+(?:\s+\d+[MTN]\d+)*)\s*\(/);
        if (hMatch) horariosStr = hMatch[1];
      }
      periodo = m[1];
      turma = m[2];
      docente = m[3].replace(/\(\d+h\)/, '').trim();
      // Unifica índices: se regex principal, m[5]/m[6]; se fallback, já reposicionados acima
      const matStr = (m as any)[5] as string;
      const capStr = (m as any)[6] as string;
      matriculados = parseInt(matStr || '0');
      capacidade = parseInt(capStr || '0');
      reservas = [];
      linhaReserva = '';

      // Agregar linhas de reservas (podem quebrar). Para na próxima turma ou próxima disciplina
      for (let j = i + 1; j < linhas.length; j++) {
        const lp = linhas[j].trim();
        // Se alcançou próxima turma, encerra coleta
        if (/^\d{4}\.\d\s+GRADUAÇÃO\s+Turma/.test(lp)) {
          break;
        }
        // Se alcançou próxima disciplina, encerra coleta
        if (/^[A-Z]{3,}[A-Z0-9]*\d{1,4}(?:\.\d+)?\s*-\s+/.test(lp)) {
          break;
        }
        // Linhas de reserva: devem conter " - Presencial - " e terminar com "(n)" (com ou sem sufixo de tipo)
        if ((/\(\d+\)/.test(lp) && /\s-\s*Presencial\s-\s*/i.test(lp))) {
          linhaReserva += (linhaReserva ? ' ' : '') + lp;
        }
      }

      if (linhaReserva) {
        const blocos = linhaReserva.split(';').map(b => b.trim()).filter(Boolean);
        for (const bloco of blocos) {
          let idx = bloco.indexOf(' - Presencial');
          let modalidade = 'Presencial';
          if (idx === -1) {
            idx = bloco.indexOf(' - EAD');
            modalidade = 'EAD';
          }
          if (idx > -1) {
            const cursoFull = bloco.substring(0, idx).trim();
            const resto = bloco.substring(idx + (' - ' + modalidade).length).trim();
            // Remove prefixo '- ' (se existir) após 'Presencial'
            const afterPres = resto.replace(/^\-\s*/, '');
            // Captura tipo (N/MT/MTN...) e quantidade no final, com ou sem hífen antes
            const tipoQtd = afterPres.match(/(?:-\s*)?([A-ZMTN]{1,3})\s*\((\d+)\)\s*;?$/);
            if (tipoQtd) {
              const tipo = tipoQtd[1];
              const quantidade = parseInt(tipoQtd[2]);
              // Subárea é o que vier antes do sufixo de tipo/qtd
              let subarea = afterPres
                .replace(/(?:-\s*)?[A-ZMTN]{1,3}\s*\(\d+\)\s*;?$/, '')
                .trim();
              // Base do curso: apenas o nome antes do primeiro ' - '
              const cursoBase = (cursoFull.split(' - ')[0] || cursoFull).trim();
              let cursoDisplay = cursoBase;
              if (subarea) {
                subarea = subarea.replace(/\s+-\s+/g, ' - ').trim();
                cursoDisplay = `${cursoBase} - ${subarea}`;
              }
              reservas.push({
                curso: cursoDisplay,
                modalidade,
                tipo,
                quantidade
              });
            }
          }
        }
      }

      if (matriculados < capacidade) {
        resultado.push({
          codigo: disciplinaAtual.codigo,
          nome: disciplinaAtual.nome,
          turma,
          periodo,
          docente,
          horarios: horariosStr,
          matriculados,
          capacidade,
          vagasDisponiveis: capacidade - matriculados,
          reservas
        });
      }

      horariosStr = '';
      continue;
    }
  }
  return resultado;
}