import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const practices = [
  {
    title: "We do not till",
    body: [
      "Aside from creating new beds initially, we practice no-till farming. The ecosystem of our soil does not battle with the destructive nature of fast moving metal. Instead, we engage in biologically-intensive, human-scale methods to manage our beds and protect the soil.",
      "This creates more soil life and natural resistance to pests and disease. It also increases the soil's ability to hold water and resist drought.",
    ],
  },
  {
    title: "We use holistic practices for pest control and fertility management",
    body: [
      "We do not use any chemical or synthetic sprays on our farm. We maintain natural growing methods using organic compost applications, companion planting, fostering biodiversity, and the bare minimum of organically approved inputs when they are needed.",
    ],
    itemsLabel: "Sprays we do use",
    items: [
      {
        name: "Bacillus thuringiensis (Bt)",
        desc: "A naturally occurring bacterium that makes worms sick when they eat it.",
      },
      {
        name: "Neem oil",
        desc: "A natural, organic pesticide derived from the seeds of the neem tree.",
      },
      {
        name: "Spinosad",
        desc: "Derived from soil bacteria to target specific insects. It breaks down quickly in sunlight and soil into harmless natural elements.",
      },
      {
        name: "Lactic acid bacteria (LAB)",
        desc: "Commonly found in fermented foods, we use it as a biostimulant. Farmer Jesse cultures ours from organic rice wash water.",
      },
      {
        name: "Whey",
        desc: "Naturally derived from organic milk, we use it as a fungicide. Farmer Jesse makes this himself.",
      },
      {
        name: "Effective microorganisms",
        desc: "A blend of beneficial, naturally occurring microbes — primarily LAB, yeast, and photosynthetic bacteria. We use it as a biostimulant.",
      },
    ],
  },
  {
    title: "We are actively engaged with our farm",
    body: [
      "We highly value integrity and quality. We have our hands in the soil and our feet on the ground daily, giving the care that our small farming scale allows. Keeping our team and our tools small means we can pay attention to the details and foster a flourishing farm.",
      "We do not use tractors in our growing area, apart from moving mulch and compost. Tractors compact the ground, which harms plant health as well as the water and the land around us. Staying off it also reduces the carbon footprint of our farm.",
    ],
  },
  {
    title: "We treat our animals with the utmost care",
    body: [
      "All of our farm animals are on a strictly organic and natural diet. They forage, scratch, munch, and move around the way nature intended. While we do not allow our hens to free range — due to the danger of them getting in the road or wandering to the nearby sod farms — they are rotationally grazed or have access to a large chicken run from sun up to sun down. Animals are crucial to regenerating soil health.",
    ],
  },
  {
    title: "We test our water regularly",
    body: [
      "We run water testing twice a year through the health department to ensure it is clean and safe for irrigation.",
    ],
  },
];

const history = [
  {
    heading: "Roots That Run Deep",
    paragraphs: [
      "Our farming roots run deep. On Katy's maternal side, our family's connection to the land in neighboring Johnston County dates back to the Revolutionary War, when an ancestor, Haley Dupree, was gifted land for his service. In 1830, Alexander Stancil married into the family and began cultivating that soil. Today, descendants of Haley and Alexander still farm that very same land.",
      "Meanwhile, Jesse's family was establishing their own homesteading roots in Northern Minnesota after immigrating from Scandinavia.",
      "In southern Wake County, the ground we stand on today was originally worked by Katy's grandfather, Charles Stephenson. After returning home from WWII, he worked this land as a tenant farmer. In 1972, he and his wife, Ruth, were finally able to purchase the acreage they had spent decades nurturing. Both of us grew up in families that were homesteading long before it became a modern trend. We share childhood memories of abundant gardens, working alongside family, and eating delicious, homegrown produce year-round.",
    ],
  },
  {
    heading: "A Shared Passion",
    paragraphs: [
      "Katy grew up just across the road from her grandparents, always dreaming of building a home here to raise her own children around family. Today, that dream is a reality — we are completely encircled by her parents, sister's family, uncles, aunts, and cousins, as well as Jesse's parents, sister, brother-in-law, niece, and nephew who live nearby. The Stephenson land is still actively farmed by Katy and Jesse, her cousin Colt, and her Uncle Mackey.",
      "Our own shared journey began with a single tomato plant named Tom, which Katy gifted to Jesse while we were dating. Tom grew out of a pot in the backyard of Jesse's rental house in Jacksonville, NC. Whenever Jesse visited Katy's parents' house, we would forage for wild blackberries and help her dad in the garden. We quickly realized we had fallen in love while cooking — sharing a passion for high-quality ingredients and making gourmet meals at home.",
    ],
  },
  {
    heading: "Nurturing the Future",
    paragraphs: [
      "By 2007, Jesse was diving deep into agriculture, nutrition, and the environmental impacts of conventional farming. When we finally moved into our home on the family farm in 2017, he immediately started a backyard garden, putting his years of research into practice.",
      "In 2022, our dream of stewarding this land for the next generation took on an urgent new meaning. After years of conventional farming practices had stripped the topsoil bare of life, we wanted to nurse this soil back to health. We began dreaming of a regenerative market garden.",
      "Thanks to community grants awarded in 2025, we purchased our first two high tunnels. That spring, we began selling our first harvest of fresh, sustainably grown produce at our local community market. We are proud to cultivate the future while honoring our past.",
    ],
  },
];

function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-16 bg-[var(--color-linen)]">
        <Container>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium">Our Story</h1>
          <p className="mt-4 text-[var(--color-muted)] text-lg max-w-2xl leading-relaxed">
            A small scale, regenerative, mixed enterprise farm in Willow Spring, North
            Carolina — growing vegetables, fruits, herbs, flowers, poultry, and eggs.
          </p>
        </Container>
      </div>

      <Container>
        {/* Intro */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-6">
              We are farmers who care about the flourishing of this land and the people
              around it.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed mb-6">
              Alongside our produce, we offer field trips and educational workshops —
              because knowing where your food comes from is part of what makes it
              nourishing.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We have lots of dreams and plans for this place to grow into a sanctuary for
              our community. A place where you can step away from the noise and hustle and
              breathe. So stick around, folks, and become part of the dream.
            </p>
          </div>

          <div className="bg-[var(--color-linen)] aspect-[4/3] overflow-hidden">
            <img
              src="/farm/high-tunnel.jpg"
              alt="Rows of lettuce growing inside one of the farm's high tunnels"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Farming practices */}
        <div className="py-16 border-t border-[var(--color-linen)]">
          <h2 className="font-serif text-3xl sm:text-4xl mb-3">How We Farm</h2>
          <p className="text-[var(--color-muted)] leading-relaxed max-w-2xl mb-12">
            Five commitments that shape every decision we make on this land.
          </p>

          <div className="space-y-12">
            {practices.map((p, i) => (
              <div key={p.title} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 gap-y-3">
                <span className="font-serif text-4xl text-[var(--color-terra)] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-2xl mb-3">{p.title}</h3>
                  {p.body.map((para) => (
                    <p key={para} className="text-[var(--color-muted)] leading-relaxed mb-3">
                      {para}
                    </p>
                  ))}
                  {p.items && (
                    <div className="mt-6">
                      {p.itemsLabel && (
                        <p className="text-sm font-medium text-[var(--color-ink)] mb-3">
                          {p.itemsLabel}
                        </p>
                      )}
                      <dl className="m-0 space-y-3">
                        {p.items.map((item) => (
                          <div
                            key={item.name}
                            className="pl-5 relative before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-px before:bg-[var(--color-terra)]"
                          >
                            <dt className="text-sm font-medium text-[var(--color-ink)] inline">
                              {item.name}
                            </dt>
                            <dd className="m-0 text-sm text-[var(--color-muted)] leading-relaxed inline">
                              {" — "}
                              {item.desc}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Practices imagery */}
      <div className="bg-[var(--color-linen)] py-16">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { src: "/farm/bean-seedlings.jpg", alt: "Rows of young bean seedlings in a mulched permanent bed under drip irrigation" },
              { src: "/farm/bean-vines.jpg", alt: "A wall of mature bean vines climbing inside a high tunnel" },
              { src: "/farm/hen.jpg", alt: "A speckled hen out on pasture behind poultry netting" },
              { src: "/farm/bee-brassica.jpg", alt: "A bumblebee on flowering brassica" },
            ].map((img) => (
              <div key={img.src} className="aspect-square overflow-hidden">
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
      </div>

      <Container>
        {/* History */}
        <div className="py-16">
          <h2 className="font-serif text-3xl sm:text-4xl mb-10">Our History</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {history.map((section) => (
                <div key={section.heading}>
                  <h3 className="font-serif text-2xl mb-4">{section.heading}</h3>
                  <div className="space-y-5">
                    {section.paragraphs.map((para) => (
                      <p key={para} className="text-[var(--color-muted)] leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <figure className="m-0">
                <div className="bg-[var(--color-linen)] overflow-hidden">
                  <img
                    src="/farm/history-family-field.jpg"
                    alt="A vintage photograph of a father and young child walking through a hayfield"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
                  Homesteading before it was a trend.
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="bg-[var(--color-linen)] overflow-hidden">
                  <img
                    src="/farm/history-first-tomato.jpg"
                    alt="A hand reaching into a tomato plant holding a small green tomato"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
                  Tom — our first tomato.
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="bg-[var(--color-linen)] overflow-hidden">
                  <img
                    src="/farm/history-jesse-tom.jpg"
                    alt="Jesse tending tomato plants growing in pots in a backyard"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
                  Jesse and Tom, Jacksonville, NC.
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="bg-[var(--color-linen)] overflow-hidden">
                  <img
                    src="/farm/market-spotlight.jpg"
                    alt="Jesse and Katy behind their stand of produce at the community farmers market"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
                  Our first season at the community market, 2025.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Farmers */}
        <div className="py-16 border-t border-[var(--color-linen)]">
          <h2 className="font-serif text-3xl sm:text-4xl mb-8">Get to Know Your Farmers</h2>

          <figure className="m-0 mb-16">
            <div className="bg-[var(--color-linen)] aspect-[3/2] overflow-hidden">
              <img
                src="/farm/jesse-katy.jpg"
                alt="Jesse and Katy standing together at the edge of the sweet corn at dusk"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-[var(--color-muted)]">
              Jesse and Katy, out by the corn at the end of a summer day.
            </figcaption>
          </figure>

          {/* Jesse */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 mb-16">
            <div>
              <div className="bg-[var(--color-linen)] aspect-[3/4] overflow-hidden">
                <img
                  src="/farm/jesse-harvest.jpg"
                  alt="Jesse kneeling to pick tomatoes inside a high tunnel, harvest crate at his feet"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <figure className="m-0 mt-4">
                <div className="bg-[var(--color-linen)] overflow-hidden">
                  <img
                    src="/farm/history-motorcycle.jpg"
                    alt="A motorcycle parked in a dry riverbed with a rider resting beside it"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-[var(--color-muted)]">
                  Northern to Southern Africa, by motorcycle.
                </figcaption>
              </figure>
            </div>
            <div>
              <h3 className="font-serif text-2xl mb-4">Jesse</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Jesse grew up all over the midwest and in Kenya, Africa. Some of his best
                childhood memories are from his time on his grandparents' dairy farm —
                rhubarb scented soap takes him right back to his Grandma's garden. Jesse has
                had many adventures in his life. He spent middle school and high school in
                Kenya, did a year at a private college playing soccer, rode a motorcycle
                from Northern to Southern Africa, served in the United States Marine Corps,
                ran a 50-mile ultra marathon, and traveled through Europe, Australia, and
                New Zealand backpacking and rock climbing for nine months with his buddy
                from the Marine Corps.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Jesse has always been passionate about nutrition. He is a jack of all
                trades. He has roasted coffee for over 20 years just for fun, brewed the
                best pumpkin ale that Katy has ever tasted, and enjoys baking sourdough,
                fermenting all the things, and brewing hard cider each fall. If Katy or his
                dad, Darrell, needs something built, he is the one to do it.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Jesse is a Campbell University alumnus. He enjoys rugby over football, but
                he will watch the Chiefs play with Katy. He is a classic rock kind of guy.
                Give him a cup of good coffee on the porch on a cool morning and he is in
                paradise. If you want to know anything about soil health, regenerative
                farming, or homesteading, he is the one to ask — he is the one out there
                doing the physical labor all year round to ensure you have the best food
                around.
              </p>
            </div>
          </div>

          {/* Katy */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
            <div className="bg-[var(--color-linen)] aspect-[3/4] overflow-hidden">
              <img
                src="/farm/katy.jpg"
                alt="Katy holding one of the farm's hens among the blueberry bushes"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif text-2xl mb-4">Katy</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Here are a few things you should know about Katy. She loves people and
                animals, and not necessarily in that order. When you interact with her you
                will instantly feel safe and seen. She will make you laugh, and she will
                most likely want to talk to you about chickens.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                She is the one keeping up with all the administration, to-do lists, and
                social media, giving Jesse much needed deadlines, tenderly caring for our
                animals, and trying desperately to convince Jesse that they should keep all
                of them as pets. You will find her out in the garden in the spring, fall,
                and winter. Katy is passionate about advocating for those with invisible
                illnesses and helping folks be more thoughtful toward those of us who have
                other abilities.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                She is a Campbell University alumna — Go Camels! If she has headphones on,
                she is either listening to Taylor Swift or an audio book.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Volunteers */}
      <div className="bg-[var(--color-sage)] text-white py-16">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl mb-4">Our Volunteers</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We have the absolute best crew of volunteers that make all of this possible.
              From helping with harvest, planting, washing, packing, sorting, and
              brainstorming, to access to land and tech support — they are part of every
              aspect of this farm.
            </p>
            <p className="text-white/80 leading-relaxed">
              Thank you to Ronnie (Katy's dad), Denise (Katy's mom), Darrell (Jesse's dad),
              Stuart, and Becky for all of your help.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
