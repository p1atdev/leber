import { Secret } from "./secret.ts"
import { LeberUser } from "./user.ts"

export interface WorkersUser {
    id: string
    payload: LeberUser
}

export class WorkersClient {
    private readonly url: string
    private readonly token: string
    constructor() {
        this.url = Secret.WORKERS_URL!
        this.token = Secret.AUTH_TOKEN!
    }

    public getUsers = async (): Promise<string[]> => {
        const url = new URL("/users", this.url)
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "X-Auth-Token": this.token,
            },
        })
        const json = await res.json()
        return json
    }

    public getUser = async (id: string): Promise<WorkersUser> => {
        const url = new URL(`/user/${id}`, this.url)
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "X-Auth-Token": this.token,
            },
        })
        const json = await res.json()
        return json
    }

    public createUser = async (user: WorkersUser) => {
        const url = new URL("/user", this.url)
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "X-Auth-Token": this.token,
            },
            body: JSON.stringify(user),
        })
        const json = await res.json()
        return json
    }

    public updateUser = async (id: string, user: WorkersUser) => {
        const url = new URL(`/user/${id}`, this.url)
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "X-Auth-Token": this.token,
            },
            body: JSON.stringify(user),
        })
        const json = await res.json()
        return json
    }

    public deleteUser = async (id: string) => {
        const url = new URL(`/user/${id}`, this.url)
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "X-Auth-Token": this.token,
            },
        })
        const json = await res.json()
        return json
    }
}
