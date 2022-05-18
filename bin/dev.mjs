import { createServer, build } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { resolve, dirname } from 'path';
import { filesMap } from './map.mjs';
import path from 'path';
import { generateManifest } from './manifest.mjs';

const inputs = {};
filesMap.forEach(file => {
  inputs[file.name] = file.input;
});

const server = await createServer({
  configFile: false,
  root: path.resolve('../'),
  resolve: {
    alias: {
      '@common': '../src/common',
      '@modules': '../src/modules',
      // This aliases are needed for dev server
      'vue-base': '../node_modules/vue/index.mjs',
      '@zb/hooks': '../src/modules/hooks/index.es.ts',
      '@zb/rest': '../src/modules/rest/index.es.ts',
      '@zb/i18n': '../src/modules/i18n/index.ts',
      '@zb/utils': '../src/common/utils/index.ts',
      '@zb/components': '../src/common/main.ts',
    },
  },
  mode: 'development',
  build: {
    rollupOptions: {
      input: inputs,
      external: ['@zb/rest', '@zb/i18n', '@zb/hooks', '@zb/utils', 'vue'],
      globals: {
        '@zb/i18n': 'zb.l18n',
        '@zb/rest': 'zb.rest',
        '@zb/hooks': 'zb.hooks',
        '@zb/utils': 'zb.utils',
        vue: 'zb.vue',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "../src/common/scss/_mixins.scss";`,
      },
    },
  },
  plugins: [vue()],
});

await server.listen();

/**
 * Generate manifest file
 *
 * This will set the dev mode to on and also output a map of the file handles with their location
 */
const devScripts = {};
const { address, port } = server.httpServer.address();
const url = `http://${address}:${port}/`;
filesMap.forEach(fileConfig => {
  devScripts[fileConfig.output] = `${url}${fileConfig.input}`;
});
generateManifest({
  debug: true,
  devScripts,
});
console.log(server.httpServer.address());
server.printUrls();