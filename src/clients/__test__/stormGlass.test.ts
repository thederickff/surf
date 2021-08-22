import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassFetchPointsGet from '@test/fixtures/storm_glass_fetch_points_get.json';
import stormGlassFetchPointsReturn from '@test/fixtures/storm_glass_fetch_points_return.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const lat = -33.79;
  const lng = 151.28;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the stormGlass service', async () => {
    mockedAxios.get.mockResolvedValue({ data: stormGlassFetchPointsGet });
    
    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    
    expect(response).toEqual(stormGlassFetchPointsReturn);
  });
  
  it('should exlude incomplete data points', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        hours: [
          {
            windDirection: {
              noaa: 300
            },
            time: '2020-04-26T00:00:00+00:00'
          }
        ]
      }
    });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from stormGlass service when the request fail before reaching the service', async () => {

    
    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate with stormGlass: Network Error'
    )
  });

  it('should get an StormGlassResponseError when the stormGlass service responds with error', async () => {
    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] }
      }
    });

    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      `Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code 429`
    )
  });
});