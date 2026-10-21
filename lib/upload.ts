export async function uploadFilesToAssets(
  files: File[],
  folder: string,
  slug?: string | null,
) {
  const formData = new FormData();
  formData.set("folder", folder);
  if (slug) {
    formData.set("slug", slug);
  }
  for (const file of files) {
    formData.append("files", file);
  }
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = (await res.json()) as { urls: string[] };
  return data.urls;
}

export async function uploadSingleToAssets(
  file: File,
  folder: string,
  slug?: string | null,
) {
  const [url] = await uploadFilesToAssets([file], folder, slug);
  return url;
}
