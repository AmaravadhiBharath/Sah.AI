import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, rmSync, readFileSync, writeFileSync } from 'fs';

// Plugin to copy manifest and fix output structure
const postBuildPlugin = () => ({
  name: 'post-build',
  closeBundle() {
    // Copy manifest.json
    copyFileSync('public/manifest.json', 'dist/manifest.json');

    // Copy welcome.html
    if (existsSync('public/welcome.html')) {
      copyFileSync('public/welcome.html', 'dist/welcome.html');
    }

    // Create icons directory
    const iconDir = 'dist/icons';
    if (!existsSync(iconDir)) {
      mkdirSync(iconDir, { recursive: true });
    }

    // Fix sidepanel HTML location
    const srcHtmlPath = 'dist/src/sidepanel/index.html';
    const srcHistoryPath = 'dist/src/sidepanel/history.html';
    const destDir = 'dist/sidepanel';
    const destHtmlPath = 'dist/sidepanel/index.html';
    const destHistoryPath = 'dist/sidepanel/history.html';

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    if (existsSync(srcHtmlPath)) {
      // Read, fix paths, and write
      let html = readFileSync(srcHtmlPath, 'utf-8');
      // Fix paths: ../../sidepanel.js -> ../sidepanel.js, ../../assets/ -> ../assets/
      html = html.replace(/src="\.\.\/\.\.\/sidepanel\.js"/g, 'src="../sidepanel.js"');
      html = html.replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/');
      writeFileSync(destHtmlPath, html);
    }

    if (existsSync(srcHistoryPath)) {
      let html = readFileSync(srcHistoryPath, 'utf-8');
      html = html.replace(/src="\.\.\/\.\.\/history\.js"/g, 'src="../history.js"');
      html = html.replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/');
      writeFileSync(destHistoryPath, html);
    }

    // Clean up src folder
    rmSync('dist/src', { recursive: true, force: true });
  }
});

export default defineConfig({
  plugins: [react(), postBuildPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
        history: resolve(__dirname, 'src/sidepanel/history.html'),
        content: resolve(__dirname, 'src/content/index.ts'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
