export interface BlogPostContent {
    title: string;
    description: string;
    category: string;
    content: React.ReactNode;
}

export interface BlogPost {
    slug: {
        th: string;
        en: string;
    };
    image: string;
    imageHint: string;
    date: string;
    th: BlogPostContent;
    en: BlogPostContent;
}

export const blogData: Record<string, BlogPost> = {
    "how-to-clean-sofa": {
        slug: {
            th: "วิธีซักโซฟาผ้าด้วยตัวเอง",
            en: "how-to-clean-a-fabric-sofa-yourself",
        },
        image: "https://placehold.co/800x400.png",
        imageHint: "woman cleaning sofa",
        date: "2024-07-21",
        th: {
            title: "วิธีซักโซฟาผ้าด้วยตัวเองเบื้องต้น กำจัดคราบง่ายๆ",
            description: "รวมเคล็ดลับและขั้นตอนการทำความสะอาดโซฟาผ้าด้วยของใช้ในบ้าน เพื่อจัดการคราบเล็กๆ น้อยๆ ก่อนเรียกใช้บริการจากมืออาชีพ",
            category: "เคล็ดลับทำความสะอาด",
            content: (
                <>
                    <p>โซฟาผ้าเป็นเฟอร์นิเจอร์ชิ้นโปรดของใครหลายคน แต่ก็เป็นแหล่งสะสมฝุ่นและเกิดคราบได้ง่าย การทำความสะอาดโซฟาผ้าด้วยตัวเองเป็นประจำจะช่วยยืดอายุการใช้งานและทำให้โซฟาของคุณดูเหมือนใหม่อยู่เสมอ วันนี้เรามีเคล็ดลับง่ายๆ มาฝากกันครับ</p>
                    <h2>1. เตรียมอุปกรณ์</h2>
                    <ul>
                        <li>เครื่องดูดฝุ่น (พร้อมหัวดูดแบบแปรง)</li>
                        <li>ผ้าไมโครไฟเบอร์สะอาด 2-3 ผืน</li>
                        <li>น้ำอุ่น</li>
                        <li>น้ำยาล้างจาน หรือ สบู่อ่อนๆ</li>
                        <li>เบกกิ้งโซดา (สำหรับกำจัดกลิ่น)</li>
                    </ul>
                    <h2>2. ดูดฝุ่นให้ทั่ว</h2>
                    <p>ขั้นตอนแรกที่สำคัญที่สุดคือการดูดฝุ่น ใช้เครื่องดูดฝุ่นพร้อมหัวแปรงดูดเศษผง ฝุ่น และขนสัตว์เลี้ยงออกจากโซฟาให้หมดจดทุกซอกทุกมุม รวมถึงใต้เบาะรองนั่งและหมอนอิง การดูดฝุ่นจะช่วยป้องกันไม่ให้ฝุ่นกลายเป็นคราบโคลนเมื่อโดนน้ำ</p>
                    <h2>3. จัดการคราบเฉพาะจุด</h2>
                    <p>ผสมน้ำยาล้างจานเล็กน้อยกับน้ำอุ่น ใช้ผ้าไมโครไฟเบอร์ชุบน้ำยาที่ผสมไว้แล้วบิดให้หมาดที่สุด จากนั้นค่อยๆ ซับลงบนคราบเบาๆ <strong>ห้ามถูแรงๆ</strong> เพราะจะทำให้คราบกระจายตัวและซึมลึกลงไปในเนื้อผ้า ให้ซับจากขอบนอกของคราบเข้ามาด้านใน เมื่อคราบจางลงแล้ว ให้ใช้ผ้าสะอาดอีกผืนชุบน้ำเปล่าบิดหมาดซับเพื่อล้างน้ำยาออก</p>
                </>
            ),
        },
        en: {
            title: "How to Clean a Fabric Sofa Yourself: Easy Stain Removal",
            description: "A collection of tips and steps for cleaning a fabric sofa with household items to manage small stains before calling in the professionals.",
            category: "Cleaning Tips",
            content: (
                 <>
                    <p>A fabric sofa is a favorite piece of furniture for many, but it can easily accumulate dust and stains. Regularly cleaning your fabric sofa yourself helps extend its life and keeps it looking new. Today, we have some simple tips for you.</p>
                    <h2>1. Prepare Your Supplies</h2>
                    <ul>
                        <li>Vacuum cleaner (with a brush attachment)</li>
                        <li>2-3 clean microfiber cloths</li>
                        <li>Warm water</li>
                        <li>Mild dish soap or gentle soap</li>
                        <li>Baking soda (for odor removal)</li>
                    </ul>
                    <h2>2. Vacuum Thoroughly</h2>
                    <p>The most crucial first step is to vacuum. Use a vacuum with a brush attachment to remove all debris, dust, and pet hair from every nook and cranny of the sofa, including under the cushions. Vacuuming prevents dust from turning into mud when it gets wet.</p>
                    <h2>3. Spot Treat Stains</h2>
                    <p>Mix a small amount of dish soap with warm water. Dampen a microfiber cloth with the solution and wring it out as much as possible. Gently blot the stain. <strong>Do not rub vigorously</strong>, as this can spread the stain and push it deeper into the fabric. Blot from the outside of the stain inward. Once the stain fades, use another clean, damp cloth to blot the area with plain water to rinse off the soap.</p>
                </>
            ),
        }
    },
    "when-to-clean-car-seats": {
        slug: {
            th: "สัญญาณเตือนซักเบาะรถ",
            en: "signs-its-time-to-clean-your-car-seats",
        },
        image: "https://placehold.co/800x400.png",
        imageHint: "car seat interior",
        date: "2024-07-18",
        th: {
            title: "5 สัญญาณเตือน! ถึงเวลาต้องซักเบาะรถยนต์แล้ว",
            description: "เบาะรถยนต์ของคุณมีกลิ่นอับ มีคราบแปลกๆ หรือไม่? มาเช็คสัญญาณที่บ่งบอกว่าเบาะรถของคุณต้องการการทำความสะอาดครั้งใหญ่",
            category: "บริการของเรา",
            content: (
                <>
                    <p>เบาะรถยนต์เป็นส่วนที่เราสัมผัสอยู่ตลอดเวลา จึงไม่น่าแปลกใจที่จะกลายเป็นแหล่งสะสมของเชื้อโรค ฝุ่น และคราบสกปรกต่างๆ แต่หลายคนอาจไม่แน่ใจว่าเมื่อไหร่ถึงควรทำความสะอาดครั้งใหญ่ ลองมาเช็ค 5 สัญญาณเตือนนี้กันดูครับ</p>
                    <h2>1. มีกลิ่นไม่พึงประสงค์</h2>
                    <p>หากเปิดประตูรถเข้ามาแล้วได้กลิ่นอับ กลิ่นอาหาร หรือกลิ่นเหม็นเปรี้ยว นั่นคือสัญญาณชัดเจนว่ามีแบคทีเรียและเชื้อราเติบโตอยู่ในเบาะรถของคุณแล้ว การใช้สเปรย์ปรับอากาศเป็นเพียงการแก้ปัญหาที่ปลายเหตุเท่านั้น</p>
                    <h2>2. เห็นคราบสกปรกชัดเจน</h2>
                    <p>คราบกาแฟ, น้ำอัดลม, ขนม หรือรอยเปื้อนจากเหงื่อไคลที่เห็นได้ด้วยตาเปล่า ไม่เพียงแต่ทำให้รถดูไม่สวยงาม แต่ยังเป็นแหล่งอาหารชั้นดีของเชื้อโรคอีกด้วย หากปล่อยไว้นาน คราบเหล่านี้จะยิ่งฝังลึกและทำความสะอาดยากขึ้น</p>
                </>
            ),
        },
        en: {
            title: "5 Warning Signs! It's Time to Clean Your Car Seats",
            description: "Does your car upholstery have a musty smell or strange stains? Let's check the signs that indicate your car seats need a deep clean.",
            category: "Our Services",
            content: (
                 <>
                    <p>We are constantly in contact with our car seats, so it's no surprise they become a breeding ground for germs, dust, and dirt. Many people are unsure when it's time for a major cleaning. Let's look at these 5 warning signs.</p>
                    <h2>1. Unpleasant Odors</h2>
                    <p>If you open your car door and are greeted by a musty, food, or sour smell, it's a clear sign that bacteria and mold are growing in your car seats. Using an air freshener only masks the problem temporarily.</p>
                    <h2>2. Visible Stains</h2>
                    <p>Stains from coffee, soda, snacks, or sweat are not only unsightly but also a food source for germs. If left for too long, these stains will set in and become much harder to clean.</p>
                </>
            ),
        }
    },
    "sofa-vs-carpet-cleaning": {
        slug: {
            th: "ซักโซฟาต่างกับซักพรมอย่างไร",
            en: "how-is-sofa-cleaning-different-from-carpet-cleaning",
        },
        image: "https://placehold.co/800x400.png",
        imageHint: "sofa carpet",
        date: "2024-07-15",
        th: {
            title: "ซักโซฟา กับ ซักพรม เหมือนหรือต่างกันอย่างไร?",
            description: "หลายคนอาจคิดว่าการซักโซฟาและพรมใช้วิธีเดียวกัน บทความนี้จะมาไขข้อข้องใจถึงความแตกต่างของวัสดุและวิธีการทำความสะอาด",
            category: "เกร็ดความรู้",
            content: (
                <>
                    <p>หลายท่านอาจคิดว่าการซักโซฟาและซักพรมนั้นใช้วิธีการเดียวกันได้ เพราะต่างก็เป็นเฟอร์นิเจอร์ที่ทำจากผ้าเหมือนกัน แต่ในความเป็นจริงแล้ว ทั้งสองอย่างนี้มีความแตกต่างกันในรายละเอียดที่สำคัญ ซึ่งส่งผลต่อวิธีการทำความสะอาดที่เหมาะสม</p>
                    <h2>ความแตกต่างหลัก</h2>
                    <ol>
                        <li><strong>โครงสร้างและวัสดุภายใน:</strong> โซฟามีโครงสร้างที่ซับซ้อนกว่ามาก มีทั้งโครงไม้, ฟองน้ำ, สปริง และวัสดุบุภายในอื่นๆ ในขณะที่พรมมีเพียงชั้นของเส้นใยและแผ่นรองด้านหลัง การใช้น้ำมากเกินไปในการซักโซฟาอาจทำให้วัสดุภายในเสียหาย เกิดเชื้อรา และมีกลิ่นอับได้</li>
                        <li><strong>ชนิดของเส้นใย:</strong> ผ้าบุโซฟามีความหลากหลายสูงมาก ตั้งแต่ผ้าฝ้าย, ลินิน, กำมะหยี่ ไปจนถึงผ้าสังเคราะห์ ซึ่งแต่ละชนิดตอบสนองต่อน้ำยาและวิธีการทำความสะอาดแตกต่างกัน ในขณะที่พรมส่วนใหญ่มักทำจากเส้นใยสังเคราะห์ที่ทนทานกว่า</li>
                    </ol>
                </>
            ),
        },
        en: {
            title: "Sofa Cleaning vs. Carpet Cleaning: What's the Difference?",
            description: "Many people think sofa and carpet cleaning are the same. This article will clarify the differences in materials and cleaning methods.",
            category: "Knowledge",
             content: (
                <>
                    <p>Many people might think that sofa and carpet cleaning can be done using the same methods because they are both fabric-based furnishings. However, in reality, there are significant differences between the two that affect the appropriate cleaning approach.</p>
                    <h2>Key Differences</h2>
                    <ol>
                        <li><strong>Structure and Internal Materials:</strong> Sofas have a much more complex structure, including a wooden frame, foam, springs, and other upholstery materials. In contrast, carpets only consist of a layer of fibers and a backing. Using too much water when cleaning a sofa can damage the internal materials, leading to mold and musty odors.</li>
                        <li><strong>Fiber Types:</strong> Upholstery fabrics are highly diverse, ranging from cotton, linen, and velvet to synthetic fabrics. Each type responds differently to cleaning solutions and methods. Carpets, on the other hand, are mostly made from more durable synthetic fibers.</li>
                    </ol>
                </>
            ),
        }
    },
};
