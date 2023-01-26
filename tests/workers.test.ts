import { assertExists } from "../deps.ts"
import { WorkersClient } from "../workers.ts"

Deno.test("get users", async () => {
    const client = new WorkersClient()

    const users = await client.getUsers()

    assertExists(users)
})
