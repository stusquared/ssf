import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sanityClient, queries, urlFor } from "@/lib/sanity";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
});

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: { asset: { _ref: string }; alt?: string };
  categories?: string[];
  author?: { name: string };
}

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    sanityClient
      .fetch<Post[]>(queries.allPosts)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(
    new Set(posts.flatMap((p) => p.categories ?? []))
  );

  const filtered = activeCategory
    ? posts.filter((p) => p.categories?.includes(activeCategory))
    : posts;

  return (
    <>
      <div className="pt-32 pb-16 bg-[var(--color-linen)]">
        <Container>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium">Farm Journal</h1>
          <p className="mt-4 text-[var(--color-muted)] text-lg max-w-xl leading-relaxed">
            Stories from the field — seasons, harvests, recipes, and reflections.
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 text-sm border transition-colors ${
                  activeCategory === null
                    ? "bg-[var(--color-sage)] text-white border-[var(--color-sage)]"
                    : "border-[var(--color-linen)] text-[var(--color-muted)] hover:border-[var(--color-sage)]"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-sm border transition-colors ${
                    activeCategory === cat
                      ? "bg-[var(--color-sage)] text-white border-[var(--color-sage)]"
                      : "border-[var(--color-linen)] text-[var(--color-muted)] hover:border-[var(--color-sage)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[var(--color-linen)] animate-pulse">
                  <div className="aspect-[16/9]" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-[var(--color-muted)]/20 rounded w-1/4" />
                    <div className="h-5 bg-[var(--color-muted)]/20 rounded w-3/4" />
                    <div className="h-3 bg-[var(--color-muted)]/20 rounded" />
                    <div className="h-3 bg-[var(--color-muted)]/20 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-[var(--color-muted)] py-20">
              No posts yet. Check back soon!
            </p>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post._id}
                  to="/blog/$slug"
                  params={{ slug: post.slug.current }}
                  className="group block bg-[var(--color-linen)] overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.mainImage && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={urlFor(post.mainImage).width(600).height(338).url()}
                        alt={post.mainImage.alt ?? post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {post.categories?.[0] && (
                      <span className="text-xs font-medium text-[var(--color-terra)] uppercase tracking-wider">
                        {post.categories[0]}
                      </span>
                    )}
                    <h2 className="font-serif text-xl mt-1 mb-2 group-hover:text-[var(--color-sage)] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-[var(--color-muted)] line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-[var(--color-muted)]">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {post.author && (
                        <p className="text-xs text-[var(--color-muted)]">{post.author.name}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
