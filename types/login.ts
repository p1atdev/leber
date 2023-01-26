export interface LeberLogin {
    user: {
        id: number
        authentication_token: string
        patients: {
            id: number
            company_id: number
        }[]
    }
}
