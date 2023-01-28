import { LeberCLient } from "../client.ts"
import { ApplicationCommandOptionTypes, InteractionResponseTypes, Embed } from "../deps.ts"
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

        await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.DeferredChannelMessageWithSource,
            data: {
                flags: 1 << 6,
            },
        })

        if (!phoneNumber || !password) {
            await bot.helpers.editOriginalInteractionResponse(interaction.token, {
                embeds: [
                    {
                        title: "Failed to login",
                        description: "Missing phone number or password",
                        color: 0xff0000,
                    },
                ],
            })
            return
        }

        if (typeof phoneNumber !== "string" || typeof password !== "string") {
            await bot.helpers.editOriginalInteractionResponse(interaction.token, {
                embeds: [
                    {
                        title: "Failed to login",
                        description: "Invalid phone number or password",
                        color: 0xff0000,
                    },
                ],
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

            await bot.helpers.editOriginalInteractionResponse(interaction.token, {
                embeds: [
                    {
                        title: "Logged in successfully!",
                        color: 0x00ff00,
                    },
                ],
            })

            // save to db
            const workers = new WorkersClient()
            await workers.createUser({
                id: interaction.user.id.toString(),
                payload: user,
            })
        } catch (_e) {
            await bot.helpers.editOriginalInteractionResponse(interaction.token, {
                embeds: [
                    {
                        title: "Failed to login",
                        description: "Invalid phone number or password",
                        color: 0xff0000,
                    },
                ],
            })
        }
    },
}

export default login
