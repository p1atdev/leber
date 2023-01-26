import { LeberLoginOptions, LeberCLient } from "./client.ts"
import { AppConfig } from "./types/mod.ts"
import { LeberTemperatureQuestion } from "./types/temperatureQuestions.ts"
import { LeberUser } from "./user.ts"
import { takeRandom } from "./utils.ts"

export const getAnswerNumbers = (questions: LeberTemperatureQuestion[], answers: string[]) => {
    if (questions.length < answers.length) {
        throw new Error("Invalid answers")
    }

    const answerNumbers: number[] = []

    for (const [i, answer] of answers.entries()) {
        const question = questions[i]
        const answerNumber = question.options.find((a) => a.answer_text === answer)?.id
        if (!answerNumber) {
            throw new Error("Invalid answer: No answer found")
        }
        answerNumbers.push(answerNumber)
    }

    return answerNumbers
}

export const submitTemperature = async (user: LeberUser, config: AppConfig) => {
    const client = new LeberCLient()

    const questions = await client.getTemperatureQuestions(user)

    const minTempNum = parseFloat(config.min_temp.replace("°C", ""))
    const maxTempNum = parseFloat(config.max_temp.replace("°C", ""))

    if (isNaN(minTempNum) || isNaN(maxTempNum)) {
        throw new Error("Invalid min_temp or max_temp")
    }

    // get random temperature
    const temp = Math.floor(takeRandom(minTempNum, maxTempNum) * 10) / 10

    const answers: number[] = getAnswerNumbers(questions, [temp.toString(), config.time, config.health])

    try {
        await client.submitTemperatures(answers, user)
    } catch (e) {
        console.error(e)
    }
}
