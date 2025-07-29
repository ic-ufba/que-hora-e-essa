import { Link } from "react-router-dom";
import { useState } from "react";

const perguntas = [
  {
    pergunta: "Como é que devo colocar a informação para conversão?",
    resposta: (
      <span>Basta seguir o tutorial da página inicial: copie o bloco de informações da disciplina diretamente do SIGAA (incluindo o cabeçalho e a linha da turma) e cole no campo de conversão. O sistema já está preparado para interpretar o formato padrão do SIGAA.</span>
    ),
  },
  {
    pergunta: "Por que não atualiza automaticamente com as matérias, que nem o Meu Horário?",
    resposta: (
      <span>O SIGAA não possui uma API pública de integração e o modo como as turmas são divulgadas dificulta o acesso automático às informações. Além disso, sem a divulgação via SUPAC, fica difícil extrair os dados sobre as turmas ofertadas.</span>
    ),
  },
  {
    pergunta: "Esse site é oficial?",
    resposta: (
      <span>Não, este não é um site oficial da UFBA e não possui nenhum apoio institucional. Trata-se de um projeto do Laboratório de Ideias do Instituto de Computação, uma iniciativa dos alunos do IC.</span>
    ),
  },
  {
    pergunta: "O site está com problema",
    resposta: (
      <span>Isso pode acontecer! Por ser uma iniciativa de alunos e estar no início, o sistema está sujeito a erros e evoluções. Por favor, relate o problema pelo formulário de contato para que possamos trabalhar na solução.<br />
        <a href="https://forms.gle/PSnbWAaGz4ELqqvX8" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Contato</a>
      </span>
    ),
  },
  {
    pergunta: "Como posso apoiar?",
    resposta: (
      <span>Seja bem-vindo(a) para participar! Você pode contribuir com ideias, sugestões ou código. Use o formulário de contato para falar conosco ou acesse o projeto no GitHub.<br />
        <div className="flex flex-wrap gap-3 mt-2">
          <a href="https://forms.gle/PSnbWAaGz4ELqqvX8" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Contato</a>
          <a href="https://github.com/ic-ufba/que-hora-e-essa.git" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors">GitHub</a>
        </div>
      </span>
    ),
  },
  {
    pergunta: "Tenho dúvida/crítica/sugestão",
    resposta: (
      <span>Envie sua mensagem pelo formulário de contato, sua opinião é muito importante!<br />
        <a href="https://forms.gle/PSnbWAaGz4ELqqvX8" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Contato</a>
      </span>
    ),
  },
];

const FAQ = () => {
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h1>
      <div className="space-y-4">
        {perguntas.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-blue-200 bg-white shadow-sm overflow-hidden">
            <button
              className={`w-full flex items-center justify-between px-5 py-4 text-left font-medium text-blue-900 hover:bg-blue-50 transition-colors focus:outline-none focus:bg-blue-100 ${aberta === idx ? 'bg-blue-50' : ''}`}
              onClick={() => setAberta(aberta === idx ? null : idx)}
              aria-expanded={aberta === idx}
            >
              <span>{item.pergunta}</span>
              <span className={`ml-4 transition-transform ${aberta === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div
              className={`transition-all duration-300 px-5 ${aberta === idx ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'} text-gray-700 text-base bg-blue-50`}
              style={{overflow: 'hidden'}}
            >
              {aberta === idx && (
                <div className="faq-resposta">{item.resposta}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/" className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Voltar para a página inicial</Link>
      </div>
    </div>
  );
};

export default FAQ; 