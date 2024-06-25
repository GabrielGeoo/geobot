export default async function getGeoguessrStats(id: string) {
  const baseUrl = `https://www.geoguessr.com/api/v3/users/${id}/stats`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data;
};