import { InteractionResponseTypes } from "../deps.ts"
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
                    embeds: [
                        {
                            title: "Logged out successfully!",
                            color: 0x00ff00,
                        },
                    ],
                },
            })

            // update database
            const workers = new WorkersClient()
            await workers.deleteUser(interaction.user.id.toString())
        } catch (_e) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: "Failed to logout",
                            description: "Please try again later or contact the developer.",
                            color: 0xff0000,
                        },
                    ],
                },
            })
        }
    },
}

export default logout
