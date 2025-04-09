'use client';

import {isServer} from '@tanstack/react-query';
import {type PropsWithChildren, useState} from 'react';
import {Provider} from 'react-redux';
import {AppStore, makeStore} from '../redux/store';

export default function ReduxProvider({children}: PropsWithChildren) {
  const [store] = useState(() => inititlizeStore());
  return <Provider store={store}>{children}</Provider>;
}

const inititlizeStore = () => {
  let store: AppStore | undefined = undefined;

  if (isServer) {
    store = makeStore();
    return store;
  }

  if (!store) {
    store = makeStore();
  }
  return store;
};
