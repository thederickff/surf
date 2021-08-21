import { SetupServer } from '@src/server';
import supertest from 'supertest';
import { CustomGlobal } from './globals';
declare const global: CustomGlobal;

beforeAll(() => {
  const server = new SetupServer();
  server.init();

  global.testRequest = supertest(server.app);
});
