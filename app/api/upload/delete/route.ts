import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

// Helper to get the public directory, consistent with the upload route
async function getPublicDir(): Promise<string> {
  const cwd = process.cwd();
  const publicInCwd = path.join(cwd, "public");
  try {
    await fs.access(publicInCwd);
    return publicInCwd;
  } catch {
    return publicInCwd;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { message: "No image URLs provided" },
        { status: 400 },
      );
    }

    const publicDir = await getPublicDir();
    const deletionResults = {
      success: [] as string[],
      failed: [] as { url: string; reason: string }[],
    };

    for (const url of urls) {
      try {
        // Sanitize and construct the file path
        // URL is like "/assets/folder/filename.webp"
        // We need to remove the leading slash to join it with the publicDir path
        const relativePath = url.startsWith("/") ? url.substring(1) : url;
        const filePath = path.join(publicDir, relativePath);

        // Security check: ensure the path is within the public directory
        const resolvedPath = path.resolve(filePath);
        const resolvedPublicDir = path.resolve(publicDir);
        if (!resolvedPath.startsWith(resolvedPublicDir)) {
          throw new Error("Invalid file path. Traversal attempt detected.");
        }

        await fs.unlink(filePath);
        deletionResults.success.push(url);
      } catch (error: any) {
        // If file doesn't exist, it might have been deleted already. We can count it as a non-failure.
        if (error.code !== "ENOENT") {
          deletionResults.failed.push({ url, reason: error.message });
        }
      }
    }

    if (deletionResults.failed.length > 0) {
      console.error("Failed to delete some images:", deletionResults.failed);
      // Decide if we should return a partial success or an error
      return NextResponse.json(
        {
          message: "Some images could not be deleted",
          results: deletionResults,
        },
        { status: 207 }, // Multi-Status
      );
    }

    return NextResponse.json(
      {
        message: "Images deleted successfully",
        results: deletionResults,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete images error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json(
      { message: "An unexpected error occurred", error: errorMessage },
      { status: 500 },
    );
  }
}
