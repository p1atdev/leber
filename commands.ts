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

    log.info("Registered handling interactions")

    // bot.activeGuildIds.forEach(async (guildId) => {
    //     console.log("guildId", guildId)
    // })

    const current = await bot.helpers.getGlobalApplicationCommands()
    console.log("current", current)
    // current.forEach(async (command) => {
    //     // if (global) {
    //     // await bot.helpers.deleteGlobalApplicationCommand(command.id)
    //     // } else {
    //     console.log("command.id", command.id)
    //     // await bot.helpers.deleteGuildApplicationCommand(command.id, "780053991853129729")
    //     // }
    // })

    // await Promise.all(
    commands.map(async (command) => {
        // if (global) {

        log.info(`Registering command ${command.command.name}`)
        await bot.helpers.createGlobalApplicationCommand(command.command)
        log.info(`Command ${command.command.name} registered in global`)

        // } else {
        // await bot.helpers.createGuildApplicationCommand(command.command, "")
        // log.info(`Command ${command.command.name} registered in guild`)
        // }
    })
    // )

    // if (global) {
    // log.info("Registering commands globally")
    await bot.helpers.upsertGlobalApplicationCommands(commands.map((c) => c.command))
    log.info("Commands upserted in global")
    // } else {
    // await bot.helpers.upsertGuildApplicationCommands(
    //     "",
    //     commands.map((c) => c.command)
    // )

    // log.info("Registering commands in guild")
    // }

    console.log(await bot.helpers.getGlobalApplicationCommands())
}
