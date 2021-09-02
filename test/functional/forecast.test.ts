import { Beach, BeachPosition } from '@src/models/beach';
import stormGlassFetchPointsGet from '@test/fixtures/storm_glass_fetch_points_get.json';
import apiForecastResponse1Beach from '@test/fixtures/api_forecast_response_1_beach.json';
import nock from 'nock';
import { CustomGlobal } from '../globals';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
declare const global: CustomGlobal;

describe('Beach forecast functional tests', () => {

  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456'
  };

  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});

    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());

    const defaultBeach = {
      lat: -33.79,
      lng: 151.28,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id
    };

    const beach = new Beach(defaultBeach);
    await beach.save();
  });

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {"encodedQueryParams":true})
      .get('/v2/weather/point')
      .query({
        params: "swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed",
        source: "noaa",
        end: "1592113802",
        lat: "-33.79",
        lng: "151.28"
      })
      .reply(200, stormGlassFetchPointsGet);

    const { body, status } = await global.testRequest.get('/forecast').set({
      authorization: `Bearer ${token}`
    });
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1Beach);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {"encodedQueryParams":true})
      .get('/v2/weather/point')
      .query({
        params: "swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed",
        source: "noaa",
        end: "1592113802",
        lat: "-33.79",
        lng: "151.28"
      })
      .replyWithError('Something went wrong');

    const { body, status } = await global.testRequest.get('/forecast').set({
      authorization: `Bearer ${token}`
    });
    expect(status).toBe(500);
    expect(body).toEqual({ error: 'Something went wrong' });
  });
});
