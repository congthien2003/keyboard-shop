"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSlug } from "@/lib/admin-data";
import { useProduct } from "@/hooks/useProduct";
import { ProductStatus } from "@/types/product";
import { CategoryResponse } from "@/types/category";
import { ProductResponse } from "@/services/product-service";
import { TipTapEditor } from "../tiptap-editor";
import { X, GripVertical } from "lucide-react";

type ProductFormData = {
  brand: string;
  layout: string;
  switchType: string;
  connectivity: string[];
  hotSwappable: string;
  categoryId: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  info: string;
  infoVi: string;
  weight: string;
  weightVi: string;
  price: string;
  originalPrice: string;
  priceVi: string;
  originalPriceVi: string;
  productSlug?: string;
  image: string;
  images: string[];
  origin: string;
  originVi: string;
  unit: string;
  unitVi: string;
  rating: number;
  viewCount: number;
  status: "contact" | "direct" | "out_of_stock";
  rawThumbnail: FileList | null;
  rawGallery: FileList | null;
};

interface ProductPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductResponse | null;
  categories: CategoryResponse[];
  onSuccess: () => void;
}

export function ProductPopup({
  open,
  onOpenChange,
  product,
  categories,
  onSuccess,
}: ProductPopupProps) {
  const { t, locale } = useI18n();
  const {
    createProduct,
    updateProduct,
    uploadThumbnail,
    uploadGallery,
    deleteImages,
    loading,
    error,
  } = useProduct();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const defaultValues: ProductFormData = {
    brand: "", layout: "", switchType: "", connectivity: [], hotSwappable: "",
    categoryId: "",
    name: "",
    nameVi: "",
    description: "",
    descriptionVi: "",
    info: "",
    infoVi: "",
    weight: "",
    weightVi: "",
    price: "",
    originalPrice: "",
    priceVi: "",
    originalPriceVi: "",
    productSlug: "",
    image: "",
    images: [],
    origin: "",
    originVi: "",
    unit: "",
    unitVi: "",
    rating: 0,
    viewCount: 0,
    status: "direct",
    rawThumbnail: null,
    rawGallery: null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (product) {
      const translateEn = product.translates.find((t) => t.lang === "en");
      const translateVi = product.translates.find((t) => t.lang === "vi");

      reset({
        brand: product.brand || "", layout: product.layout || "", switchType: product.switchType || "",
        connectivity: product.connectivity || [], hotSwappable: product.hotSwappable == null ? "" : String(product.hotSwappable),
        categoryId: product.categoryId,
        name: translateEn?.name || "",
        nameVi: translateVi?.name || "",
        description: translateEn?.description || "",
        descriptionVi: translateVi?.description || "",
        info: translateEn?.info || "",
        infoVi: translateVi?.info || "",
        weight: translateEn?.weight || "",
        weightVi: translateVi?.weight || "",
        price: translateEn?.price?.toString() || "",
        originalPrice: translateEn?.originalPrice?.toString() || "",
        priceVi: translateVi?.price?.toString() || "",
        originalPriceVi: translateVi?.originalPrice?.toString() || "",
        productSlug: (product as any)?.slug || "",
        image: product.thumbnail,
        images: product.image,
        origin: translateEn?.fromCountry || "",
        originVi: translateVi?.fromCountry || "",
        unit: translateEn?.unit || "",
        unitVi: translateVi?.unit || "",
        rating: product.rating || 0,
        viewCount: product.viewCount || 0,
        status: (product.status === 1
          ? "contact"
          : product.status === 2
            ? "out_of_stock"
            : "direct") as "contact" | "direct" | "out_of_stock",
      });
      setGalleryImages(product.image || []);
    } else {
      reset(defaultValues);
      setGalleryImages([]);
    }
  }, [product, open, reset]);

  const mapStatus = (s: "contact" | "direct" | "out_of_stock") => {
    if (s === "contact") return ProductStatus.CONTACT;
    if (s === "out_of_stock") return ProductStatus.SOLD;
    return ProductStatus.ACTIVE;
  };

  const parsePrice = (p: string) => {
    const n = parseFloat((p || "").replace(/[^0-9.,-]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => {
    setValue(field, value as any);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...galleryImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setGalleryImages(newImages);
    setDraggedIndex(index);
    setValue("images", newImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = galleryImages[index];
    setImagesToDelete((prev) => [...prev, imageToRemove]);
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (formData: ProductFormData) => {
    const fileThumbnail = formData.rawThumbnail;
    const fileGallery = formData.rawGallery;

    const [thumbnail, filesGallery] = await Promise.all([
      fileThumbnail?.[0]
        ? uploadThumbnail(fileThumbnail[0], formData.productSlug || null)
        : null,
      fileGallery
        ? uploadGallery(Array.from(fileGallery), formData.productSlug || null)
        : null,
    ]);

    const finalImages = filesGallery
      ? [...galleryImages, ...filesGallery]
      : galleryImages;

    const input = {
      thumbnail: thumbnail || watch("image"),
      image: finalImages,
      status: mapStatus(formData.status),
      slug:
        formData.productSlug ||
        generateSlug(watch("nameVi") || watch("name") || ""),
      brand: formData.brand.trim() || null, layout: formData.layout.trim() || null, switchType: formData.switchType.trim() || null,
      connectivity: formData.connectivity, hotSwappable: formData.hotSwappable === "" ? null : formData.hotSwappable === "true",
      categoryId: formData.categoryId,
      rating: formData.rating || 0,
      viewCount: formData.viewCount || 0,
      translates: [
        {
          lang: "vi",
          name: formData.nameVi,
          description: formData.descriptionVi || "",
          info: formData.infoVi || "",
          weight: formData.weightVi || "",
          unit: formData.unitVi || "",
          price: parsePrice(formData.priceVi || formData.price),
          originalPrice:
            parsePrice(formData.originalPriceVi || formData.originalPrice) ||
            parsePrice(formData.priceVi || formData.price),
          fromCountry: formData.originVi || "",
        },
        {
          lang: "en",
          name: formData.name,
          description: formData.description || "",
          info: formData.info || "",
          weight: formData.weight || "",
          unit: formData.unit || "",
          price: parsePrice(formData.price),
          originalPrice:
            parsePrice(formData.originalPrice) || parsePrice(formData.price),
          fromCountry: formData.origin || "",
        },
      ],
    };

    if (product) {
      const saved = await updateProduct(product.id, input);
      if (!saved) return;
      // After successfully updating the product, delete the marked images
      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete);
        setImagesToDelete([]); // Reset the list
      }
    } else {
      const saved = await createProduct(input);
      if (!saved) return;
    }
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product
              ? t("admin.products.edit") || "Sửa sản phẩm"
              : t("admin.products.addNew") || "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
            <legend className="px-2 font-semibold">{locale === "vi" ? "Thông số sản phẩm" : "Product specifications"}</legend>
            {([ ["brand", locale === "vi" ? "Thương hiệu" : "Brand"], ["layout", "Layout"], ["switchType", "Switch"] ] as const).map(([field, label]) => (
              <label key={field} className="space-y-2 text-sm">{label}<Input {...register(field)} maxLength={100} /></label>
            ))}
            <label className="space-y-2 text-sm">Hot-swap
              <select {...register("hotSwappable")} className="w-full rounded-md border bg-background p-2">
                <option value="">{locale === "vi" ? "Không áp dụng" : "Not applicable"}</option>
                <option value="true">{locale === "vi" ? "Có" : "Yes"}</option>
                <option value="false">{locale === "vi" ? "Không" : "No"}</option>
              </select>
            </label>
            <div className="sm:col-span-2"><p className="mb-2 text-sm">{locale === "vi" ? "Kết nối" : "Connectivity"}</p>
              <div className="flex flex-wrap gap-5">{["USB-C", "Bluetooth", "2.4GHz"].map(value => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" value={value} {...register("connectivity")} />{value}</label>)}</div>
            </div>
          </fieldset>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("admin.products.category") || "Danh mục"} *
            </label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        t("admin.products.selectCategory") || "Chọn danh mục"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {locale === "vi"
                          ? cat.translates.find((t) => t.lang === "vi")?.name ||
                            ""
                          : cat.translates.find((t) => t.lang === "en")?.name ||
                            ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {t("admin.products.categoryRequired") ||
                  "Vui lòng chọn danh mục"}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.nameVi") || "Tên (Tiếng Việt)"} *
              </label>
              <Input
                {...register("nameVi", { required: true })}
                placeholder="Tên sản phẩm"
                onChange={(e) => {
                  setValue("nameVi", e.target.value);
                  // Auto generate slug from Vietnamese name
                  if (e.target.value) {
                    setValue("productSlug", generateSlug(e.target.value));
                  }
                }}
              />
              {errors.nameVi && (
                <p className="text-sm text-destructive">
                  {t("admin.products.nameRequired") ||
                    "Vui lòng nhập tên sản phẩm"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.nameEn") || "Tên (English AB)"} *
              </label>
              <Input
                {...register("name", { required: true })}
                placeholder="Product Name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {t("admin.products.nameRequired") ||
                    "Vui lòng nhập tên sản phẩm"}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.descVi") || "Mô tả (Tiếng Việt)"}
              </label>
              <Textarea
                {...register("descriptionVi")}
                placeholder="Mô tả"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.descEn") || "Mô tả (English)"}
              </label>
              <Textarea
                {...register("description")}
                placeholder="Description"
                rows={4}
              />
            </div>
          </div>

          {/* Info (with language tabs) */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Tabs
              defaultValue={locale === "vi" ? "vi" : "en"}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">
                  {t("admin.products.infoVi") || "Thông tin (Tiếng Việt)"}
                </TabsTrigger>
                <TabsTrigger value="en">
                  {t("admin.products.infoEn") || "Thông tin (English)"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vi" className="space-y-2">
                <label className="text-sm font-medium">
                  {t("admin.products.infoVi") || "Thông tin (Tiếng Việt)"}
                </label>
                <TipTapEditor
                  content={watch("infoVi") || ""}
                  onChange={(content) => updateField("infoVi", content)}
                  placeholder={t("admin.products.infoPlaceholder")}
                />
              </TabsContent>

              <TabsContent value="en" className="space-y-2">
                <label className="text-sm font-medium">
                  {t("admin.products.infoEn") || "Thông tin (English)"}
                </label>
                <TipTapEditor
                  content={watch("info") || ""}
                  onChange={(content) => updateField("info", content)}
                  placeholder={t("admin.products.infoPlaceholder")}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Slug */}
          <div className="grid grid-cols-1">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.slug") || "Product Slug"}
              </label>
              <Input {...register("productSlug")} placeholder="product-slug" />
              <p className="text-xs text-muted-foreground">
                {t("admin.products.slugHint") ||
                  "Auto-generated from Vietnamese name, editable"}
              </p>
            </div>
          </div>

          {/* Price - Vietnamese */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.price") || "Giá"} (VND) *
              </label>
              <Input
                {...register("priceVi", { required: true })}
                placeholder="180000"
              />
              {errors.priceVi && (
                <p className="text-sm text-destructive">
                  {t("admin.products.priceRequired") || "Vui lòng nhập giá"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.price") || "Giá"} (USD) *
              </label>
              <Input
                {...register("price", { required: true })}
                placeholder="180000"
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {t("admin.products.priceRequired") || "Vui lòng nhập giá"}
                </p>
              )}
            </div>
          </div>

          {/* Price - English */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.originalPrice") || "Giá gốc"} (VND)
              </label>
              <Input {...register("originalPriceVi")} placeholder="200000" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.originalPrice") || "Giá gốc"} (USD)
              </label>
              <Input {...register("originalPrice")} placeholder="200000" />
            </div>
          </div>

          {/* Origin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.originVi") || "Xuất xứ (Tiếng Việt)"}
              </label>
              <Input {...register("originVi")} placeholder="Việt Nam" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.originEn") || "Xuất xứ (English)"}
              </label>
              <Input {...register("origin")} placeholder="Vietnam" />
            </div>
          </div>

          {/* Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.weightVi") || "Khối lượng (Tiếng Việt)"}
              </label>
              <Input {...register("weightVi")} placeholder="1 kg, 500 g, ..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.weightEn") || "Khối lượng (English)"}
              </label>
              <Input {...register("weight")} placeholder="1 kg, 500 g, ..." />
            </div>
          </div>

          {/* Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.unitVi") || "Đơn vị (Tiếng Việt)"}
              </label>
              <Input {...register("unitVi")} placeholder="kg, bó, hộp, ..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.unitEn") || "Đơn vị (English)"}
              </label>
              <Input {...register("unit")} placeholder="kg, bunch, box, ..." />
            </div>
          </div>

          {/* Rating & View Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.rating") || "Đánh giá"}
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register("rating", {
                  valueAsNumber: true,
                  min: 0,
                  max: 5,
                })}
                placeholder="0.0 - 5.0"
              />
              <p className="text-xs text-muted-foreground">
                {t("admin.products.ratingHint") || "Đánh giá từ 0.0 đến 5.0"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.products.viewCount") || "Lượt xem"}
              </label>
              <Input
                type="number"
                min="0"
                {...register("viewCount", {
                  valueAsNumber: true,
                  min: 0,
                })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                {t("admin.products.viewCountHint") || "Số lượt xem sản phẩm"}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("admin.products.status") || "Trạng thái"} *
            </label>
            <Controller
              name="status"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">
                      {t("admin.products.statusContact") || "Liên hệ"}
                    </SelectItem>
                    <SelectItem value="direct">
                      {t("admin.products.statusActive") || "Còn Hàng"}
                    </SelectItem>
                    <SelectItem value="out_of_stock">
                      {t("admin.products.statusOutOfStock") || "Hết hàng"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">
                {t("admin.products.statusRequired") ||
                  "Vui lòng chọn trạng thái"}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("admin.products.image") || "Hình ảnh chính"}
            </label>
            {product ? (
              <>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadThumbnail(
                          file,
                          watch("productSlug") || null,
                        );
                        setValue("image", url);
                      } catch (_) {}
                    }}
                  />
                </div>
                {watch("image") && (
                  <img
                    src={watch("image")}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                )}
              </>
            ) : (
              <>
                <Input
                  {...register("rawThumbnail")}
                  id="rawThumbnail"
                  type="file"
                  placeholder="/images/product.webp"
                />
              </>
            )}
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("admin.products.images") || "Hình ảnh phụ (Gallery)"}
            </label>
            {product ? (
              <>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      if (files.length === 0) return;
                      try {
                        const urls = await uploadGallery(
                          files,
                          watch("productSlug") || null,
                        );
                        const newImages = [...galleryImages, ...urls];
                        setGalleryImages(newImages);
                        setValue("images", newImages);
                      } catch (_) {}
                    }}
                  />
                </div>
                {galleryImages && galleryImages.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("admin.products.dragToReorder") ||
                        "Kéo thả để sắp xếp lại thứ tự ảnh"}
                    </p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={`${img}-${idx}`}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all ${
                            draggedIndex === idx
                              ? "border-blue-500 opacity-50 scale-95"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                            {idx + 1}
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/60 text-white p-1 rounded">
                              <GripVertical className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Input
                  {...register("rawGallery")}
                  id="rawGallery"
                  type="file"
                  multiple
                  accept="image/*"
                  placeholder="Hình ảnh phụ"
                />
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("admin.cancel") || "Hủy"}
            </Button>
            <Button type="submit" disabled={loading}>
              {product
                ? t("admin.update") || "Cập nhật"
                : t("admin.create") || "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
