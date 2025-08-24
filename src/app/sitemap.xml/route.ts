import { NextResponse } from "next/server";

/** ตั้งค่าโดเมนหลักให้ชัดเจน */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://sofaclean-pro-v2.vercel.app";

/** หน้า static หลักของเว็บ */
const staticPaths = [
  { loc: "/",            changefreq: "daily",   priority: "1.0" },
  { loc: "/en",          changefreq: "daily",   priority: "1.0" },
  { loc: "/en/blog",     changefreq: "weekly",  priority: "0.9" },
  { loc: "/th",          changefreq: "daily",   priority: "1.0" },
  { loc: "/th/blog",     changefreq: "weekly",  priority: "0.9" },
] as const;

/** ตัวอย่าง: ดึงโพสต์/เพจแบบไดนามิก (แทนที่ด้วยการดึงจาก DB, CMS, หรือไฟล์ได้) */
async function getDynamicEntries() {
  // TODO: แทนที่ด้วยการ fetch จริงของโปรเจกต์คุณ
  // ตัวอย่าง slug ที่มีทั้ง EN/TH
  const posts = [
    { path: "/en/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { path: "/th/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { path: "/en/blog/when-to-clean-car-seats", lastmod: "2024-07-18" },
    { path: "/th/blog/when-to-clean-car-seats", lastmod: "2024-07-18" },
    { path: "/en/blog/sofa-vs-carpet-cleaning-difference", lastmod: "2024-07-15" },
    { path: "/th/blog/sofa-vs-carpet-cleaning-difference", lastmod: "2024-07-15" },

    // ตัวอย่าง slug ภาษาไทย (หลีกเลี่ยง percent-encoding ยาวด้วยการ normalize)
    {
      path:
        "/th/blog/บริการซักเบาะโซฟา-ทำความสะอาดถึงบ้าน-สะอาด-ปลอดภัย-เหมือนใหม่",
      lastmod: "2025-08-13",
    },
    {
      path:
        "/en/blog/บริการซักเบาะโซฟา-ทำความสะอาดถึงบ้าน-สะอาด-ปลอดภัย-เหมือนใหม่",
      lastmod: "2025-08-13",
    },
  ];

  return posts.map(p => ({
    loc: p.path,
    changefreq: "monthly" as const,
    priority: "0.8",
    lastmod: new Date(p.lastmod + "T00:00:00Z").toISOString(),
  }));
}

/** ป้องกัน URL ซ้ำ + แก้ percent-encoding ให้พอดี (ไม่ double-encode) */
function normalizePath(path: string) {
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
}

function toAbsoluteUrl(path: string) {
  const clean = normalizePath(path.startsWith("/") ? path : `/${path}`);
  return `${SITE_URL}${clean}`;
}

function buildXml(items: Array<{
  loc: string;
  changefreq: string;
  priority: string | number;
  lastmod?: string;
}>) {
  const urls = items
    .map(
      i => `
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

export async function GET() {
  // รวม static + dynamic
  const dynamic = await getDynamicEntries();

  const all = [
    ...staticPaths.map(s => ({
      loc: toAbsoluteUrl(s.loc),
      changefreq: s.changefreq,
      priority: s.priority,
    })),
    ...dynamic.map(d => ({
      ...d,
      loc: toAbsoluteUrl(d.loc),
    })),
  ];

  // ลบ URL ซ้ำ (เผื่อมาจากหลายแหล่ง)
  const deduped = Array.from(
    new Map(all.map(u => [u.loc, u])).values()
  );

  const xml = buildXml(deduped);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // cache ฝั่ง CDN 6 ชั่วโมง (ปรับได้)
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
