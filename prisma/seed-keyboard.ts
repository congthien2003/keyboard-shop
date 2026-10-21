import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const categories = [
 ["ban-phim-co", "Bàn phím cơ", "Mechanical keyboards", "keyboard"],
 ["gaming", "Gaming", "Gaming", "gaming"],
 ["khong-day", "Không dây", "Wireless", "wireless"],
 ["kit-custom", "Kit custom", "Custom kits", "kit"],
 ["switch", "Switch", "Switches", "switch"],
 ["keycap", "Keycap", "Keycaps", "keycap"],
 ["phu-kien", "Phụ kiện", "Accessories", "accessories"],
] as const;
const models = [
 ["Core 65", "Core 75", "Core TKL"], ["Strike 60", "Strike 75", "Strike TKL"],
 ["Air 65", "Air 75", "Air 98"], ["Forge 65 Kit", "Forge 75 Kit", "Forge TKL Kit"],
 ["Linear Red / 35", "Tactile Brown / 35", "Silent Linear / 35"],
 ["Crimson PBT", "Polar PBT", "Graphite PBT"], ["Desk Mat", "Coiled Cable", "Keycap Puller"],
];
const prices = [1490000,1890000,2190000,1290000,250000,690000,290000];
const uuid = (kind: string, index: number) => `5b000000-0000-4000-8000-${kind}${String(index).padStart(10,"0")}`;
async function main() {
 await prisma.$transaction(async tx => {
  for (let c=0;c<categories.length;c++) {
   const [slug,vi,en,asset] = categories[c]; const categoryId = uuid("01",c+1);
   await tx.category.upsert({ where: {id:categoryId}, create: {id:categoryId}, update: {} });
   for (const lang of ["vi","en"]) {
    const translation = { name: lang === "vi" ? vi : en, description: lang === "vi" ? `Bộ sưu tập ${vi.toLowerCase()} SB-MechKey.` : `The SB-MechKey ${en.toLowerCase()} collection.`, slug };
    await tx.categoryTranslate.upsert({ where: {categoryId_lang:{categoryId,lang}}, create:{categoryId,lang,...translation}, update:translation });
   }
   for (let i=0;i<3;i++) {
    const id=uuid("02",c*3+i+1); const keyboard=c<4;
    const price=prices[c]+(c<4 ? i*200000 : i*50000);
    const image=`/images/mechkey/${asset}.svg`;
    const specs = { categoryId, thumbnail:image, image:JSON.stringify([image]), status:3, slug:`sb-${slug}-${i+1}`, brand:"SB-MechKey", layout:keyboard ? [c===1 ? "60%" : "65%","75%",c===2 ? "98%" : "TKL"][i] : null, switchType:c===3 ? null : c===4 ? ["Linear","Tactile","Silent Linear"][i] : keyboard ? "Linear" : null, connectivity:keyboard ? (c===2 ? ["USB-C","Bluetooth","2.4GHz"] : ["USB-C"]) : [], hotSwappable:keyboard ? true : null };
    await tx.product.upsert({ where:{id}, create:{id,...specs}, update:specs });
    for (const lang of ["vi","en"]) {
     const translated = {name:`SB ${models[c][i]}`, description:lang==="vi" ? `${vi} dành cho góc bàn của bạn. Sản phẩm minh họa trong catalog phát triển, chưa phải chào bán thực tế.` : `${en} for your desk. Demonstration catalog item for development, not a live commercial offer.`, info:lang==="vi" ? "<p>Hình ảnh là minh họa thiết kế. Giá và thông số là dữ liệu mẫu.</p>" : "<p>Images are design illustrations. Prices and specifications are sample data.</p>", price:lang==="vi" ? price : Math.round(price/25000), originalPrice:0, fromCountry:"", weight:"", unit:lang==="vi" ? (c===4 ? "gói 35 switch" : c===5 ? "bộ" : "chiếc") : (c===4 ? "35-switch pack" : c===5 ? "set" : "piece")};
     await tx.productTranslate.upsert({where:{productId_lang:{productId:id,lang}},create:{productId:id,lang,...translated},update:translated});
    }
   }
  }
 }, {timeout:60000});
 console.log("SB-MechKey: 7 sample categories and 21 sample products prepared. Existing records outside the seed IDs were preserved.");
}
main().catch(error => {console.error(error);process.exitCode=1;}).finally(() => prisma.$disconnect());
