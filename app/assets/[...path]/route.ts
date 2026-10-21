import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

// Route handler to serve files from /assets/... path
// This ensures files uploaded dynamically are accessible with SEO-friendly URLs
// Files are served as static files with proper headers for SEO and caching
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join("/");

    // Get the public directory
    const cwd = process.cwd();
    const publicDir = path.join(cwd, "public");
    const fullPath = path.join(publicDir, "assets", filePath);

    // Security: prevent directory traversal
    const normalizedPath = path.normalize(fullPath);
    const normalizedPublicDir = path.normalize(publicDir);
    if (!normalizedPath.startsWith(normalizedPublicDir)) {
      return NextResponse.json({ message: "Invalid path" }, { status: 400 });
    }

    // Check if file exists
    try {
      await fs.access(normalizedPath);
    } catch {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Read and serve the file
    const fileBuffer = await fs.readFile(normalizedPath);
    const ext = path.extname(normalizedPath).toLowerCase();

    // Determine content type
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    // Serve file with SEO-friendly headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // SEO-friendly: long cache for static assets
        "Cache-Control": "public, max-age=31536000, immutable",
        // Allow search engines to index
        "X-Robots-Tag": "index, follow",
        // CORS headers if needed
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error serving asset:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
