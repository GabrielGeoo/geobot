export default async function getLocalization(lat: number, lng: number): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results;
  const administrative_area_level_2_results = results.find((result: any) => result.types.includes("administrative_area_level_2"));
  const address_components = administrative_area_level_2_results.address_components;
  const country = address_components.find((component: any) => component.types.includes("country"));
  const administrative_area_level_1 = address_components.find((component: any) => component.types.includes("administrative_area_level_1"));
  const administrative_area_level_2 = address_components.find((component: any) => component.types.includes("administrative_area_level_2"));
  return {
    country: country.long_name,
    administrative_area_level_1: administrative_area_level_1.long_name,
    administrative_area_level_2: administrative_area_level_2.long_name
  }
}