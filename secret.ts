import { load } from "./deps.ts"

await load({ export: true })

export const Secret = {
    TEST_USER_MOBILE: Deno.env.get("TEST_USER_MOBILE"),
    TEST_USER_PASSWORD: Deno.env.get("TEST_USER_PASSWORD"),

    BOT_TOKEN: Deno.env.get("BOT_TOKEN"),

    CONFIG_URL: Deno.env.get("CONFIG_URL"),
    WORKERS_URL: Deno.env.get("WORKERS_URL"),

    AUTH_TOKEN: Deno.env.get("AUTH_TOKEN"),
}
