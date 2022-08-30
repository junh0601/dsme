const apiKey = "d2aab5f5c4c9fe0fce6481b412cea172";

const lat = "34.8717056";
const lon = "128.7258112";
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${apiKey}`;

export const getOpenWeatherData = async () => {
  const json = await fetch(url).then((data) => data.json());
  return json;
};
