import { Context } from "hono";
import { Client } from 'pg';
import { env } from "hono/adapter";
import AppContext from "@/context";

export const initDb = (c: Context<AppContext>) => {
    let db = c.get("db");
    let envs = env(c);
    if (!db) {
        // NOTE: using "or" for envs here just to not use ".env" file
        const client = new Client({
            host: envs.PGHOST || 'localhost',
            port: envs.PGPORT || 5432,
            user: envs.PGUSER || 'candidate',
            password: envs.PGPASSWORD || 'candidate',
            database: envs.PGDATABASE || 'fruity'
        });
        c.set('db', client);
    }
    return db;
};