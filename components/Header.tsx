
import React, { useState, useRef, useEffect } from 'react';
import { ViewState, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { Search, X, Globe, Menu, Loader2 } from 'lucide-react';

interface HeaderProps {
  setViewState: (view: ViewState) => void;
  viewState: ViewState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  setViewState,
  viewState,
  searchQuery,
  setSearchQuery,
  language,
  setLanguage
}) => {
  const t = UI_TRANSLATIONS[language];
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulate loading state for search
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (view: ViewState) => {
    setViewState(view);
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-zinc-100 py-6 px-6 md:px-12 flex justify-between items-center transition-all h-24">
        {/* Logo Area - Hidden on mobile when search is open */}
        <div
          className={`cursor-pointer group ${isMobileSearchOpen ? 'hidden md:block' : 'block'}`}
          onClick={() => handleNavClick(ViewState.HOME)}
        >
          <h1 className="font-serif text-3xl tracking-tight text-ink group-hover:opacity-70 transition-opacity">
            The Index.
          </h1>
          <p className="font-mono text-xs text-graphite tracking-widest uppercase mt-1">
            Journal of Information Science
          </p>
        </div>

        <div className={`flex items-center gap-6 md:gap-8 ${isMobileSearchOpen ? 'w-full md:w-auto' : ''}`}>
          {/* Search Bar */}
          {/* Search Bar */}
          {/* Search Bar */}
          <div className={`relative flex items-center transition-all duration-500 ease-out ${isMobileSearchOpen ? 'w-full' : 'w-auto'}`}>
            <div className={`relative flex items-center overflow-hidden transition-all duration-500 ${isMobileSearchOpen || searchQuery ? 'w-full md:w-72 bg-white/95 backdrop-blur-md shadow-2xl border border-zinc-200 rounded-full px-4 py-2' : 'w-8 md:w-8 border-b border-transparent'}`}>
              <button
                onClick={() => {
                  if (!isMobileSearchOpen) {
                    setIsMobileSearchOpen(true);
                  }
                }}
                className={`shrink-0 text-ink transition-transform duration-300 ${isMobileSearchOpen ? 'scale-90' : 'hover:scale-110'}`}
              >
                <Search size={18} strokeWidth={2} />
              </button>

              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsMobileSearchOpen(true)}
                onBlur={() => !searchQuery && setIsMobileSearchOpen(false)}
                className={`bg-transparent outline-none text-sm font-sans ml-3 text-ink placeholder-zinc-400 w-full h-6 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-100' : 'opacity-0 cursor-pointer'}`}
              />

              {/* Loading Indicator */}
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isSearching ? 'opacity-100' : 'opacity-0'}`}>
                <Loader2 size={14} className="animate-spin text-black" />
              </div>
            </div>

            {/* Close Button */}
            {isMobileSearchOpen && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsMobileSearchOpen(false);
                  setSearchQuery('');
                }}
                className="ml-3 text-zinc-400 hover:text-red-500 transition-colors md:hidden"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex gap-8 items-center">
            <button
              onClick={() => setViewState(ViewState.HOME)}
              className={`text-sm font-sans tracking-wide transition-colors hover:text-ink ${viewState === ViewState.HOME ? 'text-ink font-medium border-b border-black' : 'text-zinc-400'}`}
            >
              {t.currentIssue}
            </button>
            <button
              onClick={() => setViewState(ViewState.ARCHIVE)}
              className={`text-sm font-sans tracking-wide transition-colors hover:text-ink ${viewState === ViewState.ARCHIVE ? 'text-ink font-medium border-b border-black' : 'text-zinc-400'}`}
            >
              {t.archives}
            </button>
            <button
              onClick={() => setViewState(ViewState.MASTHEAD)}
              className={`text-sm font-sans tracking-wide transition-colors hover:text-ink ${viewState === ViewState.MASTHEAD ? 'text-ink font-medium border-b border-black' : 'text-zinc-400'}`}
            >
              {t.masthead}
            </button>
          </nav>

          {/* Desktop Language Dropdown */}
          <div
            className={`hidden md:block relative border-l border-zinc-200 pl-6`}
            ref={dropdownRef}
          >
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 text-zinc-400 hover:text-ink transition-colors group relative"
              aria-label="Select Language"
            >
              <Globe size={18} strokeWidth={1.5} />
              <span className="font-mono text-xs uppercase tracking-widest w-6 text-left">{language}</span>

              {/* Tooltip for Language */}
              <div className="absolute right-0 top-full mt-4 hidden group-hover:block z-50 pointer-events-none">
                <div className="bg-ink text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 shadow-xl whitespace-nowrap">
                  Select Language
                </div>
              </div>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-4 w-32 bg-white border border-zinc-100 shadow-xl py-2 flex flex-col animate-in fade-in slide-in-from-top-2 z-50">
                {(['en', 'ig', 'yo', 'ha'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setIsLangMenuOpen(false); }}
                    className={`text-left px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-zinc-50 transition-colors ${language === lang ? 'text-black font-bold bg-zinc-50/50' : 'text-zinc-400'}`}
                  >
                    {lang === 'en' ? 'English' : lang === 'ig' ? 'Igbo' : lang === 'yo' ? 'Yoruba' : 'Hausa'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle - Hidden if search is open */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden text-ink p-2 ${isMobileSearchOpen ? 'hidden' : 'block'}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto">
          <div className="p-6 flex justify-between items-center border-b border-zinc-100">
            <span className="font-serif text-xl">The Index.</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-ink">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col p-8 gap-8 items-center justify-center text-center">
            <button
              onClick={() => handleNavClick(ViewState.HOME)}
              className={`font-serif text-3xl ${viewState === ViewState.HOME ? 'text-ink underline decoration-2 underline-offset-4' : 'text-zinc-500'}`}
            >
              {t.currentIssue}
            </button>
            <button
              onClick={() => handleNavClick(ViewState.ARCHIVE)}
              className={`font-serif text-3xl ${viewState === ViewState.ARCHIVE ? 'text-ink underline decoration-2 underline-offset-4' : 'text-zinc-500'}`}
            >
              {t.archives}
            </button>
            <button
              onClick={() => handleNavClick(ViewState.MASTHEAD)}
              className={`font-serif text-3xl ${viewState === ViewState.MASTHEAD ? 'text-ink underline decoration-2 underline-offset-4' : 'text-zinc-500'}`}
            >
              {t.masthead}
            </button>
            <button
              onClick={() => handleNavClick(ViewState.ADMIN)}
              className={`font-serif text-3xl ${viewState === ViewState.ADMIN ? 'text-ink underline decoration-2 underline-offset-4' : 'text-zinc-500'}`}
            >
              {t.admin}
            </button>

            <div className="w-16 h-px bg-zinc-200 my-4"></div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              {(['en', 'ig', 'yo', 'ha'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setIsMobileMenuOpen(false); }}
                  className={`py-3 border font-mono text-xs uppercase tracking-widest ${language === lang ? 'border-ink bg-ink text-white' : 'border-zinc-200 text-zinc-500'}`}
                >
                  {lang === 'en' ? 'English' : lang === 'ig' ? 'Igbo' : lang === 'yo' ? 'Yoruba' : 'Hausa'}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-300">
            The Index. Mobile
          </div>
        </div>
      )}
    </>
  );
};