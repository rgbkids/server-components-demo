//@ts-check

import {hydrateRoot} from 'react-dom';
import Root from './Root.client';

const initialCache = new Map();
hydrateRoot(
  document.getElementById('root'),
  <Root initialCache={initialCache} />
);
