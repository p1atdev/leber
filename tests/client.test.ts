import { assertExists, assert } from "../deps.ts"
import { Secret } from "../secret.ts"
import { LeberCLient } from "../client.ts"

Deno.test("client login", async () => {
    assertExists(Secret.TEST_USER_MOBILE)
    assertExists(Secret.TEST_USER_PASSWORD)

    const client = new LeberCLient()

    assert(
        await client.login({
            mobile: Secret.TEST_USER_MOBILE,
            password: Secret.TEST_USER_PASSWORD,
        })
    )
})

Deno.test("get temperature questions", async () => {
    assertExists(Secret.TEST_USER_MOBILE)
    assertExists(Secret.TEST_USER_PASSWORD)

    const client = new LeberCLient()

    await client.login({
        mobile: Secret.TEST_USER_MOBILE,
        password: Secret.TEST_USER_PASSWORD,
    })

    const questions = await client.getTemperatureQuestions()

    assert(questions.length > 0)
})
