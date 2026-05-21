import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { SCIMAGO_DOMAINS } from '../constants';
import { THESES_LIBRARY } from '../data/library';
import { Thesis } from '../types';
import SubmitPublicationModal from './SubmitPublicationModal';

const ITEMS_PER_PAGE = 10;

interface LibraryViewProps {
  initialThesisId?: string | null;
}

const LibraryView: React.FC<LibraryViewProps> = ({ initialThesisId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { thesisId } = useParams();

  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedYearFilter, setSelectedYearFilter] = useState('any');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const normalizeId = (text: string | undefined) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const libIndex = parts.indexOf('library');
    let urlId = '';
    if (libIndex !== -1 && parts[libIndex + 1]) urlId = decodeURIComponent(parts[libIndex + 1]);
    else if (thesisId) urlId = thesisId;
    else if (initialThesisId) urlId = initialThesisId;

    if (urlId) {
      const found = THESES_LIBRARY.find(t =>
        normalizeId(t.id) === normalizeId(urlId) ||
        normalizeId(t.title) === normalizeId(urlId)
      );
      if (found) setSelectedThesis(found);
    } else {
      setSelectedThesis(null);
    }
  }, [initialThesisId, thesisId, location]);

  const openThesis = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    navigate(`/library/${thesis.id}`);
  };

  const closeThesis = () => {
    setSelectedThesis(null);
    navigate(`/library`);
  };

  // Compteurs par domaine
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    THESES_LIBRARY.forEach((item) => {
      const domain = item.domain || 'Multidisciplinary';
      counts[domain] = (counts[domain] || 0) + 1;
    });
    return counts;
  }, []);

  // Stats globales
  const stats = useMemo(() => {
    const total = THESES_LIBRARY.length;
    const openAccess = THESES_LIBRARY.filter(t => !t.isRestricted).length;
    const years = THESES_LIBRARY.map(t => parseInt(t.year) || 0).filter(Boolean);
    const yearMin = years.length ? Math.min(...years) : 0;
    return { total, openAccess, yearMin };
  }, []);

  const filteredTheses = useMemo(() => {
    let results = THESES_LIBRARY.filter((t) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (t.title || '').toLowerCase().includes(searchLower) ||
        (t.author || '').toLowerCase().includes(searchLower) ||
        (t.abstract || '').toLowerCase().includes(searchLower);
      const matchesDomain = selectedDomain === 'Tous' || t.domain === selectedDomain;
      let matchesYear = true;
      const thesisYear = parseInt(t.year) || 0;
      if (selectedYearFilter !== 'any') matchesYear = thesisYear >= parseInt(selectedYearFilter);
      return matchesSearch && matchesDomain && matchesYear;
    });
    results.sort((a, b) => {
      const dateA = parseInt(a.year) || 0;
      const dateB = parseInt(b.year) || 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return results;
  }, [searchTerm, selectedDomain, selectedYearFilter, sortOrder]);

  const totalPages = Math.ceil(filteredTheses.length / ITEMS_PER_PAGE);
  const currentTheses = filteredTheses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedDomain, selectedYearFilter, sortOrder]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage, selectedThesis]);

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;
    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) range.push(i);
    }
    if (totalPages > 1) range.push(totalPages);
    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }
    if (totalPages === 1) return [1];
    return rangeWithDots;
  };

  const copyCitation = (thesis: Thesis) => {
    const citation = `${thesis.author} (${thesis.year}). ${thesis.title}. ${thesis.institution}.`;
    navigator.clipboard.writeText(citation);
    alert('Citation copiée !');
  };

  const shareOnWhatsApp = (thesis: Thesis) => {
    const preciseLink = `${window.location.origin}/library/${thesis.id}`;
    const text = `*Regarde cette publication sur Kongo Science :*\n\n"${thesis.title}"\n${thesis.author} (${thesis.year})\n\nLien : ${preciseLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const renderZoteroCoins = (thesis: Thesis) => {
    const title = encodeURIComponent(thesis.title || '');
    const author = encodeURIComponent(thesis.author || '');
    const date = encodeURIComponent(thesis.year || '');
    const publisher = encodeURIComponent(thesis.institution || '');
    const isThesis = (thesis.type || '').includes('Thèse') || (thesis.type || '').includes('Mémoire');
    const genre = isThesis ? 'dissertation' : 'article';
    const fmt = isThesis ? 'info:ofi/fmt:kev:mtx:dissertation' : 'info:ofi/fmt:kev:mtx:journal';
    const coinsData = `ctx_ver=Z39.88-2004&rft_val_fmt=${fmt}&rft.title=${title}&rft.au=${author}&rft.date=${date}&rft.inst=${publisher}&rft.genre=${genre}`;
    return <span className="Z3988" title={coinsData} style={{ display: 'none' }}></span>;
  };

  const MailRequestPopup = () => {
    if (!showMailPopup || !selectedThesis) return null;
    const subject = encodeURIComponent(`Demande d'accès : ${selectedThesis.title.substring(0, 50)}...`);
    const body = encodeURIComponent(`Bonjour Dr. Nkodia,\n\nJe suis intéressé par votre publication "${selectedThesis.title}" (${selectedThesis.year}).\nPourriez-vous m'envoyer une copie privée ?`);
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=nkodiahardy@gmail.com&su=${subject}&body=${body}`;
    const mailtoLink = `mailto:nkodiahardy@gmail.com?subject=${subject}&body=${body}`;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowMailPopup(false)}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          <button onClick={() => setShowMailPopup(false)} aria-label="Fermer" className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Demander une copie privée</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Ce document est protégé. L'auteur recevra votre demande par email.</p>
          </div>
          <div className="space-y-3">
            <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors">
              Écrire via Gmail
            </a>
            <a href={mailtoLink} className="block text-center text-xs text-slate-400 hover:text-blue-700 underline">Ou via l'application par défaut</a>
          </div>
        </div>
      </div>
    );
  };

  // ====================================================================
  // VUE DÉTAIL
  // ====================================================================
  if (selectedThesis) {
    const t = selectedThesis;
    return (
      <div className="bg-slate-50 min-h-screen pb-24">
        {showMailPopup && <MailRequestPopup />}

        {/* Bandeau retour */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button
              onClick={closeThesis}
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              Retour aux résultats
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-12">
          {renderZoteroCoins(t)}

          {/* En-tête article */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {t.type || 'Publication'}
              </span>
              {t.isRestricted ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Accès restreint
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Open Access
                </span>
              )}
              {t.domain && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 bg-slate-100 rounded-full">
                  {t.domain}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.1] mb-6">
              {t.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 text-base">
              <span className="font-bold text-slate-900">{t.author}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{t.year}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="italic">{t.institution}</span>
            </div>
          </header>

          {/* Carte résumé + actions */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12 mb-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-slate-300"></span>
              Résumé
            </h3>
            <p className="text-slate-700 leading-relaxed text-lg font-serif first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-blue-700">
              {t.abstract}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5">Actions</h3>
            <div className="flex flex-wrap gap-3">
              {t.isForSale && t.purchaseUrl && (
                <a href={t.purchaseUrl} target="_blank" rel="noopener noreferrer" className="group bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all active:scale-95">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Acheter
                </a>
              )}
              {t.isRestricted && (
                <button onClick={() => setShowMailPopup(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all active:scale-95">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Demander une copie
                </button>
              )}
              {t.pdfUrl && (
                <a href={t.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all active:scale-95">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  {t.isRestricted ? 'Voir le site source' : 'Télécharger'}
                </a>
              )}
              <button onClick={() => shareOnWhatsApp(t)} className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all active:scale-95">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Partager
              </button>
              <button onClick={() => copyCitation(t)} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Citer
              </button>
            </div>

            {t.isRestricted && (
              <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-sm text-amber-900">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="leading-relaxed">
                  Ce document n'est pas en libre accès (Open Access) en raison des droits d'auteur. Vous pouvez essayer de le consulter via le bouton "Voir le site source" (si vous avez un accès universitaire) ou "Demander une copie" directement à l'auteur.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================================
  // VUE LISTE
  // ====================================================================
  return (
    <div className="bg-slate-50 min-h-screen">
      {showSubmitModal && <SubmitPublicationModal onClose={() => setShowSubmitModal(false)} />}

      {/* ====== HERO ====== */}
      <section className="relative bg-slate-950 pt-20 pb-32 text-white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] bg-indigo-500/20 rounded-full blur-[140px]"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-6">
              <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-100">Archive scientifique souveraine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-6">
              Bibliothèque
              <span className="block italic text-blue-300">des publications.</span>
            </h1>
            <p className="text-blue-100/80 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Rendre le patrimoine scientifique du Bassin du Congo <span className="text-white font-bold">visible et accessible</span>. Thèses, mémoires, articles — depuis {stats.yearMin || '2000'}.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <label htmlFor="library-search" className="sr-only">Rechercher</label>
              <input
                id="library-search"
                type="text"
                placeholder="Titre, auteur, mot-clé, domaine…"
                className="w-full h-16 pl-14 pr-32 rounded-2xl text-base text-slate-900 bg-white shadow-2xl focus:ring-4 focus:ring-blue-500/50 outline-none transition-all placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
                <p className="font-serif italic text-3xl font-bold text-white leading-none">{stats.total}</p>
                <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mt-1">Documents</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
                <p className="font-serif italic text-3xl font-bold text-white leading-none">{stats.openAccess}</p>
                <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mt-1">Open Access</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
                <p className="font-serif italic text-3xl font-bold text-white leading-none">{SCIMAGO_DOMAINS.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mt-1">Domaines</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TOOLBAR FILTRES ====== */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-10">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filtres
            </button>

            <select
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm text-slate-700 px-4 py-2.5 rounded-xl font-medium cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              aria-label="Trier"
            >
              <option value="newest">Plus récents d'abord</option>
              <option value="oldest">Plus anciens d'abord</option>
            </select>

            <select
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm text-slate-700 px-4 py-2.5 rounded-xl font-medium cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              aria-label="Filtrer par année"
            >
              <option value="any">Toutes années</option>
              <option value="2023">Depuis 2023</option>
              <option value="2020">Depuis 2020</option>
              <option value="2015">Depuis 2015</option>
              <option value="2010">Depuis 2010</option>
            </select>

            {(searchTerm || selectedDomain !== 'Tous' || selectedYearFilter !== 'any') && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedDomain('Tous'); setSelectedYearFilter('any'); }}
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors px-3 py-2.5"
              >
                Réinitialiser
              </button>
            )}
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="group bg-slate-900 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Contribuer
          </button>
        </div>
      </div>

      {/* ====== GRILLE PRINCIPALE ====== */}
      <div className="max-w-7xl mx-auto px-6 pb-24 flex flex-col md:flex-row gap-10">
        {/* SIDEBAR DOMAINES */}
        <aside className={`w-full md:w-72 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sticky top-24">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-slate-300"></span>
              Domaines
            </h4>
            <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
              <button
                onClick={() => setSelectedDomain('Tous')}
                className={`text-left text-sm flex justify-between items-center transition-all px-3 py-2 rounded-lg ${
                  selectedDomain === 'Tous'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Tous les domaines</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  selectedDomain === 'Tous' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{THESES_LIBRARY.length}</span>
              </button>

              {SCIMAGO_DOMAINS.map((dom) => {
                const count = domainCounts[dom.value] || 0;
                if (count === 0) return null;
                const active = selectedDomain === dom.value;
                return (
                  <button
                    key={dom.value}
                    onClick={() => setSelectedDomain(dom.value)}
                    aria-pressed={active}
                    className={`text-left text-sm flex justify-between items-center transition-all px-3 py-2 rounded-lg ${
                      active
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-2">{dom.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* LISTE */}
        <main className="flex-grow min-w-0">
          <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              <span className="italic text-blue-700">{filteredTheses.length}</span>{' '}
              <span className="text-slate-500 font-normal text-base">résultat{filteredTheses.length > 1 ? 's' : ''}</span>
            </h2>
            {selectedDomain !== 'Tous' && (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Domaine : <span className="text-slate-900">{selectedDomain}</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            {currentTheses.length > 0 ? (
              currentTheses.map((thesis) => (
                <article
                  key={thesis.id}
                  onClick={() => openThesis(thesis)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openThesis(thesis)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ouvrir la publication : ${thesis.title}`}
                  className="group relative bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  {renderZoteroCoins(thesis)}

                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Année + Type */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-serif italic font-bold text-blue-700 text-lg leading-none">{thesis.year}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{thesis.type || 'Publication'}</span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                        {thesis.title}
                      </h3>

                      <p className="text-sm text-slate-600 mb-4">
                        <span className="font-semibold text-slate-900">{thesis.author}</span>
                        {thesis.institution && (
                          <>
                            <span className="text-slate-400 mx-2">·</span>
                            <span className="italic">{thesis.institution}</span>
                          </>
                        )}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {thesis.isRestricted ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 text-[10px] uppercase tracking-widest">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            Accès restreint
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 text-[10px] uppercase tracking-widest">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            Open Access
                          </span>
                        )}
                        {thesis.domain && (
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md">
                            {thesis.domain}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white transition-all">
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-900 font-bold mb-1">Aucun résultat</p>
                <p className="text-slate-500 text-sm mb-6">Aucune publication ne correspond à votre recherche.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedDomain('Tous'); setSelectedYearFilter('any'); }}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors"
                >
                  Effacer les filtres
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-12 pt-8 border-t border-slate-100 flex justify-center items-center gap-1 select-none flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                Précédent
              </button>

              {getVisiblePages().map((page, idx) =>
                typeof page === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      currentPage === page
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="w-10 h-10 flex items-center justify-center text-slate-400">…</span>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
};

export default LibraryView;
