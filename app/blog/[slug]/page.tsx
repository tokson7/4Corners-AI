import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { articles } from '@/lib/blog/articles'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
import { ArticleContent } from '@/components/blog/ArticleContent'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { BlogImagePlaceholder } from '@/components/blog/BlogImagePlaceholder'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }
  
  return {
    title: `${article.title} | 4Corners AI Blog`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  
  if (!article) {
    notFound()
  }
  
  // Get related articles (same category, excluding current)
  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3)
  
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
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 text-purple-300/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          {/* Article Hero */}
          <article className="mb-12">
            <div className="mb-6">
              <CategoryBadge category={article.category} />
            </div>
            
            <h1 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
              {article.title}
            </h1>
            
            {/* Metadata */}
            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-purple-300/60">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>

            {/* Featured image placeholder */}
            <div className="mb-12">
              <BlogImagePlaceholder category={article.category} featured={true} />
            </div>

            {/* Article Content */}
            <div className="mb-12">
              <ArticleContent content={article.content} />
            </div>

            {/* Article Footer */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Share this article
                </h3>
                <ShareButtons url={`/blog/${article.slug}`} title={article.title} />
              </div>

              <div className="border-t border-white/10 pt-6">
                <Link href="/generate">
                  <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50">
                    Try 4Corners AI - 3 Free Generations →
                  </button>
                </Link>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Related Articles
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
