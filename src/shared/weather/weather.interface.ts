export type WeatherResult = {
  city: string;
  cityName: string;
  icon: string;
  description: string;
  /** 現在溫度 */
  temp: number;
  /** 體感溫度 */
  feels_like: number;
  /** 最高溫度 */
  temp_max: number;
  /** 最低溫度 */
  temp_min: number;
  /** 大氣壓力 */
  pressure: number;
  /** 相對濕度 */
  humidity: number;
  /** 能見度 */
  visibility: number;
  /** 時間 */
  dt: number;
};

export type WeatherCityInfo = {
  key: string;
  name: string;
  lon: number;
  lat: number;
};
