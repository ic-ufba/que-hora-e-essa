// Teste do parser com o texto fornecido
const testText = `SIGAA - Sistema Integrado de Gestão de Atividades Acadêmicas

Versão em Inglês Versão em Espanhol Versão em Francês
 
CURSO DE COMPUTAÇÃO / IC/UFBA
INSTITUTO DE COMPUTAÇÃO - IC/UFBA
Telefone/Ramal: Não informado
ApresentaçãoEnsinoCalendárioProjeto Pedagógico do CursoNotícias
Turmas

Buscar
Ano . Período : 
2025
 . 
2
 

Código: 



MATC53 - ACC:ONDA SOLIDÁRIA DE INCLUSÃO DIGITAL-TECNOLOGIA A SERVIÇO
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01	DEBORA ABDALLA SANTOS	4	7M456 2T56 7T1 (01/09/2025 - 10/01/2026)

GMAT0002 - ESTÁGIO SUPERVISIONADO I
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01		25	6N12 7N1 (01/09/2025 - 10/01/2026)

GMAT0002 - ESTÁGIO SUPERVISIONADO I
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	02		25	6N34 7N1 (01/09/2025 - 10/01/2026)

GMAT0003 - ESTÁGIO SUPERVISIONADO II
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01	DEBORA ABDALLA SANTOS	20	6N12 7N2 (01/09/2025 - 10/01/2026)

GMAT0004 - ESTÁGIO SUPERVISIONADO III
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01	MARLO VIEIRA DOS SANTOS E SOUZA	20	67N12 (01/09/2025 - 10/01/2026)

GMAT0005 - ESTÁGIO SUPERVISIONADO IV
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01	LUMA DA ROCHA SEIXAS	10	67N12 (01/09/2025 - 10/01/2026)

MATB59.1 - ESTATÍSTICA BÁSICA A - PRÁTICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	02	ANDREA ANDRADE PRUDENTE	10	3N34 (01/09/2025 - 10/01/2026)

MATB59.0 - ESTATÍSTICA BÁSICA A - TEÓRICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	02	ANDREA ANDRADE PRUDENTE	10	5N34 (01/09/2025 - 10/01/2026)

MATA01 - GEOMETRIA ANALÍTICA
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	02	DIEGO CATALANO FERRAIOLI	15	24T34 (01/09/2025 - 10/01/2026)

66 Turmas  Disponíveis
SIGAA | STI/SUPAC - - | Copyright © 2006-2025 - UFBA`;

// Simulação da função limparTextoSigaa atualizada
function limparTextoSigaa(texto) {
  const lines = texto.split('\n');
  const disciplinasEncontradas = [];
  let currentDisciplina = [];
  let encontrouDisciplina = false;
  let encontrouCabecalho = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Identifica início de uma disciplina (código - nome)
    const disciplinaMatch = line.match(/^([A-Z]{3,4}\d{2,3}(?:\.\d+)?)\s*-\s*(.+)$/);
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
}

// Simulação da função parseSigaaText atualizada
function parseSigaaText(texto) {
  const lines = texto.split('\n').filter(line => line.trim() !== '');
  const turmas = [];
  
  let currentDisciplina = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Identifica início de uma disciplina (código - nome)
    const disciplinaMatch = line.match(/^([A-Z]{3,4}\d{2,3}(?:\.\d+)?)\s*-\s*(.+)$/);
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
      // Verifica se a linha tem o formato de uma turma (deve ter horários no formato correto)
      const turmaMatch = line.match(/^(\d{4}\.\d)\s+(\w+)\s+(.+?)\s+(\d+)\s+(.+?)\s+\((.+?)\)$/);
      if (turmaMatch) {
        const [, periodo, turma, docente, vagas, horariosStr, datas] = turmaMatch;
        
        // Valida se o horário está no formato correto (deve conter códigos como 24T34, 7M456, etc.)
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
      } else {
        // Fallback: tentar parsing manual apenas se a linha parece ser uma turma
        const parts = line.split(/\s+/);
        if (parts.length >= 6) {
          const periodo = parts[0];
          const turma = parts[1];
          const vagas = parts[parts.length - 3];
          const horariosStr = parts[parts.length - 2];
          const datas = parts[parts.length - 1];
          const docente = parts.slice(2, parts.length - 3).join(' ');
          
          // Valida se o horário está no formato correto
          if (horariosStr.match(/\d+[MTN]\d+/) && datas.includes('(') && datas.includes(')')) {
            const [dataInicio, dataFim] = datas.replace(/[()]/g, '').split(' - ');
            
            turmas.push({
              codigo: currentDisciplina.codigo,
              nome: currentDisciplina.nome,
              periodo: periodo || '(Sem informação)',
              turma: turma || '(Sem informação)',
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
  }
  
  return turmas;
}

// Teste
console.log('=== TESTE DO PARSER ATUALIZADO ===');
console.log('Texto original (primeiras linhas):');
console.log(testText.substring(0, 200) + '...');
console.log('\n=== TEXTO LIMPO ===');
const textoLimpo = limparTextoSigaa(testText);
console.log(textoLimpo);
console.log('\n=== TURMAS ORGANIZADAS ===');
const turmas = parseSigaaText(textoLimpo);
console.log(`Total de turmas encontradas: ${turmas.length}`);

// Agrupa turmas por disciplina
const turmasPorDisciplina = turmas.reduce((acc, turma) => {
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
}, {});

console.log(`\nDisciplinas únicas: ${Object.keys(turmasPorDisciplina).length}`);
Object.values(turmasPorDisciplina).forEach((disc, index) => {
  console.log(`\n${index + 1}. ${disc.codigo} - ${disc.nome}`);
  console.log(`   Total de turmas: ${disc.turmas.length}`);
  console.log(`   Total de vagas: ${disc.turmas.reduce((total, t) => total + t.vagas, 0)}`);
  disc.turmas.forEach(turma => {
    console.log(`   - Turma ${turma.turma}: ${turma.docente} (${turma.vagas} vagas) - ${turma.horarios}`);
  });
}); 