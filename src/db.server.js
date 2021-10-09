//@ts-check

import {Pool} from 'react-pg';
import credentials from '../credentials';

// Don't keep credentials in the source tree in a real app!
export const db = new Pool(credentials);
