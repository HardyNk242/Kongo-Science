import React from 'react';
import { Article } from '../types';

interface Props {
  article: Article;
  onClick: (article: Article) => void; // NOUVEAU : On ajoute une fonction de clic
}

const ArticleCard: React.FC<Props> = ({ article, onClick }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="h-48 overflow-hidden relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase text-blue-700 shadow-sm">
          {article.category}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>{article.date}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{article.author}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight">
          {article.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {article.excerpt}
        </p>

        <button
          onClick={() => onClick(article)} // NOUVEAU : Déclenche l'ouverture
          className="mt-auto flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
        >
          Lire l'article
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
