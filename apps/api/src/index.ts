import { Hono } from 'hono';
import { initDb } from '@/infrastructure/db';
import commonRoute from '@/routes/common';
import reportRoute from '@/routes/report';
import AppContext from '@/context';

const app = new Hono<AppContext>().basePath('/api');

app
  .use((c, next) => {
    initDb(c);
    return next();
  });


export const routes = app
  .route('/common', commonRoute)
  .route('/report', reportRoute);

export default {
  port: 3001, // TODO: set it in env variable (put it here for the sake of the test)
  fetch: app.fetch,
}

