import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

import type { UserConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config: UserConfig = {
    plugins: [react(), svgr()],
    build: {
      outDir: "./build",
      sourcemap: true,
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
    },
  };

  return config;
});
