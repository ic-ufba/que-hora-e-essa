// Debug do problema
const testText = `GMAT0002 - ESTÁGIO SUPERVISIONADO I
Período/ Ano	Turma	Docente	Vgs Reservadas	Horários
2025.2	01		25	6N12 7N1 (01/09/2025 - 10/01/2026)`;

console.log('=== DEBUG ===');
console.log('Texto original:');
console.log(testText);

const lines = testText.split('\n');
console.log('\nLinhas:');
lines.forEach((line, i) => {
  console.log(`Linha ${i}: "${line}"`);
});

console.log('\n=== TESTE REGEX ===');
const line = lines[2]; // Linha da turma
console.log(`Testando linha: "${line}"`);

// Teste do regex original
const turmaMatch = line.match(/^(\d{4}\.\d)\s+(\w+)\s+(.*?)\s+(\d+)\s+(.+?)\s+\((.+?)\)$/);
console.log('Regex original:', turmaMatch);

// Teste do fallback
const parts = line.split(/\s+/);
console.log('Parts:', parts);
console.log('Parts length:', parts.length);

if (parts.length >= 6) {
  const periodo = parts[0];
  const turma = parts[1];
  const vagas = parts[parts.length - 3];
  const horariosStr = parts[parts.length - 2];
  const datas = parts[parts.length - 1];
  const docente = parts.slice(2, parts.length - 3).join(' ');
  
  console.log('Periodo:', periodo);
  console.log('Turma:', turma);
  console.log('Docente:', docente);
  console.log('Vagas:', vagas);
  console.log('Horarios:', horariosStr);
  console.log('Datas:', datas);
  
  console.log('Horarios match:', horariosStr.match(/\d+[MTN]\d+/));
  console.log('Datas includes ():', datas.includes('(') && datas.includes(')'));
} 