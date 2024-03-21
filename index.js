const fs = require("fs");
const puppeteer = require("puppeteer");
const { Parser } = require("json2csv");
const path = require("path");

async function scrapeInstagramComments(link) {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const navigationPromise = page.waitForNavigation();
  await page.goto(link);
  const commentsSection = "div > ul";
  await page.waitForSelector(commentsSection);

  let previousHeight;
  while (true) {
    previousHeight = await page.evaluate('document.querySelector("' + commentsSection + '").scrollHeight');
    await page.evaluate('document.querySelector("' + commentsSection + '").scrollTop = document.querySelector("' + commentsSection + '").scrollHeight');
    await page.waitForFunction(`document.querySelector("${commentsSection}").scrollHeight > ${previousHeight}`);
    await page.waitForTimeout(2000); // delay to allow page to load new comments
  }
  
}


const postLink = process.argv[2];

if (!postLink) {
  console.error("Please provide the Instagram post link as an argument.");
  process.exit(1);
}


scrapeInstagramComments(postLink);