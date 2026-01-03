
import React from 'react';

const TeamView: React.FC = () => {
  const members = [
    {
      name: "Dr. Hardy Nkodia",
      role: "Président du bureau exécutif",
      bio: "Géologue et Assistant à l'Université Marien Ngouabi, spécialisé dans l'étude tectonique du Congo. Son travail de recherche combine expertise en géologie structurale, gestion de projets et enseignement. Passionné par la promotion de la science en Afrique, il a publié des articles de renom et dirigé des conférences internationales.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500",
      tags: ["Tectonique", "Géologie Structurale", "Univ. Marien Ngouabi"]
    },
    {
      name: "Richy Mobongui",
      role: "Vice-Président",
      bio: "Expert en Field Network Services chez MTN Congo depuis 2018. Responsable du suivi de la disponibilité du réseau et de l'énergie, de l'exécution des projets Field Services et de la maintenance des centres de données. Licence en Technologies de l'information (ISTP Brazzaville).",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=500",
      tags: ["Network Services", "MTN Congo", "IT Systems"]
    },
    {
      name: "Jemima Bounkouta",
      role: "Secrétaire Générale",
      bio: "Spécialiste en hydrogéologie environnementale et coordination de projets. Entrepreneure indépendante en QHSE et analyse de données (Sphinx, Excel). Master 2 en Sciences de la Terre (Univ. Marien Ngouabi), experte en analyse chimique des eaux.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500",
      tags: ["Hydrogéologie", "QHSE", "Data Analysis"]
    },
    {
      name: "Dr. Nicy Bazebizonza",
      role: "V.P. Commission Contrôle & Évaluation",
      bio: "Géologue-Cartographe à l'Institut Géographique National (IGN) du Congo. Ambassadeur de la Géomatique. Doctorant sur les cavités karstiques du Congo en collaboration avec le MRAC de Tervuren (Belgique). Auteur de sept articles scientifiques.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500",
      tags: ["Géomatique", "Cartographie", "IGN Congo"]
    },
    {
      name: "Hathor Régina Kintono",
      role: "Secrétaire Adjointe",
      bio: "Détentrice d'un Master en hydrogéologie à l'université Mariën NGOUABI. Elle apporte une expertise pointue dans la gestion des ressources hydriques et le suivi administratif des projets scientifiques de la communauté.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500",
      tags: ["Hydrogéologie", "Expertise Scientifique"]
    }
  ];

  return (
    <div className="bg-slate-50 py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Notre équipe</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-8 tracking-tight">Le Bureau Exécutif</h1>
          <p className="text-slate-600 text-xl leading-relaxed max-w-3xl mx-auto">
            Des experts engagés pour renforcer les compétences des chercheurs africains et résoudre les problèmes sociaux par l'approche scientifique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {members.map((member, idx) => (
            <div key={idx} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              <div className="relative h-96 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                   <h3 className="text-3xl font-bold text-white mb-2">{member.name}</h3>
                   <div className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">{member.role}</div>
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-8">
                  {member.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed italic mb-8 flex-grow">
                  "{member.bio}"
                </p>
                <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                   <span className="text-blue-700 font-black text-[10px] uppercase tracking-widest cursor-default">Profil Vérifié</span>
                   <div className="flex gap-4">
                     <svg className="w-5 h-5 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Recrutement */}
        <section className="mt-32 bg-blue-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 max-w-4xl">
              <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Recrutement</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-10 italic">Rejoindre l'équipe Kongo Science</h2>
              <p className="text-blue-100/80 text-xl mb-12 leading-relaxed">
                Nous recherchons des formateurs, organisateurs d'événements, chercheurs expérimentés, experts en communication, marketing et spécialistes des sciences sociales.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                 {[
                   "Formateurs Renforcement Capacités",
                   "Organisateurs d'Événements",
                   "Chercheurs Expérimentés",
                   "Experts Communication & Marketing",
                   "Spécialistes Sciences Sociales"
                 ].map(profile => (
                   <div key={profile} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {profile}
                   </div>
                 ))}
              </div>
              <button className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl">
                 Postuler pour nous rejoindre
              </button>
           </div>
           <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full translate-x-1/2 translate-y-1/2 blur-[120px] opacity-20"></div>
        </section>
      </div>
    </div>
  );
};

export default TeamView;
