import type { MetadataRoute } from "next";

const base =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofaclean-pro-v2.vercel.app")
    .replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = (d: string) => new Date(d).toISOString();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`,        changeFrequency: "daily",  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en`,      changeFrequency: "daily",  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en/blog`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${base}/th`,      changeFrequency: "daily",  priority: 1.0, lastModified: new Date() },
    { url: `${base}/th/blog`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
  ];

  const posts: MetadataRoute.Sitemap = [
    { url: `${base}/en/blog/how-to-clean-fabric-sofa`, lastModified: now("2024-07-21"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/th/blog/how-to-clean-fabric-sofa`, lastModified: now("2024-07-21"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/en/blog/when-to-clean-car-seats`,  lastModified: now("2024-07-18"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/th/blog/when-to-clean-car-seats`,  lastModified: now("2024-07-18"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/th/blog/บริการซักเบาะโซฟา-ทำความสะอาดถึงบ้าน-สะอาด-ปลอดภัย-เหมือนใหม่`, lastModified: now("2025-08-13"), changeFrequency: "monthly", priority: 0.8 },
  ];

  return [...staticUrls, ...posts];
}
