import { Hono } from 'hono';

import { initDb } from '@/infrastructure/db';
import AppContext from './context';

const app = new Hono<AppContext>().basePath('/api');

app
  .use((c, next) => {
    initDb(c);
    return next();
  });

export default app
