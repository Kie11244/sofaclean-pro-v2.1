import { NextResponse } from "next/server";

/** ตั้งโดเมนหลัก 55(ถ้าไม่ตั้ง env จะ fallback เป็น vercel app) */
const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofaclean-pro-v2.vercel.app")
    .replace(/\/+$/, ""); // ตัด / ท้าย

/** Static URLs หลัก */
const staticPaths = [
  { loc: "/",               changefreq: "daily",   priority: "1.0" },
  { loc: "/en",             changefreq: "daily",   priority: "1.0" },
  { loc: "/en/blog",        changefreq: "weekly",  priority: "0.9" },
  { loc: "/th",             changefreq: "daily",   priority: "1.0" },
  { loc: "/th/blog",        changefreq: "weekly",  priority: "0.9" },
];

/** ดึงรายการ dynamic (ตัวอย่าง) — เปลี่ยนเป็น fetch จาก DB/CMS ได้ */
async function getDynamicEntries() {
  const posts = [
    { slug: "/en/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { slug: "/th/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { slug: "/en/blog/when-to-clean-car-seats",  lastmod: "2024-07-18" },
    { slug: "/th/blog/when-to-clean-car-seats",  lastmod: "2024-07-18" },
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

/** สร้าง XML body */
function buildXml(items: Array<{
  loc: string; changefreq: string; priority: string; lastmod?: string;
}>) {
  const urls = items.map(i => `
  <url>
    <loc>${i.loc}</loc>
    ${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ""}
    <changefreq>${i.changefreq}</changefreq>
    <priority>${i.priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/** Handler: GET /sitemap.xml */
export async function GET() {
  // รวม static + dynamic
  const dynamic = await getDynamicEntries();
  const all = [
    ...staticPaths.map(p => ({
      ...p,
      loc: `${SITE_URL}${p.loc}`,
    })),
    ...dynamic,
  ];

  const xml = buildXml(all);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
