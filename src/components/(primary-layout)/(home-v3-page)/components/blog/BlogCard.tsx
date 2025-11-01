import Link from 'next/link';
import { BlogPost, BLOG_CATEGORIES } from '../../lib/blog/types';
import { formatDate } from '../../lib/blog/utils';
import { Clock, User } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryInfo = BLOG_CATEGORIES[post.category];
  
  return (
    <Card 
      className={`overflow-hidden hover-elevate transition-all ${
        featured ? 'md:flex md:flex-row' : ''
      }`}
      data-testid={`blog-card-${post.slug}`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={`relative ${featured ? 'md:w-1/2' : 'w-full'} aspect-video bg-muted`}>
          {/* Placeholder for blog image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-500/10">
            <span className="text-foreground-tertiary text-sm">{post.imageAlt}</span>
          </div>
        </div>
      </Link>
      
      <div className={`p-6 ${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={categoryInfo.color} data-testid={`badge-category-${post.category}`}>
            {categoryInfo.name}
          </Badge>
          {post.featured && (
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 
            className={`font-bold text-foreground mb-2 hover:text-primary transition-colors ${
              featured ? 'text-h3 md:text-h2' : 'text-h4'
            }`}
            data-testid={`blog-title-${post.slug}`}
          >
            {post.title}
          </h3>
        </Link>
        
        <p className="text-body2 text-foreground-secondary mb-4 line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex items-center gap-4 text-caption text-foreground-tertiary">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readingTime} min read</span>
          </div>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-caption"
              data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
