import { defineType, defineField } from "sanity";

export default defineType({
  name: "csaPage",
  title: "CSA Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({
      name: "isOpen",
      title: "Signups Open?",
      type: "boolean",
      description: "Toggle to show/hide the signup form on the site.",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Shown below the page title.",
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [{ type: "block" }],
      description: "Additional program details rendered on the CSA page.",
    }),
    defineField({
      name: "signupCtaText",
      title: "Signup CTA Text",
      type: "string",
      initialValue: "Join the Waitlist",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare() {
      return { title: "CSA Page" };
    },
  },
});
