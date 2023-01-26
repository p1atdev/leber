export const mobileToUser = (mobile: string, countryCode = 81) => {
    if (mobile.startsWith("0")) {
        mobile = mobile.substring(1)
    }
    return `+${countryCode}${mobile}`
}

export const takeRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
