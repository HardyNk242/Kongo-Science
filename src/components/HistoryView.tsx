
import React from 'react';

const HistoryView: React.FC = () => {
  const activities = [
    {
      year: "2019",
      title: "Fondation & Premier Séminaire",
      expert: "Conseil Scientifique KS",
      audience: "Étudiants en Physique",
      description: "Formation notée 17,35/20 par les pairs. 98% des participants ont vivement apprécié l'approche innovante de l'enseignement."
    },
    {
      year: "2019",
      title: "Cartographie Minière & SIG",
      expert: "Dr. Miyouna Timothée",
      audience: "Master de Géosciences (Géologie)",
      description: "Séminaire technique sur l'utilisation du SIG pour la gestion des ressources minières."
    },
    {
      year: "2020",
      title: "Recherche Médicale COVID-19",
      expert: "Fondation Ntoumi / FRMC",
      audience: "500 participants (Univ. Marien Ngouabi, Lycéens)",
      description: "Étude financée par Kongo Science pour comprendre la dynamique du virus en République du Congo."
    },
    {
      year: "2021",
      title: "Géomatique & Cartographie IGN",
      expert: "Nicy Bazebizonza (IGN) & Nkodia Hardy",
      audience: "L3 à Master 2 de Géologie",
      description: "Session de 3 jours sur l'utilisation de la Cartographie sur Ordinateur avec le SIG."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white relative">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Aux origines de la vision</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">Bref historique</h1>
          <p className="text-slate-400 text-xl max-w-3xl leading-relaxed">
            La communauté Kongo Science a été fondée le 25 mai 2019 par Hardy Nkodia et Wamene Okumel.
          </p>
        </div>
      </section>

      {/* Récit Narratif */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-10 text-lg text-slate-700 leading-relaxed">
            <div className="prose prose-slate prose-lg">
              <p>
                <span className="font-bold text-slate-900">NKODIA Hardy</span>, alors doctorant en géologie structurale, avait observé un manque d'une élite de scientifiques souhaitant accroître les connaissances mondiales au sein des universités. 
              </p>
              <p>
                Selon lui, la plupart des étudiants sont simplement formés pour exécuter des tâches et non pour rechercher et développer de nouvelles idées. Il était donc nécessaire de combler ce vide pour espérer voir émerger une génération de chercheurs africains puissants. 
              </p>
              <p>
                En rencontrant <span className="font-bold text-slate-900">Wamene Okumel</span>, l'un de ses collègues de classe partageant la même passion, ils décidèrent de créer une communauté visant à encadrer les étudiants en master et en doctorat afin qu'ils puissent apporter d'importantes contributions dans leurs domaines scientifiques respectifs.
              </p>
            </div>

            <div className="bg-blue-50 p-12 rounded-[3rem] border border-blue-100 relative overflow-hidden">
               <h3 className="text-2xl font-serif font-bold text-blue-900 mb-6 italic">Pourquoi "Kongo" plutôt que "Congo" ?</h3>
               <p className="mb-6">
                 Ce choix a fait l'objet d'une grande discussion. "Kongo" désignait la région originelle au cœur de l'Afrique où siégeait le Royaume Kongo (s'étendant du Gabon au Cameroun, en passant par l'Angola et les deux Congo).
               </p>
               <div className="space-y-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-600">
                   <p className="italic">"Kongo semble plus original pour promouvoir une science issue de nos propres efforts, contrairement à la dénomination coloniale."</p>
                   <span className="text-xs font-bold uppercase mt-4 block text-slate-400">— Nkodia Hardy</span>
                 </div>
                 <p>
                   Bien qu'Okumel craignait que cela ne catégorise la science comme tribale, l'argument de l'originalité et du refus de la dénomination coloniale l'emporta. Kongo Science prône une science universelle aux racines authentiques.
                 </p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 sticky top-28 shadow-sm">
              <h4 className="font-black text-[10px] uppercase tracking-widest text-blue-700 mb-6">Évaluation 2019</h4>
              <div className="space-y-6">
                 <div className="flex items-end gap-2">
                    <span className="text-4xl font-serif font-bold text-blue-900">17,35</span>
                    <span className="text-slate-400 pb-1">/ 20</span>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold tracking-tighter">
                    Note globale attribuée par les pairs lors de la première formation en Physique.
                 </p>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[86%]"></div>
                 </div>
                 <ul className="text-xs space-y-3 text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                       98% de satisfaction
                    </li>
                    <li className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                       36% demandent plus de temps
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronologie des Séminaires */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Réalisations</span>
            <h2 className="text-4xl font-serif font-bold text-slate-900">Actions sur le terrain</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((act, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-center mb-8">
                   <span className="text-5xl font-serif font-black text-blue-50 group-hover:text-blue-100 transition-colors">{act.year}</span>
                   <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">{act.title}</h3>
                <div className="space-y-4 text-sm text-slate-500 mb-8">
                   <p><span className="font-bold text-slate-400 uppercase tracking-tighter text-[10px] block">Intervenant</span> {act.expert}</p>
                   <p><span className="font-bold text-slate-400 uppercase tracking-tighter text-[10px] block">Public</span> {act.audience}</p>
                </div>
                <p className="text-slate-600 leading-relaxed italic border-t border-slate-50 pt-6">
                   {act.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryView;
