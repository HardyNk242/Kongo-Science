
import React from 'react';
import { Article } from '../types';

interface Props {
  article: Article;
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="text-slate-500 text-sm mb-2">{article.date} • Par {article.author}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
        <button className="text-blue-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
          Lire la suite
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
