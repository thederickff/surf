import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassFetchPointsGet from '@test/fixtures/storm_glass_fetch_points_get.json';
import stormGlassFetchPointsReturn from '@test/fixtures/storm_glass_fetch_points_return.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the stormGlass service', async () => {
    const lat = -33.79;
    const lng = 151.28;

    axios.get = jest.fn().mockResolvedValue(stormGlassFetchPointsGet);

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassFetchPointsReturn);
  });
});