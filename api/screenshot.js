const puppeteer = require("puppeteer");
const fs = require("fs");
const { promisify } = require("util");

async function takeScreenshot(url = "") {
  const encodedUrl = new URL(url);
  if (encodedUrl.protocol !== "https") {
    throw new Error("The page must be secure");
  }

  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });
  await page.goto(url);

  const path = `screenshots/${encodedUrl.hostname}.jpeg`;

  await page.screenshot({ path });
  await browser.close();
  return path;
}

// /api/screenshot?url=
async function handler(req, res) {
  const { url } = req.query;
  const file = await takeScreenshot(url);
  const fileBuffer = await promisify(fs.readFile)(file);
  res.send(fileBuffer);
}

module.exports = handler;
