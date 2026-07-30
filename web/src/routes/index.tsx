import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sanityClient, queries, urlFor } from "@/lib/sanity";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: { asset: { _ref: string }; alt?: string };
  categories?: string[];
}

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    sanityClient.fetch<Post[]>(queries.recentPosts).then(setPosts).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden bg-[var(--color-ink)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium leading-tight mb-6">
            Sweet Source<br />Farmstead
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed sm:whitespace-nowrap">
            A small-scale, regenerative farm in Willow&nbsp;Spring, North&nbsp;Carolina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/csa">
              <Button variant="primary" className="px-8 py-4 text-base">
                Join Our CSA
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" className="px-8 py-4 text-base border-white text-white hover:bg-white hover:text-[var(--color-ink)]">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="bg-[var(--color-sage)] text-white py-14">
        <Container>
          <p className="font-serif text-xl sm:text-2xl text-center max-w-3xl mx-auto leading-relaxed">
            We are farmers who care about the flourishing of this land and the people
            around it.
          </p>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              Sweet Source Farmstead is a small scale, regenerative, mixed enterprise farm
              in Willow Spring, North Carolina. We offer organically grown vegetables,
              fruits, herbs, flowers, poultry, eggs, field trips, and educational workshops.
            </p>
            <Link
              to="/about"
              className="inline-block mt-6 text-[var(--color-sage)] font-medium hover:underline"
            >
              Read more about our farming practices →
            </Link>
          </div>
        </Container>
      </section>

      {/* Feature cards */}
      <section className="pb-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                to: "/about",
                img: "/farm/jesse-katy.jpg",
                title: "Our Story",
                text: "Meet Jesse and Katy — a family farm committed to sustainable practices, healthy soil, and honest food.",
              },
              {
                to: "/csa",
                img: "/csa_card.jpg.jpg",
                title: "CSA Program",
                text: "Join our community-supported agriculture and receive a weekly box of the freshest seasonal produce.",
              },
              {
                to: "/blog",
                img: "/journal_card.jpg",
                title: "Farm Journal",
                text: "Stories from the field — what's growing, what we're learning, and what's on the table.",
              },
            ].map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group block bg-[var(--color-linen)] overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[4/3] bg-[var(--color-muted)]/20 overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl mb-2 group-hover:text-[var(--color-sage)] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{card.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* What we grow */}
      <section className="py-20 bg-[var(--color-linen)]">
        <Container>
          <div className="text-center mb-12 max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">What We Grow</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Vegetables, fruits, herbs, flowers, poultry, and eggs — grown organically and
              harvested at their peak.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { src: "/farm/strawberries.jpg", alt: "Pints of freshly picked strawberries" },
              { src: "/farm/tomatoes-cherry-vine.jpg", alt: "Cherry tomatoes ripening on the vine" },
              { src: "/farm/eggs.jpg", alt: "A basket of pastel-colored farm eggs" },
              { src: "/farm/peppers-harvest.jpg", alt: "A basket of freshly cut sweet peppers" },
              { src: "/farm/market-beets-carrots.jpg", alt: "Beets and carrots on the market table" },
              { src: "/farm/squash.jpg", alt: "A basket of winter squash" },
              { src: "/farm/hen.jpg", alt: "A speckled hen out on pasture" },
              { src: "/farm/lettuce-red.jpg", alt: "Red oakleaf lettuce" },
            ].map((img) => (
              <div key={img.src} className="aspect-square overflow-hidden bg-[var(--color-muted)]/10">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-serif text-3xl">From the Journal</h2>
              <Link to="/blog" className="text-sm text-[var(--color-sage)] hover:underline font-medium">
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to="/blog/$slug"
                  params={{ slug: post.slug.current }}
                  className="group bg-[var(--color-linen)] block overflow-hidden hover:shadow-md transition-shadow"
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
                    <h3 className="font-serif text-lg mt-1 mb-2 group-hover:text-[var(--color-sage)] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-muted)] mt-3">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CSA CTA */}
      <section className="py-20 text-center">
        <Container>
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">Ready to join the farm?</h2>
            <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
              Sign up for our CSA waitlist and be the first to know when shares become available
              for the upcoming season.
            </p>
            <Link to="/csa">
              <Button variant="primary" className="px-8 py-4 text-base">
                Learn About Our CSA
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
