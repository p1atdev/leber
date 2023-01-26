import { Cron } from "./deps.ts"
import { loadAppConfig } from "./config.ts"
import { submitTemperature } from "./main.ts"
import { Secret } from "./secret.ts"

const config = await loadAppConfig()

const _scheduler: Cron = new Cron("* * * * *", () => {
    console.log(new Date())
    console.log(config)
    console.log("Secret:", Secret)
})
