import './util/module-alias';
import { Server } from '@overnightjs/core';
import { json } from 'express';
import { ForecastController } from './controllers/forecast.controller';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    // this.app.use(json);
    // this.app.listen(3000);
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();

    this.addControllers([forecastController]);
  }
}
