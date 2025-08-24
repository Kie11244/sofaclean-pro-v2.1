import { NextResponse } from "next/server";

/** โดเมนหลัก: ใช้จาก ENV ก่อนเสมอ ตัด / ท้ายออก */
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofaclean-pro-v2.vercel.app";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

/** หน้า static หลัก */
const staticPaths: Array<{ loc: string; changefreq: string; priority: string }> = [
  { loc: "/",        changefreq: "daily",  priority: "1.0" },
  { loc: "/en",      changefreq: "daily",  priority: "1.0" },
  { loc: "/en/blog", changefreq: "weekly", priority: "0.9" },
  { loc: "/th",      changefreq: "daily",  priority: "1.0" },
  { loc: "/th/blog", changefreq: "weekly", priority: "0.9" },
];

/** ตัวอย่าง dynamic (ปรับเป็น fetch DB/CMS ได้) */
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

  return posts.map(p => ({
    loc: `${SITE_URL}${p.slug}`,
    lastmod: new Date(p.lastmod).toISOString(),
    changefreq: "monthly",
    priority: "0.8",
  }));
}

/** ประกอบ XML */
function buildXml(
  items: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }>
) {
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/** GET /sitemap.xml */
export async function GET() {
  const dynamic = await getDynamicEntries();
  const all = [
    ...staticPaths.map(p => ({ ...p, loc: `${SITE_URL}${p.loc}` })),
    ...dynamic,
  ];

  const xml = buildXml(all);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // กันแคชชั่วคราว เพื่อเคลียร์ของเก่า; ถ้าทุกอย่าง OK แล้วค่อยเปลี่ยนเป็น s-maxage ได้
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
