import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Calendar,
  Grid3X3,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import logo from "@/components/image/logo.png";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Determina se deve mostrar a navegação baseado na rota atual
  const shouldShowNavigation = location.pathname !== '/';
  
  // Determina se deve mostrar "Grade" baseado na rota atual
  const shouldShowGrade = location.pathname === '/planejador';

  const navigation = [
    {
      name: 'Planejamento Semestral',
      href: '/planejador',
      icon: Calendar,
    },
    ...(shouldShowGrade ? [{
      name: 'Grade',
      href: '/grade',
      icon: Grid3X3,
    }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {shouldShowNavigation && (
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Nome */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Logo QueHoraÉEssa?" className="w-8 h-8 rounded-lg object-contain bg-white" />
              <span className="text-lg md:text-xl font-bold text-gray-900">QueHoraÉEssa?</span>
            </Link>
            {/* Navegação */}
            {location.pathname === '/grade' ? (
              <nav className="flex items-center gap-6">
                <Link
                  to="/planejador"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Planejamento</span>
                </Link>
              </nav>
            ) : location.pathname === '/planejador' ? (
              <nav className="flex items-center gap-6">
                <Link
                  to="/grade"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="font-medium">Grade</span>
                </Link>
              </nav>
            ) : location.pathname === '/contato' || location.pathname === '/faq' ? (
              <nav className="flex items-center gap-6">
                <Link
                  to="/planejador"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Planejamento</span>
                </Link>
              </nav>
            ) : (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && location.pathname !== '/planejador' && location.pathname !== '/grade' && (
            <nav className="md:hidden mt-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </header>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>
      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            {/* Descrição Centralizada */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Sistema inteligente para conversão de horários do SIGAA UFBA. 
              Transformando códigos confusos em horários claros e organizados.
            </p>
            {/* Projeto Centralizado */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Projeto do IdeaLab.ic</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Este site não tem nenhuma relação com o SIGAA</div>
            {/* Links Centralizados */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a 
                href="https://www.meuhorarioufba.com.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Meu Horário UFBA
              </a>
              <a 
                href="https://github.com/ic-ufba/que-hora-e-essa.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Código Fonte
              </a>
              <a 
                href="https://sigaa.ufba.br/sigaa/public/home.jsf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                SIGAA UFBA
              </a>
            </div>
            <div className="mt-4 text-center space-y-2">
              <a href="/faq" className="inline-block text-blue-700 font-semibold hover:text-blue-900 transition-colors text-base px-4 py-2 rounded-lg hover:bg-blue-50">
                Perguntas Frequentes
              </a>
              <div className="w-8 h-px bg-blue-200 mx-auto"></div>
              <a href="/contato" className="inline-block text-blue-700 font-semibold hover:text-blue-900 transition-colors text-base px-4 py-2 rounded-lg hover:bg-blue-50">
                Contato
              </a>
            </div>
            {/* Linha de Separação */}
            <div className="border-t border-blue-200 mt-8 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-xs text-gray-500">
                    © 2025 QueHoraÉEssa?. Todos os direitos reservados.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Inspirado no Meu Horário UFBA</span>
                  <span>•</span>
                  <span>Universidade Federal da Bahia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 