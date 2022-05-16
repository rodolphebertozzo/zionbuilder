import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import externalGlobals from 'rollup-plugin-external-globals';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@zionbuilder/composables': './src/modules/composables/main.ts',
			'vue-base': path.resolve(__dirname, './node_modules/vue/index.mjs'),
		},
	},
	build: {
		target: 'es2015',
		// generate manifest.json in outDir
		manifest: true,
		rollupOptions: {
			// overwrite default .html entry
			input: {
				admin: './src/admin/main.ts',
				editor: './src/editor/main.ts',

				// Modules
				i18n: './src/modules/i18n/index.ts',
				vue: './src/modules/vue/main.ts',
				hooks: './src/modules/hooks/main.ts',
				rest: './src/modules/rest/main.ts',
				composables: './src/modules/composables/main.ts',
				utils: './src/modules/utils/index.ts',
				['edit-page']: './src/modules/edit-page/main.ts',
				['gutenberg']: './src/modules/gutenberg/main.ts',
			},
			output: {
				assetFileNames: `[name].[ext]`,
				entryFileNames: `[name].js`,
				manualChunks: {},
				// format: 'iife',
				// inlineDynamicImports: true,
				// globals: {
				// 	'@zb/i18n': 'zb.l18n',
				// 	'@zb/rest': 'zb.rest',
				// 	'@zb/hooks': 'zb.hooks',
				// 	vue: 'zb.vue',
				// },
			},
			external: ['@zb/rest', '@zb/i18n', '@zb/hooks', 'vue'],
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/scss/_mixins.scss";`,
			},
		},
	},
	plugins: [
		vue(),
		externalGlobals({
			'@zb/i18n': 'zb.l18n',
			'@zb/rest': 'zb.rest',
			'@zb/hooks': 'zb.hooks',
			vue: 'zb.vue',
		}),
	],
});
