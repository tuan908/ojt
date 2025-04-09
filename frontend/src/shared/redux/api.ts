import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query';
import {getUrl} from '../utils';

export const baseApi = createApi({
  reducerPath: 'API',
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
  }),
  endpoints: () => ({}),
});
