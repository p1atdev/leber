import { loadAppConfig } from "../config.ts"
import { assertExists } from "../deps.ts"

Deno.test("read config", () => {
    const config = loadAppConfig()
    assertExists(config)
    assertExists(config.time)
    assertExists(config.min_temp)
    assertExists(config.max_temp)
})
