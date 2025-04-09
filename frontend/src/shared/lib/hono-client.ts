import {hc} from 'hono/client';
import type {AppType} from '~/server';
import {getUrl} from '../utils';

const hcWithType = hc<AppType>(getUrl());
export const client = hcWithType.api.hono.v1;
