import { toast } from "@/hooks/use-toast"
import { useCallback } from "react"

export function useClipBoard() {
  const copyToClipboard = useCallback(async function(content: string): Promise<void> {
    let errorText: string | null = null
    let textArea: HTMLTextAreaElement | null = null
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content)
      } else {
        // Fallback para navegadores mais antigos
        textArea = document.createElement('textarea')

        textArea.value = content
        textArea.style.position = 'fixed' // Evitar rolagem indesejada
        textArea.style.opacity = '0' // Tornar invisível
        document.body.append(textArea)
        
        textArea.focus()
        textArea.select()

        if (!document.execCommand('copy')) {
          throw new Error('Falha ao copiar texto usando execCommand.')
        }
      }
    } catch (error) {
      errorText = error instanceof Error ? error.message : 'Erro ao copiar texto'
    } finally {
      toast({
        variant: errorText ? 'destructive' : 'default',
        description: errorText ?? 'Texto copiado com sucesso'
      })
      textArea?.remove()
    }
  }, [])
  
  return { copyToClipboard }
}
