import { AxiosStatic } from "axios";

export class StormGlass {

  readonly params = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection, windSpeed';
  readonly source = 'noaa';

  constructor(protected request: AxiosStatic) { }

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.params}&source=${this.source}&end=1592113802&lat=${lat}&lng=${lng}`
    );
  }
}