import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-300 overflow-hidden">
      {/* Halo décoratif */}
      <div className="absolute -top-32 left-1/4 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* === BANDEAU NEWSLETTER === */}
      <section className="relative border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-3 block">Newsletter</span>
              <h3 className="text-3xl font-serif font-bold text-white italic leading-tight">
                Restez à la pointe de la science congolaise.
              </h3>
              <p className="text-slate-400 text-sm mt-3 max-w-md leading-relaxed">
                Un email mensuel. Conférences, bourses, publications. Désabonnement libre.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3" aria-label="Inscription newsletter">
              <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                autoComplete="email"
                className="flex-1 bg-white/5 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-white/10 px-5 py-4 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none"
              />
              <button
                type="submit"
                disabled={submitted}
                className="group bg-white text-slate-900 px-7 py-4 rounded-xl font-bold text-sm hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitted ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Inscrit
                  </>
                ) : (
                  <>
                    S'abonner
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* === CORPS DU FOOTER === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-14">
          {/* Marque */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-serif font-bold text-xl shadow-lg">
                K
              </div>
              <span className="text-xl font-serif font-bold text-white">
                Kongo <span className="text-blue-400 italic">Science</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              Bâtir un avenir scientifique prospère en Afrique par l'excellence de la recherche et la résolution des défis stratégiques du Bassin du Congo.
            </p>

            {/* Stats compact */}
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-2xl font-serif font-bold text-white italic">50+</p>
                <p className="text-[10px] uppercase text-slate-500 tracking-widest font-bold">Chercheurs</p>
              </div>
              <div className="w-px h-10 bg-slate-800"></div>
              <div>
                <p className="text-2xl font-serif font-bold text-white italic">3 000+</p>
                <p className="text-[10px] uppercase text-slate-500 tracking-widest font-bold">Documents</p>
              </div>
              <div className="w-px h-10 bg-slate-800"></div>
              <div>
                <p className="text-2xl font-serif font-bold text-white italic">6 ans</p>
                <p className="text-[10px] uppercase text-slate-500 tracking-widest font-bold">Expertise</p>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-2">
              {[
                { name: 'Facebook', href: 'https://facebook.com', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'LinkedIn', href: 'https://linkedin.com', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                { name: 'YouTube', href: 'https://youtube.com', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                { name: 'WhatsApp', href: 'https://wa.me/242068347820', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 bg-slate-800/60 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes liens */}
          <nav aria-label="Explorer" className="md:col-span-2">
            <h4 className="text-white font-bold mb-5 uppercase text-[11px] tracking-[0.2em]">Explorer</h4>
            <ul className="space-y-3 text-sm">
              {['Notre Vision', 'Programmes PACC', 'Bibliothèque', 'Conférences', 'Publications'].map(l => (
                <li key={l}>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all"></span>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Domaines" className="md:col-span-2">
            <h4 className="text-white font-bold mb-5 uppercase text-[11px] tracking-[0.2em]">Domaines</h4>
            <ul className="space-y-3 text-sm">
              {['SIG & Géomatique', 'Sciences de la Terre', 'Rédaction Scientifique', 'Intelligence Artificielle', 'Bourses & Mobilité'].map(l => (
                <li key={l}>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all"></span>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-white font-bold mb-5 uppercase text-[11px] tracking-[0.2em]">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <span className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-colors">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div className="text-slate-400 leading-relaxed">
                  22 rue Ngabi Barthelemy<br />
                  Brazzaville, République du Congo
                </div>
              </li>
              <li>
                <a href="mailto:kongoscience25@gmail.com" className="flex items-center gap-3 group hover:text-white transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-colors">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-slate-400 group-hover:text-white transition-colors">kongoscience25@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+242068347820" className="flex items-center gap-3 group hover:text-white transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-colors">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="text-slate-400 group-hover:text-white transition-colors font-mono">+242 06 834 78 20</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* === BAS DU FOOTER === */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            © {currentYear} Communauté Kongo Science. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Politique de Confidentialité</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Engagement Éthique</a>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Made with care · Brazzaville
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
