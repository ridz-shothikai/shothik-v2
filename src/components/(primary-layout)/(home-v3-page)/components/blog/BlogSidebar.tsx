import Link from 'next/link';
import { BLOG_CATEGORIES } from '../../lib/blog/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export function BlogSidebar() {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card className="p-6">
        <h3 className="text-h4 font-bold text-foreground mb-4" data-testid="sidebar-categories-title">
          Categories
        </h3>
        <div className="space-y-2">
          {Object.values(BLOG_CATEGORIES).map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="block p-2 rounded-md hover-elevate transition-all"
              data-testid={`link-category-${category.slug}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-body2 text-foreground">{category.name}</span>
                <Badge variant="secondary" className={category.color}>
                  {category.slug}
                </Badge>
              </div>
              <p className="text-caption text-foreground-tertiary mt-1">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Newsletter Signup */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-blue-500/5">
        <h3 className="text-h4 font-bold text-foreground mb-2" data-testid="newsletter-title">
          Stay Updated
        </h3>
        <p className="text-body2 text-foreground-secondary mb-4">
          Get the latest writing tips, AI tool guides, and academic resources delivered to your inbox.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-body2"
            data-testid="input-newsletter-email"
          />
          <button
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2 transition-all"
            data-testid="button-subscribe-newsletter"
          >
            Subscribe
          </button>
        </div>
        <p className="text-caption text-foreground-tertiary mt-2">
          No spam. Unsubscribe anytime.
        </p>
      </Card>

      {/* Popular Tags */}
      <Card className="p-6">
        <h3 className="text-h4 font-bold text-foreground mb-4" data-testid="popular-tags-title">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {['AI Humanizer', 'Academic Writing', 'Plagiarism', 'Grammar', 'Research', 'Students', 'AI Detection', 'Writing Tips'].map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="cursor-pointer hover-elevate"
              data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
