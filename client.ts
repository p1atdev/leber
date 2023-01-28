import { LeberLogin, LeberResponse, LeberTemperatureQuestion } from "./types/mod.ts"
import { LeberUser } from "./user.ts"
import { mobileToUser } from "./utils.ts"

export interface LeberLoginOptions {
    mobile: string
    password: string
}

export class LeberCLient {
    private readonly host = "https://api.leber11.com"
    private user: LeberUser | null = null

    public login = async (options: LeberLoginOptions) => {
        const body = {
            login: mobileToUser(options.mobile),
            password: options.password,
        }

        const url = new URL("/v9//users/sign_in", this.host)

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const json: LeberResponse<LeberLogin> = await res.json()

        if (json.status !== 1) {
            throw new Error(`Login failed. user: ${options.mobile}, ${json.message}`)
        }

        this.user = new LeberUser(json.result)

        return this.user
    }

    public getTemperatureQuestions = async (user?: LeberUser, languageCode = "ja") => {
        const session = user || this.user
        if (!session) {
            throw new Error("Not logged in")
        }

        const url = new URL("/v9//temperature_questions", this.host)
        url.searchParams.set("language_code", languageCode)
        url.searchParams.set("patient_id", session.patient_id.toString())

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "X-USER-TOKEN": session.authentication_token,
            },
        })

        const json: LeberResponse<LeberTemperatureQuestion[]> = await res.json()

        if (json.status !== 1) {
            throw new Error(`Failed to get temperature questions: ${json.message}`)
        }

        return json.result
    }

    public submitTemperatures = async (answers: number[], user?: LeberUser) => {
        const session = user || this.user
        if (!session) {
            throw new Error("Not logged in")
        }

        const body = {
            company_id: session.company_id,
            temp_answers_attributes: answers.map((answer, index) => ({
                additional_comment: "",
                answer_id: [answer],
                question_id: index + 1,
                question_number: index + 1,
            })),
        }

        const url = new URL(`/v9//patients/${session.patient_id}/submit_temperatures`, this.host)

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "X-USER-TOKEN": session.authentication_token,
            },
        })

        const json: LeberResponse<null> = await res.json()

        if (json.status !== 1) {
            throw new Error(`Failed to submit temperatures: ${json.message}`)
        }

        return true
    }
}
