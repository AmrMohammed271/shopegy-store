export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)} EGP`;
}

export function parseImages(images: string): string[] {
  try {
    return JSON.parse(images);
  } catch {
    return images ? [images] : ["/placeholder.svg"];
  }
}
