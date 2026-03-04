import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            '.manus.computer',
            'all'
        ]
    }
})
