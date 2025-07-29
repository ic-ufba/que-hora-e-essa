// Teste final com diferentes formatos
const testCases = [
  {
    name: "MATD04 - ESTRUTURAS DE DADOS",
    text: `MATD04 - ESTRUTURAS DE DADOS
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	02	ADRIANO HUMBERTO DE OLIVEIRA MAIA	35	35N12 (01/09/2025 - 10/01/2026)`
  },
  {
    name: "MATA01 - GEOMETRIA ANALÍTICA",
    text: `MATA01 - GEOMETRIA ANALÍTICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	02	DIEGO CATALANO FERRAIOLI	15	24T34 (01/09/2025 - 10/01/2026)`
  },
  {
    name: "GMAT0002 - ESTÁGIO SUPERVISIONADO I",
    text: `GMAT0002 - ESTÁGIO SUPERVISIONADO I
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01		25	6N12 7N1 (01/09/2025 - 10/01/2026)`
  }
];

// Simulação das funções
function parseSigaaText(text) {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const turmas = [];
  
  let currentDisciplina = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    const disciplinaMatch = line.match(/^([A-Z]{3,4}\d{2,3}(?:\.\d+)?)\s*-\s*(.+)$/);
    if (disciplinaMatch) {
      currentDisciplina = {
        codigo: disciplinaMatch[1],
        nome: disciplinaMatch[2]
      };
      continue;
    }
    
    if (line.includes('Período/ Ano') && line.includes('Turma') && line.includes('Docente')) {
      continue;
    }
    
    if (currentDisciplina) {
      const turmaMatch = line.match(/^(\d{4}\.\d)\s+(\w+)\s+(.+?)\s+(\d+)\s+(.+?)\s+\((.+?)\)$/);
      if (turmaMatch) {
        const [, periodo, turma, docente, vagas, horariosStr, datas] = turmaMatch;
        
        if (horariosStr.match(/\d+[MTN]\d+/)) {
          const [dataInicio, dataFim] = datas.split(' - ');
          
          turmas.push({
            codigo: currentDisciplina.codigo,
            nome: currentDisciplina.nome,
            periodo: periodo,
            turma: turma,
            docente: docente.trim() || '(Sem informação)',
            vagas: parseInt(vagas) || 0,
            horarios: horariosStr || '(Sem informação)',
            dataInicio: dataInicio || '(Sem informação)',
            dataFim: dataFim || '(Sem informação)'
          });
        }
      }
    }
  }
  
  return turmas;
}

function parseHorarios(horariosStr) {
  if (!horariosStr || horariosStr === '(Sem informação)' || !horariosStr.match(/\d+[MTN]\d+/)) {
    return [];
  }
  
  const horarios = [];
  const horariosArray = horariosStr.split(/\s+/);
  
  const DIAS_SIGAA = {
    '2': 'Segunda', '3': 'Terça', '4': 'Quarta', '5': 'Quinta', '6': 'Sexta', '7': 'Sábado'
  };
  
  const HORARIOS_UFBA = {
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
  
  horariosArray.forEach(horario => {
    if (horario.match(/\d+[MTN]\d+/)) {
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

// Teste
console.log('=== TESTE FINAL - DIFERENTES FORMATOS ===\n');

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log('='.repeat(50));
  
  const turmas = parseSigaaText(testCase.text);
  console.log(`Turmas encontradas: ${turmas.length}`);
  
  turmas.forEach((turma, idx) => {
    console.log(`\nTurma ${idx + 1}:`);
    console.log(`- Código: ${turma.codigo}`);
    console.log(`- Nome: ${turma.nome}`);
    console.log(`- Turma: ${turma.turma}`);
    console.log(`- Professor: ${turma.docente}`);
    console.log(`- Vagas: ${turma.vagas}`);
    console.log(`- Horários SIGAA: ${turma.horarios}`);
    
    const horariosConvertidos = parseHorarios(turma.horarios);
    console.log(`\nHorários convertidos (${horariosConvertidos.length}):`);
    horariosConvertidos.forEach((horario, i) => {
      console.log(`  ${i + 1}. ${horario.dia} ${horario.horarioInicio} - ${horario.horarioFim} (${horario.bloco})`);
    });
  });
});

console.log('\n=== TESTE CONCLUÍDO ==='); 