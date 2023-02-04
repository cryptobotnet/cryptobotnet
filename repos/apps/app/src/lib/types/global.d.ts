declare module '*.svg' {
  const content: unknown
  export default content
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        initDataUnsafe: any
      }
    }
  }
}
