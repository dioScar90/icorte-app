
export function navigateToEndOfInput(input: HTMLInputElement) {
  input.focus()
  input.setSelectionRange(input.value.length, input.value.length)
}
