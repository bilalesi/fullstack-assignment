import { hc } from "hono/client";
import type ApiType from "../../../../api/src/rpc";

// TODO: use env variable for this one
// NOTE: left it in plaintext, just because it small app and no need to install other dependencies
// to better handling env vars (with types and autocomplete) 
const rpc = hc<ApiType>("http://localhost:3001");

export default rpc;
