export interface LeberTemperatureQuestion {
    id: number
    que_basic_txt: string
    question_number: number
    allow_comment: boolean
    question_text: string
    option_type: string
    placeholder_key: null | string
    placeholder_comment: null | string
    options: TemperatureQuestionOption[]
}

export interface TemperatureQuestionOption {
    id: number
    answer_text: string
}
