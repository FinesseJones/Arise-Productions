/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}