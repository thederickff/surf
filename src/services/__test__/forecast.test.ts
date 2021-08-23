import { StormGlass } from '@src/clients/stormGlass';
import stormGlassFetchPointsReturn from '@test/fixtures/storm_glass_fetch_points_return.json';
import { Beach, BeachPosition, ForecastService } from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast service', () => {
  StormGlass.prototype.fetchPoints = jest
  .fn()
  .mockResolvedValue(stormGlassFetchPointsReturn);

  it('should return the forecast for a list of beaches', async () => {

    const beaches: Beach[] = [
      {
        lat: -33.79,
        lng: 151.28,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id'
      }
    ];

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.79,
            lng: 151.28,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100
          }
        ]
      },
      {
        time: "2020-04-26T01:00:00+00:00",
        forecast: [
          {
            lat: -33.79,
            lng: 151.28,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      },
      {
        time: "2020-04-26T02:00:00+00:00",
        forecast: [
          {
            lat: -33.79,
            lng: 151.28,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100
          }
        ]
      }
    ];

    const forecast = new ForecastService(new StormGlass());
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });
});