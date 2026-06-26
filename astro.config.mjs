// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://camiicode.github.io",
  base: "/LandingLensAI/",
  vite: {
    plugins: [tailwindcss()]
  }
});