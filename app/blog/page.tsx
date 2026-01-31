'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { articles, categories } from '@/lib/blog/articles'
import { ArticleCard } from '@/components/blog/ArticleCard'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Filter articles by category
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((article) => article.category === selectedCategory)
  
  // Get featured article (first one marked as featured)
  const featuredArticle = articles.find((article) => article.featured)
  
  // Get non-featured articles
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured || selectedCategory !== 'All'
  )
  
  return (
    <div className="relative min-h-screen">
      {/* Static gradient background with grain texture */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.15),transparent_50%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative px-4 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-5xl font-bold text-transparent sm:text-6xl md:text-7xl">
              Design Insights & Tips
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-purple-200/80 sm:text-xl">
              Learn professional design techniques, best practices, and industry insights
              to level up your design systems and create better products.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 text-purple-200/60 hover:border-purple-500/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Article */}
          {selectedCategory === 'All' && featuredArticle && (
            <div className="mb-16">
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Featured Article
              </h2>
              <ArticleCard article={featuredArticle} featured />
            </div>
          )}

          {/* Articles Grid */}
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-white">
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h2>
            
            {regularArticles.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {regularArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
                <p className="text-purple-200/60">
                  No articles found in this category.
                </p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-purple-500/5 p-12 text-center backdrop-blur-xl">
            <h2 className="mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              Ready to Create Your Own Design System?
            </h2>
            <p className="mb-8 text-lg text-purple-200/80">
              Generate professional design systems in seconds with AI-powered tools.
            </p>
            <Link href="/generate">
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                Start Creating Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
