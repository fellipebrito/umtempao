// One-shot: screenshot the Clube dos 19 share card at 1200×630 → PNG.
// Re-run whenever the card design or player data changes.
//
//   node scripts/bake-c19-og.mjs                 → proposals/clube-dos-19/og-image.png
//   node scripts/bake-c19-og.mjs out.png          → explicit out path
//
// Requires a local server running on URL_BASE (default http://localhost:8000/).
import { chromium } from "playwright";

const OUT = process.argv[2] || "proposals/clube-dos-19/og-image.png";
const URL_BASE = process.env.URL || "http://localhost:8000/";
const URL = URL_BASE.replace(/\/?$/, "/") + "proposals/clube-dos-19/share-card.html";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

console.log(`[bake] navigating to ${URL}`);
await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });
await page.waitForFunction(
  () => window.C19 && window.UI && document.getElementById("root").children.length > 0,
  null, { timeout: 10_000 }
);
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.waitForTimeout(1200);

await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
console.log(`[bake] wrote ${OUT}`);
await browser.close();
