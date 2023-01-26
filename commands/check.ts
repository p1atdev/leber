import { InteractionResponseTypes } from "../deps.ts"
import { SlashCommand } from "../types/mod.ts"
import { WorkersClient } from "../workers.ts"

const check: SlashCommand = {
    command: {
        name: "check",
        description: "Check your session status",
    },
    action: async (bot, interaction) => {
        // ge user
        const workers = new WorkersClient()
        const result = await workers.getUser(interaction.user.id.toString())

        if (result.payload) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "You are logged in!",
                },
            })
        } else {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "You are not logged in!",
                },
            })
        }
    },
}

export default check
