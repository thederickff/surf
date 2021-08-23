import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";
import { InternalError } from "@src/util/errors/internal-error";

export enum BeachPosition {
  N = 'N',
  W = 'W',
  E = 'E',
  S = 'S'
}

export interface Beach {
  name: string;
  user: string;
  lat: number;
  lng: number;
  position: BeachPosition;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
}

export interface BeachForecastNoTime extends Omit<BeachForecast, 'time'> {
}

export interface BeachForecastHour {
  time: string;
  forecast: BeachForecastNoTime[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class ForecastService {
  constructor(protected stormGlass: StormGlass) { }

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecastHour[]> {
    const forecasts: BeachForecast[] = [];
  
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedData = this.enrichedBeachData(points, beach);
  
        forecasts.push(... enrichedData);
      }
  
      return this.groupForecastByTime(forecasts);
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    return points.map(e => ({
      ... {
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ... e
    }));
  }

  private groupForecastByTime(forecasts: BeachForecast[]) {
    const map: { [time: string]: BeachForecastHour } = {};

    for (const forecast of forecasts) {
      if (!map[forecast.time]) {
        map[forecast.time] = {
          time: forecast.time,
          forecast: []
        };
      }

      const { time, ...exceptTime } = forecast;
      map[forecast.time].forecast.push(exceptTime);
    }
  
    return Object.keys(map).map(key => map[key] as BeachForecastHour);
  }
}