import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trash2,
  Download,
  History
} from "lucide-react";
import { Disciplina } from "@/utils/sigaaParser";
import { GradeHoraria } from "@/components/GradeHoraria";
import { useToast } from "@/hooks/use-toast";

const Grade = () => {
  const [gradeAtual, setGradeAtual] = useState<Disciplina[]>([]);
  const [historicoGrades, setHistoricoGrades] = useState<{ [key: string]: Disciplina[] }>({});
  const [showHistoricoGrades, setShowHistoricoGrades] = useState(false);
  const { toast } = useToast();

  // Carrega a grade do localStorage ao inicializar
  useEffect(() => {
    const gradeSalva = localStorage.getItem('gradeHoraria');
    console.log('gradeSalva', gradeSalva);
    if (gradeSalva) {
      setGradeAtual(JSON.parse(gradeSalva));
    }
    
    // Carrega histórico de grades salvas
    const historicoGradesSalvo = localStorage.getItem('historicoGrades');
    console.log('historicoGradesSalvo', historicoGradesSalvo);
    if (historicoGradesSalvo) {
      setHistoricoGrades(JSON.parse(historicoGradesSalvo));
    }
  }, []);

  // Salva a grade no localStorage sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('gradeHoraria', JSON.stringify(gradeAtual));
  }, [gradeAtual]);
  
  // Salva o histórico de grades no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('historicoGrades', JSON.stringify(historicoGrades));
  }, [historicoGrades]);

  const handleRemoverDisciplina = (codigo: string) => {
    setGradeAtual((prev) => prev.filter((d) => d.codigo !== codigo));
    toast({
      title: "Disciplina removida",
      description: "A disciplina foi removida da grade.",
    });
  };

  const handleLimparGrade = () => {
    setGradeAtual([]);
    localStorage.removeItem('gradeHoraria');
    toast({
      title: "Grade limpa",
      description: "Todas as disciplinas foram removidas.",
    });
  };
  
  const handleSalvarGrade = () => {
    if (gradeAtual.length === 0) {
      toast({
        title: "Grade vazia",
        description: "Adicione disciplinas à grade antes de salvar.",
        variant: "destructive",
      });
      return;
    }
    
    const nome = prompt("Digite um nome para salvar esta grade:");
    if (nome && nome.trim()) {
      const nomeTrim = nome.trim();
      setHistoricoGrades(prev => ({
        ...prev,
        [nomeTrim]: [...gradeAtual]
      }));
      toast({
        title: "Grade salva!",
        description: `Grade "${nomeTrim}" foi salva com sucesso.`,
      });
    }
  };
  
  const handleCarregarGrade = (nomeGrade: string) => {
    const grade = historicoGrades[nomeGrade];
    if (grade) {
      setGradeAtual(grade);
      setShowHistoricoGrades(false);
      toast({
        title: "Grade carregada!",
        description: `Grade "${nomeGrade}" foi carregada com sucesso.`,
      });
    }
  };
  
  const handleRemoverGrade = (nomeGrade: string) => {
    setHistoricoGrades(prev => {
      const novo = { ...prev };
      delete novo[nomeGrade];
      return novo;
    });
    toast({
      title: "Grade removida",
      description: `Grade "${nomeGrade}" foi removida do histórico.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Título principal */}
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Grade Horária</h1>
          {/* Descrição principal */}
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Visualize sua grade horária completa com todos os detalhes
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          {Object.keys(historicoGrades).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoricoGrades(true)}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <History className="w-4 h-4" />
              Histórico
            </Button>
          )}
          {gradeAtual.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSalvarGrade}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <Download className="w-4 h-4" />
                Salvar Grade
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLimparGrade}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Grade
              </Button>
              </>
          )}
        </div>
      </div>

      {/* Grade Section */}
      <div className="space-y-6">
        {gradeAtual.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground opacity-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Grade vazia</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Adicione disciplinas na tela de Planejamento para visualizar sua grade horária.
              </p>
            </CardContent>
          </Card>
        ) : (
          <GradeHoraria
            disciplinas={gradeAtual}
            onRemoverDisciplina={handleRemoverDisciplina}
            compact={false}
          />
        )}
      </div>
      
      {/* Modal de histórico de grades */}
      {showHistoricoGrades && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHistoricoGrades(false)}>
          <div className="bg-background rounded-lg p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Histórico de Grades Salvas</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowHistoricoGrades(false)} className="hover:bg-gray-100">
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {Object.keys(historicoGrades).length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhuma grade salva encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(historicoGrades).map(([nomeGrade, disciplinas]) => (
                    <div key={nomeGrade} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{nomeGrade}</h4>
                          <p className="text-sm text-muted-foreground">{disciplinas.length} disciplina(s)</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCarregarGrade(nomeGrade)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Carregar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoverGrade(nomeGrade)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {disciplinas.slice(0, 5).map((disciplina) => (
                          <span key={disciplina.codigo} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {disciplina.codigo}
                          </span>
                        ))}
                        {disciplinas.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{disciplinas.length - 5} mais
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grade; 