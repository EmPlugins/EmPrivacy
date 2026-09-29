import { MUTABLE_MEDIA_CACHE_CONTROL, matchInternalMediaKey, originalMediaHeaders } from "../media/image-endpoint.mjs";
import { GET as GET$1 } from "astro/assets/endpoint/generic";
import { getConfiguredImageService, imageConfig } from "astro:assets";

//#region src/astro/image-endpoint.ts
const prerender = false;
const FORMAT_MIME = {
	webp: "image/webp",
	avif: "image/avif",
	png: "image/png",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	gif: "image/gif"
};
function isNotFound(error) {
	return error instanceof Error && (error.message.includes("not found") || error.message.includes("NOT_FOUND"));
}
function streamOriginal(body, contentType) {
	return new Response(body, {
		status: 200,
		headers: originalMediaHeaders(contentType)
	});
}
const GET = async (ctx) => {
	const url = new URL(ctx.request.url);
	const key = matchInternalMediaKey(url.searchParams.get("href"));
	const storage = ctx.locals.emdash?.storage;
	if (!key || !storage) return GET$1(ctx);
	const service = await getConfiguredImageService();
	if (!("transform" in service)) return GET$1(ctx);
	try {
		const source = await storage.download(key);
		if (!source.contentType.startsWith("image/")) return streamOriginal(source.body, source.contentType);
		const transform = await service.parseURL(url, imageConfig);
		if (!transform) return streamOriginal(source.body, source.contentType);
		const inputBuffer = new Uint8Array(await new Response(source.body).arrayBuffer());
		const { data, format } = await service.transform(inputBuffer, transform, imageConfig);
		return new Response(data, {
			status: 200,
			headers: {
				"Content-Type": FORMAT_MIME[format] ?? source.contentType,
				"Cache-Control": MUTABLE_MEDIA_CACHE_CONTROL,
				"X-Content-Type-Options": "nosniff"
			}
		});
	} catch (error) {
		if (isNotFound(error)) return new Response("Not Found", { status: 404 });
		console.error("[emdash] image transform failed:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
};

//#endregion
export { GET, prerender };
//# sourceMappingURL=image-endpoint.mjs.map