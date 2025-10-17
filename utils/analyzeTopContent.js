const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function analyzeTopContent(clusters) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
      "--disable-gpu",
    ],
    executablePath: puppeteer.executablePath(),
  });

  const analysisResults = [];

  for (const cluster of clusters) {
    const searchKeywords = cluster.keywords;
    console.log(`🔍 Analyzing cluster: ${searchKeywords.join(", ")}`);

    const allPagesData = [];

    for (const query of searchKeywords) {
      const searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
      console.log(`🌐 Searching Brave for: ${query}`);

      try {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
        );

        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await delay(Math.random() * 100);

        // Extract top organic result links
        const links = await page.$$eval("a", (as) =>
          as
            .map((a) => a.href)
            .filter(
              (href) =>
                href.startsWith("http") &&
                !href.includes("brave.com") &&
                !href.includes("/settings") &&
                !href.includes("/images") &&
                !href.includes("/videos")
            )
            .slice(0, 2)
        );

        await page.close(); // free memory immediately

        for (const url of links) {
          try {
            const page2 = await browser.newPage();
            await page2.setDefaultNavigationTimeout(0);
            await page2.setUserAgent(
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
            );

            console.log(`🕸️ Visiting: ${url}`);
            await page2.goto(url, { waitUntil: "domcontentloaded" });

            const html = await page2.content();
            const $ = cheerio.load(html);

            const title = $("title").text().trim();
            const description =
              $('meta[name="description"]').attr("content") ||
              $('meta[property="og:description"]').attr("content") ||
              "";

            const headings = [];
            $("h1, h2, h3").each((_, el) => {
              const text = $(el).text().trim();
              if (text && text.length > 3) headings.push(text);
            });

            allPagesData.push({ query, url, title, description, headings });

            await page2.close(); // free memory immediately
          } catch (err) {
            console.error(`⚠️ Failed to scrape ${url}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`❌ Error while searching "${query}":`, err.message);
      }

      await delay(Math.random() * 100);
    }

    analysisResults.push({
      cluster: cluster.keywords,
      analyzedKeywords: searchKeywords,
      topPages: allPagesData,
    });

    await delay(Math.random() * 100);
  }

  await browser.close();
  return analysisResults;
}

module.exports = { analyzeTopContent };