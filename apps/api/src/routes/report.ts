import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator as validator } from "@hono/zod-validator";
import { z } from "zod";
import { Office } from "@/types";
import AppContext from "@/context";

const SELECT_OFFICE_BY_ID_QUERY = "SELECT * FROM public.location WHERE id = $1";
const SELECT_MOST_FRUIT_QUERY = `
        SELECT f.name AS fruit, SUM(amount) AS consumption
        FROM public.ledger l
        JOIN public.fruit f ON l.fruit_id = f.id
        where l.amount < 0 AND location_id = $1 AND EXTRACT(YEAR FROM time) = $2
        GROUP BY fruit
        ORDER BY consumption asc
        LIMIT 1;
`;

const SELECT_FRUIT_CONSUMED = `
    SELECT SUM(amount) AS consumption
    FROM public.ledger l
    WHERE l.amount < 0 AND location_id = $1 AND EXTRACT(YEAR FROM time) = $2;
`;

/**
 * For the purpose of the test (to make it not over engineered)
 * I kept the business logic in the "controller" 
 * usually I split it to repository (which used to query/mutate db) and use-cases
 */
const reportRoute = new Hono<AppContext>()
    .get('/top_fruit',
        validator(
            'query',
            z.object({
                office: z.string().transform(val => Number(val)),
                year: z.string().transform(val => Number(val)),
            })
        ), async (c) => {
            const db = c.get('db');
            await db.connect();
            const { office, year } = c.req.valid('query');

            // TODO: this business logic should be refactored 
            try {
                const officeResult = await db.query<Office>(SELECT_OFFICE_BY_ID_QUERY, [office]);
                if (officeResult.rows.length === 0) {
                    // TODO: after refactoring the use case
                    // TODO: should not handle http exception (Error) here
                    // TODO: raise a custom error as EntityNotFound
                    throw new HTTPException(400, { message: "Office not found" });
                }
                const officeRow = officeResult.rows[0];
                const result = await db.query<{ fruit: string; consumption: number }>(SELECT_MOST_FRUIT_QUERY, [office, year])

                if (result.rows.length === 0) {
                    return c.json({
                        message: 'No data found for this combination',
                        data: null,
                    }, 200);
                } else {
                    const topFruit = result.rows[0];
                    return c.json({
                        message: `
                            In ${officeRow.name} during ${year}, 
                            the most eaten fruit was ${topFruit.fruit} with a total of ${topFruit.consumption} pieces.
                        `,
                        data: {
                            fruit: topFruit.fruit,
                            consumption: Math.abs(topFruit.consumption),
                        }
                    }, 200);
                }
            } catch (error) {
                if (error instanceof HTTPException) throw error;
                throw new HTTPException(500, {
                    message: "Internal server error", cause: error
                });
            } finally {
                await db.end();
            }
        })
    .get('/avg_consumption',
        validator(
            'query',
            z.object({
                office: z.string().transform(val => Number(val)),
                year: z.string().transform(val => Number(val)),
            })
        ), async (c) => {
            const db = c.get('db');
            await db.connect();
            const { office, year } = c.req.valid('query');
            // TODO: business logic should be refactored 
            try {
                const officeResult = await db.query<Office>(SELECT_OFFICE_BY_ID_QUERY, [office]);
                if (officeResult.rows.length === 0) {
                    // TODO: after refactoring the use case
                    // TODO: should not handle http exception (Error) here
                    // TODO: raise a custom error as EntityNotFound
                    throw new HTTPException(400, { message: "Office not found" });
                }
                const officeRow = officeResult.rows[0];

                const result = await db.query<{ consumption: number }>(SELECT_FRUIT_CONSUMED, [office, year])

                if (result.rows.length === 0) {
                    return c.json({
                        message: 'No data found for this combination',
                        data: null,
                    }, 200);
                } else {
                    const totalAmount = Math.abs(result.rows[0].consumption);
                    const average = totalAmount / officeRow.headcount || 0;

                    return c.json({
                        message: `
                            In ${officeRow.name} during ${year}, 
                            on average, each person consumed approximately ${average.toFixed(2)} pieces of fruit.
                        `,
                        data: {
                            year,
                            office: officeRow.name,
                            avgConsumption: average,
                        }
                    }, 200);
                }
            } catch (error) {
                if (error instanceof HTTPException) throw error;
                throw new HTTPException(500, {
                    message: "Internal server error", cause: error
                });
            } finally {
                await db.end();
            }
        });


export default reportRoute;