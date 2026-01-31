import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'
import { CategoryBadge } from './CategoryBadge'
import { BlogImagePlaceholder } from './BlogImagePlaceholder'
import type { Article } from '@/lib/blog/articles'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <article
        className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:bg-white/10 ${
          featured ? 'p-8' : 'p-6'
        }`}
      >
        {/* Gradient placeholder image */}
        <div className="mb-6 overflow-hidden rounded-xl">
          <BlogImagePlaceholder category={article.category} featured={featured} />
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <CategoryBadge category={article.category} />
        </div>

        {/* Title */}
        <h3
          className={`mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text font-bold text-transparent transition-all group-hover:from-purple-400 group-hover:to-white ${
            featured ? 'text-3xl' : 'text-xl'
          }`}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          className={`mb-4 text-purple-200/80 ${
            featured ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'
          }`}
        >
          {article.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-purple-300/60">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>

        {/* Hover effect overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
        </div>
      </article>
    </Link>
  )
}
