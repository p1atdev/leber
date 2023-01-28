import { Cron } from "./deps.ts"
import { loadAppConfig } from "./config.ts"
import { submitTemperature } from "./main.ts"
import { LeberBot } from "./bot.ts"
import { WorkersClient } from "./workers.ts"
import { log } from "./log.ts"
import { Secret } from "./secret.ts"

const config = await loadAppConfig()

const bot = new LeberBot()
bot.setup()

await bot.sendDM(Secret.NOTIFY_ID!, "Bot started")

const _scheduler: Cron = new Cron("0 22 * * 1-6", async () => {
    const workers = new WorkersClient()
    const users = await workers.getUsers()

    for (const id of users) {
        try {
            const user = await workers.getUser(id)
            await submitTemperature(user.payload, config)

            // send dm
            await bot.sendDM(user.id, "已完成每日健康打卡")
            log.info(`${user.id} 已完成每日健康打卡`)
        } catch (e) {
            log.error(e)
        }
    }
})

await bot.start()
