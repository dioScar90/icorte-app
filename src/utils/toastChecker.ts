import { useToast } from "@/hooks/use-toast";
import { UnprocessableEntityError } from "@/providers/proxyProvider";

export function checkUnprocessableEntityToast(err: unknown) {
  if (!(err instanceof UnprocessableEntityError)) {
    return null
  }

  err.errorsEntries
    .forEach(([name, messages]) =>
      form.setError(name as keyof UserRegisterForFormType, { ...messages }))

  useToast().toast('aee', )

  const obj = {
    variant: 'destructive',
    title: err.title,
    desciption: 'aee'
  }
}