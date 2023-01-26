import { load } from "./deps.ts"

await load({ export: true })

export const Secret = {
    TEST_USER_MOBILE: Deno.env.get("TEST_USER_MOBILE"),
    TEST_USER_PASSWORD: Deno.env.get("TEST_USER_PASSWORD"),

    USERS: Deno.env.get("USERS"),

    CONFIG_URL: Deno.env.get("CONFIG_URL"),
}
