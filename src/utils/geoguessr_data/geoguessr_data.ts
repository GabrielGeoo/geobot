export default async function getGeoguessrData(id: string) {
  const baseUrl = `https://www.geoguessr.com/_next/data/98LjpZm2t7_C4w9kGIvjQ/fr/user/${id}.json`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data.pageProps;
};