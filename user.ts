import { LeberLogin } from "./types/mod.ts"

export interface LeberUser {
    id: number
    authentication_token: string
    patient_id: number
    company_id: number
}

export class LeberUser {
    constructor(login: LeberLogin) {
        this.id = login.user.id
        this.authentication_token = login.user.authentication_token
        this.patient_id = login.user.patients[0].id
        this.company_id = login.user.patients[0].company_id
    }
}
