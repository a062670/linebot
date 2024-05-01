import { Injectable } from '@nestjs/common';
import { cityInfoList } from './config/weather.config';
import { WeatherResult } from './weather.interface';

@Injectable()
export class WeatherService {
  async getWeather(cityName: string): Promise<WeatherResult | null> {
    const city =
      cityInfoList.find((city) => city.name === cityName)?.key || 'Taipei';
    const resp = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`,
    );
    const data = await resp.json();
    if (data.cod !== 200) {
      return null;
    }
    return {
      city: city,
      cityName: cityName,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_max: data.main.temp_max,
      temp_min: data.main.temp_min,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      visibility: data.visibility,
      dt: data.dt,
    } as WeatherResult;
  }
}
export { WeatherResult };
