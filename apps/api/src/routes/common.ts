import { Hono } from "hono";
import { Office, Fruit } from "@/types";
import { HTTPException } from "hono/http-exception";
import AppContext from "@/context";


const SELECT_OFFICES_QUERY = 'SELECT * FROM public.location';

export const commonController = new Hono<AppContext>()
    .get('/offices', async (c) => {
        const db = c.get('db');
        try {
            await db.connect();
            const results = await db.query<Office>(SELECT_OFFICES_QUERY);
            return c.json({
                message: "List of offices fetched successfully",
                data: results.rows,
            }, 200);
        } catch (error) {
            throw new HTTPException(500, {
                message: "Internal server error", cause: error
            });
        } finally {
            await db.end();
        }
    });
