import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";

// Helper function to get the correct public directory path
// In standalone mode, Next.js changes cwd to standalone folder via process.chdir(__dirname)
// So process.cwd() should already be the standalone directory
// But we need to handle both development and production cases
async function getPublicDir(): Promise<string> {
  const cwd = process.cwd();

  // In standalone mode, Next.js does process.chdir(__dirname) in server.js
  // So process.cwd() should already be the standalone directory
  // Public folder should be at cwd/public
  const publicInCwd = path.join(cwd, "public");

  // Verify the public folder exists, if not, try to find it
  try {
    await fs.access(publicInCwd);
    return publicInCwd;
  } catch {
    // If public folder doesn't exist in cwd, check if we're in standalone mode
    // and need to look in the current directory
    // This should not happen in normal operation, but handle it gracefully
    return publicInCwd; // Still return it so mkdir can create it
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const folder = String(formData.get("folder") || "misc");
    const slug = String(formData.get("slug") || undefined);
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === "files") {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No files provided" },
        { status: 400 },
      );
    }

    const publicDir = await getPublicDir();
    const assetsDir = path.join(publicDir, "assets", folder);
    await fs.mkdir(assetsDir, { recursive: true });

    // Log for debugging
    console.log("Upload - Public dir:", publicDir);
    console.log("Upload - Assets dir:", assetsDir);

    const savedUrls: string[] = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const originalName = (file as any).name || "file";
      const ext = path.extname(originalName) || ".bin";
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const unique = Math.random().toString(36).slice(2, 8);
      const fileName = slug
        ? `${slug}-${timestamp}-${unique}${ext}`
        : `${timestamp}-${unique}${ext}`;
      const filePath = path.join(assetsDir, fileName);
      // Giảm kích thước với sharp

      // await fs.writeFile(filePath, buffer);
      await sharp(buffer)
        .resize({ width: 1080, height: 1080 }) // ⚙️ Giảm chiều rộng (có thể thay đổi)
        .jpeg({ quality: 100 }) // ⚙️ Nén 75%
        .toFile(filePath);

      // Verify file was saved
      try {
        await fs.access(filePath);
        console.log("Upload - File saved successfully:", filePath);
      } catch (error) {
        console.error(
          "Upload - File save verification failed:",
          filePath,
          error,
        );
      }

      // Use route handler to serve the file with SEO-friendly URL
      // This works around Next.js not detecting new files in public folder
      // URL format: /assets/product/... (not /api/assets/...) for better SEO
      savedUrls.push(`/assets/${folder}/${fileName}`);
    }

    return NextResponse.json({ urls: savedUrls }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { message: "Upload failed", error: errorMessage },
      { status: 500 },
    );
  }
}
