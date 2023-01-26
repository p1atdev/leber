import { mobileToUser, takeRandom } from "../utils.ts"
import { assertEquals, assert } from "../deps.ts"

Deno.test("login id generate", () => {
    const mobile = "08012345678"
    const countryCode = 81
    const expected = "+818012345678"

    const actual = mobileToUser(mobile, countryCode)
    assertEquals(actual, expected)
})

Deno.test("login id generate without country code", () => {
    const mobile = "08012345678"
    const expected = "+818012345678"

    const actual = mobileToUser(mobile)
    assertEquals(actual, expected)
})

Deno.test("login id generate without prefix zero", () => {
    const mobile = "8012345678"
    const expected = "+818012345678"

    const actual = mobileToUser(mobile)
    assertEquals(actual, expected)
})

Deno.test("get random number between two numbers", () => {
    // repeat 10 times
    for (let i = 0; i < 10; i++) {
        const min = 36.2
        const max = 36.7

        const num = takeRandom(min, max)

        assert(num >= min && num <= max)
    }
})
