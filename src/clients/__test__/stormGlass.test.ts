import { StormGlass } from '@src/clients/stormGlass';
import stormGlassFetchPointsGet from '@test/fixtures/storm_glass_fetch_points_get.json';
import stormGlassFetchPointsReturn from '@test/fixtures/storm_glass_fetch_points_return.json';
import * as HTTPUtil from '@src/util/request';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const lat = -33.79;
  const lng = 151.28;
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized forecast from the stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassFetchPointsGet } as HTTPUtil.Response);
    
    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    
    expect(response).toEqual(stormGlassFetchPointsReturn);
  });
  
  it('should exlude incomplete data points', async () => {
    mockedRequest.get.mockResolvedValue({
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
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate with stormGlass: Network Error'
    )
  });

  it('should get an StormGlassResponseError when the stormGlass service responds with error', async () => {
    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] }
      }
    });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      `Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code 429`
    )
  });
});