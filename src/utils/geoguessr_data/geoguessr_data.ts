export default async function getGeoguessrData(id: string) {
  const baseUrl = `https://www.geoguessr.com/api/v3/users/${id}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data;
};