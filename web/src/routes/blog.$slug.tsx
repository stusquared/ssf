import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortableText } from "@portabletext/react";
import { sanityClient, queries, urlFor } from "@/lib/sanity";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await sanityClient.fetch(queries.postBySlug, { slug: params.slug });
    if (!post) throw notFound();
    return { post };
  },
  component: PostPage,
  notFoundComponent: () => (
    <Container>
      <div className="py-32 text-center">
        <h1 className="font-serif text-4xl mb-4">Post not found</h1>
        <Link to="/blog" className="text-[var(--color-sage)] hover:underline">
          ← Back to Journal
        </Link>
      </div>
    </Container>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData();

  return (
    <>
      {/* Post header */}
      <div className="pt-32 pb-12 bg-[var(--color-linen)]">
        <Container>
          <Link
            to="/blog"
            className="text-sm text-[var(--color-sage)] hover:underline mb-6 inline-block"
          >
            ← Farm Journal
          </Link>
          <div className="max-w-2xl">
            {post.categories?.[0] && (
              <span className="text-xs font-medium text-[var(--color-terra)] uppercase tracking-wider">
                {post.categories[0].title}
              </span>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl font-medium mt-2 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
              {post.author && <span>{post.author.name}</span>}
              {post.author && <span>·</span>}
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero image */}
      {post.mainImage && (
        <div className="w-full aspect-[21/9] max-h-[500px] overflow-hidden">
          <img
            src={urlFor(post.mainImage).width(1400).height(600).url()}
            alt={post.mainImage.alt ?? post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post body */}
      <Container>
        <div className="py-14 max-w-2xl">
          <div className="prose-farm">
            <PortableText
              value={post.body}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="text-[var(--color-ink)] leading-relaxed mb-5">{children}</p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-serif text-3xl mt-10 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-serif text-2xl mt-8 mb-3">{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[var(--color-terra)] pl-6 my-8 font-serif text-xl text-[var(--color-muted)] italic">
                      {children}
                    </blockquote>
                  ),
                },
                types: {
                  image: ({ value }) => (
                    <figure className="my-10">
                      <img
                        src={urlFor(value).width(800).url()}
                        alt={value.alt ?? ""}
                        className="w-full"
                      />
                      {value.caption && (
                        <figcaption className="text-xs text-center text-[var(--color-muted)] mt-2">
                          {value.caption}
                        </figcaption>
                      )}
                    </figure>
                  ),
                },
                marks: {
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                  link: ({ value, children }) => (
                    <a
                      href={value?.href}
                      className="text-[var(--color-sage)] underline hover:text-[var(--color-sage-dark)]"
                      target={value?.href?.startsWith("http") ? "_blank" : undefined}
                      rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc list-outside pl-5 mb-5 space-y-1 text-[var(--color-ink)]">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal list-outside pl-5 mb-5 space-y-1 text-[var(--color-ink)]">
                      {children}
                    </ol>
                  ),
                },
              }}
            />
          </div>

          {/* Tags */}
          {post.categories?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[var(--color-linen)] flex flex-wrap gap-2">
              {post.categories.map((cat: { _id: string; title: string }) => (
                <span
                  key={cat._id}
                  className="text-xs px-3 py-1 border border-[var(--color-linen)] text-[var(--color-muted)]"
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Link to="/blog" className="text-sm text-[var(--color-sage)] hover:underline">
              ← Back to Journal
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
