import './util/module-alias';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import * as database from '@src/database';
import { BeachController } from './controllers/beach';
import { json } from 'express';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.info(`Server listening to port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    database.close();
  }

  private setupExpress(): void {
    this.app.use(json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachController = new BeachController();
    this.addControllers([forecastController, beachController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }
}
