import { FocusEvent } from "react"

export function navigateToEndAfterFocus(e: FocusEvent<HTMLInputElement>) {
  setTimeout(() =>
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length
    )
  , 50)
}
