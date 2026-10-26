// Netlify: put this at netlify/functions/stock.mjs. It is served at /api/stock (no netlify.toml needed).
export default async (req) => {
  const q = new URL(req.url).searchParams;
  const symbol = q.get("symbol") || "", p1 = q.get("period1") || "", p2 = q.get("period2") || "", interval = q.get("interval") || "1d";
  if (!/^[\^A-Za-z0-9.\-=]{1,15}$/.test(symbol) || !/^\d+$/.test(p1) || !/^\d+$/.test(p2) || !/^(1h|1d)$/.test(interval))
    return new Response('{"error":"bad params"}', { status: 400, headers: { "Content-Type": "application/json" } });
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${p1}&period2=${p2}&interval=${interval}`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=600" } });
  } catch (e) {
    return new Response('{"error":"upstream failed"}', { status: 502, headers: { "Content-Type": "application/json" } });
  }
};
export const config = { path: "/api/stock" };
