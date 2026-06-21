import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? "placeholder-id",
  dataset: import.meta.env.VITE_SANITY_DATASET ?? "development",
  apiVersion: "2025-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]`,

  recentPosts: `*[_type == "post"] | order(publishedAt desc) [0..2] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "categories": categories[]->title
  }`,

  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "categories": categories[]->title,
    "author": author->{ name, image }
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    "categories": categories[]->{ _id, title },
    "author": author->{ name, image, bio }
  }`,

  csaPage: `*[_type == "csaPage"][0]`,
};
