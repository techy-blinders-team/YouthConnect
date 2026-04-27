import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        exclude: ['canvg', 'raf']
    },
    build: {
        commonjsOptions: {
            include: [/canvg/, /raf/, /node_modules/]
        }
    }
});
