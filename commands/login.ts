import { LeberCLient } from "../client.ts"
import { ApplicationCommandOptionTypes, InteractionResponseTypes } from "../deps.ts"
import { SlashCommand } from "../types/mod.ts"
import { WorkersClient } from "../workers.ts"

const login: SlashCommand = {
    command: {
        name: "login",
        description: "Login to LEBER",
        options: [
            {
                name: "phone_number",
                description: "Your phone number",
                type: ApplicationCommandOptionTypes.String,
                required: true,
            },
            {
                name: "password",
                description: "Your password",
                type: ApplicationCommandOptionTypes.String,
                required: true,
            },
        ],
    },
    action: async (bot, interaction) => {
        if (!interaction.data) return
        const phoneNumber = interaction.data.options?.find((o) => o.name === "phone_number")?.value
        const password = interaction.data.options?.find((o) => o.name === "password")?.value

        if (!phoneNumber || !password) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Missing phone number or password",
                },
            })
            return
        }

        if (typeof phoneNumber !== "string" || typeof password !== "string") {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Invalid phone number or password",
                },
            })
            return
        }

        // login check
        const client = new LeberCLient()

        try {
            const user = await client.login({
                mobile: phoneNumber,
                password,
            })
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Logged in successfully!",
                },
            })

            // save to db
            const workers = new WorkersClient()
            await workers.createUser({
                id: interaction.user.id.toString(),
                payload: user,
            })
        } catch (_e) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Failed to login. Invalid phone number or password",
                },
            })
        }
    },
}

export default login
