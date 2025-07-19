import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ name: string }> },
) {
	const { name } = await params;

	if (!name) {
		return NextResponse.json({ error: "Bad Request" }, { status: 400 });
	}

	const filePath = path.join(process.cwd(), "public", "images", name);

	try {
		const fileBuffer = await readFile(filePath);

		// Derive a basic content-type from the file extension
		const ext = path.extname(name).toLowerCase();
		const contentType =
			ext === ".png"
				? "image/png"
				: ext === ".jpg" || ext === ".jpeg"
					? "image/jpeg"
					: ext === ".gif"
						? "image/gif"
						: ext === ".svg"
							? "image/svg+xml"
							: "application/octet-stream";

		return new NextResponse(fileBuffer, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (err) {
		console.error(err);

		return new NextResponse(null, { status: 404 });
	}
}
