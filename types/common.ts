export interface LeberResponse<T> {
    status: number
    result: T
    message?: string
}
