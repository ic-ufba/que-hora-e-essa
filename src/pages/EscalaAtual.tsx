import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trash2,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { Disciplina } from "@/utils/sigaaParser";
import { GradeHoraria } from "@/components/GradeHoraria";
import { useToast } from "@/hooks/use-toast";

const Grade = () => {
  const [gradeAtual, setGradeAtual] = useState<Disciplina[]>([]);
  const { toast } = useToast();

  // Carrega a grade do localStorage ao inicializar
  useEffect(() => {
    const gradeSalva = localStorage.getItem('gradeHoraria');
    if (gradeSalva) {
      setGradeAtual(JSON.parse(gradeSalva));
    }
  }, []);

  // Salva a grade no localStorage sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('gradeHoraria', JSON.stringify(gradeAtual));
  }, [gradeAtual]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* Título principal */}
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Grade Horária</h1>
          {/* Descrição principal */}
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Visualize sua grade horária completa com todos os detalhes
          </p>
        </div>
        {gradeAtual.length > 0 && (
          <Button variant="outline" onClick={handleLimparGrade}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Grade
          </Button>
        )}
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
    </div>
  );
};

export default Grade; 