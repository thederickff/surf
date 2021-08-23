import { SetupServer } from '@src/server';
import supertest from 'supertest';
import { CustomGlobal } from './globals';
declare const global: CustomGlobal;

let server: SetupServer;

beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.app);
});

afterAll(async () => {
  await server.close();
});