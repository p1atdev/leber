import { InteractionResponseTypes } from "../deps.ts"
import { SlashCommand } from "../types/mod.ts"

const neko: SlashCommand = {
    command: {
        name: "neko",
        description: "neko",
    },
    action: async (bot, interaction) => {
        await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: "にゃーん",
            },
        })
    },
}

export default neko
