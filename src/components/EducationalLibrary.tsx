/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { EDUCATIONAL_ARTICLES } from '../data/initialData';
import { EducationalArticle } from '../types';

export const EducationalLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);

  const categories = [
    'All',
    'Breathing Techniques',
    'Inhaler Technique',
    'Action Plans & Safety',
    'Triggers & Environment'
  ];

  const filteredArticles = EDUCATIONAL_ARTICLES.filter(art => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-teal-600" />
            <span>Respiratory Health Library</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evidence-informed clinical guides grounded in GINA, BTS/SIGN, and British Thoracic Society guidelines
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles & guides..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Category Segmented Controls */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-teal-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setActiveArticle(null)}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              ← Back to All Articles
            </button>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activeArticle.readingTimeMin} min read
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              {activeArticle.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeArticle.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {activeArticle.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Key Clinical Takeaways</span>
            </h4>
            <ul className="list-disc pl-4 text-xs text-teal-950 space-y-1">
              {activeArticle.keyTakeaways.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Article Sections */}
          <div className="space-y-6 pt-2">
            {activeArticle.sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {section.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Peer-Reviewed Clinical Citations */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Credible Clinical References & Guidelines</span>
            </h4>
            <div className="space-y-2">
              {activeArticle.citations.map((cite, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600"
                >
                  <p className="font-semibold text-slate-900">{cite.title}</p>
                  <p className="text-slate-500">
                    {cite.author} · <em>{cite.publication}</em> ({cite.year})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Articles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-teal-700 uppercase tracking-wider text-[11px]">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTimeMin} min
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {article.citations.length} verified citation{article.citations.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setActiveArticle(article)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
