import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  BookOpen,
  ExternalLink,
  Calendar,
  Grid3X3,
  Download,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/components/image/logo.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-center mt-8 mb-4">
        <img src={logo} alt="Logo QueHoraÉEssa?" className="w-16 h-16 rounded-lg object-contain bg-white mb-2" />
        <span className="text-2xl md:text-3xl font-bold text-gray-900">QueHoraÉEssa?</span>
        </div>

      {/* Boas-vindas */}
      <section className="max-w-3xl mx-auto px-4 md:px-0 mt-10 mb-8 text-center">
        <p className="text-lg md:text-xl text-gray-700">Transforme códigos confusos do SIGAA em horários claros, planeje seu semestre e visualize sua grade de forma simples e moderna.</p>
      </section>

      {/* Blocos de ação */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conversão Simples */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 flex flex-col items-center shadow-sm">
            <Calculator className="w-10 h-10 text-blue-600 mb-3" />
            <h2 className="text-xl font-bold text-blue-900 mb-2">Conversão Simples</h2>
            <p className="text-gray-700 mb-4 text-center">Converta rapidamente o horário de uma disciplina individual do SIGAA em horários legíveis. Ideal para quando você quer saber o horário de uma matéria específica.</p>
            <Link to="/conversao">
              <Button className="w-full md:w-auto">Ir para Conversão Simples</Button>
            </Link>
          </div>
          {/* Planejamento Semestral */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 flex flex-col items-center shadow-sm">
            <Calendar className="w-10 h-10 text-indigo-600 mb-3" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Planejamento Semestral</h2>
            <p className="text-gray-700 mb-4 text-center">Organize sua grade personalizada convertendo todas as disciplinas do semestre em horários claros. Ideal para visualizar conflitos e planejar seu semestre com praticidade.</p>
            <Link to="/planejador">
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">Ir para Planejamento Semestral</Button>
            </Link>
          </div>
              </div>
      </section>

      {/* Tutorial de Coleta de Dados */}
      <main className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tutorial de Coleta de Dados */}
          <Card id="tutorial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BookOpen className="w-5 h-5" />
                Como coletar os dados no SIGAA?
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Siga estes passos para extrair os dados corretamente do sistema da UFBA
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    <div>Período/ Ano	Turma	Docente	Vgs Reservadas	Horários</div>
                    <div>2025.2	03	JAIME LEONARDO ORJUELA CHAMORRO	5	24T34 (01/09/2025 - 10/01/2026)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;