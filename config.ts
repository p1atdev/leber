import { AppConfig } from "./types/config.ts"
import { yaml } from "./deps.ts"

export const loadAppConfig = (path = "./config.yaml"): AppConfig => {
    const text = Deno.readTextFileSync(path)
    return yaml.parse(text) as AppConfig
}
