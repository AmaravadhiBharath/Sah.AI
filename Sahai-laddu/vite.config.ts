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
    
    // Create icons directory
    const iconDir = 'dist/icons';
    if (!existsSync(iconDir)) {
      mkdirSync(iconDir, { recursive: true });
    }
    
    // Fix sidepanel HTML location
    const srcHtmlPath = 'dist/src/sidepanel/index.html';
    const destDir = 'dist/sidepanel';
    const destHtmlPath = 'dist/sidepanel/index.html';
    
    if (existsSync(srcHtmlPath)) {
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      
      // Read, fix paths, and write
      let html = readFileSync(srcHtmlPath, 'utf-8');
      // Fix paths: ../../sidepanel.js -> ../sidepanel.js, ../../assets/ -> ../assets/
      html = html.replace(/src="\.\.\/\.\.\/sidepanel\.js"/g, 'src="../sidepanel.js"');
      html = html.replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/');
      writeFileSync(destHtmlPath, html);
      
      // Clean up src folder
      rmSync('dist/src', { recursive: true, force: true });
    }
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
