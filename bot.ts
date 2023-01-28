import { registerCommands } from "./commands.ts"
import { Bot, createBot, Intents, startBot, enableHelpersPlugin, BotWithHelpersPlugin } from "./deps.ts"
import { log } from "./log.ts"
import { Secret } from "./secret.ts"
import { slashCommands } from "./commands/mod.ts"

export class LeberBot {
    private readonly bot: BotWithHelpersPlugin<Bot>

    constructor() {
        this.bot = enableHelpersPlugin(
            createBot({
                token: Secret.BOT_TOKEN!,
                intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent | Intents.GuildMembers,
            })
        )
    }

    public setup = () => {
        registerCommands(this.bot, slashCommands)

        this.bot.events.ready = () => {
            log.success("Successfully connected to gateway")
        }
    }

    public sendDM = async (userId: string, content: string) => {
        await this.bot.helpers.sendDirectMessage(userId, content)
    }

    public start = async () => {
        this.setup()
        await startBot(this.bot)
    }
}
