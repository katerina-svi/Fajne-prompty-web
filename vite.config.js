import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'out',
        rollupOptions: {
            input: {
                main: 'index.html',
            },
        },
    },
});
