export type Category = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryTranslate = {
  id: string;
  categoryId: string;
  lang: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CategoryTranslateModel {
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
}

export interface CategoryResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  translates: CategoryTranslateResponse[];
}

export interface CategoryTranslateResponse {
  id: string;
  lang: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
