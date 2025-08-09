import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  output: "static",
  prefetch: true,
  compressHTML: true,
  integrations: [mdx(), react()],
});