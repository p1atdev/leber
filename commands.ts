import { Bot } from "./deps.ts"
import { log } from "./log.ts"
import { SlashCommand } from "./types/command.ts"

export const registerCommands = async (
    bot: Bot,
    commands: SlashCommand[]
    // guildId: string,
    // global: boolean
) => {
    bot.events.interactionCreate = async (b, interaction) => {
        const name = interaction.data?.name
        if (!name) return

        const command = commands.find((c) => c.command.name === name)
        if (!command) return

        const action = command.action
        if (!action) return

        await action(b, interaction)
    }

    const current = await bot.helpers.getGlobalApplicationCommands()
    current.forEach(async (command) => {
        // if (global) {
        await bot.helpers.deleteGlobalApplicationCommand(command.id)
        // } else {
        //     await bot.helpers.deleteGuildApplicationCommand(command.id, guildId)
        // }
    })

    await Promise.all(
        commands.map(async (command) => {
            // if (global) {

            log.info(`Registering command ${command.command.name}`)
            await bot.helpers.createGlobalApplicationCommand(command.command)

            // } else {
            // await bot.helpers.createGuildApplicationCommand(command.command, "")
            // }
        })
    )

    // if (global) {
    log.info("Registering commands globally")
    await bot.helpers.upsertGlobalApplicationCommands(commands.map((c) => c.command))
    // } else {
    // await bot.helpers.upsertGuildApplicationCommands(
    //     "",
    //     commands.map((c) => c.command)
    // )

    log.info("Registering commands in guild")
    // }

    console.log(await bot.helpers.getGlobalApplicationCommands())
}
