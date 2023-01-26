import { assertExists, assert } from "../deps.ts"
import { Secret } from "../secret.ts"
import { LeberCLient } from "../client.ts"

Deno.test("client login", async () => {
    assertExists(Secret.TEST_USER_MOBILE)
    assertExists(Secret.TEST_USER_PASSWORD)

    const client = new LeberCLient({
        mobile: Secret.TEST_USER_MOBILE,
        password: Secret.TEST_USER_PASSWORD,
    })

    assert(await client.login())
})

Deno.test("get temperature questions", async () => {
    assertExists(Secret.TEST_USER_MOBILE)
    assertExists(Secret.TEST_USER_PASSWORD)

    const client = new LeberCLient({
        mobile: Secret.TEST_USER_MOBILE,
        password: Secret.TEST_USER_PASSWORD,
    })

    await client.login()

    const questions = await client.getTemperatureQuestions()

    assert(questions.length > 0)
})
