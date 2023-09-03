import { contract } from "./contract.ts";
import { initClient } from "@ts-rest/core";

export const apiClient = initClient(contract, {
    // @ts-ignore
    baseUrl: import.meta.env.VITE_API_URL ?? '',
    baseHeaders: {},
});
