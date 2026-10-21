export type Product = {
  id: string;
  thumbnail: string;
  image: string[];
  status: ProductStatus;
  slug: string;
  viewCount: number;
  rating: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum ProductStatus {
  CONTACT = 1,
  SOLD = 2,
  ACTIVE = 3,
}

export type ProductTranslate = {
  id: string;
  productId: string;
  lang: string;
  name: string;
  description: string;
  info: string;
  price: number;
  originalPrice: number;
  fromCountry: string;
  weight: string;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
};
