import React from 'react';
import { Workflow, ArrowUpRight } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { useLanguage } from '../../hooks/useLanguage';
import { TRANSLATIONS } from '../../constants';

export const LandingPage = () => {
  const { setView } = useNavigation();
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  return (
    <div className="landing-multi-font min-h-screen bg-white flex flex-col">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-200/60 h-16 sm:h-[72px]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <Workflow className="text-white" size={18} />
            </div>
            <span className="text-[15px] sm:text-base font-semibold text-slate-900 tracking-tight">GESTORA</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setView('landing')} className="text-[13px] sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100/80 transition-colors">
              Início
            </button>
            <button onClick={() => setView('login')} className="text-[13px] sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors shadow-sm">
              Entrar
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 sm:pt-40 md:pt-48 lg:pt-64 pb-32 sm:pb-40 md:pb-56 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto space-y-8 sm:space-y-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 leading-[1.05] tracking-tight animate-in">
          {t.landingTitle.split(' simples e eficaz')[0]} <span className="text-[#10b981]">simples</span> e <span className="text-[#10b981]">eficaz</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-[20px] text-slate-500 max-w-3xl mx-auto font-medium animate-in leading-relaxed px-2">
          {t.landingDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center pt-6 sm:pt-8 animate-in">
          <button onClick={() => setView('login')} className="flex items-center justify-center gap-2 px-10 sm:px-14 py-4 sm:py-5 rounded-full border-2 border-[#10b981] text-[#10b981] font-bold hover:bg-[#10b981] hover:text-white transition-all text-base group w-full sm:w-auto">
            Começar Agora <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-14 px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
          <div className="flex items-center gap-2.5 text-slate-400">
            <Workflow size={18} />
            <span className="text-sm font-semibold tracking-tight">GESTORA</span>
          </div>
          <p className="text-slate-500 text-xs tracking-wide">
            © 2026 ILUNGI GESTORA
          </p>
        </div>
      </footer>
    </div>
  );
};