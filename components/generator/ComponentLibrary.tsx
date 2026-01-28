'use client';

import { useState } from 'react';
import { ComponentViewer } from './ComponentViewer';
import type { ComponentCategory } from '@/lib/types/components';
import { 
  MousePointer2, 
  LayoutGrid, 
  FormInput, 
  Bell, 
  Menu,
  Settings
} from 'lucide-react';

interface ComponentLibraryProps {
  categories: ComponentCategory[];
}

const categoryIcons = {
  buttons: MousePointer2,
  cards: LayoutGrid,
  forms: FormInput,
  alerts: Bell,
  navigation: Menu,
  modals: Settings,
};

export function ComponentLibrary({ categories }: ComponentLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || 'buttons');

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Navigation */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Component Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Settings;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium text-sm">{category.name}</span>
                <span className="text-xs opacity-70">
                  {category.variants.length} variants
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Components */}
      {currentCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{currentCategory.name}</h2>
              <p className="text-muted-foreground mt-1">{currentCategory.description}</p>
            </div>
            <div className="text-sm text-purple-300">
              {currentCategory.variants.length} component{currentCategory.variants.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Component Grid */}
          <div className="space-y-6">
            {currentCategory.variants.map((variant) => (
              <ComponentViewer key={variant.id} variant={variant} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentCategory && (
        <div className="glass rounded-xl p-12 text-center border border-white/10">
          <p className="text-gray-400">No components available</p>
        </div>
      )}
    </div>
  );
}
