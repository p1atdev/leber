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
                    embeds: [
                        {
                            title: "Failed to submit temperature",
                            description: "Missing temperature",
                            color: 0xff0000,
                        },
                    ],
                },
            })
            return
        }

        if (typeof temperature !== "string") {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: "Failed to submit temperature",
                            description: "Invalid temperature",
                            color: 0xff0000,
                        },
                    ],
                },
            })
            return
        }

        if (typeof time !== "undefined" && typeof time !== "string") {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: "Failed to submit temperature",
                            description: "Invalid time",
                            color: 0xff0000,
                        },
                    ],
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
                    embeds: [
                        {
                            title: "You are not logged in!",
                            description: "Please login first",
                            color: 0xff0000,
                        },
                    ],
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
                    embeds: [
                        {
                            title: "Successfully submitted your temperature and health status",
                            fields: [
                                {
                                    name: "temperature",
                                    value: temperature,
                                },
                                {
                                    name: "time",
                                    value: timeText,
                                },
                            ],
                            color: 0x00ff00,
                        },
                    ],
                },
            })
        } catch (e) {
            console.error(e)
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: "Failed to submit your temperature",
                            fields: [
                                {
                                    name: "temperature",
                                    value: temperature,
                                },
                                {
                                    name: "time",
                                    value: timeText,
                                },
                                {
                                    name: "error",
                                    value: e.message,
                                },
                            ],
                            color: 0xff0000,
                        },
                    ],
                },
            })
        }
    },
}

export default submit
