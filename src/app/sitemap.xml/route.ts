import { NextResponse } from "next/server";

/** Base URL ของเว็บ */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://sofaclean-pro-v2.vercel.app";

/** Static paths หลัก */
const staticPaths = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/en", changefreq: "daily", priority: "1.0" },
  { loc: "/en/blog", changefreq: "weekly", priority: "0.9" },
  { loc: "/th", changefreq: "daily", priority: "1.0" },
  { loc: "/th/blog", changefreq: "weekly", priority: "0.9" },
];

/** ตัวอย่างการดึงข้อมูล Dynamic จาก Database / API */
async function getDynamicEntries() {
  // 🔹 TODO: เปลี่ยนเป็น fetch ข้อมูลจริงจาก CMS / Database ของคุณ
  // เช่น fetch("https://api.example.com/posts")
  const posts = [
    { slug: "/en/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { slug: "/th/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { slug: "/en/blog/when-to-clean-car-seats", lastmod: "2024-07-18" },
    { slug: "/th/blog/when-to-clean-car-seats", lastmod: "2024-07-18" },
    {
      slug: "/th/blog/บริการซักเบาะโซฟา-ทำความสะอาดถึงบ้าน-สะอาด-ปลอดภัย-เหมือนใหม่",
      lastmod: "2025-08-13",
    },
  ];

  return posts.map((p) => ({
    loc: `${SITE_URL}${p.slug}`,
    lastmod: new Date(p.lastmod).toISOString(),
    changefreq: "monthly",
    priority: "0.8",
  }));
}

/** สร้าง XML */
function buildXml(items: any[]) {
  const urls = items
    .map(
      (i) => `
  <url>
    <loc>${i.loc}</loc>
    ${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ""}
    <changefreq>${i.changefreq}</changefreq>
    <priority>${i.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

/** Handler หลัก */
export async function GET() {
  const dynamicEntries = await getDynamicEntries();

  const all = [
    ...staticPaths.map((s) => ({
      loc: `${SITE_URL}${s.loc}`,
      changefreq: s.changefreq,
      priority: s.priority,
    })),
    ...dynamicEntries,
  ];

  const xml = buildXml(all);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
