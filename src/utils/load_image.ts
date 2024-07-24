import puppeteer from "puppeteer";
import fs from 'fs';

export async function loadImage(coord: any): Promise<Buffer> {
  const url = `http://localhost:8080/map?key=${process.env.GOOGLE_MAPS_API_KEY}&lat=${coord.lat}&lng=${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`;
  console.log(url);
  let dateDebug = new Date();
  const now = new Date();

  const browser = await puppeteer.launch();
  console.log(`Browser launched in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  dateDebug = new Date();
  const page = await browser.newPage();
  console.log(`Page created in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  dateDebug = new Date();
  const ratio = 200;
  await page.setViewport({ width: 16 * ratio, height: 9 * ratio });
  console.log(`Viewport set in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  dateDebug = new Date();
  await page.goto(url, { waitUntil: 'networkidle0' });
  console.log(`Page loaded in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  dateDebug = new Date();
  const element = await page.$('#map');
  await element!.screenshot({ path: `${coord.lat}_${coord.lng}_${coord.heading}_${coord.pitch}_${coord.zoom}.png` });
  console.log(`Screenshot taken in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  dateDebug = new Date();
  await browser.close();
  console.log(`Browser closed in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  dateDebug = new Date();
  // Envoyer l'image dans le message
  return fs.readFileSync(`${coord.lat}_${coord.lng}_${coord.heading}_${coord.pitch}_${coord.zoom}.png`);
}