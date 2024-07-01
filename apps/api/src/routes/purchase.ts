import { Hono } from "hono";
import { zValidator as validator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { Fruit, Ledger } from "@/types";
import AppContext from "@/context";

type FruitWithCalories = Fruit & {
    calories: number;
}

type FruitObject = FruitWithCalories & {
    quantity: number;
}

const FRUITYVICE_API = "https://www.fruityvice.com/api/fruit";

async function getFruitCalories(fruit: Fruit): Promise<FruitWithCalories> {
    try {
        const response = await fetch(`${FRUITYVICE_API}/${fruit.fruityvice_id}`);
        const data = await response.json();
        return {
            ...fruit,
            calories: data?.nutritions?.calories || 0 // 0 calories if not found
        };
    } catch (error) {
        return {
            ...fruit,
            calories: 0 // Default to 0 calories on error
        };
    }
}

const CALORIES_LIMIT = 1000;
const SELECT_FRUIT_QUERY = "SELECT * FROM public.fruit WHERE id = $1";

const purchaseRoute = new Hono<AppContext>()
    .post('/',
        validator(
            'form',
            z.object({
                office: z
                    .string()
                    .transform(val => Number(val)),
                fruits: z
                    .string()
                    .refine(val => {
                        try {
                            const obj = JSON.parse(val);
                            if (Array.isArray(obj) && !!obj.length) {
                                return true;
                            }
                            return false;
                        } catch (_) {
                            return false;
                        }
                    })
                    .transform(val => JSON.parse(val))
                    .pipe(
                        z.array(
                            z.object(
                                {
                                    id: z.string(),
                                    name: z.string(),
                                    quantity: z.number(),
                                },
                            )
                        )
                    )
            })
        ),
        async (c) => {
            const db = c.get('db');
            try {
                await db.connect();
                const { fruits, office } = c.req.valid('form');
                let totalCalories = 0;
                let fruitList: Array<FruitObject> = [];
                for (const { id, quantity } of fruits) {
                    const fruitsResult = await db.query<Fruit>(SELECT_FRUIT_QUERY, [id]);
                    const row = fruitsResult.rows[0];
                    const fruitWithCalories = await getFruitCalories(row);
                    totalCalories += fruitWithCalories.calories * quantity;

                    // fail early instead of request all the calories concurrently using `promise.allSettled`
                    if (totalCalories > CALORIES_LIMIT) {
                        throw new HTTPException(400, {
                            message: `Total calories exceed the ${CALORIES_LIMIT}kcal limit`
                        });
                    }

                    fruitList.push({
                        ...fruitWithCalories,
                        quantity,
                    });
                }

                const values = fruitList.map(row => `(${row.id}, ${office}, ${row.quantity}, CURRENT_TIMESTAMP)`);
                const PURCHASE_MUTATION = `INSERT INTO public.ledger (fruit_id, location_id, amount, time) VALUES ${values.join(',')}`
                const result = await db.query<Ledger>(PURCHASE_MUTATION);

                return c.json({
                    message: "Purchase successful!",
                    data: {
                        totalCalories,
                        totalFruit: result.rows.length,
                    }
                }, 200);
            } catch (error) {
                if(error instanceof HTTPException) throw error;
                throw new HTTPException(500, {
                    message: "Internal server error", cause: error
                });
            } finally {
                await db.end();
            }
        });

export default purchaseRoute;