import { mobileToUser } from "../utils.ts"
import { assertEquals } from "../deps.ts"

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
