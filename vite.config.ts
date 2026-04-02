import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },

  fmt: {},

  lint: { options: { typeAware: true, typeCheck: true } },

  plugins: [
    react(),
    sentryVitePlugin({
      org: "bjorn-tirsen",
      project: "will-my-tokens-last",
    }),
  ],

  base: "/will-my-tokens-last/",

  build: {
    sourcemap: true,
  },
});
