import { LeberCLient } from "../client.ts"
import { ApplicationCommandOptionTypes, InteractionResponseTypes } from "../deps.ts"
import { SlashCommand } from "../types/mod.ts"
import { WorkersClient } from "../workers.ts"

const logout: SlashCommand = {
    command: {
        name: "logout",
        description: "Logout and revoke your session",
    },
    action: async (bot, interaction) => {
        try {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Logged out successfully!",
                },
            })

            // update database
            const workers = new WorkersClient()
            await workers.deleteUser(interaction.user.id.toString())
        } catch (_e) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Failed to logout. Please try again later or contact the developer.",
                },
            })
        }
    },
}

export default logout
