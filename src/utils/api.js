const cache = new Map();

export async function fetchWeatherData(lat, lon, start, end, variable) {
  const key = `${lat}-${lon}-${start}-${end}-${variable}`;
  if (cache.has(key)) return cache.get(key);

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=${variable}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const values = data?.hourly?.[variable] || [];
    cache.set(key, values);
    return values;
  } catch (error) {
    console.error("API fetch failed:", error);
    return [];
  }
}
