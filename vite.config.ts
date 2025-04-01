import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const production = mode === 'production' || mode === 'preview';
  const pwaOptions: Partial<VitePWAOptions> = {
    mode: production ? 'production' : 'development',
    srcDir: 'src',
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg}']
    },
    filename: 'serviceWorker.ts',
    strategies: 'injectManifest',
    manifest: {
      name: 'React IndexedDB Example',
      short_name: 'React IndexedDB',
      id: '/',
      start_url: '/index.html',
      background_color: '#ffffff',
      lang: 'en-US',
      description: 'React IndexedDB',
      theme_color: '#ffffff',
      dir: 'ltr',
      orientation: 'natural',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'maskable-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      display_override: ['window-controls-overlay'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html'
    },
  };

  return {
    esbuild: {
      drop: production ? ['console', 'debugger'] : [],
    },
    plugins: [react(), VitePWA(pwaOptions)],
  };
});
