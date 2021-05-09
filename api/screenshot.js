const puppeteer = require("puppeteer");
const fs = require("fs");

async function takeScreenshot(url = "") {
  const encodedUrl = new URL(url);

  if (encodedUrl.protocol !== "https:") {
    throw new Error("The page must be secure");
  }

  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });
  await page.goto(url);

  const file = await page.screenshot();
  await browser.close();
  return file;
}

// /api/screenshot?url=
async function handler(req, res) {
  const { url } = req.query;
  const file = await takeScreenshot(url);
  res.send(file);
}

module.exports = handler;
