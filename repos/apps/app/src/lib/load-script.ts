export const loadScript = (source: string): Promise<HTMLScriptElement> => {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement('script')

    script.src = source
    script.async = true

    script.onload = () => {
      resolve(script)
    }

    script.onerror = () => {
      reject(new Error(`script not loaded: ${source}`))
    }

    document.body.appendChild(script)
  })
}
