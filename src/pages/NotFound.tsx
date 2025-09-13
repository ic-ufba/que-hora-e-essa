import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription>
            A página que você está procurando não existe ou foi movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Verifique se o endereço está correto ou navegue para uma das páginas disponíveis.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/planejador">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Comece seu planejamento
              </Link>
            </Button>
      </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
