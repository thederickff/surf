import './util/module-alias';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import * as database from '@src/database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  public async close(): Promise<void> {
    database.close();
  }

  private setupExpress(): void {
    // this.app.use(json);
    // this.app.listen(3000);
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();

    this.addControllers([forecastController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }
}
