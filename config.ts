import { AppConfig } from "./types/config.ts"
import { yaml } from "./deps.ts"
import { Secret } from "./secret.ts"

export const loadAppConfig = async (path = "./config.yaml"): Promise<AppConfig> => {
    try {
        const text = Deno.readTextFileSync(path)
        return yaml.parse(text) as AppConfig
    } catch {
        // fetch from remote
        const res = await fetch(Secret.CONFIG_URL!)
        const text = await res.text()
        return yaml.parse(text) as AppConfig
    }
}
