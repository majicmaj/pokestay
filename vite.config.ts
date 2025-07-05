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
            src: "pokeball.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pokeball.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pokeball.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pokeball.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*"],
        navigateFallback: "index.html",
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
