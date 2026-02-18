/** getWeather API 응답의 예보 단일 항목 */
export interface WeatherForecastItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string | number;
  nx: number;
  ny: number;
}

/** getWeather API 응답의 location */
export interface WeatherResultLocation {
  lat: number;
  lon: number;
  nx: number;
  ny: number;
  pointIndex: number;
  name: string;
  distance: number;
  arriveTime: string;
  breakTime: string;
  departureTime: string;
  apiTime: string;
}

/** getWeather API 응답의 weather (필터링된 예보) */
export interface WeatherResultForecast {
  filteredPOP: WeatherForecastItem[];
  filteredPTY: WeatherForecastItem[];
  filteredPCP: WeatherForecastItem[];
  filteredSKY: WeatherForecastItem[];
  filteredTMP: WeatherForecastItem[];
  fcstDateResults: WeatherForecastItem[];
}

/** getWeather API 응답의 단일 항목 (location + weather) */
export interface WeatherResultItem {
  location: WeatherResultLocation;
  weather: WeatherResultForecast;
}

/** getWeather API 전체 응답 */
export type GetWeatherResponse = WeatherResultItem[];
