import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Farm Name", type: "string" }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short phrase shown in the hero section.",
    }),
    defineField({
      name: "mission",
      title: "Mission Statement",
      type: "text",
      rows: 3,
      description: "Shown in the green strip on the homepage.",
    }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
