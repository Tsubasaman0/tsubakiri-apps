// 静的ファイル配信に「途中から取り出す(Range)」対応を足す。ポッドキャストアプリが音声を少しずつ取りに来るため。
// それ以外はそのまま静的ファイル(public/)を返す。
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const range = request.headers.get("Range");
    if (range && url.pathname.startsWith("/audio/") && request.method === "GET") {
      const full = await env.ASSETS.fetch(new Request(url.toString(), { method: "GET" }));
      if (!full.ok) return full;
      const buf = await full.arrayBuffer();
      const total = buf.byteLength;
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!m) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
      let start = m[1] === "" ? Math.max(0, total - Number(m[2])) : Number(m[1]);
      let end = (m[1] === "" || m[2] === "") ? total - 1 : Math.min(Number(m[2]), total - 1);
      if (isNaN(start) || isNaN(end) || start > end || start >= total) {
        return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
      }
      const headers = new Headers(full.headers);
      headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
      headers.set("Content-Length", String(end - start + 1));
      headers.set("Accept-Ranges", "bytes");
      return new Response(buf.slice(start, end + 1), { status: 206, headers });
    }
    const res = await env.ASSETS.fetch(request);
    if (url.pathname.startsWith("/audio/")) {
      const h = new Headers(res.headers);
      h.set("Accept-Ranges", "bytes");
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  }
};
