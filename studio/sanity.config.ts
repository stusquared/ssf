import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const SINGLETON_TYPES = ["siteSettings", "csaPage"];

export default defineConfig({
  name: "sweetsourcefarmstead",
  title: "Sweet Source Farmstead",

  projectId: "wgdj35k3",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("CSA Page")
              .id("csaPage")
              .child(S.document().schemaType("csaPage").documentId("csaPage")),
            S.divider(),
            S.documentTypeListItem("post").title("Blog Posts"),
            S.documentTypeListItem("author").title("Authors"),
            S.documentTypeListItem("category").title("Categories"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(({ action }) => action !== "duplicate")
        : prev,
  },
});
