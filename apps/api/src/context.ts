import { Client } from "pg";
import { Env } from "./env";

type Variables = {
    db: Client;
};

export default interface AppContext {
    Bindings: Env;
    Variables: Variables;
}
