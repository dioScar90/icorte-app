// type LiteralValues = 'today' | 'yesterday' | 'tomorrow';

// type ToArray<T, S extends T[] = []> =
//   T extends `${infer U}`
//   // ? S extends [U]
//     ? [...[U], S]
//     // : never
//   : never;

// type ArrayOfLiteralValues = ToArray<LiteralValues>

// const dream: ArrayOfLiteralValues = ['today', 'yesterday', 'tomorrow']
// console.log(dream)
