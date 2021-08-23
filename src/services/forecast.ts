import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";

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

export class ForecastService {
  constructor(protected stormGlass: StormGlass) { }

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSource: BeachForecast[] = [];

    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedData = points.map(e => ({ ... {
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        }, ... e
      }));

      pointsWithCorrectSource.push(... enrichedData);
    }
    
    return pointsWithCorrectSource;
  }
}