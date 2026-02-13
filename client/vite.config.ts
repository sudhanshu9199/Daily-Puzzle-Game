import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Daily Puzzle Game",
        short_name: "DailyPuzzle",
        description: "A new logic puzzle every day!",
        theme_color: "#ffffff",
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: "icons/daily_icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/daily_icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    headers: {
      // This allows the Google Auth popup to communicate with your app
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    }
  }
});
