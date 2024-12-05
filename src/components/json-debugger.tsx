import { useEffect, useRef } from "react";

type Props = {
  obj: Record<string, any> | any[]
  className?: string
}

export function JsonDebugger({ obj, className }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  
  return (
    <pre
      ref={ref}
      className={className}
    >
      {Object.entries(obj).map(([key, value]) => (
        <p><span>{key}</span> {'=>'} {typeof value}</p>
      ))}
      {JSON.stringify(obj, undefined, 2)}
    </pre>
  )
}
