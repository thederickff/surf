export {};

import Global = NodeJS.Global;

export interface CustomGlobal extends Global {
  testRequest: import('supertest').SuperTest<import('supertest').Test>;
}

declare global {
  module NodeJS {
    interface Global {}
  }
}
