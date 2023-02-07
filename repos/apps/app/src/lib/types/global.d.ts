export declare module '*.svg' {
  const content: unknown
  export default content
}

export declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        initDataUnsafe: any
        colorScheme: 'light' | 'dark'
      }
    }
  }
}
