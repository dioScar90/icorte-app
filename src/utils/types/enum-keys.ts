
export type EnumKeys<T extends Record<string, string | number>> = ReadonlyArray<keyof T>
