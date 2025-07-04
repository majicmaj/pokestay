import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["**/*"],
      manifest: {
        name: "PokéStay",
        short_name: "PokéStay",
        description: "A Pokémon-themed game built with React and Vite.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "assets/screenshots/desktop.png",
            sizes: "3024x1718",
            type: "image/png",
            label: "Desktop view",
            form_factor: "wide",
          },
          {
            src: "assets/screenshots/mobile.png",
            sizes: "828x1792",
            type: "image/png",
            label: "Mobile view",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*"],
        navigateFallback: "/offline.html",
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === "https://pokeapi.co",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "pokeapi-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === "https://raw.githubusercontent.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "github-assets-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === "https://play.pokemonshowdown.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "pokemon-showdown-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
