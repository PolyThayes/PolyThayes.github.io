// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // Your public web address. Change this if you add a custom domain.
  site: 'https://polythayes.github.io',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  vite: {
    define: { __PROJECT_ROOT__: JSON.stringify(root) },
  },
});
