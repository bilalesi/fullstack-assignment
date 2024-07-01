export type Fruit = {
    id: number;
    name: string;
    fruityvice_id: number;
}

export type Ledger = {
    fruit_id: number;
    location_id: number;
    amount: number;
    time: Date;
}

export type Office = {
    id: number;
    name: string;
    headcount: number;
}