/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.jsx' {
  import type { ComponentType, JSX } from 'react'
  const component: ComponentType<any>
  export default component
}
