/**
 * Helper function to generate URL-friendly slug from text
 * Converts Vietnamese text to ASCII-compatible slug
 *
 * @param text - The text to convert to slug
 * @returns URL-friendly slug string
 *
 * @example
 * generateSlug("Trái Cây Tươi") // "trai-cay-tuoi"
 * generateSlug("Fresh Fruits") // "fresh-fruits"
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return (
    text
      // Convert to lowercase
      .toLowerCase()
      // Normalize Unicode characters (remove accents)
      .normalize("NFD")
      // Remove diacritical marks (accents)
      .replace(/[\u0300-\u036f]/g, "")
      // Replace Vietnamese đ/Đ with d
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      // Remove all non-alphanumeric characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, "")
      // Replace multiple spaces with single hyphen
      .replace(/\s+/g, "-")
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Trim whitespace
      .trim()
  );
}

/**
 * Generate multiple slugs from text array
 * Useful when generating slugs for multiple languages
 *
 * @param texts - Array of texts to convert
 * @returns Array of slugs
 */
export function generateSlugs(texts: string[]): string[] {
  return texts.map((text) => generateSlug(text));
}

/**
 * Check if a slug is valid (URL-friendly)
 *
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.trim() === "") {
    return false;
  }

  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Normalize existing slug (fix common issues)
 *
 * @param slug - The slug to normalize
 * @returns Normalized slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug || typeof slug !== "string") {
    return "";
  }

  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
