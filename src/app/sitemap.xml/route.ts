import { NextResponse } from "next/server";

/** ตั้งค่าโดเมนหลักให้ชัดเจน */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://sofaclean-pro-v2.vercel.app";

/** หน้า static หลักของเว็บ */
const staticPaths = [
  { loc: "/",        changefreq: "daily",   priority: "1.0" },
  { loc: "/en",      changefreq: "daily",   priority: "1.0" },
  { loc: "/en/blog", changefreq: "weekly",  priority: "0.9" },
  { loc: "/th",      changefreq: "daily",   priority: "1.0" },
  { loc: "/th/blog", changefreq: "weekly",  priority: "0.9" },
] as const;

/** ดึงโพสต์ไดนามิก (ตัวอย่าง) */
async function getDynamicEntries() {
  const posts = [
    { path: "/en/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { path: "/th/blog/how-to-clean-fabric-sofa", lastmod: "2024-07-21" },
    { path: "/en/blog/when-to-clean-car-seats", lastmod: "2024-07-18" },
    { path: "/th/blog/when-to-clean-car-seats", lastmod: "2024-07-18" },
    { path: "/en/blog/sofa-vs-carpet-cleaning-difference", lastmod: "2024-07-15" },
    { path: "/th/blog/sofa-vs-carpet-cleaning-difference", lastmod: "2024-07-15" },
    {
      path: "/th/blog/บริการซักเบาะโซฟา-ทำความสะอาดถึงบ้าน-สะอาด-ปลอดภัย-เหมือนใหม่",
      lastmod: "2025-08-13",
    },
    {
      path: "/en/blog/บริการซักเบาะโซฟา-ทำความสะอาดถึงบ้าน-สะอาด-ปลอดภัย-เหมือนใหม่",
      lastmod: "2025-08-13",
    },
  ];

  return posts.map((p) => ({
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
  const urls = items.map((i) => `
  <url>
    <loc>${i.loc}</loc>
    ${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ""}
    <changefreq>${i.changefreq}</changefreq>
    <priority>${i.priority}</priority>
  </url>`).join("");

  const generatedAt = new Date().toISOString(); // สำหรับเช็กว่าไฟล์ใหม่จริง

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
  <!-- generated: ${generatedAt} -->
</urlset>`;
}

export async function GET() {
  const dynamic = await getDynamicEntries();

  const all = [
    ...staticPaths.map((s) => ({
      loc: toAbsoluteUrl(s.loc),
      changefreq: s.changefreq,
      priority: s.priority,
    })),
    ...dynamic.map((d) => ({
      ...d,
      loc: toAbsoluteUrl(d.loc),
    })),
  ];

  const deduped = Array.from(new Map(all.map((u) => [u.loc, u])).values());

  const xml = buildXml(deduped);
  const now = new Date().toISOString();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // ปิด cache เพื่อให้เห็นผลทันที
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      // debug header ไว้เช็กว่า response มาสด ๆ
      "X-Sitemap-Generated-At": now,
    },
  });
}
