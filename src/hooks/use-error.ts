import { InvalidUsernameOrPasswordError } from "@/providers/proxyProvider"

function handleError<TError extends Error>(error?: TError) {
  if (!error) {
    return
  }

  if (error instanceof InvalidUsernameOrPasswordError) {
    display
  }
    
    err.displayToastAndFormErrors(form.setError)
    .forEach(({ error, toast }) => {
      form.setError(error.key, { message: error?.message })
      toast(toast)
    })
}

export function useError() {
  return {
    handleError,
  }
}
