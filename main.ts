import { LeberClientOptions, LeberCLient } from "./client.ts"
import { loadAppConfig } from "./config.ts"
import { takeRandom } from "./utils.ts"

export const submitTemperature = async (options: LeberClientOptions) => {
    const client = new LeberCLient(options)

    await client.login()

    const questions = await client.getTemperatureQuestions()

    const config = loadAppConfig()

    const answers: number[] = []

    // temperature_selection
    const temperatures = questions.find((q) => q.que_basic_txt === "temperature_selection")?.options
    const minId = temperatures?.find((t) => t.answer_text === config.min_temp)?.id
    const maxId = temperatures?.find((t) => t.answer_text === config.max_temp)?.id

    if (minId && maxId) {
        answers.push(takeRandom(minId, maxId))
    } else {
        throw new Error("Invalid temperature range, maybe not found in the question options")
    }

    // time
    const times = questions.find((q) => q.que_basic_txt === "time_selection")?.options
    const time = times?.find((t) => t.answer_text === config.time)?.id

    if (time) {
        answers.push(time)
    } else {
        throw new Error("Invalid time, maybe not found in the question options")
    }

    // health check
    const healths = questions.find((q) => q.que_basic_txt === "health_check")?.options
    const health = healths?.find((t) => t.answer_text === config.health)?.id

    if (health) {
        answers.push(health)
    } else {
        throw new Error("Invalid health, maybe not found in the question options")
    }

    try {
        await client.submitTemperatures(answers)
    } catch (e) {
        console.error(e)
    }
}
