export default async function getGeoguessrData(id: string) {
  const baseUrl = `https://www.geoguessr.com/_next/data/PAJchk6PWdCRMvFO2CM6T/fr/user/${id}.json`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data.pageProps;
};