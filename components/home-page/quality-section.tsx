import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
} from "lucide-react";

export async function QualitySection({ lang }: { lang: Locale }) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const qualityStatements = [
    {
      icon: Shield,
      title: "Chất Lượng Đảm Bảo",
      titleEn: "Quality Guaranteed",
      description:
        "Mỗi sản phẩm đều được kiểm tra nghiêm ngặt trước khi giao hàng",
      descriptionEn: "Every product is strictly inspected before delivery",
    },
    {
      icon: Award,
      title: "Nguồn Gốc Rõ Ràng",
      titleEn: "Clear Origin",
      description:
        "Tất cả trái cây đều có xuất xứ và chứng nhận an toàn thực phẩm",
      descriptionEn:
        "All fruits have clear origin and food safety certificates",
    },
    {
      icon: CheckCircle,
      title: "Cam Kết 100%",
      titleEn: "100% Commitment",
      description: "Hoàn tiền hoặc đổi mới nếu không hài lòng về chất lượng",
      descriptionEn: "Money back or replacement if not satisfied with quality",
    },
  ];

  const certificates = [
    {
      icon: Award,
      title: "Uy Tín Chất Lượng",
      titleEn: "Quality Reputation",
      description: "12 năm kinh nghiệm trong ngành trái cây",
      descriptionEn: "12 years of experience in fruit industry",
    },
    {
      icon: Shield,
      title: "An Toàn Thực Phẩm",
      titleEn: "Food Safety",
      description: "Chứng nhận an toàn thực phẩm quốc tế",
      descriptionEn: "International food safety certification",
    },
    {
      icon: Clock,
      title: "Giao Hàng Nhanh Chóng",
      titleEn: "Fast Delivery",
      description: "Giao hàng trong ngày cho đại lý và cửa hàng",
      descriptionEn: "Same-day delivery for retailers and stores",
    },
    {
      icon: DollarSign,
      title: "Giá Cả Hợp Lý",
      titleEn: "Reasonable Prices",
      description: "Giá bỏ sỉ cạnh tranh, hỗ trợ đại lý phát triển",
      descriptionEn: "Competitive wholesale prices, supporting retailer growth",
    },
  ];

  return (
    <section className="storefront-section bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="storefront-heading mb-4">
            {t("home.quality.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.quality.subtitle")}
          </p>
        </div>
        {/* Certificates */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground">
            {t("home.quality.certificates.title")}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((cert, index) => (
              <Card
                key={index}
                className="storefront-card storefront-card-interactive bg-card/90 text-center backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <cert.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">
                    {t(
                      "home.quality.certificates.item" + (index + 1) + ".title",
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      "home.quality.certificates.item" +
                        (index + 1) +
                        ".description",
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Trust Badge
				<div className="mt-16 text-center">
					<div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
						<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
						<span className="font-semibold text-foreground">
							{t("home.quality.trustBadge")}
						</span>
					</div>
				</div> */}
      </div>
    </section>
  );
}
