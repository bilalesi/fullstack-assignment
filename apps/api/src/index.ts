import { Hono } from 'hono';

import { initDb } from '@/infrastructure/db';
import AppContext from './context';
import commonRoute from '@/routes/common';
const app = new Hono<AppContext>().basePath('/api');

app
  .use((c, next) => {
    initDb(c);
    return next();
  });

app.route('/common', commonRoute);

export default app
