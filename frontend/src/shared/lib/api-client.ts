import {env} from '../../../env.mjs';
import {getUrl} from '../utils';
import {HttpClient} from './http-client';

// API clients
const ApiClient = {
  Spring: new HttpClient(env.SPRING_API),
  Hono: new HttpClient(`${getUrl()}/api/hono/v1`),
};

export default ApiClient;
