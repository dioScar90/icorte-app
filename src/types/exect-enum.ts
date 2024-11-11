
// // export interface EnumAsArrayConst<T, N extends number> extends Array<T> {
// //   length: N
// //   [index: number]: T
// // }
// export interface EnumAsArrayConst<K> extends ReadonlyArray<K> {
//   [index: number]: K
// }

// type KNum = `${number}`
// type TVal<K> = K extends KNum ? string : number
// type TK = string




// // type RecordSet<T> = Record<K, [K in T] extends KNum ? string : number>

// type RecordSet<T extends Record<string, unknown>> = {
//   [K in keyof T]: T[K] extends KNum ? string : number;
// };

// const ola: RecordSet<{
//   "0": "Female",
//   "1": "Male",
//   "Male": 1,
//   "Female": 0
// }> = {
//   "0": "Female",
//   "1": "Male",
//   "Male": 1,
//   "Female": 0
// }

// console.log(ola)

// type EnumMap<T extends string> = {
//   [Index in T | `${number}`]: Index extends T ? number : T;
// };



// type TOk<T> = Exclude<T, number>

// function isNumeric(key: string): key is KNum {
//   return !Number.isNaN(+key)
// }

// function getEnumValues<TEnum extends RecordSet<TEnum>>(enumVal: TEnum) {
//   const listaaa: TRes[] = []

//   for (const key in enumVal) {
//     if (isNumeric(key)) {
//       listaaa.push(enumVal[key] as TRes)
//     }
//   }

//   return listaaa
// }

// enum MamaMia {
//   Vish,
//   AiAi,
// }

// const agoraVai = getEnumValues(MamaMia)




// // Tipo genérico para a estrutura do objeto
// type BiDirectionalEnum<T extends Record<string, string | number>> = {
//   [K in keyof T]: T[K];
// };

// // Função para extrair os valores cujas chaves são numéricas
// function getNumericKeyValues<T extends Record<string, string | number>>(
//   obj: T
// ): (T[keyof T & `${number}`])[] {
//   return Object.keys(obj)
//     .filter((key): key is keyof T & `${number}` => !isNaN(Number(key))) // Filtra as chaves numéricas
//     .map((key) => obj[key]); // Retorna os valores dessas chaves
// }

// // Exemplo de uso
// const genderMap = {
//   "0": "Female",
//   "1": "Male",
//   "Male": 1,
//   "Female": 0,
// } as const;

// const numericValues = getNumericKeyValues(MamaMia); // Tipo inferido: ("Female" | "Male")[]
// console.log(numericValues); // Output: ["Female", "Male"]


