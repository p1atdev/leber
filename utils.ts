export const mobileToUser = (mobile: string, countryCode = 81) => {
    if (mobile.startsWith("0")) {
        mobile = mobile.substring(1)
    }
    return `+${countryCode}${mobile}`
}

// 36.2 ~ 36.7
export const takeRandom = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}
