import path from 'path';
import fs from 'fs';

const elementsMap = [];
fs.readdirSync('src/elements/').forEach(folder => {
  //   console.log(file);
  const files = ['editor.ts', 'editor.js', 'frontend.ts', 'frontend.js', 'frontend.scss'];
  files.forEach(filename => {
    if (fs.existsSync(`src/elements/${folder}/${filename}`)) {
      const file = path.parse(filename);

      elementsMap.push({
        input: `src/elements/${folder}/${filename}`,
        format: 'iife',
        output: `elements/${folder}/${file.name}`,
      });
    }
  });
});

export const filesMap = [
  // Global
  {
    input: 'src/common/vue.ts',
    format: 'iife',
    output: 'vue',
    name: 'vue',
  },
  {
    input: 'src/common/pinia.ts',
    format: 'iife',
    output: 'pinia',
    name: 'pinia',
  },
  {
    input: 'src/common/index.ts',
    format: 'iife',
    output: 'common',
  },

  //   admin
  {
    input: 'src/admin/edit-page.ts',
    format: 'iife',
    output: 'edit-page',
    name: 'editPage',
  },
  {
    input: 'src/admin/gutenberg.ts',
    format: 'iife',
    output: 'gutenberg',
  },
  {
    input: 'src/admin/admin-page.ts',
    format: 'iife',
    output: 'admin-page',
    name: 'adminPage',
  },

  {
    input: 'src/admin/regenerateAssets.ts',
    format: 'iife',
    output: 'regenerate-assets-notice',
    name: 'regenerateAssetsNotice',
  },

  {
    input: 'src/modules/screenshot/index.ts',
    format: 'iife',
    output: 'screenshot',
  },
  {
    input: 'src/modules/integrations/rankmath.ts',
    format: 'iife',
    output: 'integrations/rankmath',
  },
  {
    input: 'src/modules/integrations/yoast.ts',
    format: 'iife',
    output: 'integrations/yoast',
  },
  // Editor
  {
    input: 'src/editor/editor.ts',
    format: 'iife',
    output: 'editor',
  },
  // packages
  {
    input: 'src/modules/animateJS/index.ts',
    format: 'iife',
    output: 'animateJS',
  },

  // Frontend
  {
    input: 'src/frontend/modules/modalJS/index.ts',
    format: 'iife',
    output: 'ModalJS',
  },
  {
    input: 'src/frontend/modules/video/index.ts',
    format: 'iife',
    output: 'ZBVideo',
  },
  {
    input: 'src/frontend/modules/videoBG/index.ts',
    format: 'iife',
    output: 'ZBVideoBg',
  },
  {
    input: 'src/scss/frontend/index.scss',
    output: 'frontend',
  },
  //   ...elementsMap,
];
