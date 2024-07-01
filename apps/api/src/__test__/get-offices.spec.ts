import { test, expect, describe } from "bun:test";
import { app } from '@/index';

describe("test get all locations", () => {
    test("/GET offices", async () => {
        const res = await app.request('/api/common/offices', { method: 'get' }, {})
        expect(res.status).toBe(200)
        expect((await res.json()).data.length).toEqual(4);
    })
})