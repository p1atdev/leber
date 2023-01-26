import { LeberCLient } from "../client.ts"
import { ApplicationCommandOptionTypes, InteractionResponseTypes, datetime } from "../deps.ts"
import { getAnswerNumbers } from "../main.ts"
import { temperatureList, timeList } from "../static.ts"
import { SlashCommand } from "../types/mod.ts"
import { WorkersClient } from "../workers.ts"

const submit: SlashCommand = {
    command: {
        name: "submit",
        description: "Submit your temperature and health status. (Need to login first)",
        options: [
            {
                name: "temperature",
                description: "Your temperature",
                type: ApplicationCommandOptionTypes.String,
                required: true,
                choices: temperatureList.map((t) => ({
                    name: t,
                    value: t,
                })),
            },
            {
                name: "time",
                description: "Time of temperature measurement",
                type: ApplicationCommandOptionTypes.String,
                required: false,
                choices: timeList.map((t) => ({
                    name: t,
                    value: t,
                })),
            },
        ],
    },
    action: async (bot, interaction) => {
        if (!interaction.data) return
        const temperature = interaction.data.options?.find((o) => o.name === "temperature")?.value
        const time = interaction.data.options?.find((o) => o.name === "time")?.value

        if (!temperature) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Missing temperature",
                },
            })
            return
        }

        if (typeof temperature !== "string") {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Invalid temperature",
                },
            })
            return
        }

        if (typeof time !== "undefined" && typeof time !== "string") {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Invalid time",
                },
            })
            return
        }

        const timeText = time ? time : datetime().toZonedTime("Asia/Tokyo").format("HH:00")

        // ge user
        const workers = new WorkersClient()
        const result = await workers.getUser(interaction.user.id.toString())

        if (!result.payload) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "You are not logged in!",
                },
            })
            return
        }

        // login check
        const client = new LeberCLient()

        try {
            const questions = await client.getTemperatureQuestions(result.payload)
            const res = await client.submitTemperatures(
                getAnswerNumbers(questions, [temperature, timeText, "良い"]),
                result.payload
            )

            if (!res) {
                throw new Error("Failed to submit temperature")
            }

            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: `Successfully submitted your temperature and health status: ${temperature} at ${timeText}`,
                },
            })
        } catch (e) {
            console.error(e)
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: `Failed to submit your temperature: ${temperature} at ${timeText}`,
                },
            })
        }
    },
}

export default submit
