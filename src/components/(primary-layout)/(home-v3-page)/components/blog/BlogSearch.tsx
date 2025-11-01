'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { BlogPost, BlogCategory, BLOG_CATEGORIES } from '../../lib/blog/types';
import { Badge } from '../ui/badge';

interface BlogSearchProps {
  posts: BlogPost[];
  onFilterChange: (filteredPosts: BlogPost[]) => void;
}

export function BlogSearch({ posts, onFilterChange }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');

  const handleSearch = (query: string, category: BlogCategory | 'all') => {
    let filtered = posts;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        post.author.name.toLowerCase().includes(lowerQuery)
      );
    }

    onFilterChange(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value, selectedCategory);
  };

  const handleCategoryChange = (category: BlogCategory | 'all') => {
    setSelectedCategory(category);
    handleSearch(searchQuery, category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    onFilterChange(posts);
  };

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== 'all';

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-tertiary" />
        <input
          type="text"
          placeholder="Search articles by title, tags, or author..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-body2 placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          data-testid="input-blog-search"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-caption font-medium transition-all hover-elevate active-elevate-2 ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background border border-border text-foreground'
          }`}
          onClick={() => handleCategoryChange('all')}
          aria-pressed={selectedCategory === 'all'}
          data-testid="filter-category-all"
        >
          All Articles
        </button>
        {Object.values(BLOG_CATEGORIES).map((category) => (
          <button
            key={category.slug}
            className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-caption font-medium transition-all hover-elevate active-elevate-2 ${
              selectedCategory === category.slug
                ? 'bg-primary text-primary-foreground'
                : `bg-background border border-border ${category.color}`
            }`}
            onClick={() => handleCategoryChange(category.slug)}
            aria-pressed={selectedCategory === category.slug}
            data-testid={`filter-category-${category.slug}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-2 text-body2 text-foreground-secondary hover:text-primary transition-colors"
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}
