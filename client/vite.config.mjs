import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    root: path.resolve(process.cwd(), 'client'),
    plugins: [react()],
    build: {
        outDir: path.resolve(process.cwd(), 'client/dist'),
        emptyOutDir: true,
        assetsDir: 'app-assets'
    }
});
