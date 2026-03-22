import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    root: path.resolve(process.cwd(), 'client'),
    publicDir: path.resolve(process.cwd(), 'public'),
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': 'http://127.0.0.1:3001',
            '/presentations': 'http://127.0.0.1:3001',
            '/preview': 'http://127.0.0.1:3001',
            '/presentation-runtime.html': 'http://127.0.0.1:3001',
            '/assets': 'http://127.0.0.1:3001'
        }
    },
    build: {
        outDir: path.resolve(process.cwd(), 'client/dist'),
        emptyOutDir: true,
        assetsDir: 'app-assets'
    }
});
