interface CategoryBadgeProps {
  category: string
}

const categoryColors: Record<string, string> = {
  'Color Theory': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Typography': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Design Systems': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Workflow': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Accessibility': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {category}
    </span>
  )
}
