import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

// npm run evidence
// Writes docs/evidence/{gallery,dialog}-{390,<desktop>}.png. Desktop defaults to 860.
// One-time browser install: npx playwright install chromium

const port = Number(process.env.EVIDENCE_PORT || 4173);
const base = process.env.EVIDENCE_URL || `http://127.0.0.1:${port}`;
const outDir = process.env.EVIDENCE_OUT || "docs/evidence";
const desktop = Number(process.env.EVIDENCE_DESKTOP || 860);
const shots = [
  ["gallery", 390, 844],
  ["gallery", desktop, 900],
  ["dialog", 390, 844],
  ["dialog", desktop, 900],
];

const preview = process.env.EVIDENCE_URL
  ? null
  : spawn(process.execPath, [
      fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url)),
      "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort",
    ], { stdio: ["ignore", "inherit", "inherit"] });

async function stopPreview() {
  if (!preview || preview.exitCode != null) return;
  preview.kill("SIGTERM");
  const exited = new Promise((resolve) => preview.once("exit", resolve));
  await Promise.race([exited, delay(4000)]);
  if (preview.exitCode == null) preview.kill("SIGKILL");
  await exited;
}

async function waitForPreview() {
  if (process.env.EVIDENCE_URL) return;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (preview.exitCode != null) throw new Error(`Vite preview exited with code ${preview.exitCode}`);
    try {
      if ((await fetch(base)).ok) return;
    } catch { /* preview still booting */ }
    await delay(250);
  }
  throw new Error(`Vite preview was not ready at ${base}`);
}

try {
  await waitForPreview();
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [name, width, height] of shots) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(base, { waitUntil: "domcontentloaded" });
      await page.locator(".status.empty, .status.error, .gallery-grid").first().waitFor({ timeout: 15_000 });
      await page.evaluate(() => document.fonts.ready);
      if (name === "dialog") {
        await page.getByRole("button", { name: "Try before you buy" }).click();
        await page.getByRole("dialog", { name: "Try before you buy" }).waitFor();
      }
      const file = `${outDir}/${name}-${width}.png`;
      await page.screenshot({ path: file });
      console.log(file);
      await page.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  await stopPreview();
}
