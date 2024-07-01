import { test, expect, describe } from "bun:test";
import { app } from '@/index';

describe("test get full available fruits", () => {
    test("/GET fruits", async () => {
        const res = await app.request('/api/common/fruits', { method: 'get' }, {})
        expect(res.status).toBe(200)
        expect((await res.json()).data.length).toEqual(8);
    })
})