import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Test01',
      short_name: 'Test01',
      description: 'Test01',
      theme_color: '#ffffff',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        //Cacheovani dat z API
        {
          urlPattern: /^https:\/\/www.johanovsti.eu\/RestAPI\/api.php\/auta/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 10 * 60 }, //max 50 zaznamu max 10 minut
            networkTimeoutSeconds: 10,
          },
        },
      ],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})