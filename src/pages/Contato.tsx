import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Contato = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          {/* Título principal */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Contato
          </h1>
          {/* Descrição principal */}
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Entre em contato através dos canais.
          </p>
        </div>

        {/* Cards de Contato */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Email */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              {/* CardTitle */}
              <CardTitle className="text-lg md:text-xl font-bold text-gray-900">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Envie suas dúvidas, sugestões ou reporte problemas diretamente para o email.
              </p>
              <a 
                href="mailto:idealab.ic.ufba@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                idealab.ic.ufba@gmail.com
              </a>
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              {/* CardTitle */}
              <CardTitle className="text-lg md:text-xl font-bold text-gray-900">Formulário</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Preencha o formulário online para enviar uma mensagem detalhada.
              </p>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSeJmzlN7bj6AOlwBqZbcQcw7NRcnsXs2Hay4q4rlzS-yOdijQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                Preencher Formulário
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Informação Adicional */}
        <div className="max-w-2xl mx-auto mt-8 md:mt-12 text-center">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-gray-600 text-sm">
                <strong>Resposta Rápida:</strong> Atualmente, o projeto está sendo conduzido por uma única pessoa, o que pode ocasionar algum atraso nas respostas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Botão Voltar */}
        <div className="mt-10 text-center">
          <Link to="/" className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contato; 