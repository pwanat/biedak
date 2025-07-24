import path from 'node:path'
import url from 'node:url'
import { defineConfig } from 'vite'
import type { BuildEnvironmentOptions } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Client Build Configuration
const clientBuildConfig: BuildEnvironmentOptions = {
  outDir: 'dist/client',
  emitAssets: true,
  copyPublicDir: true,
  emptyOutDir: true,
}

// Server Build Configuration
const serverBuildConfig: BuildEnvironmentOptions = {
  ssr: true,
  outDir: 'dist/server',
  copyPublicDir: false,
  emptyOutDir: true,
  rollupOptions: {
    input: path.resolve(__dirname, 'src/server/server.ts'),
    output: {
      entryFileNames: '[name].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash][extname]',
    },
  },
}

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),

        // fix loading all icon chunks in dev mode
        // https://github.com/tabler/tabler-icons/issues/1233
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    build: configEnv.mode === 'server' ? serverBuildConfig : clientBuildConfig,
  }
})
