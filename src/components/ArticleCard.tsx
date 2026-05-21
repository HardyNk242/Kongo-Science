import React from 'react';
import { Article } from '../types';

interface Props {
  article: Article;
  onClick: (article: Article) => void;
}

const ArticleCard: React.FC<Props> = ({ article, onClick }) => {
  return (
    <article
      onClick={() => onClick(article)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(article)}
      tabIndex={0}
      role="button"
      aria-label={`Lire l'article : ${article.title}`}
      className="cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 group flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      <div className="h-52 overflow-hidden relative bg-slate-100">
        <img
          src={article.imageUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>

        {/* Badge catégorie */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-900 shadow-sm tracking-widest border border-white">
          {article.category}
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow">
        {/* Métadonnées */}
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 flex-wrap">
          <time>{article.date}</time>
          <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden="true"></span>
          <span>{article.author}</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug">
          {article.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {article.excerpt}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
          Lire l'article
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </article>
  );
};

export default ArticleCard;
