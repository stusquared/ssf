import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-16 bg-[var(--color-linen)]">
        <Container>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium">Our Story</h1>
          <p className="mt-4 text-[var(--color-muted)] text-lg max-w-xl leading-relaxed">
            A small family farm rooted in sustainable practices and a love for real food.
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="prose max-w-none">
            <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-6">
              Sweet Source Farmstead was born from a simple belief: that growing food with
              care for the land produces something truly nourishing — for the body and the
              community alike.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed mb-6">
              We tend our fields with organic practices, paying close attention to soil
              health, crop rotation, and the rhythms of the seasons. Every seed we plant
              is a commitment to our customers, our neighbors, and the land we steward.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Through our CSA program, we connect directly with the families who eat our
              food — sharing not just vegetables, but the story of where they come from.
            </p>
          </div>

          <div className="bg-[var(--color-linen)] aspect-square overflow-hidden">
            <img
              src="/about-farm.jpg"
              alt="The farm"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.background =
                  "var(--color-linen)";
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Values */}
        <div className="py-16 border-t border-[var(--color-linen)]">
          <h2 className="font-serif text-3xl mb-10">What We Believe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Soil First",
                text: "Healthy soil is the foundation of everything we do. We build it up each year through composting, cover cropping, and thoughtful rotation.",
              },
              {
                title: "Seasonal & Local",
                text: "We grow what thrives here, in this climate, at this time of year. No forcing, no shortcuts — just honest food at its peak.",
              },
              {
                title: "Community Rooted",
                text: "Our CSA members aren't customers — they're partners in the farm. We grow for people we know, and that changes everything.",
              },
            ].map((v) => (
              <div key={v.title}>
                <div className="w-10 h-1 bg-[var(--color-terra)] mb-4" />
                <h3 className="font-serif text-xl mb-3">{v.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
