import { BlogPost } from '../../lib/blog/types';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  showFeatured?: boolean;
}

export function BlogGrid({ posts, showFeatured = false }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-subtitle1 text-foreground-secondary">
          No blog posts found in this category.
        </p>
      </div>
    );
  }

  const featuredPost = showFeatured ? posts.find(p => p.featured) : null;
  const regularPosts = showFeatured 
    ? posts.filter(p => !p.featured || p !== featuredPost)
    : posts;

  return (
    <div className="space-y-8">
      {featuredPost && (
        <div data-testid="featured-post">
          <h2 className="text-h3 font-bold text-foreground mb-4">Featured Post</h2>
          <BlogCard post={featuredPost} featured />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
