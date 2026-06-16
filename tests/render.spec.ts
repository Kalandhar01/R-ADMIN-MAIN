import { expect, test } from "@playwright/test";

async function pageSignal(pageUrl: string, viewport: { width: number; height: number }) {
  test.setTimeout(75_000);
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const cardSelector = viewport.width < 768 ? "[data-mobile-dashboard-card]" : "[data-floating-stack-card]";

  try {
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(cardSelector, { state: "visible" });
    await page.waitForTimeout(5200);

    const stackSignal = await page.evaluate(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).map((node) => {
          const styles = window.getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return {
            opacity: Number(styles.opacity),
            filter: styles.filter,
            width: box.width,
            height: box.height
          };
        }),
      cardSelector
    );

    await page.waitForSelector("[data-main-dashboard]", { state: "visible" });
    await page.waitForTimeout(7000);

    const signal = await page.evaluate(() => {
      const hero = document.querySelector("#hero");
      const dashboard = document.querySelector("[data-main-dashboard]");
      return {
        title: document.title,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        heroText: hero?.textContent || "",
        dashboardBox: dashboard?.getBoundingClientRect().toJSON()
      };
    });

    await page.screenshot({ path: `test-results/auditcue-home-${viewport.width}.png`, fullPage: true });
    return { ...signal, stackSignal };
  } finally {
    await browser.close();
  }
}

test("AuditCue sample homepage renders desktop and mobile without overflow", async () => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
  const desktop = await pageSignal(baseUrl, { width: 1440, height: 1000 });
  const mobile = await pageSignal(baseUrl, { width: 390, height: 844 });

  expect(desktop.heroText).toMatch(/Ractysh|AuditCue/);
  expect(desktop.heroText).toMatch(/Reimagine|Architecture|Infrastructure|Digital Assets/);
  expect(desktop.heroText).toContain("Dashboard");
  expect(desktop.overflow).toBeLessThanOrEqual(2);
  expect(desktop.dashboardBox.width).toBeGreaterThan(680);
  expect(desktop.dashboardBox.height).toBeGreaterThan(390);
  expect(desktop.stackSignal).toHaveLength(3);
  expect(desktop.stackSignal.every((card) => card.filter === "none" || card.filter === "blur(0px)")).toBe(true);

  expect(mobile.heroText).toMatch(/Ractysh|AuditCue/);
  expect(mobile.heroText).toMatch(/Reimagine|Architecture|Infrastructure|Digital Assets/);
  expect(mobile.heroText).toContain("Dashboard");
  expect(mobile.overflow).toBeLessThanOrEqual(2);
  expect(mobile.stackSignal).toHaveLength(3);
  expect(mobile.stackSignal.every((card) => card.filter === "none" || card.filter === "blur(0px)")).toBe(true);
});
