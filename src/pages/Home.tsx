import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  BookOpen,
  ExternalLink,
  Calendar,
  Download,
  Clock,
  Filter,
  Users,
  CheckCircle,
  History,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/components/image/logo.png";

const Home = () => {
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showAvisoModal, setShowAvisoModal] = useState(false);

  // Verifica se é a primeira visita
  useEffect(() => {
    const avisoVisto = localStorage.getItem('avisoVisto');
    if (!avisoVisto) {
      setShowAvisoModal(true);
    }
  }, []);

  const handleFecharAviso = () => {
    setShowAvisoModal(false);
    localStorage.setItem('avisoVisto', 'true');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-center mt-8 mb-4">
        <img src={logo} alt="Logo QueHoraÉEssa?" className="w-16 h-16 rounded-lg object-contain bg-white mb-2" />
        <span className="text-2xl md:text-3xl font-bold text-gray-900">QueHoraÉEssa?</span>
        </div>

      {/* Boas-vindas */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mt-10 mb-8 text-center">
        <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">Planeje seu semestre com facilidade</h1>
        <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto">Transforme códigos confusos do SIGAA em horários claros, organize sua grade personalizada e visualize conflitos de forma simples e moderna.</p>
      </section>

      {/* Botões de ação principais */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/planejador" className="w-full sm:w-auto">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full">
              <Calendar className="w-5 h-5 mr-2" />
              Começar a Planejar
            </Button>
          </Link>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => setShowTutorialModal(true)}
            className="px-8 py-3 text-lg w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Como Coletar Dados
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">Escolha entre conversão individual ou completa</p>
      </section>

      {/* Funcionalidades principais */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversão Individual */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Conversão Individual</h2>
            </div>
            <p className="text-gray-700 mb-4">Converta rapidamente o horário de uma disciplina específica do SIGAA em horários legíveis e organizados.</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Conversão instantânea de uma disciplina</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Histórico de conversões</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Visualize matérias fora da sua grade</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Foco total em uma única disciplina por vez</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Teste encaixes na sua grade em segundos</span>
              </div>
            </div>
            
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">Ideal para:</p>
              <p className="text-xs text-blue-800">Quando você quer saber o horário de uma matéria específica ou fazer uma consulta rápida.</p>
            </div>
          </div>

          {/* Conversão Completa */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h2 className="text-xl font-bold text-indigo-900">Conversão Completa</h2>
            </div>
            <p className="text-gray-700 mb-4">Organize sua grade personalizada convertendo todas as disciplinas do semestre e visualize conflitos de horários.</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Conversão de múltiplas disciplinas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Filtros avançados por dia e horário</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Detecção automática de conflitos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Sem precisar filtrar informações</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4" />
                <span>Informações de turmas e professores</span>
              </div>
            </div>
            
            <div className="bg-indigo-100 p-3 rounded-lg">
              <p className="text-sm text-indigo-900 font-medium mb-2">Ideal para:</p>
              <p className="text-xs text-indigo-800">Planejar todo o semestre, visualizar conflitos e organizar sua grade de forma eficiente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos do sistema */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Recursos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Conversão Inteligente</h3>
            <p className="text-sm text-gray-600">Converte automaticamente códigos do SIGAA em horários legíveis e organizados</p>
          </div>
          <div className="text-center">
            <Filter className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Filtros Avançados</h3>
            <p className="text-sm text-gray-600">Filtre disciplinas por dia, horário e restrições personalizadas</p>
          </div>
          <div className="text-center">
            <Download className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Exportação</h3>
            <p className="text-sm text-gray-600">Exporte sua grade para calendários digitais (Google Calendar, Outlook, etc.)</p>
          </div>
          <div className="text-center">
            <History className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Histórico de Cursos</h3>
            <p className="text-sm text-gray-600">Acesse rapidamente cursos consultados anteriormente</p>
          </div>
          <div className="text-center">
            <Download className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Salvar Grades</h3>
            <p className="text-sm text-gray-600">Salve e carregue suas grades personalizadas com nomes customizados</p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Detecção de Conflitos</h3>
            <p className="text-sm text-gray-600">Identifique automaticamente conflitos de horários entre disciplinas</p>
          </div>
        </div>
      </section>

      {/* Modal de aviso */}
      {showAvisoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleFecharAviso}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">ATENÇÃO</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={handleFecharAviso}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                O <strong>QueHoraÉEssa?</strong> é uma ferramenta independente, criada para auxiliar estudantes no planejamento de horários.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <p className="text-sm text-gray-700">Não temos vínculo institucional com a UFBA ou com o SIGAA.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <p className="text-sm text-gray-700">Não operamos, gerenciamos ou decidimos nada sobre o sistema SIGAA.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <p className="text-sm text-gray-700">Nosso objetivo é apenas facilitar a visualização e organização de horários para o seu planejamento acadêmico.</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleFecharAviso}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entendi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de tutorial */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTutorialModal(false)}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-3xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-bold">Como coletar dados no SIGAA</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTutorialModal(false)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Siga estes passos para extrair os dados corretamente do sistema da UFBA
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium text-sm">Acesse o SIGAA</p>
                    <a href="https://sigaa.ufba.br/sigaa/public/home.jsf" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      sigaa.ufba.br
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium text-sm">No menu lateral, clique em <strong>Graduação</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium text-sm">Clique em <strong>Cursos</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium text-sm">Pesquise pelo nome ou modalidade do curso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                  <div>
                    <p className="font-medium text-sm">Clique em <strong>Visualizar Página do Curso</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</div>
                  <div>
                    <p className="font-medium text-sm">No menu superior, vá em <strong>Ensino &gt; Turmas</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">7</div>
                  <div>
                    <p className="font-medium text-sm">Busque pelo <strong>Ano.Período</strong> ou <strong>Código da Disciplina</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">8</div>
                  <div>
                    <p className="font-medium text-sm">Clique em <strong>Buscar</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">9</div>
                  <div>
                    <p className="font-medium text-sm">Copie todo o <strong>bloco de informações</strong> da(s) matéria(s)</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm">Exemplo de dados copiados:</h4>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-xs font-mono space-y-1">
                    <div className="font-semibold">MATA01 - GEOMETRIA ANALÍTICA</div>
                    <div>Período/ Ano	Turma	Docente	Vgs Reservadas	Horários</div>
                    <div>2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;