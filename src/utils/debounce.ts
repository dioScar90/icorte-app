

let timeoutId: ReturnType<typeof setTimeout>

export const debounce = function<F extends (...args: any[]) => any>(func: F, delay = 500) {
  return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// type DebounceType<F extends (...args: any[]) => any> = 

// export const debounce = (func: Function, delay?: number) => {
//   delay ??= 500

//   return function (...args) {
//     clearTimeout(timeoutId)
//     timeoutId = setTimeout(() => func.apply(this, args), delay)
//   }
// }
