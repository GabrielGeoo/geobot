import puppeteer from "puppeteer";
import fs from 'fs';

export async function loadImage(coord: any): Promise<Buffer> {
  //const link = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coord.lat},${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`;
  const link = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=43.07235204316051,2.623455288278086&heading=87.56947&pitch=0&zoom=0";
  const url = `http://localhost:8080/map?key=${process.env.GOOGLE_MAPS_API_KEY}&lat=${coord.lat}&lng=${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`;
  console.log(link);
  let dateDebug = new Date();
  const now = new Date();

  // const browser = await puppeteer.launch();
  // console.log(`Browser launched in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  // dateDebug = new Date();
  // const page = await browser.newPage();
  // console.log(`Page created in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  // dateDebug = new Date();
  // const ratio = 210;
  // await page.setViewport({ width: 16 * ratio, height: 9 * ratio });
  // console.log(`Viewport set in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  // dateDebug = new Date();
  // await page.goto(link, { waitUntil: 'networkidle0' });
  // console.log(`Page loaded in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  // dateDebug = new Date();
  // //second form element of the page
  // const secondFormElement = (await page.$$('form'))[1];
  // console.log(secondFormElement);
  // await secondFormElement.click();
  // //wait next page to load
  // await page.waitForNavigation({ waitUntil: 'networkidle0' });
  // const element = await page.$('#map');
  // await page!.screenshot({ path: `${coord.lat}_${coord.lng}_${coord.heading}_${coord.pitch}_${coord.zoom}.png`, clip: {width: ratio * 14, height: ratio * 7, x: ratio, y: ratio} });
  // console.log(`Screenshot taken in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  // dateDebug = new Date();
  // await browser.close();
  // console.log(`Browser closed in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
  // dateDebug = new Date();

  const img = await fetch("https://maps.googleapis.com/maps/api/streetview?size=640x360&location=43.07235204316051,2.623455288278086&heading=87.56947&pitch=0&key=AIzaSyBzk__fThWKnnS8Y6YaXcNNiCLr22immtI");
  return Buffer.from(await img.arrayBuffer());
  // Envoyer l'image dans le message
  //return fs.readFileSync(`${coord.lat}_${coord.lng}_${coord.heading}_${coord.pitch}_${coord.zoom}.png`);
}