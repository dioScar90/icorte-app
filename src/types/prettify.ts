
export type Prettify<T extends object> = {
  [K in keyof T]: T[K] extends Record<string, any> ? Prettify<T[K]> : T[K]
}
