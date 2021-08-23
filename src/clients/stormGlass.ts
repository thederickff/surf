import { InternalError } from "@src/util/errors/internal-error";
import { AxiosStatic } from "axios";
import config, { IConfig } from 'config';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  
  constructor(message: string) {
    const internalMessage = 'Unexpected error when trying to communicate with stormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

const stormGlassResourceConfig: IConfig = config.get('App.resources.StormGlass');

export class StormGlass {
  readonly params = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection, windSpeed';
  readonly source = 'noaa';
  
  constructor(protected request: AxiosStatic) { }
  
  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    try {
      const res = await this.request.get<StormGlassForecastResponse>(
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${this.params}&source=${this.source}&end=1592113802&lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get('apiToken')
          }
        }
      );
        
      return this.normalizeResponse(res.data);
    } catch (error) {
      if (error.response && error.response.status) {
        throw new StormGlassResponseError(`Error: ${JSON.stringify(error.response.data)} Code ${error.response.status}`);
      } else {
        throw new ClientRequestError(error.message);
      }
    }
  }

  private normalizeResponse(res: StormGlassForecastResponse): ForecastPoint[] {
    return res.hours.filter(this.isValidPoint.bind(this)).map(hour => {
      return {
        time: hour.time,
        swellDirection: hour.swellDirection[this.source],
        swellHeight: hour.swellHeight[this.source],
        swellPeriod: hour.swellPeriod[this.source],
        waveDirection: hour.waveDirection[this.source],
        waveHeight: hour.waveHeight[this.source],
        windDirection: hour.windDirection[this.source],
        windSpeed: hour.windSpeed[this.source]
      };
    })
  }


  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(point.time &&
      point.swellDirection?.[this.source] &&
      point.swellHeight?.[this.source] &&
      point.swellPeriod?.[this.source] &&
      point.waveDirection?.[this.source] &&
      point.waveHeight?.[this.source] &&
      point.windDirection?.[this.source] &&
      point.windSpeed?.[this.source]
    );
  }
}